import Link from "next/link";
import { Clock, Award, TrendingUp, Star, ArrowRight, MapPin, CalendarDays } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { StatCard } from "@/components/dashboard/stat-card";
import { currentVolunteer } from "@/components/portal/sidebar";
import { events } from "@/data/events";
import { certificates } from "@/data/misc";
import { formatDate } from "@/lib/utils";

const statusVariant: Record<string, "success" | "warning" | "secondary"> = {
  upcoming: "success",
  ongoing: "warning",
  completed: "secondary",
};

export default function PortalHomePage() {
  const upcoming = events.filter((e) => e.status === "upcoming").slice(0, 5);
  const myCertificates = certificates.filter((c) => c.volunteerName === currentVolunteer.name);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Avatar name={currentVolunteer.name} size={56} />
          <div>
            <h1 className="font-display text-2xl font-semibold text-ink dark:text-crema-50">
              Welcome back, {currentVolunteer.name.split(" ")[0]}
            </h1>
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin size={12} /> {currentVolunteer.city} · {currentVolunteer.organization}
            </p>
          </div>
        </div>
        <Link href="/portal/passport" className="text-sm font-medium text-sage-700 hover:underline dark:text-sage-400">
          View my passport <ArrowRight size={13} className="inline" />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={Clock} label="Hours logged" value={currentVolunteer.hours.toString()} />
        <StatCard icon={TrendingUp} label="Level" value={currentVolunteer.level.toString()} />
        <StatCard icon={Star} label="XP" value={currentVolunteer.xp.toLocaleString("en-IN")} />
        <StatCard icon={Award} label="Certificates" value={myCertificates.length.toString()} />
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-base font-semibold text-ink dark:text-crema-50">
            Upcoming events
          </h2>
          <Link href="/portal/events" className="text-xs font-medium text-sage-700 hover:underline dark:text-sage-400">
            Browse all
          </Link>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-3">Event</th>
                <th className="px-4 py-3">Organization</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {upcoming.map((e) => (
                <tr key={e.id} className="border-b border-border last:border-0 hover:bg-sage-500/5">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <CalendarDays size={14} className="shrink-0 text-sage-600 dark:text-sage-400" />
                      <span className="font-medium text-foreground">{e.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{e.organization}</td>
                  <td className="px-4 py-3 text-muted-foreground">{formatDate(e.date)}</td>
                  <td className="px-4 py-3 text-muted-foreground">{e.location.split(",")[0]}</td>
                  <td className="px-4 py-3">
                    <Badge variant={statusVariant[e.status]} className="capitalize">{e.status}</Badge>
                  </td>
                </tr>
              ))}
              {upcoming.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-sm text-muted-foreground">
                    No upcoming events yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h2 className="mb-3 font-display text-base font-semibold text-ink dark:text-crema-50">My badges</h2>
        {currentVolunteer.badges.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {currentVolunteer.badges.map((b) => (
              <Badge key={b} variant="secondary">🏅 {b}</Badge>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No badges yet — join an event to start earning them.</p>
        )}
      </div>
    </div>
  );
}
