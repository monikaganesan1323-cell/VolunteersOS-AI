"use client";

import Link from "next/link";
import { LogIn, UserPlus, HeartHandshake, LogOut } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";

/**
 * Sits at the top of the dashboard. Shows Sign in / Register while signed out,
 * and a signed-in strip with a Sign out action once there's a session.
 */
export function AuthBanner() {
  const router = useRouter();
  const { hydrated, session, signOut } = useStore();

  if (!hydrated) return null;

  if (!session) {
    return (
      <div className="flex flex-col gap-4 rounded-2xl border border-border bg-crema-swirl p-5 sm:flex-row sm:items-center sm:justify-between dark:bg-white/[0.03]">
        <div>
          <h2 className="font-display text-base font-semibold text-ink dark:text-crema-50">
            You&apos;re browsing as a guest
          </h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Sign in to manage events, or register to add yourself to the volunteer roster.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" asChild>
            <Link href="/login">
              <LogIn size={15} /> Sign in
            </Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link href="/register">
              <UserPlus size={15} /> Register organization
            </Link>
          </Button>
          <Button asChild>
            <Link href="/volunteer-register">
              <HeartHandshake size={15} /> Register as volunteer
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-muted/40 px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-muted-foreground">
        Signed in as{" "}
        <span className="font-medium text-foreground">{session.name}</span>
        {" · "}
        <span className="capitalize">{session.role}</span>
        {" · "}
        {session.organization}
      </p>
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          signOut();
          toast.success("Signed out.");
          router.push("/login");
        }}
      >
        <LogOut size={14} /> Sign out
      </Button>
    </div>
  );
}
