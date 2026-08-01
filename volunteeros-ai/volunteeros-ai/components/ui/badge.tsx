import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-espresso-100 text-espresso-700 dark:bg-espresso-800 dark:text-crema-200",
        secondary: "border-transparent bg-crema-100 text-espresso-700 dark:bg-espresso-700/40 dark:text-crema-200",
        success: "border-transparent bg-sage-500/15 text-sage-600 dark:text-sage-400",
        warning: "border-transparent bg-rust-500/15 text-rust-600 dark:text-rust-400",
        outline: "border-border text-foreground",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
