import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] text-sm font-semibold transition-colors disabled:pointer-events-none disabled:opacity-50 min-h-11 px-4 py-2",
  {
    variants: {
      variant: {
        primary:
          "bg-accent text-accent-foreground hover:bg-[color-mix(in_oklab,var(--accent),black_8%)]",
        secondary:
          "bg-background-elevated text-foreground border border-border hover:bg-surface-subtle",
        ghost: "bg-transparent text-foreground hover:bg-surface-subtle",
        danger:
          "bg-danger text-danger-foreground hover:bg-[color-mix(in_oklab,var(--danger),black_8%)]",
      },
      size: {
        default: "min-h-11 px-4",
        sm: "min-h-10 px-3 text-sm",
        lg: "min-h-12 px-5 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, type = "button", ...props }: ButtonProps) {
  return (
    <button type={type} className={cn(buttonVariants({ variant, size }), className)} {...props} />
  );
}
