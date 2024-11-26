import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        success:
          "border-transparent bg-success text-success-foreground hover:bg-success/80",
        info: "border-transparent bg-info text-info-foreground hover:bg-info/80",
        warning:
          "border-transparent bg-warning text-warning-foreground hover:bg-warning/80",
        muted: "border-muted bg-muted text-muted-foreground hover:bg-muted/80",
        subtle:
          "border-transparent bg-subtle text-subtle-foreground hover:bg-subtle/80",
        neutral:
          "border-neutral bg-neutral text-neutral-foreground hover:bg-neutral/80",
        dark: "border-transparent bg-dark text-dark-foreground hover:bg-dark/80",
        light:
          "border-transparent bg-light text-light-foreground hover:bg-light/80",
        highlight:
          "border-transparent bg-highlight text-highlight-foreground hover:bg-highlight/80",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
