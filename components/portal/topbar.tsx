"use client";

import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun, Menu, ChevronRight } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { currentVolunteer } from "./sidebar";

function useBreadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean).filter((s) => s !== "portal");
  if (segments.length === 0) return ["My Overview"];
  return segments.map((s) => s.charAt(0).toUpperCase() + s.slice(1).replace(/-/g, " "));
}

export function PortalTopbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const crumbs = useBreadcrumb();

  useEffect(() => setMounted(true), []);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-sage-500/15 bg-background/80 px-4 backdrop-blur-xl sm:px-6 lg:hidden">
      <button onClick={onMenuClick} aria-label="Open menu">
        <Menu size={20} />
      </button>

      <div className="flex items-center gap-1 text-sm text-muted-foreground">
        {crumbs.map((c, i) => (
          <span key={c} className="flex items-center gap-1">
            {i > 0 && <ChevronRight size={13} />}
            <span className={i === crumbs.length - 1 ? "font-medium text-foreground" : ""}>{c}</span>
          </span>
        ))}
      </div>

      <div className="ml-auto flex items-center gap-2">
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="flex h-9 w-9 items-center justify-center rounded-xl text-espresso-700 hover:bg-sage-500/10 dark:text-crema-200"
          aria-label="Toggle theme"
        >
          {mounted && theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
        </button>
        <Avatar name={currentVolunteer.name} size={32} />
      </div>
    </header>
  );
}
