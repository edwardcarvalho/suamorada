"use client";

import * as React from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { formatPrice, bedroomsLabel } from "@/lib/utils";
import type { Property } from "@/types/property";

/* ── Cria ícone de pin com preço ─────────────────────────────────────── */
function createPinIcon(label: string, active: boolean) {
  const bg    = active ? "#E8651A" : "#1B3A5C";
  const scale = active ? "scale(1.15)" : "scale(1)";

  const html = `
    <div style="
      position: relative;
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      transform: translate(-50%, -100%) ${scale};
      transform-origin: center bottom;
      transition: transform 0.15s ease;
      filter: drop-shadow(0 2px 4px rgba(0,0,0,0.35));
      cursor: pointer;
    ">
      <!-- Badge -->
      <div style="
        background: ${bg};
        color: #ffffff;
        padding: 5px 10px;
        border-radius: 8px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        font-size: 12px;
        font-weight: 700;
        line-height: 1;
        white-space: nowrap;
        letter-spacing: -0.2px;
      ">${label}</div>
      <!-- Triângulo apontador -->
      <div style="
        width: 0;
        height: 0;
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-top: 7px solid ${bg};
        margin-top: -1px;
      "></div>
    </div>
  `;

  return L.divIcon({
    html,
    className: "",          // remove classe CSS padrão do Leaflet
    iconSize:   [0, 0],     // sem tamanho — o posicionamento é feito via CSS
    iconAnchor: [0, 0],
  });
}

/* ── Popup com foto ao hover ─────────────────────────────────────────── */
function createHoverPopup(p: Property): string {
  const cover  = (p.images as Array<{ url: string; isCover: boolean }>)?.find(i => i.isCover)
                 ?? (p.images as Array<{ url: string }>)?.[0];
  const suffix = p.listingType === "rent" ? "/mês" : "";
  const price  = formatPrice(p.price, suffix);
  const loc    = p.addressParish
    ? `${p.addressParish}, ${p.addressMunicipality}`
    : p.addressMunicipality;

  const imgHtml = cover
    ? `<img src="${cover.url}" alt="" style="width:100%;height:110px;object-fit:cover;display:block;" />`
    : `<div style="width:100%;height:70px;background:#e8e8e8;display:flex;align-items:center;justify-content:center;color:#aaa;font-size:12px;">Sem foto</div>`;

  return `
    <a href="/imovel/${p.slug}" style="
      display:block;
      width:200px;
      font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
      border-radius:8px;
      overflow:hidden;
      background:#fff;
      text-decoration:none;
      cursor:pointer;
    ">
      ${imgHtml}
      <div style="padding:10px 12px 12px;">
        <p style="font-size:15px;font-weight:700;color:#E8651A;margin:0 0 4px;">${price}</p>
        <p style="font-size:11px;color:#333;margin:0 0 3px;line-height:1.4;
            white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${p.title}</p>
        <p style="font-size:10px;color:#888;margin:0 0 6px;">${loc}</p>
        <div style="display:flex;gap:8px;font-size:10px;color:#555;border-top:1px solid #eee;padding-top:6px;">
          <span>${bedroomsLabel(p.bedrooms)}</span>
          ${p.areaUseful ? `<span>·</span><span>${p.areaUseful} m²</span>` : ""}
          ${p.bathrooms  ? `<span>·</span><span>${p.bathrooms} WC</span>`  : ""}
        </div>
      </div>
    </a>
  `;
}

/* ── Ajusta bounds quando as propriedades mudam ──────────────────────── */
function BoundsUpdater({ properties }: { properties: Property[] }) {
  const map = useMap();
  React.useEffect(() => {
    const pts = properties
      .filter(p => p.lat && p.lng)
      .map(p => [parseFloat(String(p.lat)), parseFloat(String(p.lng))] as [number, number]);
    if (!pts.length) return;
    if (pts.length === 1) {
      map.setView(pts[0], 14, { animate: true });
    } else {
      map.fitBounds(L.latLngBounds(pts), { padding: [50, 50], maxZoom: 14, animate: true });
    }
  }, [properties, map]);
  return null;
}

/* ── Componente principal ────────────────────────────────────────────── */
interface Props {
  properties: Property[];
  activePinId?: string | null;
  onPinClick?: (id: string) => void;
  className?: string;
}

export function LeafletMap({ properties, activePinId, onPinClick, className }: Props) {
  const valid = properties.filter(p => p.lat && p.lng);
  const center: [number, number] = valid.length
    ? [parseFloat(String(valid[0].lat)), parseFloat(String(valid[0].lng))]
    : [38.7223, -9.1393];

  // Ref para popup de hover
  const hoverPopupRef = React.useRef<L.Popup | null>(null);

  return (
    <div className={`relative rounded-xl overflow-hidden ${className ?? ""}`}>
      <MapContainer
        center={center}
        zoom={12}
        className="w-full h-full"
        attributionControl={false}
        zoomControl={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <BoundsUpdater properties={valid} />

        {valid.map(p => {
          const lat      = parseFloat(String(p.lat));
          const lng      = parseFloat(String(p.lng));
          const isActive = p.id === activePinId;
          const suffix   = p.listingType === "rent" ? "/m" : "";
          const label    = formatPrice(p.price, suffix)
            .replace(" 000 €", "k €")
            .replace(/\s/g, " ");   // non-breaking spaces

          return (
            <Marker
              key={`${p.id}-${isActive}`}   // força re-render ao mudar estado
              position={[lat, lng]}
              icon={createPinIcon(label, isActive)}
              zIndexOffset={isActive ? 1000 : 0}
              eventHandlers={{
                click: () => {
                  onPinClick?.(p.id);
                  window.location.href = `/imovel/${p.slug}`;
                },

                mouseover: function (e) {
                  const map = e.target._map as L.Map;
                  if (hoverPopupRef.current) {
                    hoverPopupRef.current.remove();
                  }
                  hoverPopupRef.current = L.popup({
                    offset: [0, -20],
                    closeButton: false,
                    className: "leaflet-popup-property",
                    maxWidth: 210,
                    autoPan: false,
                  })
                    .setLatLng([lat, lng])
                    .setContent(createHoverPopup(p))
                    .openOn(map);
                },

                mouseout: function () {
                  if (hoverPopupRef.current) {
                    hoverPopupRef.current.remove();
                    hoverPopupRef.current = null;
                  }
                },
              }}
            />
          );
        })}
      </MapContainer>

      {/* Atribuição */}
      <a
        href="https://www.openstreetmap.org/copyright"
        target="_blank"
        rel="noopener"
        className="absolute bottom-1 right-1 text-[9px] text-muted/70 bg-white/80 px-1.5 py-0.5 rounded z-[400] hover:text-navy"
      >
        © OpenStreetMap
      </a>
    </div>
  );
}
