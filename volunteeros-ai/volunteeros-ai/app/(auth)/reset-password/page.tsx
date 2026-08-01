"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { KeyRound } from "lucide-react";
import { AuthShell } from "@/components/shared/auth-shell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Password updated. Please sign in.");
      router.push("/login");
    }, 900);
  }

  return (
    <AuthShell title="Set a new password" subtitle="Make it something you haven't used before.">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1.5">
          <Label htmlFor="password">New password</Label>
          <Input id="password" type="password" placeholder="Minimum 8 characters" required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="confirm">Confirm password</Label>
          <Input id="confirm" type="password" placeholder="Re-enter password" required />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Updating..." : (<><KeyRound size={16} /> Update password</>)}
        </Button>
      </form>
    </AuthShell>
  );
}
