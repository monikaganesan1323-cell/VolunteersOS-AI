"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { MapPin, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useEvents } from "@/lib/event-store";
import { formatDate } from "@/lib/utils";
import { currentVolunteer } from "@/components/portal/sidebar";
import { EventDetailDialog } from "@/components/portal/event-detail-dialog";
import { useRegistrations } from "@/lib/registration-store";
import { useNotifications } from "@/lib/notification-store";
import type { VolunteerEvent } from "@/types";

const statusStyle: Record<string, "success" | "warning" | "secondary"> = {
  upcoming: "success",
  ongoing: "warning",
  completed: "secondary",
  cancelled: "secondary",
};

export default function PortalEventsPage() {
  const [selected, setSelected] = useState<VolunteerEvent | null>(null);
  const { events } = useEvents();
  const { isRegistered, register } = useRegistrations(currentVolunteer.id);
  const { addNotification } = useNotifications();
  const visible = events.filter((e) => e.status !== "cancelled");

  function handleRegister(event: VolunteerEvent) {
    register(event.id, currentVolunteer.name);
    addNotification({
      type: "registration",
      title: `${currentVolunteer.name} registered for ${event.title}`,
      body: `${currentVolunteer.city} · ${currentVolunteer.organization} · contact ${currentVolunteer.phone}`,
    });
    toast.success(`Registered for ${event.title}.`);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink dark:text-crema-50">Browse Events</h1>
        <p className="text-sm text-muted-foreground">Click an event to see details and register.</p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((e) => {
          const hasApplied = isRegistered(e.id);
          return (
            <div
              key={e.id}
              role="button"
              tabIndex={0}
              onClick={() => setSelected(e)}
              onKeyDown={(evt) => {
                if (evt.key === "Enter" || evt.key === " ") setSelected(e);
              }}
              className="flex cursor-pointer flex-col rounded-2xl border border-border bg-card p-5 text-left shadow-glass transition-shadow hover:shadow-warm-lg"
            >
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
                onClick={(evt) => {
                  evt.stopPropagation();
                  handleRegister(e);
                }}
              >
                {hasApplied ? "Registered" : "Register now"}
              </Button>
            </div>
          );
        })}
      </div>

      <EventDetailDialog
        event={selected}
        registered={selected ? isRegistered(selected.id) : false}
        onClose={() => setSelected(null)}
        onRegister={() => selected && handleRegister(selected)}
      />
    </div>
  );
}
