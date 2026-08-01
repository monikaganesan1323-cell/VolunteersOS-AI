"use client";

import { motion } from "framer-motion";
import { Clock, Flame, MessageCircle } from "lucide-react";
import { volunteers } from "@/data/volunteers";
import { initials } from "@/lib/utils";

const featured = [...volunteers].sort((a, b) => b.xp - a.xp).slice(0, 6);
const availability = [
  "Available weekends",
  "Available weekday evenings",
  "Available on-call",
  "Available weekends",
  "Available weekday mornings",
  "Currently on-call",
];

export function FeaturedVolunteers() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-espresso-500">
              Baristas of the month
            </span>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink dark:text-crema-50 md:text-4xl">
              Featured volunteers
            </h2>
          </div>
          <p className="max-w-sm text-sm text-espresso-700/70 dark:text-crema-100/60">
            Ranked by XP earned this quarter across every partner organization.
          </p>
        </div>
      </div>

      <div className="scrollbar-thin mx-auto flex max-w-6xl gap-5 overflow-x-auto px-4 pb-4">
        {featured.map((v, i) => (
          <motion.div
            key={v.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.45, delay: i * 0.06 }}
            className="w-72 shrink-0 rounded-2xl border border-border bg-card p-6 shadow-glass transition-all hover:-translate-y-1 hover:shadow-warm"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-roast-gradient font-display text-sm font-semibold text-crema-50">
                {initials(v.name)}
              </span>
              <div>
                <div className="font-display text-sm font-semibold text-ink dark:text-crema-50">
                  {v.name}
                </div>
                <div className="text-xs text-espresso-600/65 dark:text-crema-300/55">
                  {v.organization}
                </div>
              </div>
              <span className="ml-auto flex items-center gap-1 rounded-full bg-rust-500/10 px-2 py-1 text-[11px] font-medium text-rust-500">
                <Flame size={11} /> Lv.{v.level}
              </span>
            </div>

            <div className="mt-4 flex flex-wrap gap-1.5">
              {v.skills.slice(0, 3).map((s) => (
                <span
                  key={s}
                  className="rounded-full bg-espresso-50 px-2.5 py-1 text-[11px] font-medium text-espresso-700 dark:bg-white/5 dark:text-crema-200"
                >
                  {s}
                </span>
              ))}
            </div>

            <div className="mt-4 flex items-center gap-1.5 text-xs text-espresso-600/70 dark:text-crema-300/55">
              <Clock size={12} /> {v.hours} hrs logged · {v.eventsAttended} events
            </div>

            <div className="mt-1 text-[11px] text-sage-600 dark:text-sage-400">
              {availability[i]}
            </div>

            {v.badges.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {v.badges.slice(0, 2).map((b) => (
                  <span
                    key={b}
                    className="rounded-full border border-crema-300 px-2 py-0.5 text-[10px] font-medium text-espresso-600 dark:border-white/15 dark:text-crema-200"
                  >
                    🏅 {b}
                  </span>
                ))}
              </div>
            )}

            <button className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-espresso-200 py-2 text-xs font-medium text-espresso-700 transition-colors hover:bg-espresso-50 dark:border-white/15 dark:text-crema-100 dark:hover:bg-white/5">
              <MessageCircle size={13} /> Quick contact
            </button>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
