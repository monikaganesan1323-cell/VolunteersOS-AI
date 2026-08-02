"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { volunteers as seedVolunteers } from "@/data/volunteers";
import type { Volunteer } from "@/types";

const STORAGE_KEY = "vos_created_volunteers";

/** Reads saved volunteers from localStorage. Safe to call before mount. */
export function readSavedVolunteers(): Volunteer[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Volunteer[]) : [];
  } catch {
    return [];
  }
}

function writeSavedVolunteers(list: Volunteer[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    /* quota exceeded — the entry still lives in memory for this session */
  }
}

/**
 * Saved volunteers merged over the seeded list, with a persisting add().
 * Mirrors lib/event-store.ts and lib/org-store.ts — swap the two helpers
 * above for calls to POST /api/volunteers when the backend is wired up.
 */
export function useVolunteers() {
  const [saved, setSaved] = useState<Volunteer[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Load after mount so the server render and first client render match.
  useEffect(() => {
    setSaved(readSavedVolunteers());
    setHydrated(true);
  }, []);

  // Keep other open tabs in sync.
  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === STORAGE_KEY) setSaved(readSavedVolunteers());
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const addVolunteer = useCallback((volunteer: Volunteer) => {
    setSaved((prev) => {
      const next = [volunteer, ...prev];
      writeSavedVolunteers(next);
      return next;
    });
  }, []);

  const volunteers = useMemo(() => [...saved, ...seedVolunteers], [saved]);

  return { hydrated, savedVolunteers: saved, volunteers, addVolunteer };
}
