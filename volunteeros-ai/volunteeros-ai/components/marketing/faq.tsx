"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";

const faqs = [
  { q: "Do we need technical staff to run VolunteerOS AI?", a: "No. The platform is designed for program coordinators, not engineers — setup takes under an hour and most workflows are drag-and-drop." },
  { q: "Can volunteers use it without installing an app?", a: "Yes. Volunteers can check in via a web-based QR pass. A native app is available for organizations that want face and GPS verification." },
  { q: "How does AI matching decide who to recommend?", a: "It scores each volunteer against an event on skills, availability, past experience, stated interests, and distance, then explains the recommendation in plain language." },
  { q: "Is our volunteer data secure?", a: "All data is encrypted in transit and at rest, with role-based access control so only authorized coordinators can view sensitive fields." },
  { q: "Can we migrate from spreadsheets?", a: "Yes — our onboarding team helps import existing volunteer and event records in CSV or Excel format at no extra cost." },
];

export function FAQ() {
  return (
    <section id="faq" className="mx-auto max-w-3xl px-4 py-24">
      <div className="text-center">
        <span className="text-xs font-semibold uppercase tracking-widest text-espresso-500">
          FAQ
        </span>
        <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink dark:text-crema-50">
          Questions, answered
        </h2>
      </div>

      <Accordion.Root type="single" collapsible className="mt-12 space-y-3">
        {faqs.map((item, i) => (
          <Accordion.Item
            key={i}
            value={`item-${i}`}
            className="overflow-hidden rounded-2xl border border-border bg-card shadow-glass"
          >
            <Accordion.Trigger className="group flex w-full items-center justify-between px-6 py-5 text-left font-display text-base font-medium text-ink dark:text-crema-50">
              {item.q}
              <ChevronDown size={18} className="shrink-0 text-espresso-500 transition-transform duration-300 group-data-[state=open]:rotate-180" />
            </Accordion.Trigger>
            <Accordion.Content className="overflow-hidden px-6 text-sm leading-relaxed text-espresso-700/75 data-[state=open]:pb-5 data-[state=open]:animate-fade-up dark:text-crema-100/65">
              {item.a}
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </section>
  );
}
