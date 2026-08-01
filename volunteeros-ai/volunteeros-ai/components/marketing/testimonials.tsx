"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";

const testimonials = [
  { name: "Anjali Suresh", role: "Program Director, Rotaract Kochi", quote: "We went from three spreadsheets and a WhatsApp group to one dashboard. Attendance reconciliation used to take a full day — now it's instant.", rating: 5 },
  { name: "Thomas George", role: "State Coordinator, NSS Kerala", quote: "The AI matching genuinely surprised us — it paired a drone hobbyist volunteer with our mangrove survey and the fit was perfect.", rating: 5 },
  { name: "Reshma Nair", role: "CSR Lead, Kannur Seva Samiti", quote: "Certificates used to take our team a week after every event. VolunteerOS AI issues them the moment the event closes.", rating: 5 },
  { name: "Bino Mathew", role: "Founder, Habitat Kerala", quote: "The emergency broadcast feature alone justified the switch — we reached 300 volunteers in under two minutes during the July floods.", rating: 5 },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="bg-espresso-50/50 py-24 dark:bg-white/[0.02]">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-espresso-500">
            Trusted across Kerala
          </span>
          <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink dark:text-crema-50">
            Programs that run on VolunteerOS AI
          </h2>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: (i % 2) * 0.1 }}
              className="rounded-2xl border border-border bg-card p-7 shadow-glass"
            >
              <div className="mb-4 flex gap-0.5 text-crema-400">
                {Array.from({ length: t.rating }).map((_, idx) => (
                  <Star key={idx} size={14} fill="currentColor" strokeWidth={0} />
                ))}
              </div>
              <p className="font-display text-lg italic leading-relaxed text-ink/90 dark:text-crema-50/90">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="mt-6 flex items-center gap-3">
                <Avatar name={t.name} size={40} />
                <div>
                  <div className="text-sm font-semibold text-ink dark:text-crema-50">{t.name}</div>
                  <div className="text-xs text-espresso-600/70 dark:text-crema-300/60">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
