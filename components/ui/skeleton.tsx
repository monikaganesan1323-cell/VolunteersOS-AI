import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-shimmer rounded-lg bg-[length:200%_100%] bg-gradient-to-r from-espresso-100 via-crema-100 to-espresso-100 dark:from-white/5 dark:via-white/10 dark:to-white/5",
        className
      )}
    />
  );
}
