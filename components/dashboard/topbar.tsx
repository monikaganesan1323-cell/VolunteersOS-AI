"use client";

import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Search, Bell, Moon, Sun, Menu, ChevronRight } from "lucide-react";
import { UserMenu } from "@/components/dashboard/user-menu";

function useBreadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) return ["Dashboard"];
  return segments.map((s) => s.charAt(0).toUpperCase() + s.slice(1).replace(/-/g, " "));
}

export function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const crumbs = useBreadcrumb();

  useEffect(() => setMounted(true), []);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background/80 px-4 backdrop-blur-xl sm:px-6">
      <button onClick={onMenuClick} className="lg:hidden" aria-label="Open menu">
        <Menu size={20} />
      </button>

      <div className="hidden items-center gap-1 text-sm text-muted-foreground sm:flex">
        {crumbs.map((c, i) => (
          <span key={c} className="flex items-center gap-1">
            {i > 0 && <ChevronRight size={13} />}
            <span className={i === crumbs.length - 1 ? "font-medium text-foreground" : ""}>{c}</span>
          </span>
        ))}
      </div>

      <div className="relative ml-auto hidden max-w-sm flex-1 md:block">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          placeholder="Search volunteers, events, certificates..."
          className="h-10 w-full rounded-xl border border-border bg-muted/60 pl-10 pr-4 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>

      <div className="ml-auto flex items-center gap-2 md:ml-0">
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="flex h-10 w-10 items-center justify-center rounded-xl text-espresso-700 hover:bg-espresso-50 dark:text-crema-200 dark:hover:bg-white/5"
          aria-label="Toggle theme"
        >
          {mounted && theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <button
          className="relative flex h-10 w-10 items-center justify-center rounded-xl text-espresso-700 hover:bg-espresso-50 dark:text-crema-200 dark:hover:bg-white/5"
          aria-label="Notifications"
        >
          <Bell size={18} />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rust-500" />
        </button>

        <div className="ml-1 flex items-center gap-2.5 border-l border-border pl-3">
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
