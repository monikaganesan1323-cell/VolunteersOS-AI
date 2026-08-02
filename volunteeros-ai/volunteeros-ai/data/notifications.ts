import { Bell, Megaphone, ShieldAlert, CalendarClock, Sparkles, UserCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { aiMatches } from "@/data/misc";

export type NotificationType =
  | "ai_recommendation"
  | "alert"
  | "reminder"
  | "announcement"
  | "activity"
  | "registration";

export interface AppNotification {
  id: string;
  type: NotificationType;
  icon: LucideIcon;
  title: string;
  body: string;
  time: string;
}

/**
 * Icon reference per type. Notifications generated at runtime (e.g. a
 * volunteer registering) are persisted to localStorage without their icon —
 * component references aren't JSON-serialisable — and resolved through this
 * map when read back.
 */
export const TYPE_ICON: Record<NotificationType, LucideIcon> = {
  ai_recommendation: Sparkles,
  alert: ShieldAlert,
  reminder: CalendarClock,
  announcement: Megaphone,
  activity: Bell,
  registration: UserCheck,
};

const topMatch = [...aiMatches].sort((a, b) => b.skillMatch - a.skillMatch)[0];

/** Shared by the notifications page and the topbar bell. */
export const notifications: AppNotification[] = [
  {
    id: "n-ai-1",
    type: "ai_recommendation",
    icon: Sparkles,
    title: `AI recommends ${topMatch.volunteerName} for ${topMatch.eventTitle}`,
    body: `${topMatch.skillMatch}% skill match as ${topMatch.recommendedRole}. ${topMatch.reason}`,
    time: "Just now",
  },
  {
    id: "n-alert-1",
    type: "alert",
    icon: ShieldAlert,
    title: "Emergency Broadcast — Idukki Sector 4",
    body: "Heavy rainfall alert issued. All volunteers in the sector should check in with their team lead.",
    time: "3 hr ago",
  },
  {
    id: "n-reminder-1",
    type: "reminder",
    icon: CalendarClock,
    title: "Event reminder: Beach Cleanup Drive",
    body: "Your registered event starts tomorrow at 6:30 AM at Fort Kochi Beach.",
    time: "6 hr ago",
  },
  {
    id: "n-announce-1",
    type: "announcement",
    icon: Megaphone,
    title: "New badge tier launched: Legend",
    body: "Volunteers crossing 10,000 XP now unlock the Legend badge tier.",
    time: "1 day ago",
  },
  {
    id: "n-activity-1",
    type: "activity",
    icon: Bell,
    title: "Certificate issued",
    body: "Your certificate for Rural Literacy Bootcamp is ready to download.",
    time: "1 day ago",
  },
  {
    id: "n-reminder-2",
    type: "reminder",
    icon: CalendarClock,
    title: "Event reminder: Blood Donation Mega Camp",
    body: "Registration closes in 48 hours — 18 slots remaining.",
    time: "2 days ago",
  },
];
