"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { VolunteerEvent } from "@/types";
import { GEOFENCE_RADIUS_M, distanceMeters, isGeofenceOverride, venueCoords, type Coords } from "@/lib/geo";

const STORAGE_KEY = "vos_attendance";

export type ScanMethod = "QR" | "Face" | "GPS";

export interface AttendanceRecord {
  id: string;
  volunteerId: string;
  volunteerName: string;
  eventId: string;
  eventTitle: string;
  method: ScanMethod;
  arrivedAt: string; // ISO
  departedAt?: string; // ISO — set by the second scan
  distanceM?: number;
}

/**
 * NOTE ON "FACE RECOGNITION": the Face method records that a face was PRESENT
 * in frame at scan time. It does not identify the person — that would need
 * enrolled biometric templates per volunteer and a matching model, neither of
 * which exists here. Treat Face as a presence check layered on top of the QR
 * identity, not as identity on its own.
 */

export function readAttendance(): AttendanceRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AttendanceRecord[]) : [];
  } catch {
    return [];
  }
}

function writeAttendance(list: AttendanceRecord[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    /* quota exceeded — records stay in memory for this session */
  }
}

/** Pulls a volunteer id out of whatever the QR encodes, e.g. "VOS:V-1042". */
export function parseVolunteerId(payload: string): string | null {
  const match = payload.match(/V-\d+/i);
  return match ? match[0].toUpperCase() : null;
}

export interface GeofenceResult {
  event: VolunteerEvent | null;
  distanceM: number | null;
  withinFence: boolean;
  /** True when localhost dev mode waved the distance check through. */
  overridden?: boolean;
  reason?: string;
}

/**
 * Which event is the scanner standing at? The nearest live event whose venue
 * is inside the geofence. This is what enforces "only near the venue" without
 * needing an event picker in the UI.
 */
export function resolveEventAt(
  coords: Coords | null,
  events: VolunteerEvent[]
): GeofenceResult {
  const live = events.filter((e) => e.status === "upcoming" || e.status === "ongoing");

  if (!coords) {
    return { event: null, distanceM: null, withinFence: false, reason: "no-location" };
  }
  if (live.length === 0) {
    return { event: null, distanceM: null, withinFence: false, reason: "no-events" };
  }

  let nearest: { event: VolunteerEvent; distanceM: number } | null = null;

  for (const event of live) {
    const venue = venueCoords(event.location);
    if (!venue) continue;
    const distance = distanceMeters(coords, venue);
    if (!nearest || distance < nearest.distanceM) {
      nearest = { event, distanceM: distance };
    }
  }

  if (!nearest) {
    return { event: null, distanceM: null, withinFence: false, reason: "no-venue-coords" };
  }

  const reallyWithin = nearest.distanceM <= GEOFENCE_RADIUS_M;
  const overridden = !reallyWithin && isGeofenceOverride();

  return {
    event: nearest.event,
    distanceM: nearest.distanceM,
    withinFence: reallyWithin || overridden,
    overridden,
  };
}

export function useAttendance() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setRecords(readAttendance());
    setHydrated(true);
  }, []);

  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === STORAGE_KEY) setRecords(readAttendance());
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  /** Open = arrived but not yet departed. */
  const openFor = useCallback(
    (volunteerId: string, eventId: string) =>
      records.find(
        (r) => r.volunteerId === volunteerId && r.eventId === eventId && !r.departedAt
      ) ?? null,
    [records]
  );

  /**
   * First scan of a volunteer at an event logs arrival; the next one logs
   * departure against the same record.
   */
  const recordScan = useCallback(
    (input: {
      volunteerId: string;
      volunteerName: string;
      event: VolunteerEvent;
      method: ScanMethod;
      distanceM?: number;
    }): { kind: "arrival" | "departure"; record: AttendanceRecord } => {
      const now = new Date().toISOString();
      const open = records.find(
        (r) =>
          r.volunteerId === input.volunteerId &&
          r.eventId === input.event.id &&
          !r.departedAt
      );

      if (open) {
        const updated: AttendanceRecord = { ...open, departedAt: now };
        setRecords((prev) => {
          const next = prev.map((r) => (r.id === open.id ? updated : r));
          writeAttendance(next);
          return next;
        });
        return { kind: "departure", record: updated };
      }

      const created: AttendanceRecord = {
        id: `A-${Date.now().toString(36).toUpperCase()}`,
        volunteerId: input.volunteerId,
        volunteerName: input.volunteerName,
        eventId: input.event.id,
        eventTitle: input.event.title,
        method: input.method,
        arrivedAt: now,
        distanceM: input.distanceM,
      };

      setRecords((prev) => {
        const next = [created, ...prev];
        writeAttendance(next);
        return next;
      });

      return { kind: "arrival", record: created };
    },
    [records]
  );

  const sorted = useMemo(
    () => [...records].sort((a, b) => b.arrivedAt.localeCompare(a.arrivedAt)),
    [records]
  );

  return { hydrated, records: sorted, openFor, recordScan };
}
