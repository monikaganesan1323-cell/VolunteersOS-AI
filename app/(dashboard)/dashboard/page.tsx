import Link from "next/link";
import {
  Users, CalendarCheck2, Clock, Award, Building2, TrendingUp, ArrowRight,
  MapPin, CircleCheck,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/dashboard/stat-card";
import { VolunteerGrowthChart, AttendanceChart } from "@/components/dashboard/charts";
import { events } from "@/data/events";
import { leaderboard, aiMatches, activityFeed, certificates } from "@/data/misc";
import { formatDate } from "@/lib/utils";

export default function DashboardHomePage() {
  const upcoming = events.filter((e) => e.status === "upcoming").slice(0, 4);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink dark:text-crema-50">
            Good morning, Monika
          </h1>
          <p className="text-sm text-muted-foreground">
            Here&apos;s what&apos;s brewing across your programs today.
          </p>
        </div>
        <Button asChild>
          <Link href="/events">
            Create Event <ArrowRight size={15} />
          </Link>
        </Button>
      </div>

      {/* Stat grid */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard icon={Users} label="Total Volunteers" value="10,482" delta="+3.4%" />
        <StatCard icon={CalendarCheck2} label="Today's Attendance" value="612" delta="+12%" />
        <StatCard icon={Clock} label="Volunteer Hours" value="48.2k" delta="+6.1%" />
        <StatCard icon={Award} label="Certificates Issued" value="25,640" delta="+2.9%" />
        <StatCard icon={Building2} label="Organizations" value="134" delta="+4" />
        <StatCard icon={TrendingUp} label="Monthly Growth" value="7.4%" delta="+1.2%" />
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Volunteer Growth</CardTitle>
              <p className="text-sm text-muted-foreground">Last 6 months</p>
            </div>
            <Badge variant="success">+34% YoY</Badge>
          </CardHeader>
          <CardContent>
            <VolunteerGrowthChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Leaderboard</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {leaderboard.slice(0, 5).map((l) => (
              <div key={l.rank} className="flex items-center gap-3">
                <span className="w-4 text-center text-xs font-semibold text-espresso-500">
                  {l.rank}
                </span>
                <Avatar name={l.name} size={32} />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium text-foreground">{l.name}</div>
                  <div className="text-xs text-muted-foreground">Level {l.level} · {l.hours}h</div>
                </div>
                <Badge variant="secondary">{l.badge}</Badge>
              </div>
            ))}
            <Button variant="ghost" size="sm" className="w-full" asChild>
              <Link href="/leaderboard">
                View full leaderboard <ArrowRight size={14} />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Attendance This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <AttendanceChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle>Upcoming Events</CardTitle>
            <Link href="/events" className="text-xs font-medium text-espresso-600 hover:underline dark:text-crema-300">
              View all
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcoming.map((e) => (
              <div key={e.id} className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-lg bg-espresso-50 text-espresso-700 dark:bg-white/5 dark:text-crema-200">
                  <span className="text-[10px] font-medium uppercase leading-none">
                    {new Date(e.date).toLocaleDateString("en-IN", { month: "short" })}
                  </span>
                  <span className="text-sm font-semibold leading-none">
                    {new Date(e.date).getDate()}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium text-foreground">{e.title}</div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin size={11} /> {e.location.split(",")[0]}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI Recommendations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {aiMatches.slice(0, 3).map((m, i) => (
              <div key={i} className="rounded-xl border border-border p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">{m.volunteerName}</span>
                  <Badge variant="success">{m.skillMatch}% fit</Badge>
                </div>
                <div className="mt-1 text-xs text-muted-foreground">→ {m.eventTitle}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Activity Timeline</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {activityFeed.map((a) => (
              <div key={a.id} className="flex gap-3">
                <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-espresso-500" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-foreground">
                    <span className="font-medium">{a.actor}</span>{" "}
                    <span className="text-muted-foreground">{a.action}</span>{" "}
                    <span className="font-medium">{a.target}</span>
                  </p>
                  <span className="text-xs text-muted-foreground">{a.time}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle>Recent Certificates</CardTitle>
            <Link href="/certificates" className="text-xs font-medium text-espresso-600 hover:underline dark:text-crema-300">
              View all
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {certificates.slice(0, 4).map((c) => (
              <div key={c.id} className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-crema-swirl text-espresso-800">
                  <Award size={16} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium text-foreground">{c.volunteerName}</div>
                  <div className="truncate text-xs text-muted-foreground">{c.eventTitle}</div>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  {c.verified && <CircleCheck size={13} className="text-sage-500" />}
                  {formatDate(c.issuedOn)}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
