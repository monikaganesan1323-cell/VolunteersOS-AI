"use client";

import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";

function timeGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export function DashboardGreeting() {
  const { hydrated, session } = useStore();
  // Computed after mount so server and client markup match.
  const [greeting, setGreeting] = useState("Welcome");

  useEffect(() => setGreeting(timeGreeting()), []);

  const name = hydrated && session ? session.name.split(" ")[0] : "there";

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink dark:text-crema-50">
        {greeting}, {name}
      </h1>
      <p className="text-sm text-muted-foreground">
        Here&apos;s what&apos;s brewing across your programs today.
      </p>
    </div>
  );
}
