"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ShieldCheck } from "lucide-react";
import { AuthShell } from "@/components/shared/auth-shell";
import { Button } from "@/components/ui/button";

export default function OtpVerificationPage() {
  const router = useRouter();
  const [values, setValues] = useState(["", "", "", "", "", ""]);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const [loading, setLoading] = useState(false);

  function update(idx: number, val: string) {
    if (!/^[0-9]?$/.test(val)) return;
    const next = [...values];
    next[idx] = val;
    setValues(next);
    if (val && idx < 5) inputs.current[idx + 1]?.focus();
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Email verified!");
      router.push("/reset-password");
    }, 800);
  }

  return (
    <AuthShell title="Verify your email" subtitle="Enter the 6-digit code we sent to your inbox.">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex justify-between gap-2">
          {values.map((v, i) => (
            <input
              key={i}
              ref={(el) => { inputs.current[i] = el; }}
              value={v}
              onChange={(e) => update(i, e.target.value)}
              inputMode="numeric"
              maxLength={1}
              className="h-14 w-12 rounded-xl border border-border bg-white/70 text-center font-display text-xl font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring dark:bg-white/5"
            />
          ))}
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Verifying..." : (<><ShieldCheck size={16} /> Verify code</>)}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-espresso-700/70 dark:text-crema-100/60">
        Didn&apos;t get a code?{" "}
        <button className="font-medium text-espresso-700 hover:underline dark:text-crema-200">
          Resend
        </button>
      </p>
    </AuthShell>
  );
}
