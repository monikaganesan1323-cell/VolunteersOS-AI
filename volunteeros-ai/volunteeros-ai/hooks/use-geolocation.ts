"use client";

import { useCallback, useEffect, useState } from "react";
import type { Coords } from "@/lib/geo";

type Status = "idle" | "requesting" | "granted" | "denied" | "unsupported";

/**
 * Wraps navigator.geolocation. Nothing is requested until request() is
 * called, so the browser permission prompt is always tied to a deliberate
 * action (starting the scanner, or opening the GPS tab).
 */
export function useGeolocation() {
  const [coords, setCoords] = useState<Coords | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [watchId, setWatchId] = useState<number | null>(null);

  const request = useCallback(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setStatus("unsupported");
      setError("This browser does not expose location services.");
      return;
    }

    setStatus("requesting");
    setError(null);

    const id = navigator.geolocation.watchPosition(
      (position) => {
        setCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setAccuracy(Math.round(position.coords.accuracy));
        setStatus("granted");
      },
      (err) => {
        setStatus(err.code === err.PERMISSION_DENIED ? "denied" : "idle");
        setError(err.message);
      },
      { enableHighAccuracy: true, maximumAge: 10_000, timeout: 15_000 }
    );

    setWatchId(id);
  }, []);

  const stop = useCallback(() => {
    if (watchId !== null && navigator.geolocation) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
  }, [watchId]);

  useEffect(() => {
    return () => {
      if (watchId !== null && typeof navigator !== "undefined" && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [watchId]);

  return { coords, accuracy, status, error, request, stop };
}
