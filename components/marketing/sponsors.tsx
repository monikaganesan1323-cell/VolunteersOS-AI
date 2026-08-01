"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const groups = [
  {
    title: "Corporate Partners",
    partners: [
      { name: "Federal Bank", desc: "CSR grant funding for rural outreach" },
      { name: "Muthoot Fincorp", desc: "Disaster relief logistics sponsor" },
      { name: "Kitex Garments", desc: "Volunteer uniform & kit sponsor" },
    ],
  },
  {
    title: "NGO Alliances",
    partners: [
      { name: "Habitat for Humanity Kerala", desc: "Joint housing repair sprints" },
      { name: "Red Cross Kerala", desc: "Blood donation & health camps" },
    ],
  },
  {
    title: "Universities",
    partners: [
      { name: "CUSAT", desc: "Student volunteer pipeline" },
      { name: "Amrita Vishwa Vidyapeetham", desc: "Youth coding workshops" },
    ],
  },
  {
    title: "CSR Partners",
    partners: [
      { name: "Kerala CSR Trust", desc: "Program funding & audits" },
      { name: "UST Global Foundation", desc: "Tech-for-good grants" },
    ],
  },
  {
    title: "Technology Partners",
    partners: [
      { name: "Zoho for NGOs", desc: "Infrastructure & tooling credits" },
      { name: "Freshworks Cares", desc: "Support desk for volunteer queries" },
    ],
  },
];

export function Sponsors() {
  return (
    <section id="sponsors" className="mx-auto max-w-6xl px-4 py-20">
      <div className="mx-auto max-w-2xl text-center">
        <span className="text-xs font-semibold uppercase tracking-widest text-espresso-500">
          Our supply chain
        </span>
        <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink dark:text-crema-50 md:text-4xl">
          Sponsored partners
        </h2>
      </div>

      <div className="mt-12 space-y-10">
        {groups.map((group, gi) => (
          <div key={group.title}>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wide text-espresso-600/70 dark:text-crema-300/60">
              {group.title}
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {group.partners.map((p, i) => (
                <motion.div
                  key={p.name}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.4, delay: (gi * 2 + i) * 0.04 }}
                  className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-glass transition-all hover:-translate-y-0.5 hover:shadow-warm"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-crema-200 font-display text-xs font-semibold text-espresso-700 dark:bg-white/10 dark:text-crema-100">
                    {p.name
                      .split(" ")
                      .map((w) => w[0])
                      .slice(0, 2)
                      .join("")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-display text-sm font-semibold text-ink dark:text-crema-50">
                      {p.name}
                    </div>
                    <div className="truncate text-xs text-espresso-600/65 dark:text-crema-300/55">
                      {p.desc}
                    </div>
                  </div>
                  <ArrowUpRight
                    size={15}
                    className="shrink-0 text-espresso-400 dark:text-crema-300/50"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
