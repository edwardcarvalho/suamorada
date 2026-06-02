"use client";

import * as React from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { ChevronLeft, ChevronRight, Camera } from "lucide-react";
import type { PropertyImage } from "@/types/property";

const GalleryModal = dynamic(
  () => import("./GalleryModal").then((m) => m.GalleryModal),
  { ssr: false }
);

interface Props {
  images: PropertyImage[];
  title: string;
  price?: number;
  listingType?: "sale" | "rent";
  details?: string;
}

export function PropertyGallery({ images, title, price = 0, listingType = "sale", details }: Props) {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [idx, setIdx]             = React.useState(0);
  const total = images.length;

  function openAt(i: number) { setIdx(i); setModalOpen(true); }
  const prev = (e: React.MouseEvent) => { e.stopPropagation(); setIdx((i) => (i - 1 + total) % total); };
  const next = (e: React.MouseEvent) => { e.stopPropagation(); setIdx((i) => (i + 1) % total); };

  if (!total) {
    return (
      <div className="w-full h-[420px] rounded-xl bg-warm-dark flex items-center justify-center">
        <span className="font-serif text-faint text-lg">Sem fotos disponíveis</span>
      </div>
    );
  }

  const slides = images.map((img) => ({ url: img.url, alt: title }));
  const current = images[idx];

  return (
    <>
      {/* ── Galeria inline ── */}
      <div
        className="relative w-full h-[420px] rounded-xl overflow-hidden bg-warm-dark cursor-pointer group select-none"
        onClick={() => openAt(idx)}
      >
        <Image
          src={current.url}
          alt={title}
          fill
          priority
          className="object-cover transition-transform duration-300 group-hover:scale-[1.01]"
          sizes="(max-width: 768px) 100vw, 80vw"
        />

        {/* Gradientes para legibilidade dos botões */}
        <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-black/20 to-transparent" />
        <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-black/20 to-transparent" />

        {/* Seta anterior */}
        {total > 1 && (
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/85 backdrop-blur-sm flex items-center justify-center shadow hover:bg-white transition-colors opacity-0 group-hover:opacity-100"
            aria-label="Foto anterior"
          >
            <ChevronLeft size={20} className="text-ink" />
          </button>
        )}

        {/* Seta seguinte */}
        {total > 1 && (
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/85 backdrop-blur-sm flex items-center justify-center shadow hover:bg-white transition-colors opacity-0 group-hover:opacity-100"
            aria-label="Próxima foto"
          >
            <ChevronRight size={20} className="text-ink" />
          </button>
        )}

        {/* Badge contador inferior-direito */}
        <button
          onClick={(e) => { e.stopPropagation(); openAt(idx); }}
          className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm text-white text-xs font-sans font-semibold px-3 py-1.5 rounded-full hover:bg-black/80 transition-colors"
        >
          <Camera size={13} />
          {idx + 1} / {total}
        </button>

        {/* Dots indicadores (máx. 8) */}
        {total > 1 && total <= 12 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setIdx(i); }}
                className={`w-1.5 h-1.5 rounded-full transition-all ${i === idx ? "bg-white scale-125" : "bg-white/50"}`}
                aria-label={`Foto ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Modal fullscreen (Idealista-style) ── */}
      {modalOpen && (
        <GalleryModal
          slides={slides}
          initialIndex={idx}
          title={title}
          price={price}
          listingType={listingType}
          details={details}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
}
