"use client";

import { useState, useRef } from "react";
import { QrCode, ScanFace, MapPin, CheckCircle2, Clock, Camera, X } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import * as Tabs from "@radix-ui/react-tabs";
import { volunteers } from "@/data/volunteers";
import { cn } from "@/lib/utils";

const checkinHistory = [
  { name: "Ananya Krishnan", event: "Beach Cleanup Drive — Fort Kochi", time: "6:32 AM", method: "QR" },
  { name: "Rahul Menon", event: "Beach Cleanup Drive — Fort Kochi", time: "6:34 AM", method: "Face" },
  { name: "Fathima Zahra", event: "Rural Literacy Bootcamp", time: "9:58 AM", method: "GPS" },
  { name: "Meera Pillai", event: "Elderly Care Companion Day", time: "10:41 AM", method: "QR" },
  { name: "Diya Suresh", event: "Beach Cleanup Drive — Fort Kochi", time: "6:40 AM", method: "QR" },
];

const methodColor: Record<string, "success" | "secondary" | "warning"> = {
  QR: "success",
  Face: "secondary",
  GPS: "warning",
};

export default function AttendancePage() {
  const [scanned, setScanned] = useState<string | null>(null);
  const [involvement, setInvolvement] = useState({ start: "", end: "" });
  const [photos, setPhotos] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handlePhotoSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    setPhotos((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))]);
  }

  function handleSaveInvolvement(e: React.FormEvent) {
    e.preventDefault();
    setSaved(true);
  }

  function resetScan() {
    setScanned(null);
    setInvolvement({ start: "", end: "" });
    setPhotos([]);
    setSaved(false);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink dark:text-crema-50">Attendance</h1>
        <p className="text-sm text-muted-foreground">Verify check-ins by QR, face, or GPS.</p>
      </div>

      <Tabs.Root defaultValue="qr" className="space-y-5">
        <Tabs.List className="inline-flex gap-1 rounded-xl border border-border bg-muted/50 p-1">
          {[
            { value: "qr", label: "QR Scanner", icon: QrCode },
            { value: "face", label: "Face Recognition", icon: ScanFace },
            { value: "gps", label: "GPS Verification", icon: MapPin },
          ].map((t) => (
            <Tabs.Trigger
              key={t.value}
              value={t.value}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-colors",
                "data-[state=active]:bg-espresso-600 data-[state=active]:text-crema-50"
              )}
            >
              <t.icon size={15} /> {t.label}
            </Tabs.Trigger>
          ))}
        </Tabs.List>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardContent className="p-8">
              <Tabs.Content value="qr">
                <div className="mx-auto flex max-w-sm flex-col items-center text-center">
                  <div className="relative flex h-64 w-64 items-center justify-center rounded-3xl border-2 border-dashed border-espresso-300 bg-espresso-50 dark:border-white/15 dark:bg-white/5">
                    <QrCode size={64} className="text-espresso-400" />
                    <div className="absolute inset-x-6 top-1/2 h-0.5 animate-pulse bg-espresso-500/60" />
                  </div>
                  <p className="mt-5 text-sm text-muted-foreground">Point the volunteer&apos;s QR pass at the camera to check in.</p>
                  <Button
                    className="mt-4"
                    onClick={() => setScanned(volunteers[Math.floor(Math.random() * volunteers.length)].name)}
                  >
                    Simulate Scan
                  </Button>
                  {scanned && (
                    <div className="mt-5 w-full text-left">
                      <div className="flex w-full items-center gap-3 rounded-xl border border-sage-500/30 bg-sage-500/10 p-3">
                        <CheckCircle2 size={18} className="text-sage-500 shrink-0" />
                        <span className="text-sm font-medium text-foreground">{scanned} checked in successfully.</span>
                      </div>

                      {saved ? (
                        <div className="mt-3 flex items-center justify-between rounded-xl border border-border bg-muted/40 p-3">
                          <span className="text-xs text-muted-foreground">
                            Logged {involvement.start || "—"} to {involvement.end || "—"}
                            {photos.length > 0 && ` · ${photos.length} photo${photos.length > 1 ? "s" : ""} attached`}
                          </span>
                          <button onClick={resetScan} className="text-xs font-medium text-espresso-600 hover:underline dark:text-crema-300">
                            Scan next
                          </button>
                        </div>
                      ) : (
                        <form onSubmit={handleSaveInvolvement} className="mt-3 rounded-xl border border-border p-4">
                          <div className="mb-1.5 text-xs font-medium text-espresso-700 dark:text-crema-200">
                            Involvement timings
                          </div>
                          <div className="flex items-center gap-2">
                            <input
                              type="time"
                              required
                              value={involvement.start}
                              onChange={(e) => setInvolvement((v) => ({ ...v, start: e.target.value }))}
                              className="h-10 flex-1 rounded-lg border border-border bg-white/70 px-3 text-sm dark:bg-white/5"
                            />
                            <span className="text-xs text-muted-foreground">to</span>
                            <input
                              type="time"
                              required
                              value={involvement.end}
                              onChange={(e) => setInvolvement((v) => ({ ...v, end: e.target.value }))}
                              className="h-10 flex-1 rounded-lg border border-border bg-white/70 px-3 text-sm dark:bg-white/5"
                            />
                          </div>

                          <div className="mb-1.5 mt-4 text-xs font-medium text-espresso-700 dark:text-crema-200">
                            Event photos (optional)
                          </div>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handlePhotoSelect}
                            className="hidden"
                          />
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-espresso-300 py-3 text-xs font-medium text-espresso-600 hover:bg-espresso-50 dark:border-white/15 dark:text-crema-300 dark:hover:bg-white/5"
                          >
                            <Camera size={14} /> Add photos
                          </button>
                          {photos.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-2">
                              {photos.map((src, i) => (
                                <div key={i} className="relative h-14 w-14 overflow-hidden rounded-lg border border-border">
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img src={src} alt="" className="h-full w-full object-cover" />
                                  <button
                                    type="button"
                                    onClick={() => setPhotos((p) => p.filter((_, idx) => idx !== i))}
                                    className="absolute right-0.5 top-0.5 rounded-full bg-ink/60 p-0.5 text-white"
                                  >
                                    <X size={10} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}

                          <Button type="submit" size="sm" className="mt-4 w-full">
                            Save involvement details
                          </Button>
                        </form>
                      )}
                    </div>
                  )}
                </div>
              </Tabs.Content>

              <Tabs.Content value="face">
                <div className="mx-auto flex max-w-sm flex-col items-center text-center">
                  <div className="relative flex h-64 w-64 items-center justify-center rounded-full border-2 border-dashed border-espresso-300 bg-espresso-50 dark:border-white/15 dark:bg-white/5">
                    <ScanFace size={64} className="text-espresso-400" />
                  </div>
                  <p className="mt-5 text-sm text-muted-foreground">Align your face within the frame for verified check-in.</p>
                  <Button className="mt-4" variant="outline">Enable Camera</Button>
                </div>
              </Tabs.Content>

              <Tabs.Content value="gps">
                <div className="mx-auto flex max-w-sm flex-col items-center text-center">
                  <div className="relative flex h-64 w-64 items-center justify-center rounded-3xl bg-espresso-50 dark:bg-white/5">
                    <MapPin size={56} className="text-espresso-500" />
                    <span className="absolute h-24 w-24 animate-ping rounded-full bg-espresso-400/20" />
                  </div>
                  <p className="mt-5 text-sm text-muted-foreground">Confirms you&apos;re within 100m of the event location before logging attendance.</p>
                  <Badge variant="success" className="mt-4">Within geofence · 42m away</Badge>
                </div>
              </Tabs.Content>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock size={16} /> Check-in Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {checkinHistory.map((c, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Avatar name={c.name} size={32} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-foreground">{c.name}</div>
                    <div className="truncate text-xs text-muted-foreground">{c.time}</div>
                  </div>
                  <Badge variant={methodColor[c.method]}>{c.method}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </Tabs.Root>

      <Card>
        <CardHeader>
          <CardTitle>Attendance History</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-3 py-2">Volunteer</th>
                <th className="px-3 py-2">Event</th>
                <th className="px-3 py-2">Time</th>
                <th className="px-3 py-2">Method</th>
              </tr>
            </thead>
            <tbody>
              {checkinHistory.map((c, i) => (
                <tr key={i} className="border-b border-border last:border-0">
                  <td className="px-3 py-3 font-medium text-foreground">{c.name}</td>
                  <td className="px-3 py-3 text-muted-foreground">{c.event}</td>
                  <td className="px-3 py-3 text-muted-foreground">{c.time}</td>
                  <td className="px-3 py-3"><Badge variant={methodColor[c.method]}>{c.method}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
