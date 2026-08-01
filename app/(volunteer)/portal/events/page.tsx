"use client";

import { useState } from "react";
import { MapPin, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { events } from "@/data/events";
import { formatDate } from "@/lib/utils";

const statusStyle: Record<string, "success" | "warning" | "secondary"> = {
  upcoming: "success",
  ongoing: "warning",
  completed: "secondary",
  cancelled: "secondary",
};

export default function PortalEventsPage() {
  const [applied, setApplied] = useState<string[]>([]);
  const visible = events.filter((e) => e.status !== "cancelled");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink dark:text-crema-50">Browse Events</h1>
        <p className="text-sm text-muted-foreground">Find an event and apply — organizers review requests from here.</p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((e) => {
          const hasApplied = applied.includes(e.id);
          return (
            <div key={e.id} className="flex flex-col rounded-2xl border border-border bg-card p-5 shadow-glass">
              <div className="flex items-start justify-between gap-2">
                <span className="text-xs font-medium text-espresso-600/70 dark:text-crema-300/60">{e.organization}</span>
                <Badge variant={statusStyle[e.status]} className="shrink-0 capitalize">{e.status}</Badge>
              </div>
              <h3 className="mt-2 font-display text-sm font-semibold text-ink dark:text-crema-50">{e.title}</h3>
              <p className="mt-1.5 line-clamp-2 text-xs text-muted-foreground">{e.description}</p>

              <div className="mt-3 space-y-1 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5"><Calendar size={11} /> {formatDate(e.date)} · {e.time}</div>
                <div className="flex items-center gap-1.5"><MapPin size={11} /> {e.location}</div>
              </div>

              <Button
                size="sm"
                variant={hasApplied ? "secondary" : "default"}
                disabled={hasApplied || e.status === "completed"}
                className="mt-4"
                onClick={() => setApplied((a) => [...a, e.id])}
              >
                {hasApplied ? "Applied" : "Apply now"}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
