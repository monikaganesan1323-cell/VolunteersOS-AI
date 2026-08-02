"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { HeartHandshake, ExternalLink, LogOut, LogIn } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { volunteers } from "@/data/volunteers";
import { useStore } from "@/lib/store";
import { ADMIN_ORIGIN } from "@/lib/ports";
import { portalNavGroups } from "./nav-config";

// Fallback profile shown when nobody is signed in yet.
export const currentVolunteer = volunteers.find((v) => v.name === "Ananya Krishnan")!;

export function PortalSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { hydrated, session, signOut } = useStore();

  const displayName = hydrated && session ? session.name : currentVolunteer.name;
  const displayOrg = hydrated && session ? session.organization : currentVolunteer.organization;

  function handleSignOut() {
    signOut();
    toast.success("Signed out.");
    router.push("/login");
  }

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-sage-500/15 bg-sage-500/[0.04] backdrop-blur-xl lg:flex dark:bg-sage-500/[0.03]">
      <div className="flex h-16 items-center gap-2 px-5">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-sage-600 text-crema-50">
          <HeartHandshake size={16} />
        </span>
        <span className="font-display text-base font-semibold text-ink dark:text-crema-50">
          VolunteerOS
        </span>
      </div>

      <div className="mx-3 mb-4 flex items-center gap-2 rounded-full bg-sage-500/15 px-3 py-1 text-[11px] font-medium text-sage-700 dark:text-sage-400">
        <HeartHandshake size={12} /> Volunteer portal
      </div>

      <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-2 scrollbar-thin">
        {portalNavGroups.map((group) => (
          <div key={group.label}>
            <div className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-widest text-sage-700/50 dark:text-sage-400/40">
              {group.label}
            </div>
            <div className="space-y-1">
              {group.items.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                      active
                        ? "bg-sage-600 text-crema-50 shadow-warm"
                        : "text-espresso-700/70 hover:bg-sage-500/10 hover:text-espresso-900 dark:text-crema-200/70 dark:hover:text-crema-50"
                    )}
                  >
                    <item.icon size={18} className="shrink-0" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="space-y-3 border-t border-sage-500/15 p-4">
        <div className="flex items-center gap-2.5">
          <Avatar name={displayName} size={36} />
          <div className="min-w-0 leading-tight">
            <div className="truncate text-sm font-medium text-foreground">{displayName}</div>
            <div className="truncate text-xs text-muted-foreground">{displayOrg}</div>
          </div>
        </div>

        {hydrated && session ? (
          <Button variant="outline" size="sm" className="w-full" onClick={handleSignOut}>
            <LogOut size={14} /> Sign out
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1" asChild>
              <Link href="/login">
                <LogIn size={13} /> Sign in
              </Link>
            </Button>
            <Button size="sm" className="flex-1" asChild>
              <Link href="/volunteer-register">Register</Link>
            </Button>
          </div>
        )}
      </div>

      <a
        href={`${ADMIN_ORIGIN}/dashboard`}
        className="flex items-center justify-center gap-2 border-t border-sage-500/15 p-3 text-xs font-medium text-espresso-700/70 hover:bg-sage-500/10 dark:text-crema-200/70"
      >
        Admin dashboard <ExternalLink size={13} />
      </a>
    </aside>
  );
}
