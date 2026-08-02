"use client";

/**
 * Client-side app store for VolunteerOS AI.
 *
 * Holds the signed-in session, volunteers created through registration, and
 * events created from the dashboard. State is persisted twice:
 *   - localStorage  -> survives refreshes (per origin)
 *   - a cookie      -> shared across localhost:3000 (admin) and :3001 (portal),
 *                      because cookies ignore the port while localStorage does not.
 *
 * Swap the persistence helpers for real API calls when the backend is wired up.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { volunteers as seedVolunteers } from "@/data/volunteers";
import { events as seedEvents } from "@/data/events";
import type { PreviousPosition, Volunteer, VolunteerEvent } from "@/types";

export type Role = "admin" | "volunteer";

export interface Session {
  id: string;
  name: string;
  email: string;
  role: Role;
  organization: string;
}

export interface VolunteerRegistration {
  name: string;
  email: string;
  phone: string;
  city: string;
  organization?: string;
  skills?: string[];
  interests?: string[];
  previousOrganization?: string;
  previousPosition?: PreviousPosition;
  previousJoinedOn?: string;
  certificationProofs?: string[];
}

export interface OrganizationRegistration {
  name: string;
  email: string;
  organization: string;
}

export interface EventDraft {
  title: string;
  organization: string;
  category: string;
  date: string;
  time: string;
  location: string;
  capacity: number;
  description: string;
}

const SESSION_KEY = "vos_session";
const VOLUNTEERS_KEY = "vos_volunteers";
const EVENTS_KEY = "vos_events";
const COOKIE_MAX = 3500;

/* ------------------------------------------------------------------ */
/* persistence helpers                                                 */
/* ------------------------------------------------------------------ */

function readCookie(key: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${key}=`));
  if (!match) return null;
  try {
    return decodeURIComponent(match.slice(key.length + 1));
  } catch {
    return null;
  }
}

function writeCookie(key: string, raw: string | null) {
  if (typeof document === "undefined") return;
  if (raw === null) {
    document.cookie = `${key}=; path=/; max-age=0`;
    return;
  }
  const encoded = encodeURIComponent(raw);
  // Cookies cap out around 4KB - skip the mirror if the payload is too big.
  if (encoded.length > COOKIE_MAX) return;
  document.cookie = `${key}=${encoded}; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`;
}

function readJSON<T>(key: string, preferCookie = false): T | null {
  if (typeof window === "undefined") return null;
  const cookieRaw = readCookie(key);
  const localRaw = window.localStorage.getItem(key);

  let raw: string | null;
  if (preferCookie) {
    raw = cookieRaw ?? localRaw;
  } else {
    // For lists, take whichever source has more data (the other port may be ahead).
    raw =
      localRaw && (!cookieRaw || localRaw.length >= cookieRaw.length)
        ? localRaw
        : cookieRaw;
  }

  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function writeJSON(key: string, value: unknown | null) {
  if (typeof window === "undefined") return;
  if (value === null) {
    window.localStorage.removeItem(key);
    writeCookie(key, null);
    return;
  }
  const raw = JSON.stringify(value);
  try {
    window.localStorage.setItem(key, raw);
  } catch {
    /* quota exceeded - the cookie mirror below still carries the data */
  }
  writeCookie(key, raw);
}

/* ------------------------------------------------------------------ */
/* context                                                             */
/* ------------------------------------------------------------------ */

interface StoreValue {
  hydrated: boolean;
  session: Session | null;
  isSignedIn: boolean;

  volunteers: Volunteer[];
  registeredVolunteers: Volunteer[];
  events: VolunteerEvent[];
  createdEvents: VolunteerEvent[];

  signIn: (input: {
    email: string;
    name?: string;
    role?: Role;
    organization?: string;
  }) => Session;
  signOut: () => void;
  registerVolunteer: (input: VolunteerRegistration) => Volunteer;
  registerOrganization: (input: OrganizationRegistration) => Session;
  addEvent: (draft: EventDraft) => VolunteerEvent;
  removeEvent: (id: string) => void;
}

const StoreContext = createContext<StoreValue | null>(null);

function nameFromEmail(email: string) {
  const handle = email.split("@")[0] ?? "member";
  return handle
    .split(/[._-]+/)
    .filter(Boolean)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");
}

export function AppStoreProvider({ children }: { children: React.ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [registeredVolunteers, setRegisteredVolunteers] = useState<Volunteer[]>([]);
  const [createdEvents, setCreatedEvents] = useState<VolunteerEvent[]>([]);

  // Load persisted state after mount so SSR and the first client render match.
  useEffect(() => {
    setSession(readJSON<Session>(SESSION_KEY, true));
    setRegisteredVolunteers(readJSON<Volunteer[]>(VOLUNTEERS_KEY) ?? []);
    setCreatedEvents(readJSON<VolunteerEvent[]>(EVENTS_KEY) ?? []);
    setHydrated(true);
  }, []);

  // Keep other tabs in sync.
  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === SESSION_KEY) setSession(readJSON<Session>(SESSION_KEY, true));
      if (e.key === VOLUNTEERS_KEY)
        setRegisteredVolunteers(readJSON<Volunteer[]>(VOLUNTEERS_KEY) ?? []);
      if (e.key === EVENTS_KEY)
        setCreatedEvents(readJSON<VolunteerEvent[]>(EVENTS_KEY) ?? []);
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const signIn = useCallback(
    (input: { email: string; name?: string; role?: Role; organization?: string }) => {
      const next: Session = {
        id: `U-${Date.now().toString(36).toUpperCase()}`,
        name: input.name?.trim() || nameFromEmail(input.email),
        email: input.email.trim(),
        role: input.role ?? "admin",
        organization: input.organization?.trim() || "VolunteerOS AI",
      };
      setSession(next);
      writeJSON(SESSION_KEY, next);
      return next;
    },
    []
  );

  const signOut = useCallback(() => {
    setSession(null);
    writeJSON(SESSION_KEY, null);
  }, []);

  const registerVolunteer = useCallback((input: VolunteerRegistration) => {
    const volunteer: Volunteer = {
      id: `V-${Date.now().toString(36).toUpperCase()}`,
      name: input.name.trim(),
      email: input.email.trim(),
      phone: input.phone.trim(),
      city: input.city.trim(),
      skills: input.skills ?? [],
      interests: input.interests ?? [],
      hours: 0,
      xp: 0,
      level: 1,
      eventsAttended: 0,
      status: "pending",
      joinedOn: new Date().toISOString().slice(0, 10),
      badges: ["New Joiner"],
      organization: input.organization?.trim() || "Unassigned",
      previousOrganization: input.previousOrganization?.trim() || undefined,
      previousPosition: input.previousPosition,
      previousJoinedOn: input.previousJoinedOn || undefined,
      certificationProofs: input.certificationProofs?.length
        ? input.certificationProofs
        : undefined,
    };

    setRegisteredVolunteers((prev) => {
      const next = [volunteer, ...prev];
      writeJSON(VOLUNTEERS_KEY, next);
      return next;
    });

    const nextSession: Session = {
      id: volunteer.id,
      name: volunteer.name,
      email: volunteer.email,
      role: "volunteer",
      organization: volunteer.organization,
    };
    setSession(nextSession);
    writeJSON(SESSION_KEY, nextSession);

    return volunteer;
  }, []);

  const registerOrganization = useCallback(
    (input: OrganizationRegistration) =>
      signIn({
        email: input.email,
        name: input.name,
        role: "admin",
        organization: input.organization,
      }),
    [signIn]
  );

  const addEvent = useCallback((draft: EventDraft) => {
    const today = new Date(new Date().toDateString());
    const event: VolunteerEvent = {
      id: `E-${Date.now().toString(36).toUpperCase()}`,
      title: draft.title.trim(),
      organization: draft.organization.trim(),
      category: draft.category,
      date: draft.date,
      time: draft.time,
      location: draft.location.trim(),
      capacity: Number(draft.capacity) || 0,
      registered: 0,
      status: new Date(draft.date) < today ? "completed" : "upcoming",
      cover: "custom",
      description: draft.description.trim(),
    };

    setCreatedEvents((prev) => {
      const next = [event, ...prev];
      writeJSON(EVENTS_KEY, next);
      return next;
    });

    return event;
  }, []);

  const removeEvent = useCallback((id: string) => {
    setCreatedEvents((prev) => {
      const next = prev.filter((e) => e.id !== id);
      writeJSON(EVENTS_KEY, next);
      return next;
    });
  }, []);

  const value = useMemo<StoreValue>(
    () => ({
      hydrated,
      session,
      isSignedIn: Boolean(session),
      volunteers: [...registeredVolunteers, ...seedVolunteers],
      registeredVolunteers,
      events: [...createdEvents, ...seedEvents],
      createdEvents,
      signIn,
      signOut,
      registerVolunteer,
      registerOrganization,
      addEvent,
      removeEvent,
    }),
    [
      hydrated,
      session,
      registeredVolunteers,
      createdEvents,
      signIn,
      signOut,
      registerVolunteer,
      registerOrganization,
      addEvent,
      removeEvent,
    ]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) {
    throw new Error("useStore must be used inside <AppStoreProvider>");
  }
  return ctx;
}
