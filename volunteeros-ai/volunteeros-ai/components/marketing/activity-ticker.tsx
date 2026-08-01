"use client";

import { CheckCircle2, Award, UserPlus, ShieldCheck, AlertTriangle } from "lucide-react";
import { activityFeed } from "@/data/misc";

const iconFor: Record<string, typeof CheckCircle2> = {
  checkin: CheckCircle2,
  certificate: Award,
  registration: UserPlus,
  badge: ShieldCheck,
  alert: AlertTriangle,
};

const colorFor: Record<string, string> = {
  checkin: "text-sage-500",
  certificate: "text-espresso-400",
  registration: "text-crema-400",
  badge: "text-rust-400",
  alert: "text-rust-500",
};

// Duplicate the feed so the marquee loops seamlessly.
const loop = [...activityFeed, ...activityFeed];

export function ActivityTicker() {
  return (
    <div className="relative overflow-hidden border-y border-border bg-card/60 py-3 backdrop-blur">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-background to-transparent" />

      <div className="flex w-max animate-[marquee_38s_linear_infinite] gap-8 hover:[animation-play-state:paused]">
        {loop.map((item, i) => {
          const Icon = iconFor[item.type];
          return (
            <div
              key={`${item.id}-${i}`}
              className="flex shrink-0 items-center gap-2 whitespace-nowrap text-xs text-espresso-700/75 dark:text-crema-100/65"
            >
              <span className="flex h-2 w-2 shrink-0 rounded-full bg-sage-500">
                <span className="h-2 w-2 animate-ping rounded-full bg-sage-500 opacity-75" />
              </span>
              <Icon size={13} className={colorFor[item.type]} />
              <span className="font-medium text-ink dark:text-crema-50">{item.actor}</span>
              <span>{item.action}</span>
              <span className="font-medium text-ink dark:text-crema-50">{item.target}</span>
              <span className="text-espresso-500/60 dark:text-crema-300/40">· {item.time}</span>
            </div>
          );
        })}
      </div>

      <style jsx>{`
        @keyframes marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}
