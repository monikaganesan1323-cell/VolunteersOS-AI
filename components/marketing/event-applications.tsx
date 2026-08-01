"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, CheckCircle2, XCircle, ArrowRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { formatDate } from "@/lib/utils";

type AppStatus = "pending" | "approved" | "rejected";

interface Application {
  id: string;
  volunteer: string;
  event: string;
  organization: string;
  appliedOn: string;
  status: AppStatus;
  progress: number;
  note: string;
}

const applications: Application[] = [
  { id: "APP-2201", volunteer: "Vishnu Prasad", event: "Youth Coding Workshop", organization: "Youth4Change", appliedOn: "2026-07-28", status: "pending", progress: 40, note: "Awaiting skill verification from org lead." },
  { id: "APP-2202", volunteer: "Nikhil Raj", event: "Housing Repair Sprint", organization: "Habitat Kerala", appliedOn: "2026-07-30", status: "pending", progress: 65, note: "Background check in progress." },
  { id: "APP-2203", volunteer: "Diya Suresh", event: "Community Kitchen — Onam Sadya", organization: "Kannur Seva Samiti", appliedOn: "2026-07-26", status: "pending", progress: 20, note: "Submitted, queued for review." },
  { id: "APP-2189", volunteer: "Ananya Krishnan", event: "Blood Donation Mega Camp", organization: "Red Cross Kollam", appliedOn: "2026-07-18", status: "approved", progress: 100, note: "Confirmed as Camp Coordinator." },
  { id: "APP-2177", volunteer: "Aditya Varma", event: "Mangrove Restoration Drive", organization: "Kerala Disaster Corps", appliedOn: "2026-07-10", status: "approved", progress: 100, note: "Assigned Survey & Mapping Lead role." },
  { id: "APP-2165", volunteer: "Karthik Iyer", event: "Inter-College Sports Meet Volunteering", organization: "Alappuzha Sports Trust", appliedOn: "2026-07-08", status: "approved", progress: 100, note: "Approved — timing crew." },
  { id: "APP-2140", volunteer: "Arjun Nair", event: "Flood Relief Coordination", organization: "Kerala Disaster Corps", appliedOn: "2026-06-30", status: "rejected", progress: 100, note: "Overlapping shift with another commitment." },
];

const tabs: { key: AppStatus; label: string }[] = [
  { key: "pending", label: "Pending" },
  { key: "approved", label: "Approved" },
  { key: "rejected", label: "Rejected" },
];

const statusMeta: Record<AppStatus, { icon: typeof Clock; className: string }> = {
  pending: { icon: Clock, className: "bg-crema-300/25 text-espresso-600 dark:text-crema-300" },
  approved: { icon: CheckCircle2, className: "bg-sage-500/15 text-sage-600 dark:text-sage-400" },
  rejected: { icon: XCircle, className: "bg-rust-500/15 text-rust-500" },
};

export function EventApplications() {
  const [tab, setTab] = useState<AppStatus>("pending");
  const filtered = applications.filter((a) => a.status === tab);
  const counts = {
    pending: applications.filter((a) => a.status === "pending").length,
    approved: applications.filter((a) => a.status === "approved").length,
    rejected: applications.filter((a) => a.status === "rejected").length,
  };

  return (
    <section className="mx-auto max-w-6xl px-4 py-20">
      <div className="mx-auto max-w-2xl text-center">
        <span className="text-xs font-semibold uppercase tracking-widest text-espresso-500">
          Order tracking
        </span>
        <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink dark:text-crema-50 md:text-4xl">
          Event applications
        </h2>
        <p className="mt-3 text-espresso-700/75 dark:text-crema-100/65">
          Every request tracked from submission to decision — no spreadsheet
          required.
        </p>
      </div>

      <div className="mx-auto mt-10 flex max-w-md items-center justify-center gap-2 rounded-2xl border border-border bg-card p-1.5 shadow-glass">
        {tabs.map((t) => {
          const active = tab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium transition-colors ${
                active
                  ? "bg-espresso-600 text-white dark:bg-espresso-400 dark:text-bark"
                  : "text-espresso-700/70 hover:bg-espresso-50 dark:text-crema-200/70 dark:hover:bg-white/5"
              }`}
            >
              {t.label}
              <span
                className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                  active ? "bg-white/20" : "bg-espresso-100 dark:bg-white/10"
                }`}
              >
                {counts[t.key]}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mx-auto mt-8 grid max-w-3xl gap-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="grid gap-4"
          >
            {filtered.map((a) => {
              const meta = statusMeta[a.status];
              const Icon = meta.icon;
              return (
                <div
                  key={a.id}
                  className="rounded-2xl border border-border bg-card p-5 shadow-glass sm:p-6"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="font-display text-sm font-semibold text-ink dark:text-crema-50">
                        {a.volunteer}
                      </div>
                      <div className="mt-0.5 text-xs text-espresso-600/65 dark:text-crema-300/55">
                        {a.event} · {a.organization}
                      </div>
                    </div>
                    <span
                      className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium capitalize ${meta.className}`}
                    >
                      <Icon size={12} /> {a.status}
                    </span>
                  </div>

                  <div className="mt-4">
                    <Progress value={a.progress} />
                  </div>

                  <div className="mt-3 flex items-center justify-between text-[11px] text-espresso-600/60 dark:text-crema-300/50">
                    <span>Applied {formatDate(a.appliedOn)}</span>
                    <span>{a.id}</span>
                  </div>

                  <p className="mt-3 flex items-start gap-1.5 text-xs text-espresso-700/70 dark:text-crema-100/60">
                    <ArrowRight size={12} className="mt-0.5 shrink-0" /> {a.note}
                  </p>
                </div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
