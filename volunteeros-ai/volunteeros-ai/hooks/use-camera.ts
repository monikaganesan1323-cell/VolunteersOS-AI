"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type DetectMode = "qr" | "face" | "none";

/** Feature detection for the two browser detector APIs used below. */
export function hasBarcodeDetector() {
  return typeof window !== "undefined" && "BarcodeDetector" in window;
}

export function hasFaceDetector() {
  return typeof window !== "undefined" && "FaceDetector" in window;
}

/**
 * Opens the device camera into a <video> and, optionally, runs a detection
 * loop over the frames.
 *
 * QR uses the native BarcodeDetector API (Chrome/Edge, and Android Chrome) so
 * no scanning dependency is needed. FACE uses FaceDetector, which reports that
 * a face is PRESENT in frame — it does not identify who it is. See the note in
 * lib/attendance-store.ts.
 */
export function useCamera({
  mode,
  onDetect,
}: {
  mode: DetectMode;
  onDetect?: (value: string) => void;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const frameRef = useRef<number | null>(null);
  const onDetectRef = useRef(onDetect);
  onDetectRef.current = onDetect;

  const [active, setActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const stop = useCallback(() => {
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    frameRef.current = null;
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setActive(false);
  }, []);

  const start = useCallback(async () => {
    setError(null);

    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setError("This browser does not expose camera access.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: mode === "face" ? "user" : "environment" },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }
      setActive(true);
    } catch (err) {
      // Denied permission, no camera, or a non-secure origin.
      setError(err instanceof Error ? err.message : "Camera unavailable.");
      setActive(false);
    }
  }, [mode]);

  // Detection loop — throttled, since decoding every frame is wasteful.
  useEffect(() => {
    if (!active || mode === "none") return;

    const Detector =
      mode === "qr"
        ? (window as unknown as Record<string, any>).BarcodeDetector
        : (window as unknown as Record<string, any>).FaceDetector;

    if (!Detector) return;

    const detector =
      mode === "qr" ? new Detector({ formats: ["qr_code"] }) : new Detector();

    let cancelled = false;
    let lastRun = 0;

    async function tick(timestamp: number) {
      if (cancelled) return;

      const video = videoRef.current;
      if (video && video.readyState >= 2 && timestamp - lastRun > 400) {
        lastRun = timestamp;
        try {
          const results = await detector.detect(video);
          if (results.length > 0) {
            onDetectRef.current?.(
              mode === "qr" ? String(results[0].rawValue ?? "") : "face"
            );
          }
        } catch {
          /* frame not decodable yet — try again next tick */
        }
      }

      frameRef.current = requestAnimationFrame(tick);
    }

    frameRef.current = requestAnimationFrame(tick);

    return () => {
      cancelled = true;
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [active, mode]);

  // Release the camera when the component goes away.
  useEffect(() => stop, [stop]);

  return { videoRef, active, error, start, stop };
}
