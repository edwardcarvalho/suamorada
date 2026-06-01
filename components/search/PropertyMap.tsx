"use client";

import * as React from "react";
import { MapPin } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { Property } from "@/types/property";

interface PropertyMapProps {
  properties: Property[];
  activePinId?: string | null;
  onPinClick?: (id: string) => void;
  className?: string;
}

/* Mapbox carregado via dynamic import para evitar SSR */
let mapboxgl: typeof import("mapbox-gl") | null = null;

export function PropertyMap({ properties, activePinId, onPinClick, className }: PropertyMapProps) {
  const mapContainer = React.useRef<HTMLDivElement>(null);
  const mapRef = React.useRef<import("mapbox-gl").Map | null>(null);
  const markersRef = React.useRef<Map<string, import("mapbox-gl").Marker>>(new Map());
  const [loaded, setLoaded] = React.useState(false);
  const [error, setError] = React.useState(false);

  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  React.useEffect(() => {
    if (!token || !mapContainer.current || mapRef.current) return;

    import("mapbox-gl").then((mb) => {
      mapboxgl = mb;
      mb.default.accessToken = token;

      const map = new mb.default.Map({
        container: mapContainer.current!,
        style: "mapbox://styles/mapbox/light-v11",
        center: [-9.1393, 38.7223],
        zoom: 11,
        attributionControl: false,
      });

      map.addControl(new mb.default.NavigationControl({ showCompass: false }), "top-right");

      map.on("load", () => {
        setLoaded(true);
        mapRef.current = map;
      });
    }).catch(() => setError(true));

    return () => {
      markersRef.current.forEach((m) => m.remove());
      markersRef.current.clear();
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [token]);

  // Adicionar/actualizar pins quando propriedades mudam
  React.useEffect(() => {
    const map = mapRef.current;
    const mb = mapboxgl;
    if (!map || !loaded || !mb) return;

    // Remover pins antigos
    markersRef.current.forEach((m) => m.remove());
    markersRef.current.clear();

    const bounds = new mb.default.LngLatBounds();

    properties.forEach((p) => {
      if (!p.lat || !p.lng) return;
      const lat = parseFloat(String(p.lat));
      const lng = parseFloat(String(p.lng));

      const el = document.createElement("div");
      const isActive = p.id === activePinId;
      const suffix = p.listingType === "rent" ? "/m" : "";
      const label = formatPrice(p.price, suffix)
        .replace(/\.000/, "k")
        .replace(/\.\d+k/, "k");

      el.className = [
        "cursor-pointer select-none transition-all duration-200",
        "px-2.5 py-1 rounded-lg text-xs font-sans font-bold shadow-md",
        "flex items-center gap-1 whitespace-nowrap",
        isActive
          ? "bg-brand text-white scale-110 shadow-lg z-10"
          : "bg-navy text-white hover:bg-brand hover:scale-105",
      ].join(" ");

      el.innerHTML = label;
      el.addEventListener("click", () => onPinClick?.(p.id));

      const marker = new mb.default.Marker({ element: el, anchor: "bottom" })
        .setLngLat([lng, lat])
        .addTo(map);

      markersRef.current.set(p.id, marker);
      bounds.extend([lng, lat]);
    });

    if (properties.length > 0 && !bounds.isEmpty()) {
      map.fitBounds(bounds, { padding: 60, maxZoom: 14, duration: 600 });
    }
  }, [properties, loaded, activePinId, onPinClick]);

  // Actualizar estilo do pin activo
  React.useEffect(() => {
    markersRef.current.forEach((marker, id) => {
      const el = marker.getElement();
      const isActive = id === activePinId;
      el.className = el.className
        .replace(/bg-brand|bg-navy/g, isActive ? "bg-brand" : "bg-navy")
        .replace(/scale-110|scale-105/g, isActive ? "scale-110" : "")
        .trim();
    });
  }, [activePinId]);

  if (!token || error) {
    return (
      <div className={`flex flex-col items-center justify-center bg-warm-dark rounded-xl text-center p-8 gap-3 ${className}`}>
        <MapPin size={32} className="text-faint" />
        <p className="text-sm text-muted font-sans">
          {!token ? "Configure NEXT_PUBLIC_MAPBOX_TOKEN para ver o mapa" : "Mapa indisponível"}
        </p>
      </div>
    );
  }

  return (
    <div className={`relative rounded-xl overflow-hidden ${className}`}>
      <div ref={mapContainer} className="w-full h-full" />
      {!loaded && (
        <div className="absolute inset-0 bg-warm-dark flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-navy border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      {/* Botão "pesquisar nesta área" */}
      {loaded && (
        <button
          onClick={() => {
            const center = mapRef.current?.getCenter();
            if (center) {
              // trigger re-search com coords do mapa
              window.dispatchEvent(new CustomEvent("map-search", {
                detail: { lat: center.lat, lng: center.lng }
              }));
            }
          }}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white text-navy text-xs font-sans font-semibold px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center gap-1.5"
        >
          <MapPin size={12} />
          Pesquisar nesta área
        </button>
      )}
    </div>
  );
}
