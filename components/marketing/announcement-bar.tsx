"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Sparkles } from "lucide-react";

const messages = [
  "✨ Built for Rotaract, NSS, NGOs & CSR Programs",
  "🔥 12,850+ volunteers already brewing impact across Kerala",
  "🎓 New: AI Resume Builder turns logged hours into a portfolio",
];

export function AnnouncementBar() {
  const [visible, setVisible] = useState(true);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % messages.length);
    }, 4000);
    return () => clearInterval(id);
  }, []);

  if (!visible) return null;

  return (
    <div className="relative z-[60] w-full bg-roast-gradient">
      <div className="mx-auto flex max-w-6xl items-center justify-center gap-2 px-10 py-2 text-center">
        <Sparkles size={13} className="hidden shrink-0 text-crema-100/90 sm:block" />
        <AnimatePresence mode="wait">
          <motion.span
            key={index}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.35 }}
            className="text-xs font-medium text-crema-50"
          >
            {messages[index]}
          </motion.span>
        </AnimatePresence>
      </div>
      <button
        onClick={() => setVisible(false)}
        aria-label="Dismiss announcement"
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-crema-100/70 transition-colors hover:bg-white/10 hover:text-crema-50"
      >
        <X size={13} />
      </button>
    </div>
  );
}
