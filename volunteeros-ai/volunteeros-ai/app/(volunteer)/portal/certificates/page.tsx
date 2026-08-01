"use client";

import { useState } from "react";
import { Award, CheckCircle2, X, Download, Share2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { certificates } from "@/data/misc";
import { currentVolunteer } from "@/components/portal/sidebar";
import { Certificate } from "@/types";
import { formatDate } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

export default function PortalCertificatesPage() {
  const [selected, setSelected] = useState<Certificate | null>(null);
  const myCertificates = certificates.filter((c) => c.volunteerName === currentVolunteer.name);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink dark:text-crema-50">My Certificates</h1>
        <p className="text-sm text-muted-foreground">Auto-issued the moment your event closes out.</p>
      </div>

      {myCertificates.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          No certificates yet — complete an event to earn your first one.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {myCertificates.map((c) => (
            <div
              key={c.id}
              onClick={() => setSelected(c)}
              className="cursor-pointer overflow-hidden rounded-2xl border border-border bg-card shadow-glass transition-all hover:-translate-y-1 hover:shadow-warm"
            >
              <div className="relative flex h-36 flex-col items-center justify-center bg-crema-swirl p-4">
                <Award size={28} className="text-espresso-800" />
                <div className="mt-2 text-center font-display text-sm font-semibold text-espresso-800">
                  Certificate of Service
                </div>
                {c.verified && (
                  <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white/70 px-2 py-0.5 text-[10px] font-medium text-sage-700">
                    <CheckCircle2 size={11} /> Verified
                  </span>
                )}
              </div>
              <div className="p-4">
                <div className="truncate text-sm font-medium text-foreground">{c.eventTitle}</div>
                <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{formatDate(c.issuedOn)}</span>
                  <Badge variant="secondary">{c.hours}h</Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {selected && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
              className="fixed inset-0 z-50 bg-ink/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="fixed left-1/2 top-1/2 z-50 w-[92%] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-border bg-card p-6 shadow-warm-lg"
            >
              <button onClick={() => setSelected(null)} className="absolute right-4 top-4" aria-label="Close">
                <X size={18} />
              </button>
              <div className="rounded-2xl border-4 border-double border-espresso-300 bg-crema-50 p-6 text-center dark:bg-white/5">
                <Award size={32} className="mx-auto text-espresso-600" />
                <div className="mt-3 font-display text-lg font-semibold text-espresso-800 dark:text-crema-100">
                  Certificate of Volunteer Service
                </div>
                <p className="mt-2 text-sm text-espresso-700/70 dark:text-crema-100/60">This certifies that</p>
                <div className="mt-1 font-display text-2xl italic text-ink dark:text-crema-50">{selected.volunteerName}</div>
                <p className="mt-2 text-sm text-espresso-700/70 dark:text-crema-100/60">
                  completed {selected.hours} hours of service at
                </p>
                <div className="mt-1 text-sm font-medium text-foreground">{selected.eventTitle}</div>
              </div>
              <div className="mt-5 flex gap-2">
                <Button className="flex-1"><Download size={15} /> Download PDF</Button>
                <Button variant="outline" className="flex-1"><Share2 size={15} /> Share</Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
