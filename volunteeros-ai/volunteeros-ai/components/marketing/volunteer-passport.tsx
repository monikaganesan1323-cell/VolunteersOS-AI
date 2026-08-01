"use client";

import { motion } from "framer-motion";
import { Download, Star, Clock, Award, ShieldCheck } from "lucide-react";
import { volunteers } from "@/data/volunteers";
import { initials } from "@/lib/utils";

const featured = volunteers.find((v) => v.name === "Fathima Zahra")!;
const leadershipScore = 92;

// Deterministic pseudo-QR grid — purely decorative, no real encoding needed.
const qrCells = Array.from({ length: 64 }, (_, i) => (i * 37 + (i % 7) * 13) % 5 === 0);

export function VolunteerPassport() {
  return (
    <section id="passport" className="mx-auto max-w-6xl px-4 py-20">
      <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-espresso-500">
            Take it with you
          </span>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink dark:text-crema-50 md:text-4xl">
            The Volunteer Passport
          </h2>
          <p className="mt-4 max-w-md text-espresso-700/75 dark:text-crema-100/65">
            One portable, verifiable profile for every hour logged, badge
            earned, and certificate issued — a QR scan away for any
            organization your volunteers show up for next.
          </p>

          <ul className="mt-7 space-y-4">
            {[
              { icon: Clock, text: `${featured.hours} verified hours across ${featured.eventsAttended} events` },
              { icon: Award, text: "Auto-generated, tamper-evident certificates" },
              { icon: ShieldCheck, text: "Portable across every partner organization" },
            ].map((f) => (
              <li key={f.text} className="flex items-start gap-3 text-sm text-espresso-700/80 dark:text-crema-100/70">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-espresso-50 text-espresso-600 dark:bg-white/5 dark:text-crema-300">
                  <f.icon size={14} />
                </span>
                {f.text}
              </li>
            ))}
          </ul>

          <button className="mt-8 flex items-center gap-2 rounded-xl border border-espresso-200 px-5 py-2.5 text-sm font-medium text-espresso-700 transition-colors hover:bg-espresso-50 dark:border-white/15 dark:text-crema-100 dark:hover:bg-white/5">
            <Download size={15} /> Preview sample passport
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20, rotate: -2 }}
          whileInView={{ opacity: 1, y: 0, rotate: -2 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto w-full max-w-sm"
        >
          <div className="relative rounded-3xl bg-roast-gradient p-[1.5px] shadow-warm-lg">
            <div className="rounded-3xl bg-espresso-800 p-6 text-crema-50">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-crema-300/70">
                    VolunteerOS AI · Passport
                  </div>
                  <div className="font-display text-lg font-semibold">{featured.name}</div>
                  <div className="text-xs text-crema-200/70">{featured.organization}</div>
                </div>
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 font-display text-sm font-semibold">
                  {initials(featured.name)}
                </span>
              </div>

              <div className="my-5 grid grid-cols-3 gap-3 rounded-2xl bg-white/5 p-4 text-center">
                <div>
                  <div className="font-display text-lg font-semibold">{featured.hours}</div>
                  <div className="text-[10px] text-crema-300/60">Hours</div>
                </div>
                <div>
                  <div className="font-display text-lg font-semibold">Lv.{featured.level}</div>
                  <div className="text-[10px] text-crema-300/60">Level</div>
                </div>
                <div>
                  <div className="flex items-center justify-center gap-1 font-display text-lg font-semibold">
                    {leadershipScore} <Star size={12} className="text-crema-300" />
                  </div>
                  <div className="text-[10px] text-crema-300/60">Leadership</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {featured.skills.map((s) => (
                  <span key={s} className="rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-medium">
                    {s}
                  </span>
                ))}
              </div>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {featured.badges.map((b) => (
                  <span key={b} className="rounded-full border border-white/15 px-2 py-0.5 text-[10px]">
                    🏅 {b}
                  </span>
                ))}
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
                <span className="text-[10px] text-crema-300/60">Scan to verify</span>
                <div className="grid grid-cols-8 gap-[2px] rounded-md bg-white p-1.5">
                  {qrCells.map((filled, i) => (
                    <span
                      key={i}
                      className={`h-1.5 w-1.5 ${filled ? "bg-espresso-900" : "bg-transparent"}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
