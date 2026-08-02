"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { UserPlus } from "lucide-react";
import { AuthShell } from "@/components/shared/auth-shell";
import { SocialLogin } from "@/components/shared/social-login";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";

const emptyForm = {
  firstName: "",
  lastName: "",
  organization: "",
  email: "",
};

export default function RegisterPage() {
  const router = useRouter();
  const { registerOrganization } = useStore();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(emptyForm);

  function update(field: keyof typeof emptyForm, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    registerOrganization({
      name: `${form.firstName} ${form.lastName}`.trim(),
      email: form.email,
      organization: form.organization,
    });

    setTimeout(() => {
      setLoading(false);
      toast.success(`Account created — you're signed in as ${form.organization}.`);
      router.push("/dashboard");
    }, 700);
  }

  return (
    <AuthShell title="Create your account" subtitle="Start managing volunteers in minutes.">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="firstName">First name</Label>
            <Input
              id="firstName"
              value={form.firstName}
              onChange={(e) => update("firstName", e.target.value)}
              placeholder="Monika"
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="lastName">Last name</Label>
            <Input
              id="lastName"
              value={form.lastName}
              onChange={(e) => update("lastName", e.target.value)}
              placeholder="Varghese"
              required
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="org">Organization</Label>
          <Input
            id="org"
            value={form.organization}
            onChange={(e) => update("organization", e.target.value)}
            placeholder="Rotaract Kochi"
            required
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email">Work email</Label>
          <Input
            id="email"
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="you@organization.org"
            required
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" placeholder="Minimum 8 characters" required />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Creating account..." : (<><UserPlus size={16} /> Create account</>)}
        </Button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted-foreground">or continue with</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <SocialLogin />

      <p className="mt-8 text-center text-sm text-espresso-700/70 dark:text-crema-100/60">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-espresso-700 hover:underline dark:text-crema-200">
          Sign in
        </Link>
        {" "}·{" "}
        <Link href="/volunteer-register" className="font-medium text-espresso-700 hover:underline dark:text-crema-200">
          Joining as a volunteer instead?
        </Link>
      </p>
    </AuthShell>
  );
}
