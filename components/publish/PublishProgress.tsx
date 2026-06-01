import { cn } from "@/lib/utils";

const STEPS = [
  { n: 1, label: "Tipo"         },
  { n: 2, label: "Localização"  },
  { n: 3, label: "Detalhes"     },
  { n: 4, label: "Fotos"        },
] as const;

interface Props { current: number }

export function PublishProgress({ current }: Props) {
  return (
    <div className="flex items-center gap-0 w-full max-w-xl mx-auto mb-8">
      {STEPS.map(({ n, label }, i) => {
        const done   = n < current;
        const active = n === current;
        return (
          <div key={n} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-sans font-semibold transition-all",
                done   && "bg-trust text-white",
                active && "bg-navy text-white ring-4 ring-navy/20",
                !done && !active && "bg-warm-dark text-faint border border-border"
              )}>
                {done ? "✓" : n}
              </div>
              <span className={cn(
                "text-xs font-sans whitespace-nowrap",
                active ? "text-navy font-semibold" : done ? "text-trust" : "text-faint"
              )}>
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={cn(
                "flex-1 h-0.5 mx-2 mb-5 transition-colors",
                done ? "bg-trust" : "bg-border"
              )} />
            )}
          </div>
        );
      })}
    </div>
  );
}
