"use client";

import { motion } from "framer-motion";
import { Mail, Phone } from "lucide-react";

const groups = [
  {
    title: "Corporate Partners",
    partners: [
      {
        name: "Federal Bank",
        desc: "CSR grant funding for rural outreach",
        contact: "Sanjay Nair",
        email: "csr@federalbank.co.in",
        phone: "+91 484 263 0996",
      },
      {
        name: "Muthoot Fincorp",
        desc: "Disaster relief logistics sponsor",
        contact: "Reshma Iyer",
        email: "partnerships@muthootfincorp.com",
        phone: "+91 471 291 1500",
      },
      {
        name: "Kitex Garments",
        desc: "Volunteer uniform & kit sponsor",
        contact: "Deepak Menon",
        email: "outreach@kitexgarments.com",
        phone: "+91 484 282 5000",
      },
    ],
  },
  {
    title: "NGO Alliances",
    partners: [
      {
        name: "Habitat for Humanity Kerala",
        desc: "Joint housing repair sprints",
        contact: "Bino Mathew",
        email: "bino.mathew@habitatkerala.org",
        phone: "+91 89430 66210",
      },
      {
        name: "Red Cross Kerala",
        desc: "Blood donation & health camps",
        contact: "Meera Pillai",
        email: "meera.pillai@redcrosskollam.org",
        phone: "+91 96330 78214",
      },
    ],
  },
  {
    title: "Universities",
    partners: [
      {
        name: "CUSAT",
        desc: "Student volunteer pipeline",
        contact: "Dr. Anil Kurup",
        email: "nss@cusat.ac.in",
        phone: "+91 484 286 2300",
      },
      {
        name: "Amrita Vishwa Vidyapeetham",
        desc: "Youth coding workshops",
        contact: "Lakshmi Warrier",
        email: "outreach@amrita.edu",
        phone: "+91 476 280 1280",
      },
    ],
  },
  {
    title: "CSR Partners",
    partners: [
      {
        name: "Kerala CSR Trust",
        desc: "Program funding & audits",
        contact: "Vishnu Menon",
        email: "grants@keralacsrtrust.org",
        phone: "+91 90480 55223",
      },
      {
        name: "UST Global Foundation",
        desc: "Tech-for-good grants",
        contact: "Nithya Raghavan",
        email: "foundation@ust.com",
        phone: "+91 471 415 2000",
      },
    ],
  },
  {
    title: "Technology Partners",
    partners: [
      {
        name: "Zoho for NGOs",
        desc: "Infrastructure & tooling credits",
        contact: "Arun Vasudevan",
        email: "nonprofits@zohocorp.com",
        phone: "+91 44 6744 7000",
      },
      {
        name: "Freshworks Cares",
        desc: "Support desk for volunteer queries",
        contact: "Divya Shankar",
        email: "cares@freshworks.com",
        phone: "+91 44 6667 8040",
      },
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
        <p className="mt-3 text-espresso-700/75 dark:text-crema-100/65">
          Running an event and need backing? Reach the sponsorship lead directly —
          every partner below lists a working email and phone number.
        </p>
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
                  className="rounded-2xl border border-border bg-card p-5 shadow-glass transition-all hover:-translate-y-0.5 hover:shadow-warm"
                >
                  <div className="flex items-center gap-4">
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
                  </div>

                  <div className="mt-4 space-y-2 border-t border-border pt-3">
                    <div className="text-[11px] uppercase tracking-wide text-espresso-600/55 dark:text-crema-300/45">
                      Sponsorship lead · {p.contact}
                    </div>
                    <a
                      href={`mailto:${p.email}`}
                      className="flex items-center gap-2 text-xs font-medium text-espresso-700 hover:underline dark:text-crema-200"
                    >
                      <Mail size={13} className="shrink-0" />
                      <span className="truncate">{p.email}</span>
                    </a>
                    <a
                      href={`tel:${p.phone.replace(/\s/g, "")}`}
                      className="flex items-center gap-2 text-xs font-medium text-espresso-700 hover:underline dark:text-crema-200"
                    >
                      <Phone size={13} className="shrink-0" /> {p.phone}
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
