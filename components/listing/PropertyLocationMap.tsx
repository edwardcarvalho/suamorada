"use client";

import * as React from "react";
import { MapContainer, TileLayer, Marker, Circle } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface Props {
  lat: string | null;
  lng: string | null;
  label?: string;   // ex: "Campo de Ourique, Lisboa"
}

const pinIcon = L.divIcon({
  html: `
    <div style="
      position: relative;
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      transform: translate(-50%, -100%);
      filter: drop-shadow(0 2px 4px rgba(0,0,0,.35));
    ">
      <div style="
        background: #E8651A;
        color: #fff;
        width: 36px; height: 36px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex; align-items: center; justify-content: center;
        border: 3px solid white;
      ">
        <svg style="transform:rotate(45deg)" width="16" height="16" viewBox="0 0 24 24" fill="white">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>
      </div>
    </div>
  `,
  className: "",
  iconSize: [0, 0],
  iconAnchor: [0, 0],
});

export function PropertyLocationMap({ lat, lng, label }: Props) {
  const latN = lat ? parseFloat(lat) : null;
  const lngN = lng ? parseFloat(lng) : null;

  if (!latN || !lngN || isNaN(latN) || isNaN(lngN)) {
    return (
      <div className="w-full h-60 rounded-xl bg-warm-dark flex items-center justify-center border border-border">
        <p className="text-sm text-muted font-sans">Localização não disponível</p>
      </div>
    );
  }

  const center: [number, number] = [latN, lngN];

  return (
    <div className="w-full h-60 rounded-xl overflow-hidden border border-border relative isolate">
      <MapContainer
        center={center}
        zoom={15}
        className="w-full h-full"
        zoomControl={true}
        attributionControl={false}
        scrollWheelZoom={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        {/* Círculo de privacidade (~150m de raio) */}
        <Circle
          center={center}
          radius={150}
          pathOptions={{
            color: "#E8651A",
            fillColor: "#E8651A",
            fillOpacity: 0.12,
            weight: 2,
          }}
        />

        {/* Pin do imóvel */}
        <Marker position={center} icon={pinIcon} />
      </MapContainer>

      {/* Legenda de privacidade */}
      {label && (
        <div className="absolute bottom-2 left-2 right-2 z-[400] flex items-center justify-between">
          <span className="bg-white/90 backdrop-blur-sm text-xs font-sans text-muted px-2 py-1 rounded-lg shadow">
            📍 {label}
          </span>
          <span className="bg-white/90 backdrop-blur-sm text-[10px] font-sans text-faint px-2 py-1 rounded-lg shadow">
            Localização aproximada
          </span>
        </div>
      )}
    </div>
  );
}
