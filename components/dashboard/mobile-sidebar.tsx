"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Coffee, X, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { adminNavItems } from "./nav-config";

export function MobileSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
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
            className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-espresso-950 p-3 shadow-warm-lg lg:hidden"
          >
            <div className="flex h-14 items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-espresso-600 text-crema-100">
                  <Coffee size={16} />
                </span>
                <span className="font-display text-base font-semibold text-crema-50">
                  VolunteerOS
                </span>
              </div>
              <button onClick={onClose} aria-label="Close menu" className="text-crema-100/70">
                <X size={20} />
              </button>
            </div>

            <div className="mx-2 mb-3 mt-1 flex items-center gap-2 rounded-full bg-espresso-600/20 px-3 py-1 text-[11px] font-medium text-crema-200">
              <ShieldCheck size={12} /> Admin portal
            </div>

            <nav className="flex-1 space-y-1 overflow-y-auto">
              {adminNavItems.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium",
                      active ? "bg-espresso-600 text-crema-50" : "text-crema-100/60"
                    )}
                  >
                    <item.icon size={18} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
