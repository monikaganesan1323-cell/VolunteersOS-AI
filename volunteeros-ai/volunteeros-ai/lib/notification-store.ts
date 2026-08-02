"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { notifications as seedNotifications, TYPE_ICON, type AppNotification, type NotificationType } from "@/data/notifications";

const READ_KEY = "vos_read_notifications";
const CREATED_KEY = "vos_created_notifications";

/** A stored notification, minus its icon — component references aren't JSON-safe. */
type StoredNotification = Omit<AppNotification, "icon">;

export function readReadIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(READ_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function writeReadIds(ids: string[]) {
  try {
    window.localStorage.setItem(READ_KEY, JSON.stringify(ids));
  } catch {
    /* quota exceeded — read state just won't survive this session */
  }
}

function readCreated(): StoredNotification[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(CREATED_KEY);
    return raw ? (JSON.parse(raw) as StoredNotification[]) : [];
  } catch {
    return [];
  }
}

function writeCreated(list: StoredNotification[]) {
  try {
    window.localStorage.setItem(CREATED_KEY, JSON.stringify(list));
  } catch {
    /* quota exceeded — notification still lives in memory for this session */
  }
}

/**
 * Notification list (seeded + runtime-created, newest first) plus unread
 * tracking. The unread count stays 0 until after mount so the server render
 * and first client render match — that's what keeps the bell's dot from
 * flashing on every page load.
 */
export function useNotifications() {
  const [readIds, setReadIds] = useState<string[]>([]);
  const [created, setCreated] = useState<StoredNotification[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setReadIds(readReadIds());
    setCreated(readCreated());
    setHydrated(true);
  }, []);

  // Keep other open tabs in sync.
  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === READ_KEY) setReadIds(readReadIds());
      if (e.key === CREATED_KEY) setCreated(readCreated());
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const notifications = useMemo<AppNotification[]>(
    () => [
      ...created.map((n) => ({ ...n, icon: TYPE_ICON[n.type] })),
      ...seedNotifications,
    ],
    [created]
  );

  const unread = useMemo(
    () => (hydrated ? notifications.filter((n) => !readIds.includes(n.id)) : []),
    [hydrated, notifications, readIds]
  );

  const markAllRead = useCallback(() => {
    const ids = notifications.map((n) => n.id);
    setReadIds(ids);
    writeReadIds(ids);
  }, [notifications]);

  const markUnread = useCallback(() => {
    setReadIds([]);
    writeReadIds([]);
  }, []);

  /** Adds a notification — e.g. so an organizer hears about a new registration. */
  const addNotification = useCallback(
    (input: { type: NotificationType; title: string; body: string }) => {
      const entry: StoredNotification = {
        id: `n-${Date.now().toString(36)}`,
        type: input.type,
        title: input.title,
        body: input.body,
        time: "Just now",
      };
      setCreated((prev) => {
        const next = [entry, ...prev];
        writeCreated(next);
        return next;
      });
    },
    []
  );

  return {
    hydrated,
    notifications,
    readIds,
    unread,
    unreadCount: unread.length,
    markAllRead,
    markUnread,
    addNotification,
  };
}
