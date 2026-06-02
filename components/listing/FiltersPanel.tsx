"use client";

import * as React from "react";
import { ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";

/* ── Tipos ─────────────────────────────────────────────────────────────── */

export interface FilterState {
  // Tipo de imóvel
  propertyTypes: string[];     // "apartment"|"house"|"villa"|"commercial"|"land"|"garage"
  // Preço
  minPrice: string;
  maxPrice: string;
  // Tamanho
  minArea: string;
  maxArea: string;
  // Tipologia
  quartos: number[];           // 0=T0 1=T1 2=T2 3=T3 4=T4+
  // Casas de banho
  minBaths: number | null;
  // Estado
  estado: string[];            // "nova" | "bom_estado" | "needs_renovation"
  // Mais filtros (características)
  extras: string[];            // "garage"|"elevator"|"pool"|"garden"|"ac"|"balcony"|"wardrobe"|"storage"|"adapted"
  // Andar
  andar: string | null;        // "ultimo"|"intermedio"|"res_chao"
  // Eficiência energética
  energiaGrupo: string[];      // "alta"|"media"|"baixa"
  // Publicado
  publicado: string | null;    // "48h"|"semana"|"mes"
}

export const EMPTY_FILTERS: FilterState = {
  propertyTypes: [],
  minPrice: "", maxPrice: "",
  minArea: "", maxArea: "",
  quartos: [],
  minBaths: null,
  estado: [],
  extras: [],
  andar: null,
  energiaGrupo: [],
  publicado: null,
};

export function countActiveFilters(f: FilterState): number {
  let n = 0;
  if (f.propertyTypes.length)                       n++;
  if (f.minPrice || f.maxPrice)                     n++;
  if (f.minArea || f.maxArea)                       n++;
  if (f.quartos.length)                             n++;
  if (f.minBaths)                                   n++;
  if (f.estado.length)                              n++;
  if (f.extras.length)                              n++;
  if (f.andar)                                      n++;
  if (f.energiaGrupo.length)                        n++;
  if (f.publicado)                                  n++;
  return n;
}

/** Serializa o estado dos filtros para os parâmetros da API */
export function filtersToParams(f: FilterState) {
  return {
    quartos:  f.quartos.length  ? f.quartos.join(",")      : undefined,
    casasBanho: f.minBaths      ?? undefined,
    minPrice: f.minPrice        ? Number(f.minPrice)        : undefined,
    maxPrice: f.maxPrice        ? Number(f.maxPrice)        : undefined,
    minArea:  f.minArea         ? Number(f.minArea)         : undefined,
    maxArea:  f.maxArea         ? Number(f.maxArea)         : undefined,
    estado:   f.estado.length   ? f.estado.join(",")        : undefined,
    extras:   f.extras.length   ? f.extras.join(",")        : undefined,
    andar:    f.andar            ?? undefined,
    energia:  f.energiaGrupo.length ? f.energiaGrupo.join(",") : undefined,
    publicado: f.publicado       ?? undefined,
  };
}

interface Props {
  filters: FilterState;
  onChange: (f: FilterState) => void;
  listingType: "comprar" | "arrendar";
  open: boolean;
  onClose: () => void;
}

/* ── Helpers ────────────────────────────────────────────────────────────── */

function toggle<T>(arr: T[], val: T): T[] {
  return arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val];
}

/* ── Sub-componentes ────────────────────────────────────────────────────── */

function Section({ title, children, defaultOpen = true }: {
  title: string; children: React.ReactNode; defaultOpen?: boolean;
}) {
  const [open, setOpen] = React.useState(defaultOpen);
  return (
    <div className="border-b border-border last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-3 px-4 text-sm font-sans font-semibold text-ink hover:text-navy transition-colors"
      >
        {title}
        <ChevronDown size={14} className={cn("text-muted transition-transform duration-200 shrink-0", open && "rotate-180")} />
      </button>
      {open && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
}

function Pill({ active, onClick, children, className }: {
  active: boolean; onClick: () => void; children: React.ReactNode; className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-3 py-1.5 rounded-lg text-xs font-sans font-medium border transition-all whitespace-nowrap",
        active
          ? "bg-navy text-white border-navy"
          : "bg-white text-muted border-border hover:border-navy hover:text-navy",
        className
      )}
    >
      {children}
    </button>
  );
}

function RadioPill({ active, onClick, children }: {
  active: boolean; onClick: () => void; children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-3 py-1.5 rounded-lg text-xs font-sans font-medium border transition-all whitespace-nowrap",
        active
          ? "bg-navy text-white border-navy"
          : "bg-white text-muted border-border hover:border-navy hover:text-navy"
      )}
    >
      {children}
    </button>
  );
}

function CheckItem({ checked, onChange, label }: {
  checked: boolean; onChange: () => void; label: string;
}) {
  return (
    <label onClick={onChange} className="flex items-center gap-2.5 cursor-pointer group py-0.5">
      <span
        className={cn(
          "w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors",
          checked ? "bg-navy border-navy" : "border-border group-hover:border-navy"
        )}
      >
        {checked && (
          <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
            <path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </span>
      <span className="text-sm font-sans text-ink group-hover:text-navy transition-colors leading-tight">{label}</span>
    </label>
  );
}

function RangeRow({ leftValue, leftChange, leftPlaceholder, rightValue, rightChange, rightPlaceholder, suffix }: {
  leftValue: string; leftChange: (v: string) => void; leftPlaceholder: string;
  rightValue: string; rightChange: (v: string) => void; rightPlaceholder: string;
  suffix?: string;
}) {
  return (
    <div className="flex gap-2 items-center">
      <div className="relative flex-1">
        {suffix === "€" && <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-muted">€</span>}
        <input
          type="number" min={0} value={leftValue}
          onChange={(e) => leftChange(e.target.value)}
          placeholder={leftPlaceholder}
          className={cn("w-full py-2 text-sm font-sans border border-border rounded-lg outline-none focus:border-navy bg-white placeholder:text-faint", suffix === "€" ? "pl-6 pr-2" : suffix ? "pl-3 pr-8" : "px-3")}
        />
        {suffix && suffix !== "€" && <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-muted">{suffix}</span>}
      </div>
      <span className="text-muted text-sm shrink-0">—</span>
      <div className="relative flex-1">
        {suffix === "€" && <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-muted">€</span>}
        <input
          type="number" min={0} value={rightValue}
          onChange={(e) => rightChange(e.target.value)}
          placeholder={rightPlaceholder}
          className={cn("w-full py-2 text-sm font-sans border border-border rounded-lg outline-none focus:border-navy bg-white placeholder:text-faint", suffix === "€" ? "pl-6 pr-2" : suffix ? "pl-3 pr-8" : "px-3")}
        />
        {suffix && suffix !== "€" && <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-muted">{suffix}</span>}
      </div>
    </div>
  );
}

/* ── Dados estáticos ────────────────────────────────────────────────────── */

const PROPERTY_TYPE_GROUPS = [
  {
    label: "Apartamentos, penthouses e duplex",
    types: ["apartment"],
  },
  {
    label: "Casas e moradias",
    types: ["house", "villa"],
  },
  {
    label: "Comercial",
    types: ["commercial"],
  },
  {
    label: "Terrenos",
    types: ["land"],
  },
  {
    label: "Garagens",
    types: ["garage"],
  },
];

const QUARTOS = [
  { label: "T0", value: 0 },
  { label: "T1", value: 1 },
  { label: "T2", value: 2 },
  { label: "T3", value: 3 },
  { label: "T4 ou +", value: 4 },
];

const BANHOS = [
  { label: "1", value: 1 },
  { label: "2", value: 2 },
  { label: "3 ou +", value: 3 },
];

const ESTADO_OPTIONS = [
  { value: "nova",              label: "Nova construção" },
  { value: "bom_estado",        label: "Bom estado"      },
  { value: "needs_renovation",  label: "Para recuperar"  },
];

const EXTRAS_MAIN = [
  { value: "ac",        label: "Ar condicionado"  },
  { value: "wardrobe",  label: "Armários embutidos"},
  { value: "elevator",  label: "Elevador"          },
  { value: "balcony",   label: "Varanda"           },
  { value: "terrace",   label: "Terraço"           },
];

const EXTRAS_MORE = [
  { value: "garage",    label: "Lugar de garagem" },
  { value: "garden",    label: "Jardim"            },
  { value: "pool",      label: "Piscina"           },
  { value: "storage",   label: "Arrecadação"       },
  { value: "adapted",   label: "Casa adaptada"     },
];

const ANDAR_OPTIONS = [
  { value: "ultimo",     label: "Último andar"      },
  { value: "intermedio", label: "Andares intermédios"},
  { value: "res_chao",   label: "Rés do chão"       },
];

const ENERGIA_GRUPOS = [
  { value: "alta",  label: "Alta",  sub: "A+, A, B"    },
  { value: "media", label: "Média", sub: "B-, C"        },
  { value: "baixa", label: "Baixa", sub: "D, E, F"      },
];

const PUBLICADO_OPTIONS = [
  { value: "48h",    label: "Nas últimas 48 horas" },
  { value: "semana", label: "Na última semana"      },
  { value: "mes",    label: "No último mês"         },
];

/* ── Componente principal ───────────────────────────────────────────────── */

export function FiltersPanel({ filters, onChange, listingType, open, onClose }: Props) {
  const [showMoreExtras, setShowMoreExtras] = React.useState(false);
  const set = (partial: Partial<FilterState>) => onChange({ ...filters, ...partial });
  const activeCount = countActiveFilters(filters);

  // Verifica se um grupo de tipos está seleccionado (todos os tipos do grupo)
  const isGroupSelected = (types: string[]) => types.every(t => filters.propertyTypes.includes(t));
  const toggleGroup = (types: string[]) => {
    if (isGroupSelected(types)) {
      set({ propertyTypes: filters.propertyTypes.filter(t => !types.includes(t)) });
    } else {
      const merged = [...new Set([...filters.propertyTypes, ...types])];
      set({ propertyTypes: merged });
    }
  };

  const content = (
    <div className="flex flex-col h-full">

      {/* ── Header ── */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
        <span className="font-sans font-semibold text-sm text-ink">
          Filtros
          {activeCount > 0 && (
            <span className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-brand text-white text-[10px] font-bold">
              {activeCount}
            </span>
          )}
        </span>
        <div className="flex items-center gap-2">
          {activeCount > 0 && (
            <button
              onClick={() => onChange(EMPTY_FILTERS)}
              className="text-xs font-sans text-muted hover:text-brand transition-colors"
            >
              Limpar tudo
            </button>
          )}
          <button onClick={onClose} className="lg:hidden p-1 rounded hover:bg-warm" aria-label="Fechar">
            <X size={15} className="text-muted" />
          </button>
        </div>
      </div>

      {/* ── Secções ── */}
      <div className="flex-1 overflow-y-auto">

        {/* Tipo de imóvel */}
        <Section title="Tipo de imóvel">
          <div className="flex flex-col gap-1.5">
            {PROPERTY_TYPE_GROUPS.map(({ label, types }) => (
              <CheckItem
                key={label}
                checked={isGroupSelected(types)}
                onChange={() => toggleGroup(types as string[])}
                label={label}
              />
            ))}
          </div>
        </Section>

        {/* Preço */}
        <Section title={listingType === "comprar" ? "Preço" : "Renda mensal"}>
          <RangeRow
            leftValue={filters.minPrice}   leftChange={(v) => set({ minPrice: v })}   leftPlaceholder="Mín."
            rightValue={filters.maxPrice}  rightChange={(v) => set({ maxPrice: v })}  rightPlaceholder="Máx."
            suffix="€"
          />
        </Section>

        {/* Tamanho */}
        <Section title="Tamanho" defaultOpen={true}>
          <RangeRow
            leftValue={filters.minArea}   leftChange={(v) => set({ minArea: v })}   leftPlaceholder="Mín."
            rightValue={filters.maxArea}  rightChange={(v) => set({ maxArea: v })}  rightPlaceholder="Máx."
            suffix="m²"
          />
        </Section>

        {/* Quartos */}
        <Section title="Quartos">
          <div className="flex flex-wrap gap-1.5">
            {QUARTOS.map(({ label, value }) => (
              <Pill
                key={value}
                active={filters.quartos.includes(value)}
                onClick={() => set({ quartos: toggle(filters.quartos, value) })}
              >
                {label}
              </Pill>
            ))}
          </div>
        </Section>

        {/* Casas de banho */}
        <Section title="Casas de banho" defaultOpen={true}>
          <div className="flex gap-1.5 flex-wrap">
            {BANHOS.map(({ label, value }) => (
              <RadioPill
                key={value}
                active={filters.minBaths === value}
                onClick={() => set({ minBaths: filters.minBaths === value ? null : value })}
              >
                {label}
              </RadioPill>
            ))}
          </div>
        </Section>

        {/* Estado */}
        <Section title="Estado">
          <div className="flex flex-col gap-1.5">
            {ESTADO_OPTIONS.map(({ value, label }) => (
              <CheckItem
                key={value}
                checked={filters.estado.includes(value)}
                onChange={() => set({ estado: toggle(filters.estado, value) })}
                label={label}
              />
            ))}
          </div>
        </Section>

        {/* Mais filtros (características) */}
        <Section title="Mais filtros" defaultOpen={true}>
          <div className="flex flex-col gap-1.5">
            {EXTRAS_MAIN.map(({ value, label }) => (
              <CheckItem
                key={value}
                checked={filters.extras.includes(value)}
                onChange={() => set({ extras: toggle(filters.extras, value) })}
                label={label}
              />
            ))}
          </div>
          {!showMoreExtras ? (
            <button
              onClick={() => setShowMoreExtras(true)}
              className="mt-3 text-xs font-sans text-navy hover:underline"
            >
              Ver outros filtros ↓
            </button>
          ) : (
            <div className="mt-3 flex flex-col gap-1.5 border-t border-border pt-3">
              {EXTRAS_MORE.map(({ value, label }) => (
                <CheckItem
                  key={value}
                  checked={filters.extras.includes(value)}
                  onChange={() => set({ extras: toggle(filters.extras, value) })}
                  label={label}
                />
              ))}
            </div>
          )}
        </Section>

        {/* Andar */}
        <Section title="Andar" defaultOpen={true}>
          <div className="flex flex-col gap-1.5">
            {ANDAR_OPTIONS.map(({ value, label }) => (
              <CheckItem
                key={value}
                checked={filters.andar === value}
                onChange={() => set({ andar: filters.andar === value ? null : value })}
                label={label}
              />
            ))}
          </div>
        </Section>

        {/* Eficiência energética */}
        <Section title="Eficiência energética" defaultOpen={true}>
          <div className="flex flex-col gap-2">
            {ENERGIA_GRUPOS.map(({ value, label, sub }) => (
              <label key={value} onClick={() => set({ energiaGrupo: toggle(filters.energiaGrupo, value) })} className="flex items-start gap-2.5 cursor-pointer group py-0.5">
                <span
                  className={cn(
                    "w-4 h-4 rounded border flex items-center justify-center shrink-0 mt-0.5 transition-colors",
                    filters.energiaGrupo.includes(value) ? "bg-navy border-navy" : "border-border group-hover:border-navy"
                  )}
                >
                  {filters.energiaGrupo.includes(value) && (
                    <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                      <path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </span>
                <span className="flex flex-col">
                  <span className="text-sm font-sans text-ink group-hover:text-navy transition-colors">{label}</span>
                  <span className="text-[11px] text-faint font-sans">{sub}</span>
                </span>
              </label>
            ))}
          </div>
        </Section>

        {/* Publicado */}
        <Section title="Publicado" defaultOpen={true}>
          <div className="flex flex-col gap-1.5">
            {PUBLICADO_OPTIONS.map(({ value, label }) => (
              <CheckItem
                key={value}
                checked={filters.publicado === value}
                onChange={() => set({ publicado: filters.publicado === value ? null : value })}
                label={label}
              />
            ))}
          </div>
        </Section>

      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-[260px] shrink-0 bg-white border-r border-border overflow-hidden">
        {content}
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40" onClick={onClose} />
          <aside className="relative z-10 w-[300px] max-w-[88vw] bg-white flex flex-col h-full shadow-2xl animate-slide-in-left">
            {content}
          </aside>
        </div>
      )}
    </>
  );
}
