import { LucideIcon, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatCard({
  icon: Icon,
  label,
  value,
  delta,
  positive = true,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  delta?: string;
  positive?: boolean;
}) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-espresso-50 text-espresso-600 dark:bg-white/5 dark:text-crema-300">
          <Icon size={18} />
        </div>
        {delta && (
          <span
            className={cn(
              "flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-medium",
              positive ? "bg-sage-500/15 text-sage-600 dark:text-sage-400" : "bg-rust-500/15 text-rust-600 dark:text-rust-400"
            )}
          >
            {positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {delta}
          </span>
        )}
      </div>
      <div className="mt-4 font-display text-2xl font-semibold text-ink dark:text-crema-50">
        {value}
      </div>
      <div className="mt-1 text-xs text-muted-foreground">{label}</div>
    </Card>
  );
}
