"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "vos_event_registrations";

export interface Registration {
  eventId: string;
  volunteerId: string;
  volunteerName: string;
  registeredAt: string; // ISO
}

export function readRegistrations(): Registration[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Registration[]) : [];
  } catch {
    return [];
  }
}

function writeRegistrations(list: Registration[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    /* quota exceeded — registration still lives in memory for this session */
  }
}

/**
 * Which events a volunteer has registered for, with a persisting register().
 * Swap the two helpers above for API calls (POST /api/registrations) once
 * the backend is wired up — see lib/event-store.ts for the same note.
 */
export function useRegistrations(volunteerId: string) {
  const [all, setAll] = useState<Registration[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setAll(readRegistrations());
    setHydrated(true);
  }, []);

  // Keep other open tabs in sync.
  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === STORAGE_KEY) setAll(readRegistrations());
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const registeredEventIds = useMemo(
    () => new Set(all.filter((r) => r.volunteerId === volunteerId).map((r) => r.eventId)),
    [all, volunteerId]
  );

  const isRegistered = useCallback(
    (eventId: string) => registeredEventIds.has(eventId),
    [registeredEventIds]
  );

  const register = useCallback(
    (eventId: string, volunteerName: string) => {
      if (registeredEventIds.has(eventId)) return;
      const entry: Registration = {
        eventId,
        volunteerId,
        volunteerName,
        registeredAt: new Date().toISOString(),
      };
      setAll((prev) => {
        const next = [entry, ...prev];
        writeRegistrations(next);
        return next;
      });
    },
    [registeredEventIds, volunteerId]
  );

  return { hydrated, registrations: all, registeredEventIds, isRegistered, register };
}
