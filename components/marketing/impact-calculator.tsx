"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Calculator, Clock3, IndianRupee, Sparkles } from "lucide-react";

// Rough, transparent assumptions — shown to the user so the numbers feel earned, not magic.
const ADMIN_MINUTES_SAVED_PER_VOLUNTEER_PER_EVENT = 9; // manual attendance, certs, follow-up
const COORDINATOR_HOURLY_COST_INR = 220;

export function ImpactCalculator() {
  const [volunteers, setVolunteers] = useState(150);
  const [eventsPerMonth, setEventsPerMonth] = useState(6);

  const results = useMemo(() => {
    const totalTouches = volunteers * eventsPerMonth;
    const minutesSaved = totalTouches * ADMIN_MINUTES_SAVED_PER_VOLUNTEER_PER_EVENT;
    const hoursSaved = minutesSaved / 60;
    const costSaved = hoursSaved * COORDINATOR_HOURLY_COST_INR;
    const certificatesAutomated = totalTouches;
    return {
      hoursSaved: Math.round(hoursSaved),
      costSaved: Math.round(costSaved),
      certificatesAutomated,
    };
  }, [volunteers, eventsPerMonth]);

  return (
    <section className="mx-auto max-w-6xl px-4 py-20">
      <div className="mx-auto max-w-2xl text-center">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-espresso-500">
          <Calculator size={13} /> See it for your org
        </span>
        <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink dark:text-crema-50 md:text-4xl">
          What automation saves you
        </h2>
        <p className="mt-3 text-espresso-700/75 dark:text-crema-100/65">
          Drag the sliders to match your program size and see the admin
          hours VolunteerOS AI takes off your plate every month.
        </p>
      </div>

      <div className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-8 rounded-3xl border border-border bg-card p-6 shadow-glass sm:p-10 lg:grid-cols-[1fr_1fr]">
        <div className="space-y-8">
          <div>
            <div className="mb-2 flex items-center justify-between text-sm">
              <label htmlFor="vol-slider" className="font-medium text-ink dark:text-crema-50">
                Active volunteers
              </label>
              <span className="font-display font-semibold text-espresso-600 dark:text-crema-300">
                {volunteers}
              </span>
            </div>
            <input
              id="vol-slider"
              type="range"
              min={20}
              max={2000}
              step={10}
              value={volunteers}
              onChange={(e) => setVolunteers(Number(e.target.value))}
              className="w-full accent-espresso-600"
            />
            <div className="mt-1 flex justify-between text-[11px] text-espresso-600/55 dark:text-crema-300/45">
              <span>20</span>
              <span>2,000</span>
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between text-sm">
              <label htmlFor="events-slider" className="font-medium text-ink dark:text-crema-50">
                Events per month
              </label>
              <span className="font-display font-semibold text-espresso-600 dark:text-crema-300">
                {eventsPerMonth}
              </span>
            </div>
            <input
              id="events-slider"
              type="range"
              min={1}
              max={40}
              step={1}
              value={eventsPerMonth}
              onChange={(e) => setEventsPerMonth(Number(e.target.value))}
              className="w-full accent-espresso-600"
            />
            <div className="mt-1 flex justify-between text-[11px] text-espresso-600/55 dark:text-crema-300/45">
              <span>1</span>
              <span>40</span>
            </div>
          </div>

          <p className="text-[11px] leading-relaxed text-espresso-600/60 dark:text-crema-300/45">
            Estimate assumes ~{ADMIN_MINUTES_SAVED_PER_VOLUNTEER_PER_EVENT} minutes of manual
            attendance, certificate, and follow-up work saved per volunteer
            per event, at a ₹{COORDINATOR_HOURLY_COST_INR}/hr coordinator rate.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1">
          <motion.div
            key={results.hoursSaved}
            initial={{ opacity: 0.5, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="rounded-2xl bg-espresso-800 p-5 text-crema-50 dark:bg-white/5"
          >
            <div className="flex items-center gap-2 text-crema-300/80">
              <Clock3 size={15} />
              <span className="text-xs font-medium uppercase tracking-wide">Hours saved / month</span>
            </div>
            <div className="mt-2 font-display text-3xl font-semibold">
              {results.hoursSaved.toLocaleString("en-IN")}
            </div>
          </motion.div>

          <motion.div
            key={results.costSaved}
            initial={{ opacity: 0.5, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="rounded-2xl bg-sage-500/10 p-5"
          >
            <div className="flex items-center gap-2 text-sage-600 dark:text-sage-400">
              <IndianRupee size={15} />
              <span className="text-xs font-medium uppercase tracking-wide">Coordinator cost saved</span>
            </div>
            <div className="mt-2 font-display text-3xl font-semibold text-ink dark:text-crema-50">
              ₹{results.costSaved.toLocaleString("en-IN")}
            </div>
          </motion.div>

          <motion.div
            key={results.certificatesAutomated}
            initial={{ opacity: 0.5, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="rounded-2xl bg-crema-100 p-5 dark:bg-white/5"
          >
            <div className="flex items-center gap-2 text-espresso-600 dark:text-crema-300">
              <Sparkles size={15} />
              <span className="text-xs font-medium uppercase tracking-wide">Certificates auto-generated</span>
            </div>
            <div className="mt-2 font-display text-3xl font-semibold text-ink dark:text-crema-50">
              {results.certificatesAutomated.toLocaleString("en-IN")}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
