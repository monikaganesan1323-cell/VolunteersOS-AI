"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { HeartHandshake, X, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { ADMIN_ORIGIN } from "@/lib/ports";
import { portalNavGroups } from "./nav-config";

export function PortalMobileSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-ink/40 backdrop-blur-sm lg:hidden"
          />
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-card p-3 shadow-warm-lg lg:hidden"
          >
            <div className="flex h-14 items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-sage-600 text-crema-50">
                  <HeartHandshake size={16} />
                </span>
                <span className="font-display text-base font-semibold text-ink dark:text-crema-50">
                  VolunteerOS
                </span>
              </div>
              <button onClick={onClose} aria-label="Close menu">
                <X size={20} />
              </button>
            </div>

            <div className="mx-2 mb-3 mt-1 flex items-center gap-2 rounded-full bg-sage-500/15 px-3 py-1 text-[11px] font-medium text-sage-700 dark:text-sage-400">
              <HeartHandshake size={12} /> Volunteer portal
            </div>

            <nav className="flex-1 space-y-5 overflow-y-auto">
              {portalNavGroups.map((group) => (
                <div key={group.label}>
                  <div className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-widest text-espresso-600/45 dark:text-crema-300/40">
                    {group.label}
                  </div>
                  <div className="space-y-1">
                    {group.items.map((item) => {
                      const active = pathname === item.href;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={onClose}
                          className={cn(
                            "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium",
                            active
                              ? "bg-sage-600 text-crema-50"
                              : "text-espresso-700/70 dark:text-crema-200/70"
                          )}
                        >
                          <item.icon size={18} />
                          {item.label}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>

            <a
              href={`${ADMIN_ORIGIN}/dashboard`}
              className="flex items-center justify-center gap-2 border-t border-border p-3 text-xs font-medium text-espresso-700/70 dark:text-crema-200/70"
            >
              Admin dashboard <ExternalLink size={13} />
            </a>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
