"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X, MapPin, Calendar, Users, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import type { VolunteerEvent } from "@/types";

const statusStyle: Record<string, "success" | "warning" | "secondary"> = {
  upcoming: "success",
  ongoing: "warning",
  completed: "secondary",
  cancelled: "secondary",
};

/**
 * Event detail modal for the volunteer portal. Opened by clicking an event
 * card; holds the Register action.
 */
export function EventDetailDialog({
  event,
  registered,
  onClose,
  onRegister,
}: {
  event: VolunteerEvent | null;
  registered: boolean;
  onClose: () => void;
  onRegister: () => void;
}) {
  return (
    <AnimatePresence>
      {event && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-ink/50 backdrop-blur-sm"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              role="dialog"
              aria-modal="true"
              className="relative flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-warm-lg"
            >
            <button
              onClick={onClose}
              className="absolute right-4 top-4 z-10 text-muted-foreground hover:text-foreground"
              aria-label="Close"
            >
              <X size={18} />
            </button>

            <div className="min-h-0 flex-1 overflow-y-auto p-6">
              <span className="text-xs font-medium text-espresso-600/70 dark:text-crema-300/60">
                {event.organization}
              </span>
              <div className="mt-1.5 flex items-start justify-between gap-3">
                <h2 className="font-display text-lg font-semibold text-ink dark:text-crema-50">
                  {event.title}
                </h2>
                <Badge variant={statusStyle[event.status]} className="shrink-0 capitalize">
                  {event.status}
                </Badge>
              </div>

              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {event.description}
              </p>

              <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar size={14} /> {formatDate(event.date)} · {event.time}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={14} /> {event.location}
                </div>
                <div className="flex items-center gap-2">
                  <Users size={14} /> {event.registered}/{event.capacity} registered
                </div>
              </div>

              {registered && (
                <div className="mt-4 flex items-center gap-2 rounded-xl border border-sage-500/30 bg-sage-500/10 p-3 text-sm text-foreground">
                  <CheckCircle2 size={16} className="shrink-0 text-sage-500" />
                  You&apos;re registered for this event.
                </div>
              )}
            </div>

            <div className="border-t border-border p-4">
              <Button
                className="w-full"
                variant={registered ? "secondary" : "default"}
                disabled={registered || event.status === "completed"}
                onClick={onRegister}
              >
                {registered
                  ? "Registered"
                  : event.status === "completed"
                    ? "Event completed"
                    : "Register for this event"}
              </Button>
            </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
