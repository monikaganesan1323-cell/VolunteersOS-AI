"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Search, Bell, Moon, Sun, Menu, ChevronRight, LogIn, LogOut } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { useNotifications } from "@/lib/notification-store";

function useBreadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) return ["Dashboard"];
  return segments.map((s) => s.charAt(0).toUpperCase() + s.slice(1).replace(/-/g, " "));
}

export function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const bellRef = useRef<HTMLDivElement>(null);
  const { notifications, unreadCount, markAllRead } = useNotifications();
  const crumbs = useBreadcrumb();

  useEffect(() => setMounted(true), []);

  // Close whichever dropdown is open when clicking anywhere outside it.
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (menuRef.current && !menuRef.current.contains(target)) {
        setMenuOpen(false);
      }
      if (bellRef.current && !bellRef.current.contains(target)) {
        setBellOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

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

        <div className="relative" ref={bellRef}>
          <button
            onClick={() => {
              if (!bellOpen) markAllRead();
              setBellOpen((v) => !v);
              setMenuOpen(false);
            }}
            aria-haspopup="menu"
            aria-expanded={bellOpen}
            className="relative flex h-10 w-10 items-center justify-center rounded-xl text-espresso-700 hover:bg-espresso-50 dark:text-crema-200 dark:hover:bg-white/5"
            aria-label="Notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rust-500" />
            )}
          </button>

          {bellOpen && (
            <div className="absolute right-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-2xl border border-border bg-card shadow-warm-lg">
              <div className="border-b border-border px-4 py-3">
                <div className="text-sm font-medium text-foreground">Notifications</div>
                <div className="text-xs text-muted-foreground">{notifications.length} recent</div>
              </div>

              <div className="max-h-80 overflow-y-auto">
                {notifications.slice(0, 5).map((n) => (
                  <Link
                    key={n.id}
                    href="/notifications"
                    onClick={() => setBellOpen(false)}
                    className="flex items-start gap-2.5 px-4 py-2.5 hover:bg-muted/60"
                  >
                    <n.icon size={15} className="mt-0.5 shrink-0 text-muted-foreground" />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm text-foreground">{n.title}</div>
                      <div className="text-xs text-muted-foreground">{n.time}</div>
                    </div>
                  </Link>
                ))}
              </div>

              <Link
                href="/notifications"
                onClick={() => setBellOpen(false)}
                className="flex items-center justify-center border-t border-border px-4 py-2.5 text-sm font-medium text-espresso-600 hover:bg-muted/60 dark:text-crema-300"
              >
                View all notifications
              </Link>
            </div>
          )}
        </div>

        <div className="relative ml-1 border-l border-border pl-3" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            className="flex items-center gap-2.5 rounded-xl px-1.5 py-1 hover:bg-espresso-50 dark:hover:bg-white/5"
          >
            <Avatar name="Monika Varghese" size={36} />
            <div className="hidden text-left leading-tight sm:block">
              <div className="text-sm font-medium text-foreground">Monika Varghese</div>
              <div className="text-xs text-muted-foreground">Program Admin</div>
            </div>
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full z-50 mt-2 w-44 overflow-hidden rounded-2xl border border-border bg-card shadow-warm-lg">
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-foreground hover:bg-muted/60"
              >
                <LogIn size={15} className="text-muted-foreground" /> Login
              </Link>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  toast.success("Signed out.");
                  router.push("/login");
                }}
                className="flex w-full items-center gap-2.5 border-t border-border px-4 py-2.5 text-sm font-medium text-rust-500 hover:bg-rust-500/10"
              >
                <LogOut size={15} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
