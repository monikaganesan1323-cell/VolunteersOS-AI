"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { LogIn, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

/**
 * Single session control.
 *   Signed out -> "Sign in"  (links to /login)
 *   Signed in  -> "Sign out" (clears the session, then returns to /login)
 *
 * Renders through the existing <Button> variants, so it inherits the current
 * design tokens and introduces no new styling of its own.
 */
export function SessionButton({
  size = "default",
  signedInVariant = "outline",
  signedOutVariant = "default",
  className,
}: {
  size?: "default" | "sm" | "lg";
  signedInVariant?: "default" | "outline" | "secondary" | "ghost";
  signedOutVariant?: "default" | "outline" | "secondary" | "ghost";
  className?: string;
}) {
  const router = useRouter();
  const { hydrated, session, signOut } = useStore();

  // The session is restored from localStorage/cookie after mount. Hold a
  // same-sized placeholder until then so SSR and the first client render match.
  if (!hydrated) {
    return (
      <div
        className={cn(
          "animate-pulse rounded-xl bg-muted",
          size === "sm" ? "h-8 w-24" : size === "lg" ? "h-12 w-32" : "h-10 w-28",
          className
        )}
      />
    );
  }

  if (!session) {
    return (
      <Button variant={signedOutVariant} size={size} className={className} asChild>
        <Link href="/login">
          <LogIn size={15} /> Sign in
        </Link>
      </Button>
    );
  }

  return (
    <Button
      variant={signedInVariant}
      size={size}
      className={className}
      onClick={() => {
        signOut();
        toast.success("Signed out.");
        router.push("/login");
      }}
    >
      <LogOut size={15} /> Sign out
    </Button>
  );
}
