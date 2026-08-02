"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Download, Star, Clock, Award, ShieldCheck, LogIn, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { currentVolunteer } from "@/components/portal/sidebar";
import { initials } from "@/lib/utils";

const qrCells = Array.from({ length: 64 }, (_, i) => (i * 37 + (i % 7) * 13) % 5 === 0);
const leadershipScore = 88;

export default function PortalPassportPage() {
  const router = useRouter();
  const v = currentVolunteer;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink dark:text-crema-50">My Passport</h1>
          <p className="text-sm text-muted-foreground">
            Your portable, verifiable profile — scan the QR to prove it at any partner organization.
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/login"><LogIn size={14} /> Login</Link>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              toast.success("Signed out.");
              router.push("/login");
            }}
          >
            <LogOut size={14} /> Logout
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[1fr_1.1fr]">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto w-full max-w-sm"
        >
          <div className="relative rounded-3xl bg-roast-gradient p-[1.5px] shadow-warm-lg">
            <div className="rounded-3xl bg-espresso-800 p-6 text-crema-50">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-crema-300/70">
                    VolunteerOS AI · Passport
                  </div>
                  <div className="font-display text-lg font-semibold">{v.name}</div>
                  <div className="text-xs text-crema-200/70">{v.organization}</div>
                </div>
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 font-display text-sm font-semibold">
                  {initials(v.name)}
                </span>
              </div>

              <div className="my-5 grid grid-cols-3 gap-3 rounded-2xl bg-white/5 p-4 text-center">
                <div>
                  <div className="font-display text-lg font-semibold">{v.hours}</div>
                  <div className="text-[10px] text-crema-300/60">Hours</div>
                </div>
                <div>
                  <div className="font-display text-lg font-semibold">Lv.{v.level}</div>
                  <div className="text-[10px] text-crema-300/60">Level</div>
                </div>
                <div>
                  <div className="flex items-center justify-center gap-1 font-display text-lg font-semibold">
                    {leadershipScore} <Star size={12} className="text-crema-300" />
                  </div>
                  <div className="text-[10px] text-crema-300/60">Leadership</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {v.skills.map((s) => (
                  <span key={s} className="rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-medium">
                    {s}
                  </span>
                ))}
              </div>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {v.badges.map((b) => (
                  <span key={b} className="rounded-full border border-white/15 px-2 py-0.5 text-[10px]">
                    🏅 {b}
                  </span>
                ))}
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
                <span className="text-[10px] text-crema-300/60">Scan to verify</span>
                <div className="grid grid-cols-8 gap-[2px] rounded-md bg-white p-1.5">
                  {qrCells.map((filled, i) => (
                    <span key={i} className={`h-1.5 w-1.5 ${filled ? "bg-espresso-900" : "bg-transparent"}`} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-espresso-200 px-5 py-2.5 text-sm font-medium text-espresso-700 transition-colors hover:bg-espresso-50 dark:border-white/15 dark:text-crema-100 dark:hover:bg-white/5">
            <Download size={15} /> Download passport
          </button>
        </motion.div>

        <ul className="space-y-4">
          {[
            { icon: Clock, text: `${v.hours} verified hours across ${v.eventsAttended} events` },
            { icon: Award, text: "Auto-generated, tamper-evident certificates" },
            { icon: ShieldCheck, text: "Portable across every partner organization" },
          ].map((f) => (
            <li key={f.text} className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 text-sm text-foreground/85">
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-espresso-50 text-espresso-600 dark:bg-white/5 dark:text-crema-300">
                <f.icon size={15} />
              </span>
              {f.text}
            </li>
          ))}
          <li className="rounded-xl border border-dashed border-border p-4 text-xs text-muted-foreground">
            Your contact details, prior-organization history, and certificate proof files stay
            private to program admins — only the achievements above are shown here and on the
            public directory.
          </li>
        </ul>
      </div>
    </div>
  );
}
