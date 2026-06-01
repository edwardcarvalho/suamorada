"use client";

import * as React from "react";
import { MapPin } from "lucide-react";
import { usePublishStore } from "./usePublishStore";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

const CP_REGEX = /^\d{4}-\d{3}$/;

const DISTRITO_MAP: Record<string, string> = {
  "1": "Lisboa",   "2": "Lisboa",   "3": "Setúbal",  "4": "Setúbal",
  "5": "Setúbal",  "6": "Santarém", "7": "Santarém",  "8": "Faro",
  "2700": "Lisboa","2750": "Lisboa","1000": "Lisboa",  "1100": "Lisboa",
  "1200": "Lisboa","1300": "Lisboa","1400": "Lisboa",  "1500": "Lisboa",
  "1600": "Lisboa","1700": "Lisboa","1800": "Lisboa",  "1900": "Lisboa",
  "4000": "Porto", "4100": "Porto", "4200": "Porto",   "4300": "Porto",
  "4400": "Porto", "4450": "Porto", "4460": "Porto",   "4470": "Porto",
  "4700": "Braga", "4710": "Braga", "4715": "Braga",   "4720": "Braga",
};

function guessDistrito(cp: string): string {
  const prefix4 = cp.slice(0, 4);
  const prefix1 = cp.slice(0, 1);
  return DISTRITO_MAP[prefix4] ?? DISTRITO_MAP[prefix1] ?? "";
}

export function Step2Location() {
  const { data, setField, setData, setStep } = usePublishStore();
  const [cpError, setCpError] = React.useState("");

  function handleCP(val: string) {
    setField("addressPostalCode", val);
    if (CP_REGEX.test(val)) {
      setCpError("");
      const distrito = guessDistrito(val);
      if (distrito) setField("addressDistrict", distrito);
    } else if (val.length === 8) {
      setCpError("Formato inválido (ex: 1350-119)");
    }
  }

  const canContinue = data.addressMunicipality.length > 1 && data.addressDistrict.length > 1;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-sans font-semibold text-base text-ink mb-1">
          Onde fica o imóvel?
        </h2>
        <p className="text-sm text-muted font-sans mb-5">
          A localização exacta só é partilhada depois de confirmado o interesse.
        </p>
      </div>

      {/* Morada */}
      <Input
        label="Morada (rua e número)"
        value={data.addressStreet}
        onChange={(e) => setField("addressStreet", e.target.value)}
        placeholder="Rua Ferreira Borges, 24"
      />

      {/* Código postal + cidade */}
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Código Postal"
          value={data.addressPostalCode}
          onChange={(e) => handleCP(e.target.value)}
          placeholder="0000-000"
          maxLength={8}
          error={cpError}
          hint="Preenchimento automático do distrito"
        />
        <Input
          label="Cidade / Município"
          value={data.addressMunicipality}
          onChange={(e) => setField("addressMunicipality", e.target.value)}
          placeholder="Lisboa"
        />
      </div>

      {/* Freguesia + Distrito */}
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Freguesia"
          value={data.addressParish}
          onChange={(e) => setField("addressParish", e.target.value)}
          placeholder="Campo de Ourique"
        />
        <Input
          label="Distrito"
          value={data.addressDistrict}
          onChange={(e) => setField("addressDistrict", e.target.value)}
          placeholder="Lisboa"
        />
      </div>

      {/* Mapa placeholder de confirmação */}
      <div>
        <p className="text-xs font-sans font-semibold uppercase tracking-wider text-faint mb-2">
          Confirmar localização no mapa
        </p>
        <div className="h-52 bg-warm-dark rounded-xl border border-border flex items-center justify-center relative overflow-hidden">
          {/* Grid simulado */}
          <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1B3A5C" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
          {/* Road lines */}
          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <line x1="0" y1="104" x2="100%" y2="104" stroke="white" strokeWidth="6" strokeOpacity="0.4"/>
            <line x1="50%" y1="0" x2="50%" y2="100%" stroke="white" strokeWidth="4" strokeOpacity="0.3"/>
            <line x1="0" y1="160" x2="100%" y2="60" stroke="white" strokeWidth="3" strokeOpacity="0.2"/>
          </svg>
          {/* Pin */}
          <div className="relative z-10 flex flex-col items-center">
            <div className="bg-white rounded-lg px-3 py-1.5 shadow-md mb-1 text-xs font-sans font-semibold text-navy">
              {data.addressMunicipality || "A sua morada"}
            </div>
            <div className="w-10 h-10 bg-brand rounded-full flex items-center justify-center shadow-lg">
              <MapPin size={20} className="text-white" />
            </div>
          </div>
        </div>
        <p className="text-xs text-faint font-sans mt-1.5 flex items-center gap-1">
          <span>ℹ️</span> Mapa interactivo disponível após ligar a base de dados
        </p>
      </div>

      {/* Privacidade */}
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={data.hideExactAddress}
          onChange={(e) => setField("hideExactAddress", e.target.checked)}
          className="mt-0.5 w-4 h-4 accent-navy rounded"
        />
        <span className="text-sm font-sans text-muted">
          Não mostrar morada exacta no anúncio (mostrar localização aproximada por privacidade)
        </span>
      </label>

      {/* Navegação */}
      <div className="flex justify-between pt-2">
        <Button variant="ghost" size="md" onClick={() => setStep(1)}>← Anterior</Button>
        <Button variant="primary" size="lg" disabled={!canContinue} onClick={() => setStep(3)}>
          Continuar →
        </Button>
      </div>
    </div>
  );
}
