"use client";

import { motion } from "framer-motion";
import { Building2, Users, CalendarDays, Mail, Phone } from "lucide-react";
import { volunteers } from "@/data/volunteers";
import { events } from "@/data/events";

interface OrgMeta {
  category: string;
  contact: string;
  email: string;
  phone: string;
}

const orgMeta: Record<string, OrgMeta> = {
  "Rotaract Kochi": {
    category: "Rotaract Club",
    contact: "Anjali Suresh",
    email: "anjali.suresh@rotaractkochi.org",
    phone: "+91 98470 22001",
  },
  "NSS TVM": {
    category: "College NSS Unit",
    contact: "Thomas George",
    email: "thomas.george@nsskerala.gov.in",
    phone: "+91 94470 33112",
  },
  "Teach For Kerala": {
    category: "Education NGO",
    contact: "Fathima Zahra",
    email: "fathima@teachforkerala.org",
    phone: "+91 87560 44521",
  },
  "Red Cross Kollam": {
    category: "Health NGO",
    contact: "Meera Pillai",
    email: "meera.pillai@redcrosskollam.org",
    phone: "+91 96330 78214",
  },
  "Kerala Disaster Corps": {
    category: "Government Program",
    contact: "Vishnu Menon",
    email: "coordination@kdc.kerala.gov.in",
    phone: "+91 90480 55223",
  },
  Youth4Change: {
    category: "Youth NGO",
    contact: "Vishnu Prasad",
    email: "connect@youth4change.org",
    phone: "+91 88910 55671",
  },
  "Habitat Kerala": {
    category: "Housing NGO",
    contact: "Bino Mathew",
    email: "bino.mathew@habitatkerala.org",
    phone: "+91 89430 66210",
  },
  "Kannur Seva Samiti": {
    category: "Community NGO",
    contact: "Priya Nambiar",
    email: "seva@kannursevasamiti.org",
    phone: "+91 93830 44771",
  },
  "CSR Kottayam": {
    category: "CSR Foundation",
    contact: "Sneha Thomas",
    email: "programs@csrkottayam.org",
    phone: "+91 94950 11002",
  },
  "Alappuzha Sports Trust": {
    category: "College Club",
    contact: "Karthik Iyer",
    email: "trust@alappuzhasports.org",
    phone: "+91 79040 22156",
  },
};

const orgs = Object.keys(orgMeta).map((name) => ({
  name,
  ...orgMeta[name],
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
          programs already running on VolunteerOS AI. Contact any coordinator
          directly to partner on an event.
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

            <div className="mt-4 space-y-2 border-t border-border pt-3">
              <div className="text-[11px] uppercase tracking-wide text-espresso-600/55 dark:text-crema-300/45">
                Coordinator · {org.contact}
              </div>
              <a
                href={`mailto:${org.email}`}
                className="flex items-center gap-2 text-xs font-medium text-espresso-700 hover:underline dark:text-crema-200"
              >
                <Mail size={13} className="shrink-0" />
                <span className="truncate">{org.email}</span>
              </a>
              <a
                href={`tel:${org.phone.replace(/\s/g, "")}`}
                className="flex items-center gap-2 text-xs font-medium text-espresso-700 hover:underline dark:text-crema-200"
              >
                <Phone size={13} className="shrink-0" /> {org.phone}
              </a>
            </div>

            <a
              href={`mailto:${org.email}?subject=Volunteering%20with%20${encodeURIComponent(org.name)}`}
              className="mt-5 block w-full rounded-xl bg-espresso-50 py-2 text-center text-xs font-medium text-espresso-700 transition-colors hover:bg-espresso-100 dark:bg-white/5 dark:text-crema-200 dark:hover:bg-white/10"
            >
              Contact organization
            </a>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
