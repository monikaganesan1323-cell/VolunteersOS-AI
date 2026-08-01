import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-espresso-600 text-white shadow-warm hover:bg-espresso-700 dark:bg-espresso-400 dark:text-bark dark:hover:bg-espresso-300",
        secondary:
          "bg-crema-200 text-espresso-700 hover:bg-crema-300 dark:bg-espresso-800 dark:text-crema-200 dark:hover:bg-espresso-700",
        outline:
          "border border-espresso-200 bg-transparent text-espresso-700 hover:bg-espresso-50 dark:border-white/15 dark:text-crema-100 dark:hover:bg-white/5",
        ghost:
          "bg-transparent hover:bg-espresso-50 text-espresso-700 dark:text-crema-100 dark:hover:bg-white/5",
        destructive: "bg-rust-500 text-white hover:bg-rust-600",
        link: "text-espresso-600 underline-offset-4 hover:underline dark:text-crema-300",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 px-3.5 text-xs",
        lg: "h-12 px-7 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
