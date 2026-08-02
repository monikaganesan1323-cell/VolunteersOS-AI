"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { LogIn, LogOut, UserPlus, ChevronDown, Settings, UserCircle } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";

/**
 * Topbar auth control.
 * Signed out -> Sign in + Register buttons.
 * Signed in  -> avatar dropdown with Sign out.
 */
export function UserMenu() {
  const router = useRouter();
  const { hydrated, session, signOut } = useStore();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function handleSignOut() {
    signOut();
    setOpen(false);
    toast.success("Signed out.");
    router.push("/login");
  }

  // Keep the server and first client render identical.
  if (!hydrated) {
    return <div className="h-9 w-24 animate-pulse rounded-xl bg-muted" />;
  }

  if (!session) {
    return (
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" asChild>
          <Link href="/login">
            <LogIn size={14} /> Sign in
          </Link>
        </Button>
        <Button size="sm" asChild>
          <Link href="/register">
            <UserPlus size={14} /> Register
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2.5 rounded-xl px-1.5 py-1 hover:bg-espresso-50 dark:hover:bg-white/5"
      >
        <Avatar name={session.name} size={36} />
        <div className="hidden text-left leading-tight sm:block">
          <div className="text-sm font-medium text-foreground">{session.name}</div>
          <div className="text-xs capitalize text-muted-foreground">
            {session.role === "admin" ? "Program Admin" : "Volunteer"}
          </div>
        </div>
        <ChevronDown size={15} className="text-muted-foreground" />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-60 overflow-hidden rounded-2xl border border-border bg-card shadow-warm-lg">
          <div className="border-b border-border px-4 py-3">
            <div className="truncate text-sm font-medium text-foreground">{session.name}</div>
            <div className="truncate text-xs text-muted-foreground">{session.email}</div>
            <div className="mt-1 truncate text-xs text-muted-foreground">{session.organization}</div>
          </div>

          <Link
            href="/settings"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-foreground hover:bg-muted/60"
          >
            <Settings size={15} className="text-muted-foreground" /> Settings
          </Link>
          <Link
            href="/volunteers"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-foreground hover:bg-muted/60"
          >
            <UserCircle size={15} className="text-muted-foreground" /> Volunteers
          </Link>

          <button
            onClick={handleSignOut}
            className="flex w-full items-center gap-2.5 border-t border-border px-4 py-2.5 text-sm font-medium text-rust-500 hover:bg-rust-500/10"
          >
            <LogOut size={15} /> Sign out
          </button>
        </div>
      )}
    </div>
  );
}
