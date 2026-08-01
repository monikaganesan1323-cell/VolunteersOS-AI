"use client";

import { motion } from "framer-motion";
import { Users2, ArrowRight, Sparkles } from "lucide-react";
import { volunteers } from "@/data/volunteers";
import { aiMatches } from "@/data/misc";
import { initials } from "@/lib/utils";

function jaccard(a: string[], b: string[]) {
  const setA = new Set(a.map((s) => s.toLowerCase()));
  const setB = new Set(b.map((s) => s.toLowerCase()));
  const intersection = [...setA].filter((x) => setB.has(x));
  const union = new Set([...setA, ...setB]);
  return union.size === 0 ? 0 : intersection.length / union.size;
}

// For each AI-matched volunteer/event pair, find the most similar *other*
// volunteer (by shared skills + interests) and surface the same event to them.
function buildRecommendations() {
  const results: {
    volunteer: string;
    event: string;
    basedOn: string;
    similarity: number;
    shared: string[];
  }[] = [];

  for (const match of aiMatches) {
    const anchor = volunteers.find((v) => v.name === match.volunteerName);
    if (!anchor) continue;

    let best: { name: string; score: number; shared: string[] } | null = null;
    for (const v of volunteers) {
      if (v.name === anchor.name) continue;
      const combinedA = [...anchor.skills, ...anchor.interests];
      const combinedB = [...v.skills, ...v.interests];
      const score = jaccard(combinedA, combinedB);
      const shared = combinedA.filter((x) =>
        combinedB.map((y) => y.toLowerCase()).includes(x.toLowerCase())
      );
      if (score > 0 && (!best || score > best.score)) {
        best = { name: v.name, score, shared };
      }
    }

    if (best) {
      results.push({
        volunteer: best.name,
        event: match.eventTitle,
        basedOn: match.volunteerName,
        similarity: Math.round(best.score * 100),
        shared: best.shared,
      });
    }
  }

  return results.slice(0, 4);
}

const recommendations = buildRecommendations();

export function SimilarityRecommendations() {
  if (recommendations.length === 0) return null;

  return (
    <div className="rounded-2xl border border-espresso-200 bg-crema-swirl/10 p-5 dark:border-espresso-500/30">
      <div className="mb-4 flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-espresso-600 text-crema-50">
          <Users2 size={15} />
        </span>
        <div>
          <div className="font-display text-sm font-semibold text-ink dark:text-crema-50">
            Volunteer similarity matches
          </div>
          <p className="text-xs text-muted-foreground">
            Events recommended because a similar volunteer profile is already matched.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {recommendations.map((r, i) => (
          <motion.div
            key={r.volunteer + r.event}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
            className="rounded-xl border border-border bg-card p-4"
          >
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-espresso-50 text-[11px] font-semibold text-espresso-700 dark:bg-white/5 dark:text-crema-200">
                {initials(r.volunteer)}
              </span>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium text-foreground">{r.volunteer}</div>
                <div className="text-[11px] text-muted-foreground">
                  {r.similarity}% similar to {r.basedOn}
                </div>
              </div>
              <Sparkles size={13} className="shrink-0 text-espresso-500" />
            </div>

            <div className="mt-3 flex items-center gap-1.5 text-xs text-espresso-700 dark:text-crema-200">
              <ArrowRight size={12} className="shrink-0 text-espresso-400" />
              <span className="truncate font-medium">{r.event}</span>
            </div>

            {r.shared.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {r.shared.slice(0, 3).map((s) => (
                  <span
                    key={s}
                    className="rounded-full bg-espresso-50 px-2 py-0.5 text-[10px] text-espresso-600 dark:bg-white/5 dark:text-crema-300"
                  >
                    {s}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
