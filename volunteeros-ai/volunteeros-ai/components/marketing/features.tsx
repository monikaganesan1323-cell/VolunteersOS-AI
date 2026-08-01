"use client";

import { motion } from "framer-motion";
import {
  Sparkles, Contact, QrCode, ScanFace, MapPin, Award, FileText,
  MessageSquareText, Trophy, BarChart3, CalendarClock, Radio, Clock,
} from "lucide-react";

const features = [
  { icon: Sparkles, title: "AI Volunteer Matching", desc: "Matches volunteers to events by skill, availability, interest, and distance — with a plain-language reason for every recommendation." },
  { icon: Contact, title: "Volunteer Passport", desc: "One permanent digital profile that follows a volunteer across every organization they serve with." },
  { icon: QrCode, title: "QR Attendance", desc: "Instant check-in and check-out with scannable passes — no paper sign-in sheets, ever." },
  { icon: ScanFace, title: "Face Attendance", desc: "Optional face-verified check-in for high-security or high-volume events." },
  { icon: MapPin, title: "GPS Verification", desc: "Confirms volunteers are physically on-site before attendance is logged." },
  { icon: Award, title: "AI Certificates", desc: "Auto-generated, digitally signed certificates the moment an event closes out." },
  { icon: FileText, title: "Resume Builder", desc: "Turns logged hours and skills into a ready-to-share volunteer resume and portfolio." },
  { icon: MessageSquareText, title: "AI Chatbot", desc: "Answers volunteer questions, drafts reports, and finds matches — right from the dashboard." },
  { icon: Trophy, title: "Leaderboard", desc: "XP, levels, and badges that turn consistent service into a visible, motivating track record." },
  { icon: BarChart3, title: "Analytics", desc: "Growth, attendance, and hours — sliced by event, department, or organization." },
  { icon: CalendarClock, title: "Event Planner", desc: "Build, staff, and track events end-to-end, including capacity and resource checklists." },
  { icon: Radio, title: "Emergency Broadcast", desc: "Push urgent alerts to every volunteer in a sector within seconds during a crisis." },
];

export function Features() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-4 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <span className="text-xs font-semibold uppercase tracking-widest text-espresso-500">
          The full stack
        </span>
        <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink dark:text-crema-50">
          Everything a volunteer program needs, brewed into one system
        </h2>
        <p className="mt-4 text-espresso-700/75 dark:text-crema-100/65">
          Replace spreadsheets, WhatsApp groups, and paper registers with a
          single intelligent platform.
        </p>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
            className="group rounded-2xl border border-border bg-card p-6 shadow-glass transition-all hover:-translate-y-1 hover:shadow-warm"
          >
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-espresso-50 text-espresso-600 transition-colors group-hover:bg-espresso-600 group-hover:text-crema-50 dark:bg-white/5 dark:text-crema-300">
              <f.icon size={20} />
            </div>
            <h3 className="font-display text-base font-semibold text-ink dark:text-crema-50">
              {f.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-espresso-700/70 dark:text-crema-100/60">
              {f.desc}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="mt-5 flex items-center gap-2 rounded-2xl border border-dashed border-espresso-200 p-5 text-sm text-espresso-700/70 dark:border-white/10 dark:text-crema-100/60">
        <Clock size={16} className="shrink-0 text-espresso-500" />
        Plus volunteer hour tracking that rolls straight into resumes, leaderboards, and certificates automatically.
      </div>
    </section>
  );
}
