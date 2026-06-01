"use client";

import { usePublishStore } from "./usePublishStore";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const LISTING_TYPES = [
  { value: "sale", label: "Vender",   desc: "Colocar o imóvel à venda",      icon: "🏷️" },
  { value: "rent", label: "Arrendar", desc: "Arrendar o imóvel a inquilinos", icon: "🔑" },
] as const;

const PROPERTY_TYPES = [
  { value: "apartment",  label: "Apartamento", icon: "🏢" },
  { value: "house",      label: "Moradia",     icon: "🏠" },
  { value: "villa",      label: "Vivenda",     icon: "🏡" },
  { value: "commercial", label: "Comercial",   icon: "🏪" },
  { value: "land",       label: "Terreno",     icon: "🌳" },
  { value: "garage",     label: "Garagem",     icon: "🚗" },
] as const;

export function Step1Type() {
  const { data, setField, setStep } = usePublishStore();

  const canContinue = data.listingType !== "" && data.propertyType !== "";

  return (
    <div className="space-y-8">
      {/* Tipo de anúncio */}
      <section>
        <h2 className="font-sans font-semibold text-base text-ink mb-4">
          O que pretende fazer?
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {LISTING_TYPES.map((t) => (
            <button
              key={t.value}
              onClick={() => setField("listingType", t.value)}
              className={cn(
                "p-5 rounded-xl border-2 text-left transition-all",
                data.listingType === t.value
                  ? "border-navy bg-navy/5 shadow-sm"
                  : "border-border hover:border-navy/40 bg-white"
              )}
            >
              <span className="text-3xl mb-2 block">{t.icon}</span>
              <p className="font-sans font-semibold text-ink">{t.label}</p>
              <p className="text-xs text-muted font-sans mt-0.5">{t.desc}</p>
            </button>
          ))}
        </div>
      </section>

      {/* Tipo de imóvel */}
      <section>
        <h2 className="font-sans font-semibold text-base text-ink mb-4">
          Tipo de imóvel
        </h2>
        <div className="grid grid-cols-3 gap-3">
          {PROPERTY_TYPES.map((t) => (
            <button
              key={t.value}
              onClick={() => {
                setField("propertyType", t.value);
                // Auto-avança se listingType já seleccionado
                if (data.listingType !== "") setTimeout(() => setStep(2), 200);
              }}
              className={cn(
                "p-4 rounded-xl border-2 text-center transition-all",
                data.propertyType === t.value
                  ? "border-brand bg-brand/5 shadow-sm"
                  : "border-border hover:border-brand/40 bg-white"
              )}
            >
              <span className="text-2xl mb-1.5 block">{t.icon}</span>
              <p className={cn(
                "font-sans text-sm font-medium",
                data.propertyType === t.value ? "text-brand" : "text-ink"
              )}>
                {t.label}
              </p>
            </button>
          ))}
        </div>
      </section>

      <div className="flex justify-end pt-2">
        <Button
          variant="primary"
          size="lg"
          disabled={!canContinue}
          onClick={() => setStep(2)}
        >
          Continuar →
        </Button>
      </div>
    </div>
  );
}
