"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Users, Building2, ClipboardList, ScanLine, Contact, Award,
  Trophy, BarChart3, Radio, CalendarClock, FileText, Bot,
} from "lucide-react";

const items = [
  { icon: Users, label: "Volunteer Directory", href: "/portal/directory", desc: "Browse every profile" },
  { icon: Building2, label: "Organizations", href: "/organizations", desc: "Partner programs" },
  { icon: ClipboardList, label: "Event Applications", href: "/events", desc: "Review requests" },
  { icon: ScanLine, label: "Attendance", href: "/attendance", desc: "QR & face check-in" },
  { icon: Contact, label: "Volunteer Passport", href: "#passport", desc: "Portable profile" },
  { icon: Award, label: "Certificates", href: "/certificates", desc: "Auto-generated" },
  { icon: Trophy, label: "Leaderboard", href: "/leaderboard", desc: "XP & badges" },
  { icon: BarChart3, label: "Analytics", href: "/analytics", desc: "Program insights" },
  { icon: Radio, label: "Emergency Broadcast", href: "/notifications", desc: "Crisis alerts" },
  { icon: CalendarClock, label: "AI Event Planner", href: "/events", desc: "Build in minutes" },
  { icon: FileText, label: "AI Resume Builder", href: "/chatbot", desc: "Ask the AI to build one" },
  { icon: Bot, label: "AI Chatbot", href: "/chatbot", desc: "Ask anything" },
];

export function QuickAccess() {
  return (
    <section id="quick-access" className="mx-auto max-w-6xl px-4 py-20">
      <div className="mx-auto max-w-2xl text-center">
        <span className="text-xs font-semibold uppercase tracking-widest text-espresso-500">
          The counter
        </span>
        <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink dark:text-crema-50 md:text-4xl">
          Everything, one order away
        </h2>
        <p className="mt-3 text-espresso-700/75 dark:text-crema-100/65">
          Jump straight to the tool you need — no menus to dig through.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.45, delay: (i % 4) * 0.06 }}
          >
            <Link
              href={item.href}
              className="group flex h-full flex-col gap-3 rounded-2xl border border-border bg-card p-5 shadow-glass transition-all hover:-translate-y-1 hover:border-espresso-300 hover:shadow-warm dark:hover:border-espresso-500/40"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-espresso-50 text-espresso-600 transition-colors group-hover:bg-espresso-600 group-hover:text-crema-50 dark:bg-white/5 dark:text-crema-300">
                <item.icon size={18} />
              </span>
              <div>
                <div className="font-display text-sm font-semibold text-ink dark:text-crema-50">
                  {item.label}
                </div>
                <div className="mt-0.5 text-xs text-espresso-600/65 dark:text-crema-300/55">
                  {item.desc}
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
