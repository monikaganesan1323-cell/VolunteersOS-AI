"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useNotifications } from "@/lib/notification-store";

const typeColor: Record<string, string> = {
  ai_recommendation: "text-espresso-600 dark:text-crema-200",
  alert: "text-rust-500",
  reminder: "text-espresso-500",
  announcement: "text-crema-500",
  activity: "text-sage-500",
  registration: "text-sage-600 dark:text-sage-400",
};

const filters = ["all", "registration", "ai_recommendation", "alert", "reminder", "announcement", "activity"] as const;

export default function NotificationsPage() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("all");
  const { notifications } = useNotifications();
  const filtered = filter === "all" ? notifications : notifications.filter((n) => n.type === filter);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink dark:text-crema-50">Notifications</h1>
        <p className="text-sm text-muted-foreground">Alerts, reminders, and announcements across your programs.</p>
      </div>

      <div className="flex gap-2 overflow-x-auto">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-medium capitalize transition-colors",
              filter === f ? "border-espresso-600 bg-espresso-600 text-crema-50" : "border-border text-muted-foreground hover:bg-muted"
            )}
          >
            {f.replace("_", " ")}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((n) => {
          const isAi = n.type === "ai_recommendation";
          return (
            <Card
              key={n.id}
              className={cn(isAi && "border-espresso-300 bg-crema-swirl/10 dark:border-espresso-500/40")}
            >
              <CardContent className="flex items-start gap-4 p-4">
                <div
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                    isAi ? "bg-espresso-600 text-crema-50" : "bg-muted",
                    !isAi && typeColor[n.type]
                  )}
                >
                  <n.icon size={18} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-foreground">{n.title}</span>
                    <Badge variant={isAi ? "success" : "outline"} className="shrink-0 capitalize">
                      {n.type.replace("_", " ")}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{n.body}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{n.time}</span>
                    {isAi && (
                      <Button size="sm" variant="outline">
                        View match
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
