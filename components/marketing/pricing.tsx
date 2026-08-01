"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const tiers = [
  {
    name: "Starter",
    price: "Free",
    cadence: "forever",
    desc: "For small clubs and college chapters getting started.",
    features: ["Up to 100 volunteers", "QR attendance", "Basic certificates", "Community support"],
    cta: "Start free",
    highlighted: false,
  },
  {
    name: "Professional",
    price: "₹4,999",
    cadence: "/month",
    desc: "For active NGOs and district-level programs.",
    features: ["Up to 5,000 volunteers", "AI volunteer matching", "Face + GPS attendance", "Analytics & AI insights", "Priority support"],
    cta: "Start free trial",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    cadence: "billed annually",
    desc: "For state bodies, CSR networks, and multi-org platforms.",
    features: ["Unlimited volunteers", "Emergency broadcast suite", "API & webhook access", "Dedicated success manager", "Custom SLAs"],
    cta: "Talk to sales",
    highlighted: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="mx-auto max-w-6xl px-4 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <span className="text-xs font-semibold uppercase tracking-widest text-espresso-500">
          Pricing
        </span>
        <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink dark:text-crema-50">
          Simple pricing, real impact
        </h2>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
        {tiers.map((tier) => (
          <div
            key={tier.name}
            className={cn(
              "relative flex flex-col rounded-3xl border p-8",
              tier.highlighted
                ? "border-espresso-600 bg-espresso-600 text-crema-50 shadow-warm-lg md:-translate-y-3"
                : "border-border bg-card shadow-glass"
            )}
          >
            {tier.highlighted && (
              <span className="absolute -top-3 left-8 rounded-full bg-crema-300 px-3 py-1 text-[11px] font-semibold text-espresso-800">
                Most popular
              </span>
            )}
            <h3 className="font-display text-xl font-semibold">{tier.name}</h3>
            <p className={cn("mt-1 text-sm", tier.highlighted ? "text-crema-100/80" : "text-muted-foreground")}>
              {tier.desc}
            </p>
            <div className="mt-6 flex items-baseline gap-1">
              <span className="font-display text-4xl font-semibold">{tier.price}</span>
              <span className={cn("text-sm", tier.highlighted ? "text-crema-100/70" : "text-muted-foreground")}>
                {tier.cadence}
              </span>
            </div>

            <ul className="mt-7 flex-1 space-y-3">
              {tier.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm">
                  <Check size={16} className={cn("mt-0.5 shrink-0", tier.highlighted ? "text-crema-200" : "text-sage-500")} />
                  <span className={tier.highlighted ? "text-crema-50/90" : "text-foreground/85"}>{f}</span>
                </li>
              ))}
            </ul>

            <Button
              className="mt-8 w-full"
              variant={tier.highlighted ? "secondary" : "outline"}
            >
              {tier.cta}
            </Button>
          </div>
        ))}
      </div>
    </section>
  );
}
