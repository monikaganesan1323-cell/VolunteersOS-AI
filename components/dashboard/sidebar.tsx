"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Coffee, ChevronsLeft, ChevronsRight, ShieldCheck, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { PORTAL_ORIGIN } from "@/lib/ports";
import { adminNavItems } from "./nav-config";

export function Sidebar({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
}) {
  const pathname = usePathname();

  return (
    <motion.aside
      animate={{ width: collapsed ? 76 : 260 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="sticky top-0 hidden h-screen shrink-0 flex-col border-r border-espresso-900/10 bg-espresso-950 lg:flex dark:border-white/5"
    >
      <div className="flex h-16 items-center gap-2 px-5">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-espresso-600 text-crema-100">
          <Coffee size={16} />
        </span>
        {!collapsed && (
          <span className="font-display text-base font-semibold text-crema-50">
            VolunteerOS
          </span>
        )}
      </div>

      {!collapsed && (
        <div className="mx-3 mb-4 flex items-center gap-2 rounded-full bg-espresso-600/20 px-3 py-1 text-[11px] font-medium text-crema-200">
          <ShieldCheck size={12} /> Admin portal
        </div>
      )}

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2 scrollbar-thin">
        {adminNavItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-espresso-600 text-crema-50 shadow-warm"
                  : "text-crema-100/60 hover:bg-white/5 hover:text-crema-50"
              )}
            >
              <item.icon size={18} className="shrink-0" />
              {!collapsed && <span>{item.label}</span>}
              {collapsed && (
                <span className="pointer-events-none absolute left-full ml-3 whitespace-nowrap rounded-lg bg-ink px-2.5 py-1.5 text-xs text-crema-50 opacity-0 shadow-warm transition-opacity group-hover:opacity-100">
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/5 p-3">
        <a
          href={`${PORTAL_ORIGIN}/portal`}
          className="flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-medium text-crema-100/60 hover:bg-white/5 hover:text-crema-50"
        >
          {!collapsed && "Volunteer portal"} <ExternalLink size={13} />
        </a>
        <button
          onClick={onToggle}
          className="flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-crema-100/60 hover:bg-white/5 hover:text-crema-50"
        >
          {collapsed ? <ChevronsRight size={18} /> : (<><ChevronsLeft size={18} /> Collapse</>)}
        </button>
      </div>
    </motion.aside>
  );
}
