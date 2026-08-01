"use client";

import { motion } from "framer-motion";
import { Users, CalendarCheck2, Building2, Award, Heart } from "lucide-react";
import { CountUp } from "./count-up";

const stats = [
  { icon: Users, value: 12850, suffix: "+", label: "Registered Volunteers" },
  { icon: CalendarCheck2, value: 625, suffix: "+", label: "Events Conducted" },
  { icon: Building2, value: 145, suffix: "+", label: "Organizations" },
  { icon: Award, value: 28500, suffix: "+", label: "Certificates Generated" },
  { icon: Heart, value: 98, suffix: "%", label: "Volunteer Satisfaction" },
];

export function LiveStats() {
  return (
    <section className="relative overflow-hidden bg-espresso-800 py-16 dark:bg-bark">
      <div className="pointer-events-none absolute inset-0 bg-roast-gradient opacity-20" />
      <div className="pointer-events-none absolute inset-0 bg-grain opacity-40" />
      <div className="relative mx-auto max-w-6xl px-4">
        <div className="mb-10 text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-crema-300">
            Live, right now
          </span>
          <h2 className="mt-2 font-display text-2xl font-semibold text-crema-50 md:text-3xl">
            The numbers behind the blend
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-5">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="text-center"
            >
              <span className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-crema-200">
                <s.icon size={18} />
              </span>
              <div className="font-display text-2xl font-semibold text-crema-50 md:text-3xl">
                <CountUp end={s.value} suffix={s.suffix} />
              </div>
              <div className="mt-1 text-[11px] uppercase tracking-wide text-crema-100/55">
                {s.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
