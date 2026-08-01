"use client";

import { motion } from "framer-motion";
import { Sparkles, MapPin, ArrowRight } from "lucide-react";
import { aiMatches } from "@/data/misc";
import { Progress } from "@/components/ui/progress";

const scoreFields: { key: keyof (typeof aiMatches)[number]; label: string }[] = [
  { key: "skillMatch", label: "Skill match" },
  { key: "availabilityMatch", label: "Availability" },
  { key: "interestMatch", label: "Interest score" },
];

export function AIRecommendations() {
  return (
    <section className="relative overflow-hidden py-20">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-full bg-crema-swirl opacity-[0.05] dark:opacity-[0.08]" />

      <div className="mx-auto max-w-6xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-espresso-500">
            <Sparkles size={13} /> The blend engine
          </span>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink dark:text-crema-50 md:text-4xl">
            AI recommendations, matched in real time
          </h2>
          <p className="mt-3 text-espresso-700/75 dark:text-crema-100/65">
            Every volunteer is scored against every open event on skill,
            availability, interest, and distance — then paired with the
            role they&apos;ll actually be great at.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 lg:grid-cols-2">
          {aiMatches.map((m, i) => (
            <motion.div
              key={m.volunteerName + m.eventTitle}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: (i % 2) * 0.1 }}
              className="rounded-2xl border border-border bg-card p-6 shadow-glass transition-all hover:-translate-y-1 hover:shadow-warm"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="text-[11px] uppercase tracking-wide text-espresso-500">
                    Recommended for
                  </div>
                  <div className="font-display text-base font-semibold text-ink dark:text-crema-50">
                    {m.volunteerName}
                  </div>
                </div>
                <span className="flex items-center gap-1 rounded-full bg-sage-500/15 px-2.5 py-1 text-[11px] font-semibold text-sage-600 dark:text-sage-400">
                  {m.skillMatch}% fit
                </span>
              </div>

              <div className="mt-4 rounded-xl bg-espresso-50 p-3.5 dark:bg-white/5">
                <div className="text-[11px] uppercase tracking-wide text-espresso-600/70 dark:text-crema-300/55">
                  Event
                </div>
                <div className="mt-0.5 font-display text-sm font-semibold text-ink dark:text-crema-50">
                  {m.eventTitle}
                </div>
                <div className="mt-1 flex items-center gap-1.5 text-xs text-espresso-600/70 dark:text-crema-300/55">
                  <MapPin size={12} /> {m.distanceKm} km away · Suggested role: {m.recommendedRole}
                </div>
              </div>

              <div className="mt-4 space-y-2.5">
                {scoreFields.map((f) => (
                  <div key={f.label}>
                    <div className="mb-1 flex justify-between text-[11px] text-espresso-600/70 dark:text-crema-300/55">
                      <span>{f.label}</span>
                      <span>{m[f.key]}%</span>
                    </div>
                    <Progress value={Number(m[f.key])} />
                  </div>
                ))}
              </div>

              <p className="mt-4 text-xs leading-relaxed text-espresso-700/70 dark:text-crema-100/60">
                <span className="font-medium text-espresso-800 dark:text-crema-100">Why:</span>{" "}
                {m.reason}
              </p>

              <button className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-espresso-600 py-2.5 text-xs font-medium text-white transition-colors hover:bg-espresso-700 dark:bg-espresso-400 dark:text-bark">
                Apply now <ArrowRight size={13} />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
