"use client";

import * as React from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { Grid2x2, X } from "lucide-react";
import type { PropertyImage } from "@/types/property";

const Lightbox = dynamic(() => import("yet-another-react-lightbox"), { ssr: false });

interface Props {
  images: PropertyImage[];
  title: string;
}

export function PropertyGallery({ images, title }: Props) {
  const [lightboxOpen, setLightboxOpen] = React.useState(false);
  const [lightboxIndex, setLightboxIndex] = React.useState(0);

  const cover = images.find((i) => i.isCover) ?? images[0];
  const sides  = images.filter((i) => !i.isCover).slice(0, 2);
  const total  = images.length;

  const slides = images.map((img) => ({ src: img.url, alt: title }));

  function openAt(idx: number) { setLightboxIndex(idx); setLightboxOpen(true); }

  if (!images.length) {
    return (
      <div className="w-full aspect-[16/7] rounded-xl bg-warm-dark flex items-center justify-center">
        <span className="font-serif text-faint text-lg">Sem fotos disponíveis</span>
      </div>
    );
  }

  return (
    <>
      {/* Mosaic layout */}
      <div className="grid grid-cols-3 gap-2 h-[420px] rounded-xl overflow-hidden">
        {/* Main photo */}
        <div
          className="col-span-2 relative cursor-pointer group"
          onClick={() => openAt(0)}
        >
          <Image
            src={cover.url}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            priority
            sizes="(max-width: 768px) 100vw, 65vw"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
        </div>

        {/* Side photos */}
        <div className="flex flex-col gap-2">
          {sides.map((img, idx) => (
            <div
              key={img.id}
              className="relative flex-1 cursor-pointer group overflow-hidden"
              onClick={() => openAt(idx + 1)}
            >
              <Image
                src={img.url}
                alt={`${title} — foto ${idx + 2}`}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                sizes="33vw"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
              {/* Overlay "ver todas" na última foto */}
              {idx === 1 && total > 3 && (
                <div
                  className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-1 cursor-pointer"
                  onClick={() => openAt(0)}
                >
                  <Grid2x2 size={22} className="text-white" />
                  <span className="text-white text-sm font-sans font-semibold">
                    Ver todas as {total} fotos
                  </span>
                </div>
              )}
            </div>
          ))}
          {/* Botão ver todas se só 1 foto lateral */}
          {sides.length < 2 && total > 0 && (
            <button
              onClick={() => openAt(0)}
              className="flex-1 flex flex-col items-center justify-center gap-2 bg-warm-dark hover:bg-warm border border-border rounded-lg transition-colors"
            >
              <Grid2x2 size={20} className="text-muted" />
              <span className="text-xs font-sans text-muted">Ver todas</span>
            </button>
          )}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <Lightbox
          open={lightboxOpen}
          close={() => setLightboxOpen(false)}
          index={lightboxIndex}
          slides={slides}
        />
      )}
    </>
  );
}
