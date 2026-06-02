"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { Map, List, SlidersHorizontal, MapPinOff, PenLine, X } from "lucide-react";
import type { BBox } from "@/components/search/ZonePickerModal";
import { ListingCard, ListingCardSkeleton } from "@/components/listing/ListingCard";
import { FiltersPanel, EMPTY_FILTERS, countActiveFilters, filtersToParams } from "@/components/listing/FiltersPanel";
import type { FilterState } from "@/components/listing/FiltersPanel";
import { usePropertySearch } from "@/hooks/usePropertySearch";
import { cn } from "@/lib/utils";
import type { PropertyType } from "@/types/property";

const PropertyMap = dynamic(
  () => import("@/components/search/PropertyMap").then((m) => m.PropertyMap),
  { ssr: false, loading: () => <MapSkeleton /> }
);

const ZonePickerModal = dynamic(
  () => import("@/components/search/ZonePickerModal").then((m) => m.ZonePickerModal),
  { ssr: false }
);

function MapSkeleton() {
  return <div className="w-full h-full bg-warm-dark rounded-xl animate-pulse" />;
}

const SORT_OPTIONS = [
  { value: "newest",     label: "Mais recentes" },
  { value: "relevance",  label: "Relevância"    },
  { value: "price_asc",  label: "Preço ↑"       },
  { value: "price_desc", label: "Preço ↓"       },
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
  const [sort, setSort]             = React.useState(initialSort);
  const [page, setPage]             = React.useState(1);
  const [activePin, setActivePin]   = React.useState<string | null>(null);
  const [mobileView, setMobileView]   = React.useState<"list" | "map">("list");
  const [mapVisible, setMapVisible]   = React.useState(true);
  const [filtersOpen, setFiltersOpen] = React.useState(false);
  const [zoneOpen, setZoneOpen]       = React.useState(false);
  const [activeBBox, setActiveBBox]   = React.useState<BBox | null>(null);
  const [filters, setFilters]       = React.useState<FilterState>(EMPTY_FILTERS);

  // Quando os filtros mudam, volta à página 1
  const handleFiltersChange = React.useCallback((f: FilterState) => {
    setFilters(f);
    setPage(1);
  }, []);

  // Monta o propertyType: URL param tem prioridade, depois o painel (1 tipo seleccionado)
  const propertyType =
    tipoImovel ||
    (filters.propertyTypes.length === 1 ? filters.propertyTypes[0] : undefined);

  const fp = filtersToParams(filters);

  const { results, total, totalPages, isLoading } = usePropertySearch({
    tipo:         listingType,
    distrito,
    propertyType: propertyType as PropertyType | undefined,
    ...fp,
    ...(activeBBox ? {
      minLat: activeBBox.minLat, maxLat: activeBBox.maxLat,
      minLng: activeBBox.minLng, maxLng: activeBBox.maxLng,
    } : {}),
    page,
    limit: 20,
    sort: sort as never,
  });

  const heading = distritoLabel
    ? tipoLabel
      ? `${tipoLabel} para ${listingType === "comprar" ? "Venda" : "Arrendamento"} em ${distritoLabel}`
      : `Imóveis em ${distritoLabel}`
    : `Imóveis para ${listingType === "comprar" ? "Comprar" : "Arrendar"}`;

  const activeFilterCount = countActiveFilters(filters);

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">

      {/* ── Barra de resultados ── */}
      <div className="bg-white border-b border-border px-4 py-3 flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          {/* Botão zona no mapa */}
          <button
            onClick={() => setZoneOpen(true)}
            className={cn(
              "hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm font-sans font-medium transition-colors shrink-0",
              activeBBox
                ? "border-brand bg-brand/5 text-brand"
                : "border-border text-muted hover:border-navy hover:text-navy"
            )}
            title="Pesquisar por zona no mapa"
          >
            <PenLine size={14} />
            <span className="hidden xl:inline">Zona no mapa</span>
          </button>

          {/* Badge zona activa + limpar */}
          {activeBBox && (
            <button
              onClick={() => { setActiveBBox(null); setPage(1); }}
              className="hidden lg:flex items-center gap-1 px-2 py-1 rounded-full bg-brand/10 border border-brand/30 text-brand text-xs font-sans font-medium hover:bg-brand/20 transition-colors"
              title="Remover filtro de zona"
            >
              Zona activa <X size={11} />
            </button>
          )}

          {/* Botão filtros (mobile) */}
          <button
            onClick={() => setFiltersOpen(true)}
            className={cn(
              "lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm font-sans font-medium transition-colors shrink-0",
              activeFilterCount > 0
                ? "border-navy bg-navy text-white"
                : "border-border text-muted hover:border-navy hover:text-navy"
            )}
          >
            <SlidersHorizontal size={14} />
            Filtros
            {activeFilterCount > 0 && (
              <span className="bg-white text-navy text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>

          <h1 className="font-sans font-semibold text-sm text-ink truncate">
            {isLoading
              ? "A pesquisar..."
              : `${total.toLocaleString("pt-PT")} imóve${total !== 1 ? "is" : "l"} — ${heading}`}
          </h1>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <select
            value={sort}
            onChange={(e) => { setSort(e.target.value); setPage(1); }}
            className="text-sm font-sans text-muted border border-border rounded-lg px-3 py-1.5 outline-none bg-white hover:border-navy cursor-pointer"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>

          {/* Toggle mapa (desktop) */}
          <button
            onClick={() => setMapVisible(!mapVisible)}
            className={cn(
              "hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm font-sans font-medium transition-colors",
              mapVisible
                ? "border-border text-muted hover:border-navy hover:text-navy"
                : "border-navy bg-navy text-white"
            )}
            title={mapVisible ? "Ocultar mapa" : "Mostrar mapa"}
          >
            {mapVisible ? <MapPinOff size={14} /> : <Map size={14} />}
            <span className="hidden xl:inline">{mapVisible ? "Ocultar mapa" : "Mostrar mapa"}</span>
          </button>

          {/* Toggle lista/mapa (mobile) */}
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

        {/* ── Painel de filtros (desktop sidebar + mobile drawer) ── */}
        <FiltersPanel
          filters={filters}
          onChange={handleFiltersChange}
          listingType={listingType}
          open={filtersOpen}
          onClose={() => setFiltersOpen(false)}
        />

        {/* ── Lista de resultados ── */}
        <div className={cn(
          "overflow-y-auto bg-warm",
          mapVisible ? "lg:w-[42%] lg:block" : "lg:flex-1 lg:block",
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
                  <p className="text-sm text-muted max-w-xs font-sans">
                    Não encontrámos imóveis para os filtros seleccionados.{" "}
                    {activeFilterCount > 0 && (
                      <button
                        onClick={() => handleFiltersChange(EMPTY_FILTERS)}
                        className="text-brand underline"
                      >
                        Limpar filtros
                      </button>
                    )}
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
            <div className="flex justify-center gap-2 pb-6 flex-wrap px-4">
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

        {/* ── Mapa ── */}
        {mapVisible && (
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
        )}
      </div>

      {/* ── Zone Picker Modal ── */}
      {zoneOpen && (
        <ZonePickerModal
          currentProperties={results as never}
          initialCenter={
            results[0]?.lat && results[0]?.lng
              ? [parseFloat(String(results[0].lat)), parseFloat(String(results[0].lng))]
              : undefined
          }
          onApply={(bbox) => {
            setActiveBBox(bbox);
            setPage(1);
            setZoneOpen(false);
          }}
          onClose={() => setZoneOpen(false)}
        />
      )}
    </div>
  );
}
