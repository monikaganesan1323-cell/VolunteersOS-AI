"use client";

import { motion } from "framer-motion";
import { Clock, HeartHandshake, MapPinned, Droplet, TreePine, Megaphone } from "lucide-react";
import { CountUp } from "./count-up";

const impact = [
  { icon: Clock, value: 356420, suffix: "+", label: "Volunteer hours logged" },
  { icon: HeartHandshake, value: 214000, suffix: "+", label: "Lives impacted" },
  { icon: MapPinned, value: 312, suffix: "+", label: "Communities served" },
  { icon: Droplet, value: 18900, suffix: "+", label: "Blood donations enabled" },
  { icon: TreePine, value: 46500, suffix: "+", label: "Trees planted" },
  { icon: Megaphone, value: 890, suffix: "+", label: "Awareness campaigns" },
];

export function SocialImpact() {
  return (
    <section className="relative overflow-hidden py-20">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-grain opacity-30" />
      <div className="mx-auto max-w-6xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-espresso-500">
            Beyond the numbers
          </span>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink dark:text-crema-50 md:text-4xl">
            Social impact, measured
          </h2>
          <p className="mt-3 text-espresso-700/75 dark:text-crema-100/65">
            Every check-in on VolunteerOS AI rolls up into a story your
            funders, boards, and members can actually see.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6">
          {impact.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-5 text-center shadow-glass"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-espresso-50 text-espresso-600 dark:bg-white/5 dark:text-crema-300">
                <s.icon size={18} />
              </span>
              <div>
                <div className="font-display text-xl font-semibold text-ink dark:text-crema-50">
                  <CountUp end={s.value} suffix={s.suffix} />
                </div>
                <div className="mt-1 text-[11px] leading-tight text-espresso-600/70 dark:text-crema-300/55">
                  {s.label}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
