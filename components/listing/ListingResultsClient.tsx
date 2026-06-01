"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { Map, List, SlidersHorizontal, X } from "lucide-react";
import { ListingCard, ListingCardSkeleton } from "@/components/listing/ListingCard";
import { usePropertySearch } from "@/hooks/usePropertySearch";
import { cn } from "@/lib/utils";
import type { PropertyType } from "@/types/property";

const PropertyMap = dynamic(
  () => import("@/components/search/PropertyMap").then((m) => m.PropertyMap),
  { ssr: false, loading: () => <MapSkeleton /> }
);

function MapSkeleton() {
  return <div className="w-full h-full bg-warm-dark rounded-xl animate-pulse" />;
}

const SORT_OPTIONS = [
  { value: "newest",    label: "Mais recentes"  },
  { value: "relevance", label: "Relevância"     },
  { value: "price_asc", label: "Preço ↑"        },
  { value: "price_desc","label": "Preço ↓"      },
] as const;

interface Props {
  listingType: "comprar" | "arrendar";
  distrito?: string;
  tipoImovel?: string;
  distritoLabel?: string;
  tipoLabel?: string;
  initialSort?: string;
}

export function ListingResultsClient({
  listingType, distrito, tipoImovel, distritoLabel, tipoLabel, initialSort = "newest",
}: Props) {
  const [sort, setSort]         = React.useState(initialSort);
  const [page, setPage]         = React.useState(1);
  const [activePin, setActivePin] = React.useState<string | null>(null);
  const [mobileView, setMobileView] = React.useState<"list" | "map">("list");

  const { results, total, totalPages, isLoading } = usePropertySearch({
    tipo:         listingType,
    distrito,
    propertyType: tipoImovel as PropertyType | undefined,
    page,
    limit:        20,
    sort:         sort as never,
  });

  const heading = distritoLabel
    ? tipoLabel
      ? `${tipoLabel} para ${listingType === "comprar" ? "Venda" : "Arrendamento"} em ${distritoLabel}`
      : `Imóveis em ${distritoLabel}`
    : `Imóveis para ${listingType === "comprar" ? "Comprar" : "Arrendar"}`;

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      {/* ── Barra de resultados ── */}
      <div className="bg-white border-b border-border px-6 py-3 flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <h1 className="font-sans font-semibold text-sm text-ink truncate">
            {isLoading
              ? "A pesquisar..."
              : `${total.toLocaleString("pt-PT")} imóve${total !== 1 ? "is" : "l"} — ${heading}`}
          </h1>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => { setSort(e.target.value); setPage(1); }}
            className="text-sm font-sans text-muted border border-border rounded-lg px-3 py-1.5 outline-none bg-white hover:border-navy cursor-pointer"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>

          {/* Mobile toggle */}
          <div className="flex lg:hidden border border-border rounded-lg overflow-hidden">
            <button
              onClick={() => setMobileView("list")}
              className={cn("px-3 py-1.5 text-sm flex items-center gap-1.5",
                mobileView === "list" ? "bg-navy text-white" : "text-muted hover:bg-warm")}
            >
              <List size={14} /> Lista
            </button>
            <button
              onClick={() => setMobileView("map")}
              className={cn("px-3 py-1.5 text-sm flex items-center gap-1.5",
                mobileView === "map" ? "bg-navy text-white" : "text-muted hover:bg-warm")}
            >
              <Map size={14} /> Mapa
            </button>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* Lista */}
        <div className={cn(
          "overflow-y-auto bg-warm",
          "lg:w-[42%] lg:block",
          mobileView === "list" ? "flex-1" : "hidden lg:block"
        )}>
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => <ListingCardSkeleton key={i} />)
              : results.length === 0
              ? (
                <div className="col-span-full flex flex-col items-center justify-center py-24 gap-3 text-center">
                  <span className="text-4xl">🏠</span>
                  <p className="font-serif text-xl text-ink">Sem resultados</p>
                  <p className="text-sm text-muted max-w-xs">
                    Não encontrámos imóveis para os filtros seleccionados. Tente alargar a pesquisa.
                  </p>
                </div>
              )
              : results.map((p, idx) => (
                <ListingCard
                  key={p.id}
                  property={p as never}
                  priority={idx < 4}
                  activePin={activePin === p.id}
                  onMouseEnter={() => setActivePin(p.id)}
                  onMouseLeave={() => setActivePin(null)}
                />
              ))
            }
          </div>

          {/* Paginação */}
          {totalPages > 1 && !isLoading && (
            <div className="flex justify-center gap-2 pb-6">
              {Array.from({ length: Math.min(totalPages, 7) }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setPage(i + 1); window.scrollTo(0, 0); }}
                  className={cn(
                    "w-9 h-9 rounded-lg text-sm font-sans font-medium transition-colors",
                    page === i + 1
                      ? "bg-navy text-white"
                      : "bg-white text-muted border border-border hover:border-navy hover:text-navy"
                  )}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Mapa */}
        <div className={cn(
          "lg:flex-1 lg:block",
          mobileView === "map" ? "flex-1" : "hidden lg:block",
          "p-3"
        )}>
          <PropertyMap
            properties={results as never}
            activePinId={activePin}
            onPinClick={setActivePin}
            className="w-full h-full"
          />
        </div>
      </div>
    </div>
  );
}
