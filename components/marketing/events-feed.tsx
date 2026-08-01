"use client";

import { motion } from "framer-motion";
import { MapPin, Heart, MessageCircle, Share2, Building2 } from "lucide-react";
import { events } from "@/data/events";
import { formatDate } from "@/lib/utils";

const feed = [...events]
  .filter((e) => e.status !== "cancelled")
  .sort((a, b) => (a.status === "upcoming" ? -1 : 1))
  .slice(0, 8);

const social = [
  { likes: 214, comments: 18, shares: 9 },
  { likes: 156, comments: 12, shares: 6 },
  { likes: 302, comments: 27, shares: 14 },
  { likes: 189, comments: 15, shares: 8 },
  { likes: 97, comments: 6, shares: 3 },
  { likes: 244, comments: 21, shares: 11 },
  { likes: 133, comments: 9, shares: 5 },
  { likes: 178, comments: 13, shares: 7 },
];

const statusStyle: Record<string, string> = {
  upcoming: "bg-sage-500/15 text-sage-600 dark:text-sage-400",
  ongoing: "bg-rust-500/15 text-rust-500",
  completed: "bg-espresso-500/10 text-espresso-600 dark:text-crema-300",
};

export function EventsFeed() {
  return (
    <section id="events" className="mx-auto max-w-6xl px-4 py-20">
      <div className="mx-auto max-w-2xl text-center">
        <span className="text-xs font-semibold uppercase tracking-widest text-espresso-500">
          Fresh off the roast
        </span>
        <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink dark:text-crema-50 md:text-4xl">
          Recent events feed
        </h2>
        <p className="mt-3 text-espresso-700/75 dark:text-crema-100/65">
          Live from organizations posting on the platform right now.
        </p>
      </div>

      <div className="mx-auto mt-12 grid max-w-3xl gap-5">
        {feed.map((e, i) => {
          const fillRate = Math.round((e.registered / e.capacity) * 100);
          const s = social[i];
          return (
            <motion.article
              key={e.id}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: (i % 4) * 0.06 }}
              className="rounded-2xl border border-border bg-card p-6 shadow-glass"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-espresso-600 text-crema-50">
                  <Building2 size={15} />
                </span>
                <div className="min-w-0">
                  <div className="font-display text-sm font-semibold text-ink dark:text-crema-50">
                    {e.organization}
                  </div>
                  <div className="text-[11px] text-espresso-600/60 dark:text-crema-300/50">
                    {formatDate(e.date)} · {e.time}
                  </div>
                </div>
                <span
                  className={`ml-auto rounded-full px-2.5 py-1 text-[10px] font-medium capitalize ${statusStyle[e.status]}`}
                >
                  {e.status}
                </span>
              </div>

              <h3 className="mt-4 font-display text-base font-semibold text-ink dark:text-crema-50">
                {e.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-espresso-700/70 dark:text-crema-100/60">
                {e.description}
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-espresso-600/70 dark:text-crema-300/55">
                <span className="flex items-center gap-1.5">
                  <MapPin size={12} /> {e.location}
                </span>
                <span className="rounded-full bg-espresso-50 px-2 py-0.5 dark:bg-white/5">
                  {e.category}
                </span>
              </div>

              <div className="mt-4">
                <div className="mb-1.5 flex justify-between text-[11px] text-espresso-600/65 dark:text-crema-300/55">
                  <span>{e.registered} registered</span>
                  <span>{e.capacity} needed</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-espresso-100 dark:bg-white/10">
                  <div
                    className="h-full rounded-full bg-crema-swirl"
                    style={{ width: `${Math.min(fillRate, 100)}%` }}
                  />
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                <div className="flex items-center gap-5 text-xs text-espresso-600/70 dark:text-crema-300/55">
                  <span className="flex items-center gap-1.5">
                    <Heart size={14} /> {s.likes}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MessageCircle size={14} /> {s.comments}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Share2 size={14} /> {s.shares}
                  </span>
                </div>
                <button className="rounded-xl bg-espresso-600 px-4 py-1.5 text-xs font-medium text-white transition-colors hover:bg-espresso-700 dark:bg-espresso-400 dark:text-bark">
                  Register
                </button>
              </div>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
