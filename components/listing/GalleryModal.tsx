"use client";

import * as React from "react";
import Image from "next/image";
import {
  X, ChevronLeft, ChevronRight, Share2, Heart,
  Camera, MapPin, ZoomIn, ZoomOut, Maximize2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/utils";

export interface GallerySlide { url: string; alt?: string }

interface Props {
  slides: GallerySlide[];
  initialIndex?: number;
  title: string;
  price: number;
  listingType: "sale" | "rent";
  details?: string;           // ex: "105 m² | T3 | 3º andar com elevador"
  onClose: () => void;
  onContactClick?: () => void;
}

export function GalleryModal({
  slides, initialIndex = 0, title, price, listingType,
  details, onClose, onContactClick,
}: Props) {
  const [idx, setIdx]     = React.useState(initialIndex);
  const [zoom, setZoom]   = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  const total = slides.length;

  const prev = () => setIdx((i) => (i - 1 + total) % total);
  const next = () => setIdx((i) => (i + 1) % total);

  // Teclado
  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowLeft")  prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Escape")     onClose();
      if (e.key === "+" || e.key === "=") setZoom(true);
      if (e.key === "-")          setZoom(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Bloqueia scroll da página
  React.useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // Reset zoom ao mudar de foto
  React.useEffect(() => { setZoom(false); }, [idx]);

  const suffix = listingType === "rent" ? "/mês" : "";
  const current = slides[idx];

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col bg-[#1a1a1a]"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      {/* ── HEADER ─────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 md:px-6 py-3 bg-white border-b border-border shrink-0 z-10">
        {/* Info do imóvel */}
        <div className="min-w-0 mr-4">
          <p className="font-sans font-semibold text-sm text-ink truncate leading-tight">
            {title}
          </p>
          <p className="font-sans text-xs text-muted mt-0.5 truncate">
            <span className="font-semibold text-ink">{formatPrice(price, suffix)}</span>
            {details && <span className="ml-2">{details}</span>}
          </p>
        </div>

        {/* Acções */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-sans font-medium text-ink hover:bg-warm transition-colors"
            title="Partilhar"
          >
            <Share2 size={14} />
            <span className="hidden md:inline">Partilhar</span>
          </button>

          <button
            onClick={() => setSaved(!saved)}
            className={cn(
              "hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-sans font-medium transition-colors",
              saved
                ? "border-brand bg-brand/5 text-brand"
                : "border-border text-ink hover:bg-warm"
            )}
            title="Guardar favorito"
          >
            <Heart size={14} className={saved ? "fill-brand" : ""} />
            <span className="hidden md:inline">Guardar favorito</span>
          </button>

          {onContactClick && (
            <button
              onClick={onContactClick}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-brand text-white text-xs font-sans font-semibold hover:bg-brand/90 transition-colors"
            >
              Contactar
            </button>
          )}

          <button
            onClick={onClose}
            className="ml-1 p-2 rounded-lg hover:bg-warm transition-colors"
            title="Fechar (Esc)"
            aria-label="Fechar galeria"
          >
            <X size={18} className="text-ink" />
          </button>
        </div>
      </div>

      {/* ── FOTO PRINCIPAL ──────────────────────────────────────────────── */}
      <div className="flex-1 relative overflow-hidden flex items-center justify-center">
        {/* Imagem */}
        <div
          className={cn(
            "relative w-full h-full transition-transform duration-200 ease-out",
            zoom ? "scale-[2] cursor-zoom-out" : "cursor-zoom-in"
          )}
          onClick={() => setZoom(!zoom)}
          title={zoom ? "Clique para reduzir" : "Clique para ampliar"}
        >
          {current && (
            <Image
              key={idx}
              src={current.url}
              alt={current.alt ?? title}
              fill
              className="object-contain"
              sizes="100vw"
              priority
              draggable={false}
            />
          )}
        </div>

        {/* Seta ANTERIOR */}
        <button
          onClick={(e) => { e.stopPropagation(); prev(); }}
          className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-white transition-colors z-10"
          aria-label="Foto anterior"
        >
          <ChevronLeft size={22} className="text-ink" />
        </button>

        {/* Seta SEGUINTE */}
        <button
          onClick={(e) => { e.stopPropagation(); next(); }}
          className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-white transition-colors z-10"
          aria-label="Próxima foto"
        >
          <ChevronRight size={22} className="text-ink" />
        </button>
      </div>

      {/* ── BARRA INFERIOR ──────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 md:px-6 py-3 bg-white border-t border-border shrink-0 z-10">
        {/* Contador */}
        <div>
          <p className="font-sans text-[10px] font-semibold text-muted uppercase tracking-wider leading-none mb-0.5">
            Vistas
          </p>
          <p className="font-sans text-sm font-semibold text-ink">
            {idx + 1}/{total}
          </p>
        </div>

        {/* Centro: botões fotos + mapa */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {}}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-ink text-white text-xs font-sans font-semibold hover:bg-ink/80 transition-colors"
          >
            <Camera size={13} />
            {total} fotos
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-sans font-medium text-ink hover:bg-warm transition-colors">
            <MapPin size={13} />
            Mapa
          </button>
        </div>

        {/* Ampliar / Reduzir */}
        <button
          onClick={() => setZoom(!zoom)}
          className="flex items-center gap-1.5 text-xs font-sans font-medium text-navy hover:underline"
        >
          {zoom
            ? <><ZoomOut size={14} /> Reduzir foto</>
            : <><Maximize2 size={14} /> Ampliar foto</>
          }
        </button>
      </div>
    </div>
  );
}
