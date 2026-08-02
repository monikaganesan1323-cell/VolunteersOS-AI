"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { AuthShell } from "@/components/shared/auth-shell";
import { SocialLogin } from "@/components/shared/social-login";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";

export default function LoginPage() {
  const router = useRouter();
  const { signIn } = useStore();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const session = signIn({ email });
    setTimeout(() => {
      setLoading(false);
      toast.success(`Welcome back, ${session.name.split(" ")[0]}!`);
      router.push("/dashboard");
    }, 700);
  }

  return (
    <AuthShell title="Welcome back" subtitle="Sign in to continue to your dashboard.">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@organization.org"
            required
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link href="/forgot-password" className="text-xs font-medium text-espresso-600 hover:underline dark:text-crema-300">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••" required />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-espresso-500"
              aria-label="Toggle password visibility"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Signing in..." : (<><LogIn size={16} /> Sign in</>)}
        </Button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted-foreground">or continue with</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <SocialLogin />

      <p className="mt-8 text-center text-sm text-espresso-700/70 dark:text-crema-100/60">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-medium text-espresso-700 hover:underline dark:text-crema-200">
          Create one
        </Link>
      </p>
    </AuthShell>
  );
}
