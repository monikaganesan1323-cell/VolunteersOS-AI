"use client";

import Link from "next/link";
import {
  CalendarDays, MapPin, Users, Clock, ArrowLeft, ShieldAlert,
  ClipboardCheck, UserPlus, QrCode, Phone,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar } from "@/components/ui/avatar";
import { useStore } from "@/lib/store";
import { formatDate } from "@/lib/utils";

const checklist = [
  "Confirm venue access and parking",
  "Print volunteer QR passes",
  "Brief team leads on role assignments",
  "Stage first-aid and water stations",
  "Test emergency broadcast channel",
];

const emergencyContacts = [
  { name: "Event Control Room", phone: "+91 484 220 1122" },
  { name: "Local Police Liaison", phone: "+91 484 236 7788" },
  { name: "Nearest Hospital", phone: "+91 484 240 5566" },
];

export default function EventDetailPage({ params }: { params: { id: string } }) {
  const { events, volunteers, hydrated } = useStore();
  const event = events.find((e) => e.id === params.id);

  if (!event) {
    return (
      <div className="space-y-6">
        <Link href="/events" className="inline-flex items-center gap-1.5 text-sm font-medium text-espresso-600 hover:underline dark:text-crema-300">
          <ArrowLeft size={14} /> Back to events
        </Link>
        <Card>
          <CardContent className="py-16 text-center">
            <p className="text-sm text-muted-foreground">
              {hydrated ? "That event no longer exists." : "Loading event..."}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const assigned = volunteers.slice(0, 6);
  const fillRate = event.capacity > 0 ? (event.registered / event.capacity) * 100 : 0;

  return (
    <div className="space-y-6">
      <Link href="/events" className="inline-flex items-center gap-1.5 text-sm font-medium text-espresso-600 hover:underline dark:text-crema-300">
        <ArrowLeft size={14} /> Back to events
      </Link>

      <Card className="overflow-hidden">
        <div className="h-36 bg-roast-gradient" />
        <CardContent className="pb-6">
          <div className="-mt-6 flex flex-wrap items-start justify-between gap-4">
            <div>
              <Badge variant="secondary" className="mb-2 capitalize">{event.status}</Badge>
              <h1 className="font-display text-2xl font-semibold text-ink dark:text-crema-50">
                {event.title}
              </h1>
              <p className="text-sm text-muted-foreground">{event.organization} · {event.category}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm"><QrCode size={14} /> Live Attendance</Button>
              <Button size="sm"><UserPlus size={14} /> Assign Volunteers</Button>
            </div>
          </div>

          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {event.description}
          </p>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarDays size={14} /> {formatDate(event.date)} · {event.time}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin size={14} /> {event.location}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users size={14} /> {event.registered}/{event.capacity} registered
            </div>
          </div>

          <div className="mt-4 max-w-md">
            <Progress value={fillRate} />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Volunteer Assignment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {assigned.map((v) => (
              <div key={v.id} className="flex items-center gap-3 rounded-xl border border-border p-3">
                <Avatar name={v.name} size={36} />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium text-foreground">{v.name}</div>
                  <div className="truncate text-xs text-muted-foreground">{v.skills[0] ?? "Volunteer"}</div>
                </div>
                <Badge variant="success">Confirmed</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-5">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardCheck size={16} /> Checklist
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {checklist.map((c, i) => (
                <label key={i} className="flex items-start gap-2.5 text-sm text-foreground/85">
                  <input type="checkbox" className="mt-0.5 h-4 w-4 rounded border-border accent-espresso-600" />
                  {c}
                </label>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-rust-500">
                <ShieldAlert size={16} /> Emergency Contacts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {emergencyContacts.map((c) => (
                <div key={c.name} className="flex items-center justify-between text-sm">
                  <span className="text-foreground/85">{c.name}</span>
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <Phone size={12} /> {c.phone}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
