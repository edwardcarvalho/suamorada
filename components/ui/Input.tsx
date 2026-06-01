import * as React from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  variant?: "default" | "search";
  containerClassName?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, variant = "default", containerClassName, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className={cn("flex flex-col gap-1.5", containerClassName)}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-semibold font-sans uppercase tracking-wider text-faint"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {variant === "search" && (
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-faint pointer-events-none"
              aria-hidden="true"
            />
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              "w-full rounded-lg border bg-white px-4 py-3 text-sm font-sans text-ink placeholder:text-faint",
              "transition-all duration-150 outline-none",
              "border-border hover:border-navy/30 focus:border-navy focus:ring-2 focus:ring-navy/10",
              error && "border-red-500 focus:border-red-500 focus:ring-red-500/10",
              variant === "search" && "pl-9",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "[font-size:1rem]", // evita zoom no iOS
              className
            )}
            aria-invalid={error ? "true" : undefined}
            aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
            {...props}
          />
        </div>
        {error && (
          <p id={`${inputId}-error`} className="text-xs text-red-600 font-sans" role="alert">
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={`${inputId}-hint`} className="text-xs text-faint font-sans">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
