"use client";

import { motion } from "framer-motion";
import { Building2, Users, CalendarDays } from "lucide-react";
import { volunteers } from "@/data/volunteers";
import { events } from "@/data/events";

const orgMeta: Record<string, string> = {
  "Rotaract Kochi": "Rotaract Club",
  "NSS TVM": "College NSS Unit",
  "Teach For Kerala": "Education NGO",
  "Red Cross Kollam": "Health NGO",
  "Kerala Disaster Corps": "Government Program",
  "Youth4Change": "Youth NGO",
  "Habitat Kerala": "Housing NGO",
  "Kannur Seva Samiti": "Community NGO",
  "CSR Kottayam": "CSR Foundation",
  "Alappuzha Sports Trust": "College Club",
};

const orgs = Object.keys(orgMeta).map((name) => ({
  name,
  category: orgMeta[name],
  activeVolunteers: volunteers.filter((v) => v.organization === name).length,
  upcomingEvents: events.filter(
    (e) => e.organization === name && e.status === "upcoming"
  ).length,
}));

export function FeaturedOrganizations() {
  return (
    <section id="organizations" className="mx-auto max-w-6xl px-4 py-20">
      <div className="mx-auto max-w-2xl text-center">
        <span className="text-xs font-semibold uppercase tracking-widest text-espresso-500">
          The roasters
        </span>
        <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink dark:text-crema-50 md:text-4xl">
          Featured organizations
        </h2>
        <p className="mt-3 text-espresso-700/75 dark:text-crema-100/65">
          Rotaract clubs, NSS units, NGOs, CSR foundations, and government
          programs already running on VolunteerOS AI.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {orgs.map((org, i) => (
          <motion.div
            key={org.name}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.45, delay: (i % 3) * 0.07 }}
            className="rounded-2xl border border-border bg-card p-6 shadow-glass transition-all hover:-translate-y-1 hover:shadow-warm"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-espresso-600 text-crema-50">
                <Building2 size={18} />
              </span>
              <div>
                <div className="font-display text-sm font-semibold text-ink dark:text-crema-50">
                  {org.name}
                </div>
                <div className="text-[11px] text-espresso-600/65 dark:text-crema-300/55">
                  {org.category}
                </div>
              </div>
            </div>

            <div className="mt-5 flex items-center gap-5 text-xs text-espresso-700/75 dark:text-crema-100/60">
              <span className="flex items-center gap-1.5">
                <Users size={13} /> {org.activeVolunteers} volunteers
              </span>
              <span className="flex items-center gap-1.5">
                <CalendarDays size={13} /> {org.upcomingEvents} upcoming
              </span>
            </div>

            <button className="mt-5 w-full rounded-xl bg-espresso-50 py-2 text-xs font-medium text-espresso-700 transition-colors hover:bg-espresso-100 dark:bg-white/5 dark:text-crema-200 dark:hover:bg-white/10">
              Join organization
            </button>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
