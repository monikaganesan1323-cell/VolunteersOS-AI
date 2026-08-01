"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Send, ArrowLeft } from "lucide-react";
import { AuthShell } from "@/components/shared/auth-shell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Reset code sent to your email.");
      router.push("/otp-verification");
    }, 900);
  }

  return (
    <AuthShell title="Forgot your password?" subtitle="We'll send a reset code to your registered email.">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="you@organization.org" required />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Sending..." : (<><Send size={16} /> Send reset code</>)}
        </Button>
      </form>

      <Link
        href="/login"
        className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-espresso-700 hover:underline dark:text-crema-200"
      >
        <ArrowLeft size={14} /> Back to sign in
      </Link>
    </AuthShell>
  );
}
