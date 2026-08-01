"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatNumber } from "@/lib/utils";

const stats = [
  { label: "Volunteers", value: 10482 },
  { label: "Events", value: 512 },
  { label: "Organizations", value: 134 },
  { label: "Certificates", value: 25640 },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden pb-24 pt-16 md:pb-32 md:pt-24">
      {/* ambient roast-gradient wash */}
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[640px] bg-roast-gradient opacity-[0.06] dark:opacity-[0.14]" />
      <div className="pointer-events-none absolute -left-24 top-40 -z-10 h-72 w-72 rounded-full bg-crema-300/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 top-10 -z-10 h-96 w-96 rounded-full bg-espresso-400/20 blur-3xl" />

      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-16 px-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-espresso-200 bg-white/60 px-3.5 py-1.5 text-xs font-medium text-espresso-700 backdrop-blur dark:border-white/10 dark:bg-white/5 dark:text-crema-200"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-sage-500" />
            Built for Rotaract, NSS, NGOs &amp; CSR programs
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-5xl font-semibold leading-[1.05] tracking-tight text-balance text-ink dark:text-crema-50 md:text-6xl"
          >
            The Intelligent{" "}
            <span className="relative inline-block italic text-espresso-600 dark:text-crema-300">
              Volunteer
            </span>{" "}
            Operating System
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 max-w-xl text-lg leading-relaxed text-espresso-700/80 dark:text-crema-100/70"
          >
            VolunteerOS AI automates the entire volunteer lifecycle — from
            recruitment and AI matching to QR attendance and certificate
            generation — so your program runs like a well-pulled espresso:
            consistent, fast, and worth showing up for.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <Button size="lg" asChild>
              <Link href="/register">
                Get Started <ArrowRight size={16} />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="#features">
                <PlayCircle size={18} /> Watch Demo
              </Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-14 grid grid-cols-2 gap-6 sm:grid-cols-4"
          >
            {stats.map((s) => (
              <div key={s.label}>
                <div className="font-display text-2xl font-semibold text-ink dark:text-crema-50 md:text-3xl">
                  {formatNumber(s.value)}+
                </div>
                <div className="mt-1 text-xs uppercase tracking-wide text-espresso-600/70 dark:text-crema-300/60">
                  {s.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Signature element: a "brewing" cup that visualizes program health */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto w-full max-w-sm"
        >
          <div className="glass relative rounded-3xl p-7 shadow-warm-lg">
            <div className="mb-5 flex items-center justify-between">
              <span className="font-display text-sm font-semibold text-espresso-700 dark:text-crema-200">
                Program Health
              </span>
              <span className="rounded-full bg-sage-500/15 px-2.5 py-1 text-[11px] font-medium text-sage-600 dark:text-sage-400">
                Brewing well
              </span>
            </div>

            {/* the cup */}
            <div className="relative mx-auto flex h-44 w-44 items-end justify-center">
              <span className="absolute left-[38%] top-2 h-8 w-1 rounded-full bg-espresso-300/60 animate-steam-1" />
              <span className="absolute left-[52%] top-0 h-10 w-1 rounded-full bg-espresso-300/50 animate-steam-2" />
              <svg viewBox="0 0 160 130" className="h-36 w-36">
                <defs>
                  <linearGradient id="brewFill" x1="0" y1="1" x2="0" y2="0">
                    <stop offset="0%" stopColor="#6F4E37" />
                    <stop offset="100%" stopColor="#B98A5E" />
                  </linearGradient>
                  <clipPath id="cupClip">
                    <path d="M20 20 L120 20 L112 100 Q110 116 94 116 L46 116 Q30 116 28 100 Z" />
                  </clipPath>
                </defs>
                <path
                  d="M20 20 L120 20 L112 100 Q110 116 94 116 L46 116 Q30 116 28 100 Z"
                  fill="none"
                  stroke="currentColor"
                  className="text-espresso-300 dark:text-white/15"
                  strokeWidth="3"
                />
                <rect x="20" y="42" width="100" height="74" fill="url(#brewFill)" clipPath="url(#cupClip)" />
                <path
                  d="M120 34 Q145 34 145 56 Q145 78 120 76"
                  fill="none"
                  stroke="currentColor"
                  className="text-espresso-300 dark:text-white/15"
                  strokeWidth="3"
                />
              </svg>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3 text-center">
              <div>
                <div className="font-display text-lg font-semibold text-ink dark:text-crema-50">82%</div>
                <div className="text-[11px] text-espresso-600/70 dark:text-crema-300/60">Fill rate</div>
              </div>
              <div>
                <div className="font-display text-lg font-semibold text-ink dark:text-crema-50">4.8k</div>
                <div className="text-[11px] text-espresso-600/70 dark:text-crema-300/60">Hours logged</div>
              </div>
              <div>
                <div className="font-display text-lg font-semibold text-ink dark:text-crema-50">96%</div>
                <div className="text-[11px] text-espresso-600/70 dark:text-crema-300/60">On-time check-in</div>
              </div>
            </div>
          </div>

          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="glass absolute -left-8 -top-6 rounded-2xl px-4 py-3 shadow-warm"
          >
            <div className="text-[11px] text-espresso-600/70 dark:text-crema-300/60">AI Match</div>
            <div className="font-display text-sm font-semibold text-ink dark:text-crema-50">94% fit ✓</div>
          </motion.div>

          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
            className="glass absolute -bottom-6 -right-6 rounded-2xl px-4 py-3 shadow-warm"
          >
            <div className="text-[11px] text-espresso-600/70 dark:text-crema-300/60">Certificate</div>
            <div className="font-display text-sm font-semibold text-ink dark:text-crema-50">Issued ✓</div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
