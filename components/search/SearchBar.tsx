"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import * as Popover from "@radix-ui/react-popover";
import dynamic from "next/dynamic";
import { Search, MapPin, ChevronDown, SlidersHorizontal, Check, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import type { LocationResult, LocationSelection } from "./LocationPickerModal";

const LocationPickerModal = dynamic(
  () => import("./LocationPickerModal").then((m) => m.LocationPickerModal),
  { ssr: false }
);

const TIPOS = ["Comprar", "Arrendar"] as const;
type Tipo = (typeof TIPOS)[number];

const TIPOS_IMOVEL = [
  { value: "apartment",  label: "Apartamentos" },
  { value: "house",      label: "Moradias"      },
  { value: "villa",      label: "Vivendas"       },
  { value: "commercial", label: "Comercial"      },
  { value: "land",       label: "Terrenos"       },
  { value: "garage",     label: "Garagens"       },
];

const QUARTOS_OPTS = [
  { value: "0", label: "Studio" },
  { value: "1", label: "T1" },
  { value: "2", label: "T2" },
  { value: "3", label: "T3" },
  { value: "4", label: "T4" },
  { value: "5", label: "T5+" },
];

const LOCAIS = [
  "Lisboa","Porto","Braga","Setúbal","Faro",
  "Aveiro","Coimbra","Leiria","Cascais","Sintra",
  "Almada","Amadora","Loures","Vila Nova de Gaia","Matosinhos",
];

// ── Multi-select dropdown ─────────────────────────────────────────────────────
interface MultiSelectProps {
  label:       string;
  placeholder: string;
  options:     { value: string; label: string }[];
  selected:    string[];
  onChange:    (vals: string[]) => void;
  minWidth?:   string;
}

function MultiSelect({ label, placeholder, options, selected, onChange, minWidth = "min-w-[148px]" }: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);

  function toggle(val: string) {
    onChange(selected.includes(val) ? selected.filter((v) => v !== val) : [...selected, val]);
  }

  const display = selected.length === 0
    ? placeholder
    : selected.length === 1
      ? options.find((o) => o.value === selected[0])?.label ?? placeholder
      : `${selected.length} seleccionados`;

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          className={cn(
            "flex flex-col px-4 py-2 h-full text-left transition-colors outline-none",
            minWidth,
            open && "bg-warm/30"
          )}
          aria-label={label}
        >
          <span className="text-[10px] font-sans font-semibold uppercase tracking-wider text-faint mb-0.5 whitespace-nowrap">
            {label}
          </span>
          <span className={cn(
            "text-[15px] font-sans font-medium leading-tight flex items-center gap-1.5 pr-5",
            selected.length > 0 ? "text-navy" : "text-ink"
          )}>
            {display}
            {selected.length > 0 && (
              <span
                className="w-4 h-4 rounded-full bg-brand text-white text-[9px] flex items-center justify-center shrink-0 font-bold"
                aria-label={`${selected.length} seleccionados`}
              >
                {selected.length}
              </span>
            )}
          </span>
          <ChevronDown
            size={13}
            className={cn(
              "absolute right-3 bottom-3.5 text-faint transition-transform",
              open && "rotate-180"
            )}
          />
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          className="bg-white rounded-xl shadow-xl border border-border z-[100] p-2 min-w-[180px] animate-in fade-in-0 zoom-in-95"
          sideOffset={8}
          align="start"
          onInteractOutside={() => setOpen(false)}
        >
          {/* Limpar selecção */}
          {selected.length > 0 && (
            <button
              onClick={() => onChange([])}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs font-sans font-semibold text-brand hover:bg-brand/5 rounded-lg transition-colors mb-1"
            >
              <X size={12} /> Limpar selecção
            </button>
          )}

          {options.map((opt) => {
            const active = selected.includes(opt.value);
            return (
              <button
                key={opt.value}
                onClick={() => toggle(opt.value)}
                className={cn(
                  "w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm font-sans transition-colors",
                  active ? "bg-navy/5 text-navy font-medium" : "text-ink hover:bg-warm"
                )}
              >
                <span>{opt.label}</span>
                {active && <Check size={14} className="text-navy shrink-0" />}
              </button>
            );
          })}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

// ── SearchBar principal ────────────────────────────────────────────────────────
interface SearchBarProps {
  compact?:           boolean;
  initialTipo?:       string;
  initialLocal?:      string;
  initialTiposImovel?:string[];
  initialQuartos?:    string[];
  className?:         string;
}

export function SearchBar({
  compact = false,
  initialTipo = "Comprar",
  initialLocal = "",
  initialTiposImovel = [],
  initialQuartos = [],
  className,
}: SearchBarProps) {
  const router = useRouter();

  const [tipo,        setTipo]        = React.useState<Tipo>(initialTipo as Tipo);
  const [local,       setLocal]       = React.useState(initialLocal);
  const [tiposImovel, setTiposImovel] = React.useState<string[]>(initialTiposImovel);
  const [quartos,     setQuartos]     = React.useState<string[]>(initialQuartos);
  const [localOpen,    setLocalOpen]   = React.useState(false);
  const [filtrosOpen,  setFiltrosOpen] = React.useState(false);
  const [mapPickerOpen,  setMapPickerOpen]  = React.useState(false);
  const [activeBBox,     setActiveBBox]     = React.useState<LocationResult["bbox"] | null>(null);
  const [activeLocations, setActiveLocations] = React.useState<LocationResult[]>([]);
  const [minPreco,    setMinPreco]    = React.useState("");
  const [maxPreco,    setMaxPreco]    = React.useState("");

  const localRef = React.useRef<HTMLInputElement>(null);

  const localFiltrado = local.length > 0
    ? LOCAIS.filter((l) => l.toLowerCase().includes(local.toLowerCase()))
    : LOCAIS;

  function handleSearch() {
    const tipoPath = tipo === "Comprar" ? "comprar" : "arrendar";
    const params   = new URLSearchParams();

    // ── Filtros de preço e tipo ─────────────────────────────────────────
    if (tiposImovel.length) params.set("propertyType", tiposImovel[0]); // 1º tipo para o path
    if (quartos.length)     params.set("quartos",      quartos.join(","));
    if (minPreco)           params.set("minPrice",     minPreco);
    if (maxPreco)           params.set("maxPrice",     maxPreco);

    // ── Localização via map picker (tem prioridade) ────────────────────
    if (activeLocations.length > 0 || activeBBox) {
      const districts = activeLocations.filter(l => l.level === "district");
      const munis     = activeLocations.filter(l => l.level === "municipality");
      const parishes  = activeLocations.filter(l => l.level === "parish");

      if (districts.length)  params.set("distrito",  districts.map(l => l.label).join(","));
      if (munis.length)      params.set("municipio", munis.map(l => l.label).join(","));
      if (parishes.length)   params.set("freguesia", parishes.map(l => l.label).join(","));

      if (activeBBox) {
        params.set("minLat", String(activeBBox.minLat));
        params.set("maxLat", String(activeBBox.maxLat));
        params.set("minLng", String(activeBBox.minLng));
        params.set("maxLng", String(activeBBox.maxLng));
      }

      // Vai sempre para a página base com query params
      router.push(`/${tipoPath}?${params.toString()}`);
      return;
    }

    // ── Localização por texto (slug-based routing) ────────────────────
    const slug = (s: string) =>
      s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
       .replace(/\s+/g, "-").replace(/[^\w-]/g, "");

    const localSlug = local ? slug(local) : "";
    const tipoSlug  = tiposImovel.length === 1
      ? slug(TIPOS_IMOVEL.find(t => t.value === tiposImovel[0])?.label ?? "")
      : "";

    let path = `/${tipoPath}`;
    if (localSlug) path += `/${localSlug}`;
    if (tipoSlug && localSlug) path += `/${tipoSlug}`;

    // Remove propertyType do params (já está na URL)
    params.delete("propertyType");

    const qs = params.toString();
    router.push(qs ? `${path}?${qs}` : path);
  }

  function handleLocationSelect(sel: LocationSelection) {
    setMapPickerOpen(false);

    const tipoPath = tipo === "Comprar" ? "comprar" : "arrendar";
    const params   = new URLSearchParams();

    // Localização por nível
    const districts = sel.locations.filter(l => l.level === "district");
    const munis     = sel.locations.filter(l => l.level === "municipality");
    const parishes  = sel.locations.filter(l => l.level === "parish");

    if (districts.length)  params.set("distrito",  districts.map(l => l.label).join(","));
    if (munis.length)      params.set("municipio", munis.map(l => l.label).join(","));
    if (parishes.length)   params.set("freguesia", parishes.map(l => l.label).join(","));

    if (sel.drawBBox) {
      params.set("minLat", String(sel.drawBBox.minLat));
      params.set("maxLat", String(sel.drawBBox.maxLat));
      params.set("minLng", String(sel.drawBBox.minLng));
      params.set("maxLng", String(sel.drawBBox.maxLng));
    }

    // Navega directamente para os resultados
    router.push(`/${tipoPath}?${params.toString()}`);
  }

  // ── Compact (navbar) ────────────────────────────────────────────────────────
  if (compact) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <div className="flex items-center gap-2 flex-1 bg-white/10 rounded-lg px-4 py-2 min-w-0">
          <Search size={14} className="text-white/50 shrink-0" />
          <input
            value={local}
            onChange={(e) => setLocal(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Lisboa, Cascais, Porto..."
            className="bg-transparent text-sm text-white placeholder:text-white/40 outline-none w-full"
          />
        </div>
        <Button variant="primary" size="sm" onClick={handleSearch}>
          <Search size={14} />
          Pesquisar
        </Button>
      </div>
    );
  }

  // ── Full ────────────────────────────────────────────────────────────────────
  return (
    <div className={cn("w-full max-w-[920px]", className)} suppressHydrationWarning>

      {/* Tabs */}
      <div className="flex gap-1 mb-0">
        {TIPOS.map((t) => (
          <button
            key={t}
            onClick={() => setTipo(t)}
            className={cn(
              "px-5 py-2.5 text-sm font-sans font-semibold rounded-t-lg transition-all duration-150",
              tipo === t
                ? "bg-white text-navy shadow-sm"
                : "bg-navy-light/30 text-white/70 hover:bg-white/10 hover:text-white"
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Main box */}
      <div className="bg-white rounded-b-2xl rounded-tr-2xl shadow-2xl flex items-stretch gap-0 overflow-visible relative">

        {/* ── Localização ── */}
        <div className="relative flex-1 min-w-0">
          <div
            className="flex items-center gap-2 px-4 h-full cursor-text py-3"
            onClick={() => { setLocalOpen(true); localRef.current?.focus(); }}
          >
            <MapPin size={16} className={cn("shrink-0", activeBBox ? "text-brand" : "text-faint")} />
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-[10px] font-sans font-semibold uppercase tracking-wider text-faint mb-0.5">
                Localização
              </span>
              <input
                ref={localRef}
                value={local}
                onChange={(e) => { setLocal(e.target.value); setLocalOpen(true); setActiveBBox(null); }}
                onFocus={() => setLocalOpen(true)}
                onBlur={() => setTimeout(() => setLocalOpen(false), 150)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Lisboa, Cascais, Porto..."
                className="text-[15px] font-sans font-medium text-ink placeholder:text-faint outline-none bg-transparent w-full leading-tight"
              />
            </div>
            {/* Limpar */}
            {local && (
              <button
                onClick={(e) => { e.stopPropagation(); setLocal(""); setActiveBBox(null); }}
                className="text-faint hover:text-ink shrink-0"
              >
                <X size={14} />
              </button>
            )}
            {/* Botão "Selecionar no mapa" */}
            <button
              onClick={(e) => { e.stopPropagation(); setMapPickerOpen(true); setLocalOpen(false); }}
              title="Selecionar zona no mapa"
              className={cn(
                "shrink-0 p-1.5 rounded-lg transition-colors",
                activeBBox
                  ? "text-brand bg-brand/10"
                  : "text-faint hover:text-navy hover:bg-warm"
              )}
            >
              <Search size={15} />
            </button>
          </div>

          {/* Sugestões de texto */}
          {localOpen && localFiltrado.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-xl border border-border z-[100] overflow-hidden">
              {/* Opção "selecionar no mapa" sempre visível */}
              <button
                onMouseDown={() => { setMapPickerOpen(true); setLocalOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-navy hover:bg-navy/5 border-b border-border transition-colors text-left"
              >
                <MapPin size={14} className="text-brand shrink-0" />
                Selecionar zona no mapa…
              </button>
              {localFiltrado.slice(0, 5).map((l) => (
                <button
                  key={l}
                  onMouseDown={() => { setLocal(l); setLocalOpen(false); setActiveBBox(null); }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-ink hover:bg-warm transition-colors text-left"
                >
                  <MapPin size={14} className="text-faint shrink-0" />
                  {l}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Divider ── */}
        <div className="w-px bg-border self-stretch my-3" />

        {/* ── Tipo de imóvel (multi-select) ── */}
        <div className="relative flex items-center">
          <MultiSelect
            label="Tipo de imóvel"
            placeholder="Todos os tipos"
            options={TIPOS_IMOVEL}
            selected={tiposImovel}
            onChange={setTiposImovel}
            minWidth="min-w-[148px]"
          />
        </div>

        {/* ── Divider ── */}
        <div className="w-px bg-border self-stretch my-3" />

        {/* ── Quartos (multi-select) ── */}
        <div className="relative flex items-center">
          <MultiSelect
            label="Quartos"
            placeholder="Todos"
            options={QUARTOS_OPTS}
            selected={quartos}
            onChange={setQuartos}
            minWidth="min-w-[118px]"
          />
        </div>

        {/* ── Pesquisar ── */}
        <div className="p-2 flex items-center">
          <Button
            variant="primary"
            size="lg"
            onClick={handleSearch}
            className="rounded-xl px-8 gap-2 h-full"
          >
            <Search size={18} aria-hidden="true" />
            Pesquisar
          </Button>
        </div>
      </div>

      {/* Filtros avançados */}
      <div className="mt-2 flex justify-center">
        <button
          onClick={() => setFiltrosOpen(!filtrosOpen)}
          className="flex items-center gap-1.5 text-xs text-white/60 hover:text-white transition-colors font-sans"
        >
          <SlidersHorizontal size={13} />
          {filtrosOpen ? "Menos filtros" : "Filtros avançados"}
          <ChevronDown size={12} className={cn("transition-transform", filtrosOpen && "rotate-180")} />
        </button>
      </div>

      {/* Modal picker de localização */}
      {mapPickerOpen && (
        <LocationPickerModal
          initialValue={local}
          onSelect={handleLocationSelect}
          onClose={() => setMapPickerOpen(false)}
        />
      )}

      {filtrosOpen && (
        <div className="mt-2 bg-white/10 backdrop-blur-sm rounded-xl p-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Preço mínimo (€)", key: "min", val: minPreco, set: setMinPreco, ph: "0"            },
            { label: "Preço máximo (€)", key: "max", val: maxPreco, set: setMaxPreco, ph: "Sem limite"   },
          ].map((f) => (
            <div key={f.key} className="flex flex-col gap-1">
              <label className="text-[10px] font-sans font-semibold uppercase tracking-wider text-white/60">
                {f.label}
              </label>
              <input
                type="number"
                value={f.val}
                onChange={(e) => f.set(e.target.value)}
                placeholder={f.ph}
                className="bg-white/10 text-white placeholder:text-white/30 rounded-lg px-3 py-2 text-sm outline-none border border-white/10 focus:border-brand"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
