"use client";

import * as React from "react";
import { Minus, Plus } from "lucide-react";
import { usePublishStore } from "./usePublishStore";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const CONDITIONS = [
  { value: "new",                label: "Novo"             },
  { value: "used",               label: "Usado"            },
  { value: "needs_renovation",   label: "Para recuperar"   },
  { value: "under_construction", label: "Em construção"    },
];

const ENERGY = ["A+","A","B","B-","C","D","E","F","exempt"] as const;

const FEATURES_LIST = [
  "Garagem","Elevador","Piscina","Jardim","Varanda","Terraço",
  "Arrecadação","Ar condicionado","Aquecimento central",
  "Video-porteiro","Mobilado","Cozinha equipada",
  "Animais permitidos","Lareira","Porteiro",
];

const ENERGY_COLORS: Record<string, string> = {
  "A+":"bg-green-600","A":"bg-green-500","B":"bg-lime-500","B-":"bg-yellow-400",
  "C":"bg-amber-400","D":"bg-orange-400","E":"bg-red-400","F":"bg-red-600","exempt":"bg-gray-400",
};

function Counter({ label, value, onChange, min = 0, max = 10 }:
  { label: string; value: number; onChange: (v: number) => void; min?: number; max?: number }) {
  return (
    <div className="flex items-center justify-between bg-white border border-border rounded-xl px-4 py-3">
      <span className="font-sans text-sm text-ink">{label}</span>
      <div className="flex items-center gap-3">
        <button
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-ink hover:border-navy disabled:opacity-30 transition-colors"
        >
          <Minus size={14} />
        </button>
        <span className="font-sans font-semibold text-base w-6 text-center">{value}</span>
        <button
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-ink hover:border-navy disabled:opacity-30 transition-colors"
        >
          <Plus size={14} />
        </button>
      </div>
    </div>
  );
}

export function Step3Details() {
  const { data, setField, setStep } = usePublishStore();
  const [titleLen, setTitleLen] = React.useState(data.title.length);
  const [descLen, setDescLen] = React.useState(data.description.length);

  const toggleFeature = (f: string) =>
    setField("features", data.features.includes(f)
      ? data.features.filter((x) => x !== f)
      : [...data.features, f]
    );

  const canContinue = data.title.length >= 10 && data.description.length >= 50 && Number(data.price.replace(/\./g, "").replace(",", ".")) > 0;

  return (
    <div className="space-y-6">
      <h2 className="font-sans font-semibold text-base text-ink">Detalhes do imóvel</h2>

      {/* Título */}
      <div>
        <div className="flex justify-between mb-1">
          <label className="text-xs font-sans font-semibold uppercase tracking-wider text-faint">Título do anúncio</label>
          <span className={cn("text-xs font-sans", titleLen > 90 ? "text-red-500" : "text-faint")}>{titleLen}/100</span>
        </div>
        <input
          value={data.title}
          onChange={(e) => { setField("title", e.target.value); setTitleLen(e.target.value.length); }}
          maxLength={100}
          placeholder="ex: Apartamento T2 renovado com varanda em Campo de Ourique"
          className="w-full rounded-lg border border-border px-4 py-3 text-sm font-sans text-ink placeholder:text-faint outline-none focus:border-navy transition-colors"
          style={{ fontSize: "1rem" }}
        />
        {data.title.length > 0 && data.title.length < 10 && (
          <p className="text-xs text-red-500 mt-1">Mínimo 10 caracteres</p>
        )}
      </div>

      {/* Descrição */}
      <div>
        <div className="flex justify-between mb-1">
          <label className="text-xs font-sans font-semibold uppercase tracking-wider text-faint">Descrição</label>
          <span className={cn("text-xs font-sans", descLen > 1900 ? "text-red-500" : "text-faint")}>{descLen}/2000</span>
        </div>
        <textarea
          value={data.description}
          onChange={(e) => { setField("description", e.target.value); setDescLen(e.target.value.length); }}
          rows={5}
          maxLength={2000}
          placeholder="Descreva o imóvel: localização, características, renovações recentes, pontos de interesse próximos..."
          className="w-full rounded-lg border border-border px-4 py-3 text-sm font-sans text-ink placeholder:text-faint outline-none focus:border-navy transition-colors resize-none"
          style={{ fontSize: "1rem" }}
        />
        {data.description.length > 0 && data.description.length < 50 && (
          <p className="text-xs text-red-500 mt-1">Mínimo 50 caracteres</p>
        )}
      </div>

      {/* Preço */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-sans font-semibold uppercase tracking-wider text-faint block mb-1">
            Preço (€) {data.listingType === "rent" ? "/ mês" : ""}
          </label>
          <input
            type="text"
            inputMode="numeric"
            value={data.price}
            onChange={(e) => {
              // Permite dígitos, pontos e vírgulas (separadores de milhares PT)
              const raw = e.target.value.replace(/[^\d.,]/g, "");
              setField("price", raw);
            }}
            placeholder={data.listingType === "rent" ? "1.200" : "250.000"}
            className="w-full rounded-lg border border-border px-4 py-3 text-sm font-sans text-ink outline-none focus:border-navy transition-colors"
            style={{ fontSize: "1rem" }}
          />
        </div>
        <div className="flex items-end pb-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={data.priceNegotiable}
              onChange={(e) => setField("priceNegotiable", e.target.checked)}
              className="w-4 h-4 accent-navy"
            />
            <span className="text-sm font-sans text-muted">Preço negociável</span>
          </label>
        </div>
      </div>

      {/* Quartos / WC */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Counter label="Quartos" value={data.bedrooms} onChange={(v) => setField("bedrooms", v)} />
        <Counter label="Casas de banho" value={data.bathrooms} onChange={(v) => setField("bathrooms", v)} />
      </div>

      {/* Áreas */}
      <div className="grid grid-cols-2 gap-4">
        <Input label="Área útil (m²)" type="number" value={data.areaUseful}
          onChange={(e) => setField("areaUseful", e.target.value)} placeholder="85" />
        <Input label="Área bruta (m²)" type="number" value={data.areaGross}
          onChange={(e) => setField("areaGross", e.target.value)} placeholder="95" />
      </div>

      {/* Andar */}
      <div className="grid grid-cols-2 gap-4">
        <Input label="Andar" type="number" value={data.floor}
          onChange={(e) => setField("floor", e.target.value)} placeholder="3" />
        <Input label="Total de andares" type="number" value={data.totalFloors}
          onChange={(e) => setField("totalFloors", e.target.value)} placeholder="6" />
      </div>

      {/* Estado */}
      <div>
        <p className="text-xs font-sans font-semibold uppercase tracking-wider text-faint mb-2">Estado</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {CONDITIONS.map((c) => (
            <button key={c.value} onClick={() => setField("condition", c.value)}
              className={cn(
                "px-3 py-2 rounded-lg text-sm font-sans font-medium border transition-all",
                data.condition === c.value
                  ? "border-navy bg-navy/5 text-navy"
                  : "border-border text-muted hover:border-navy/40"
              )}>
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Certificado energético */}
      <div>
        <p className="text-xs font-sans font-semibold uppercase tracking-wider text-faint mb-2">
          Certificado energético
        </p>
        <div className="flex flex-wrap gap-2">
          {ENERGY.map((e) => (
            <button key={e} onClick={() => setField("energyCertificate", data.energyCertificate === e ? "" : e)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-sans font-bold border-2 transition-all",
                data.energyCertificate === e
                  ? `${ENERGY_COLORS[e]} text-white border-transparent`
                  : "border-border text-muted hover:border-muted/60"
              )}>
              {e}
            </button>
          ))}
        </div>
      </div>

      {/* Features */}
      <div>
        <p className="text-xs font-sans font-semibold uppercase tracking-wider text-faint mb-2">
          Características ({data.features.length} seleccionadas)
        </p>
        <div className="flex flex-wrap gap-2">
          {FEATURES_LIST.map((f) => (
            <button key={f} onClick={() => toggleFeature(f)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-sans font-medium border transition-all",
                data.features.includes(f)
                  ? "bg-navy text-white border-navy"
                  : "border-border text-muted hover:border-navy/40"
              )}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-between pt-2">
        <Button variant="ghost" size="md" onClick={() => setStep(2)}>← Anterior</Button>
        <Button variant="primary" size="lg" disabled={!canContinue} onClick={() => setStep(4)}>
          Continuar →
        </Button>
      </div>
    </div>
  );
}
