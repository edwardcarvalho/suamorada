"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-sans font-semibold transition-all duration-150 focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none",
  {
    variants: {
      variant: {
        primary:
          "bg-brand text-white hover:bg-brand-dark active:scale-[0.98] shadow-sm",
        secondary:
          "bg-transparent border border-navy text-navy hover:bg-navy/5 active:scale-[0.98]",
        ghost:
          "bg-transparent text-muted hover:bg-warm-dark hover:text-ink active:scale-[0.98]",
        outline:
          "bg-white border border-border text-ink hover:border-navy hover:text-navy active:scale-[0.98]",
        danger:
          "bg-red-600 text-white hover:bg-red-700 active:scale-[0.98] shadow-sm",
        trust:
          "bg-trust text-white hover:bg-trust-dark active:scale-[0.98] shadow-sm",
      },
      size: {
        sm:  "h-9 px-4 text-sm",
        md:  "h-11 px-6 text-sm",
        lg:  "h-12 px-8 text-base",
        xl:  "h-14 px-10 text-base",
        icon:"h-10 w-10 p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size:    "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, disabled, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin" size={16} aria-hidden="true" />
            <span>{children}</span>
          </>
        ) : (
          children
        )}
      </Comp>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
