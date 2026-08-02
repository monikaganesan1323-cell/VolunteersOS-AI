"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { events as seedEvents } from "@/data/events";
import type { VolunteerEvent } from "@/types";

const STORAGE_KEY = "vos_created_events";

/** Reads saved events from localStorage. Safe to call before mount. */
export function readSavedEvents(): VolunteerEvent[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as VolunteerEvent[]) : [];
  } catch {
    return [];
  }
}

function writeSavedEvents(list: VolunteerEvent[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    /* quota exceeded — the event still lives in memory for this session */
  }
}

/**
 * Saved events merged over the seeded list, with a persisting add().
 * Swap the two helpers above for API calls when the backend is wired up.
 */
export function useEvents() {
  const [saved, setSaved] = useState<VolunteerEvent[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Load after mount so the server render and first client render match.
  useEffect(() => {
    setSaved(readSavedEvents());
    setHydrated(true);
  }, []);

  // Keep other open tabs in sync.
  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === STORAGE_KEY) setSaved(readSavedEvents());
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const addEvent = useCallback((event: VolunteerEvent) => {
    setSaved((prev) => {
      const next = [event, ...prev];
      writeSavedEvents(next);
      return next;
    });
  }, []);

  const events = useMemo(() => [...saved, ...seedEvents], [saved]);

  return { hydrated, savedEvents: saved, events, addEvent };
}
