import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface Props {
  label:    string;
  value:    string | number;
  sub?:     string;
  icon?:    LucideIcon;
  accent?:  string;
  trend?:   "up" | "down" | "neutral";
}

export function StatCard({ label, value, sub, icon: Icon, accent = "#1B3A5C", trend }: Props) {
  return (
    <div className="bg-white rounded-xl border border-border/50 shadow-sm p-5 relative overflow-hidden">
      {/* Accent bar */}
      <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl" style={{ background: accent }} />

      <div className="pl-2">
        <p className="text-[10px] font-sans font-semibold uppercase tracking-wider text-faint mb-2">
          {label}
        </p>

        <div className="flex items-end justify-between gap-2">
          <p className="font-serif text-3xl text-ink leading-none">{value}</p>
          {Icon && (
            <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: `${accent}15` }}>
              <Icon size={18} style={{ color: accent }} />
            </div>
          )}
        </div>

        {sub && (
          <p className={cn(
            "text-xs font-sans mt-2",
            trend === "up"      && "text-trust",
            trend === "down"    && "text-red-500",
            trend === "neutral" && "text-faint",
            !trend              && "text-faint",
          )}>
            {trend === "up" && "↑ "}{trend === "down" && "↓ "}{sub}
          </p>
        )}
      </div>
    </div>
  );
}
