"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  organizations as seedOrganizations,
  type Organization,
} from "@/components/organizations/organization-table";

const STORAGE_KEY = "vos_created_organizations";

/** Reads saved organizations from localStorage. Safe to call before mount. */
export function readSavedOrganizations(): Organization[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Organization[]) : [];
  } catch {
    return [];
  }
}

function writeSavedOrganizations(list: Organization[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    /* quota exceeded — the entry still lives in memory for this session */
  }
}

/**
 * Saved organizations merged over the seeded list, with a persisting add().
 * Mirrors lib/event-store.ts — swap the helpers above for API calls when the
 * backend is wired up.
 */
export function useOrganizations() {
  const [saved, setSaved] = useState<Organization[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Load after mount so the server render and first client render match.
  useEffect(() => {
    setSaved(readSavedOrganizations());
    setHydrated(true);
  }, []);

  // Keep other open tabs in sync.
  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === STORAGE_KEY) setSaved(readSavedOrganizations());
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const addOrganization = useCallback((org: Organization) => {
    setSaved((prev) => {
      const next = [org, ...prev];
      writeSavedOrganizations(next);
      return next;
    });
  }, []);

  const organizations = useMemo(() => [...saved, ...seedOrganizations], [saved]);

  return { hydrated, savedOrganizations: saved, organizations, addOrganization };
}
