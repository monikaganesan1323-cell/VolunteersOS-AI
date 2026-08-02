"use client";

import Link from "next/link";
import { MapPin } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useStore } from "@/lib/store";

/** Upcoming events panel — includes events created from the Create Event dialog. */
export function UpcomingEvents() {
  const { events } = useStore();
  const upcoming = events.filter((e) => e.status === "upcoming").slice(0, 4);

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle>Upcoming Events</CardTitle>
        <Link
          href="/events"
          className="text-xs font-medium text-espresso-600 hover:underline dark:text-crema-300"
        >
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
        {upcoming.length === 0 && (
          <p className="py-6 text-center text-sm text-muted-foreground">
            No upcoming events yet — create one to get started.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
