import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-semibold font-sans leading-none whitespace-nowrap",
  {
    variants: {
      variant: {
        verified: "bg-trust text-white",
        featured: "bg-brand text-white",
        new:      "bg-navy text-white",
        paused:   "bg-muted/20 text-muted",
        pending:  "bg-amber-100 text-amber-800",
        sold:     "bg-ink text-white",
        outline:  "border border-border text-muted bg-transparent",
      },
    },
    defaultVariants: { variant: "outline" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
