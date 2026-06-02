"use client";

import * as React from "react";
import { MapPin } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { Property } from "@/types/property";

/* Leaflet carregado via dynamic import — evita erros de SSR */
import dynamic from "next/dynamic";

const LeafletMap = dynamic(() => import("./LeafletMap").then((m) => m.LeafletMap), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-warm-dark rounded-xl flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-navy border-t-transparent rounded-full animate-spin" />
    </div>
  ),
});

export interface PropertyMapProps {
  properties: Property[];
  activePinId?: string | null;
  onPinClick?: (id: string) => void;
  className?: string;
}

export function PropertyMap(props: PropertyMapProps) {
  return <LeafletMap {...props} />;
}
