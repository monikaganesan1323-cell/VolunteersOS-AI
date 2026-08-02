"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Users2, ArrowRight, Sparkles } from "lucide-react";
import { useVolunteers } from "@/lib/volunteer-store";
import { suggestEvents } from "@/lib/matching";
import { initials } from "@/lib/utils";
import type { VolunteerEvent } from "@/types";

export function SimilarityRecommendations({ events }: { events: VolunteerEvent[] }) {
  const { volunteers } = useVolunteers();

  const recommendations = useMemo(
    () => suggestEvents(volunteers, events),
    [volunteers, events]
  );

  if (recommendations.length === 0) return null;

  return (
    <div className="rounded-2xl border border-espresso-200 bg-crema-swirl/10 p-5 dark:border-espresso-500/30">
      <div className="mb-4 flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-espresso-600 text-crema-50">
          <Users2 size={15} />
        </span>
        <div>
          <div className="font-display text-sm font-semibold text-ink dark:text-crema-50">
            Volunteer similarity matches
          </div>
          <p className="text-xs text-muted-foreground">
            Upcoming events matched to volunteers by skills, interests, and location.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {recommendations.map((r, i) => (
          <motion.div
            key={r.volunteer.id + r.event.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
            className="rounded-xl border border-border bg-card p-4"
          >
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-espresso-50 text-[11px] font-semibold text-espresso-700 dark:bg-white/5 dark:text-crema-200">
                {initials(r.volunteer.name)}
              </span>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium text-foreground">{r.volunteer.name}</div>
                <div className="text-[11px] text-muted-foreground">
                  {r.score}% match · {r.event.category}
                </div>
              </div>
              <Sparkles size={13} className="shrink-0 text-espresso-500" />
            </div>

            <div className="mt-3 flex items-center gap-1.5 text-xs text-espresso-700 dark:text-crema-200">
              <ArrowRight size={12} className="shrink-0 text-espresso-400" />
              <span className="truncate font-medium">{r.event.title}</span>
            </div>

            {r.matched.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {r.matched.slice(0, 3).map((s) => (
                  <span
                    key={s}
                    className="rounded-full bg-espresso-50 px-2 py-0.5 text-[10px] capitalize text-espresso-600 dark:bg-white/5 dark:text-crema-300"
                  >
                    {s}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
