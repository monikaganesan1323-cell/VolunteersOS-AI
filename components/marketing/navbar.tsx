"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Menu, X, Coffee, LayoutDashboard, UserCircle, LogOut, UserPlus, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { useStore } from "@/lib/store";
import { ADMIN_ORIGIN, PORTAL_ORIGIN } from "@/lib/ports";

const links = [
  { href: "/", label: "Home" },
  { href: "#features", label: "Features" },
  { href: "#quick-access", label: "Solutions" },
  { href: "#events", label: "Events" },
  { href: "#organizations", label: "Organizations" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "About" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { hydrated, session, signOut } = useStore();

  function handleSignOut() {
    signOut();
    setOpen(false);
    toast.success("Signed out.");
    router.push("/login");
  }

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="mx-auto mt-4 max-w-6xl px-4">
        <div className="glass flex items-center justify-between rounded-2xl px-5 py-3 shadow-glass">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-espresso-600 text-crema-100">
              <Coffee size={16} />
            </span>
            <span className="font-display text-lg font-semibold tracking-tight text-espresso-800 dark:text-crema-100">
              VolunteerOS <span className="text-espresso-500">AI</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-7 lg:flex">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="text-sm font-medium text-espresso-700/80 transition-colors hover:text-espresso-900 dark:text-crema-200/80 dark:hover:text-crema-50"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <Button variant="outline" size="sm" asChild>
              <a href={`${PORTAL_ORIGIN}/portal`}>
                <UserCircle size={14} /> Volunteer Portal
              </a>
            </Button>
            <Button variant="secondary" size="sm" asChild>
              <a href={`${ADMIN_ORIGIN}/dashboard`}>
                <LayoutDashboard size={14} /> Admin Dashboard
              </a>
            </Button>

            {hydrated && session ? (
              <div className="ml-1 flex items-center gap-2 border-l border-espresso-200/50 pl-3 dark:border-white/10">
                <Avatar name={session.name} size={30} />
                <span className="max-w-[120px] truncate text-sm font-medium text-espresso-800 dark:text-crema-100">
                  {session.name}
                </span>
                <Button variant="ghost" size="sm" onClick={handleSignOut}>
                  <LogOut size={14} /> Sign out
                </Button>
              </div>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/login">
                    <LogIn size={14} /> Sign in
                  </Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/register">
                    <UserPlus size={14} /> Register
                  </Link>
                </Button>
              </>
            )}
          </div>

          <button
            className="lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {open && (
          <div className="glass mt-2 flex flex-col gap-1 rounded-2xl p-4 lg:hidden">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-espresso-700 hover:bg-espresso-50 dark:text-crema-200"
              >
                {l.label}
              </a>
            ))}
            <div className="mt-2 flex flex-col gap-2 px-3">
              <Button variant="outline" size="sm" className="w-full" asChild>
                <a href={`${PORTAL_ORIGIN}/portal`}>
                  <UserCircle size={14} /> Volunteer Portal
                </a>
              </Button>
              <Button variant="secondary" size="sm" className="w-full" asChild>
                <a href={`${ADMIN_ORIGIN}/dashboard`}>
                  <LayoutDashboard size={14} /> Admin Dashboard
                </a>
              </Button>
              <div className="flex gap-2">
                {hydrated && session ? (
                  <Button variant="outline" size="sm" className="flex-1" onClick={handleSignOut}>
                    <LogOut size={14} /> Sign out
                  </Button>
                ) : (
                  <>
                    <Button variant="outline" size="sm" className="flex-1" asChild>
                      <Link href="/login">Sign in</Link>
                    </Button>
                    <Button size="sm" className="flex-1" asChild>
                      <Link href="/register">Register</Link>
                    </Button>
                  </>
                )}
              </div>
              <Button variant="ghost" size="sm" className="w-full" asChild>
                <Link href="/volunteer-register">Join as Volunteer</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
