// Builds a standards-compliant .ics file for a single event and triggers a
// download. No dependency needed — Google Calendar, Outlook, and Apple
// Calendar all import this format directly.

import type { VolunteerEvent } from "@/types";

const DEFAULT_DURATION_HOURS = 3;

export type CalendarEvent = Pick<
  VolunteerEvent,
  "id" | "title" | "date" | "time" | "location" | "description" | "organization"
>;

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

function stamp(d: Date) {
  return (
    `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}` +
    `T${pad(d.getHours())}${pad(d.getMinutes())}00`
  );
}

function parse(date: string, time: string) {
  const [y, m, d] = date.split("-").map(Number);
  const [hh, mm] = (time || "09:00").split(":").map(Number);
  return new Date(y, (m || 1) - 1, d || 1, hh || 0, mm || 0);
}

// ICS treats these as control characters, so they have to be escaped.
function esc(text: string) {
  return (text ?? "")
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

export function buildIcs(event: CalendarEvent) {
  const start = parse(event.date, event.time);
  const end = new Date(start);
  end.setHours(end.getHours() + DEFAULT_DURATION_HOURS);

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//VolunteerOS AI//Events//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${event.id}@volunteeros.ai`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").split(".")[0]}Z`,
    `DTSTART:${stamp(start)}`,
    `DTEND:${stamp(end)}`,
    `SUMMARY:${esc(event.title)}`,
    `DESCRIPTION:${esc(event.description)}`,
    `LOCATION:${esc(event.location)}`,
    `ORGANIZER;CN=${esc(event.organization)}:MAILTO:noreply@volunteeros.ai`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

export function downloadIcs(event: CalendarEvent) {
  const blob = new Blob([buildIcs(event)], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${event.title.replace(/[^\w\d]+/g, "-").toLowerCase() || "event"}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
