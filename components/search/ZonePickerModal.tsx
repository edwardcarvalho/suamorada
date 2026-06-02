"use client";

import * as React from "react";
import { MapContainer, TileLayer, Marker, Polygon, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { X, Pencil, Trash2, Check, Info } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { Property } from "@/types/property";

export interface BBox {
  minLat: number; maxLat: number;
  minLng: number; maxLng: number;
  // Polígono original (para mostrar overlay)
  points: [number, number][];
}

interface Props {
  onApply: (bbox: BBox) => void;
  onClose: () => void;
  currentProperties: Property[];
  initialCenter?: [number, number];
}

/* ── Ícone de pin simples para o picker ─────────────────────────────── */
function dotIcon(active: boolean) {
  const bg = active ? "#E8651A" : "#1B3A5C";
  return L.divIcon({
    html: `<div style="
      width:10px;height:10px;border-radius:50%;
      background:${bg};border:2px solid white;
      box-shadow:0 1px 4px rgba(0,0,0,.4);
    "></div>`,
    className: "",
    iconSize: [10, 10],
    iconAnchor: [5, 5],
  });
}

/* ── Ferramenta de desenho de polígono ──────────────────────────────── */
interface DrawToolProps {
  drawing: boolean;
  points: [number, number][];
  onAddPoint: (latlng: L.LatLng) => void;
  onFinish: () => void;
}

function DrawTool({ drawing, points, onAddPoint, onFinish }: DrawToolProps) {
  const map = useMap();

  React.useEffect(() => {
    map.getContainer().style.cursor = drawing ? "crosshair" : "";
  }, [drawing, map]);

  useMapEvents({
    click(e) {
      if (!drawing) return;
      onAddPoint(e.latlng);
    },
    dblclick(e) {
      if (!drawing || points.length < 3) return;
      e.originalEvent.preventDefault();
      onFinish();
    },
  });

  return null;
}

/* ── Componente principal ───────────────────────────────────────────── */
export function ZonePickerModal({ onApply, onClose, currentProperties, initialCenter }: Props) {
  const [drawing, setDrawing] = React.useState(false);
  const [points,  setPoints]  = React.useState<[number, number][]>([]);
  const [done,    setDone]    = React.useState(false);

  const center: [number, number] = initialCenter ?? [38.7223, -9.1393];

  function addPoint(latlng: L.LatLng) {
    setPoints(prev => [...prev, [latlng.lat, latlng.lng]]);
  }

  function finishDrawing() {
    if (points.length < 3) return;
    setDrawing(false);
    setDone(true);
  }

  function clearZone() {
    setPoints([]);
    setDone(false);
    setDrawing(false);
  }

  function applyZone() {
    if (points.length < 3) return;
    const lats = points.map(p => p[0]);
    const lngs = points.map(p => p[1]);
    onApply({
      minLat: Math.min(...lats), maxLat: Math.max(...lats),
      minLng: Math.min(...lngs), maxLng: Math.max(...lngs),
      points,
    });
  }

  const validProps = currentProperties.filter(p => p.lat && p.lng);

  return (
    <div className="fixed inset-0 z-[200] flex flex-col bg-white">

      {/* ── Header ── */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-white shrink-0 z-10">
        <div className="flex items-center gap-3">
          <h2 className="font-sans font-semibold text-sm text-ink">
            Pesquisar por zona
          </h2>
          {done && (
            <span className="text-xs font-sans text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
              Zona seleccionada
            </span>
          )}
        </div>
        <button onClick={onClose} className="p-2 rounded-lg hover:bg-warm transition-colors" aria-label="Fechar">
          <X size={18} className="text-ink" />
        </button>
      </div>

      {/* ── Mapa ── */}
      <div className="flex-1 relative">
        <MapContainer
          center={center}
          zoom={12}
          className="w-full h-full"
          attributionControl={false}
          doubleClickZoom={false}   // desactiva zoom no duplo-clique (usamos para fechar)
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          <DrawTool
            drawing={drawing}
            points={points}
            onAddPoint={addPoint}
            onFinish={finishDrawing}
          />

          {/* Pins dos imóveis actuais */}
          {validProps.map(p => (
            <Marker
              key={p.id}
              position={[parseFloat(String(p.lat)), parseFloat(String(p.lng))]}
              icon={dotIcon(false)}
            />
          ))}

          {/* Polígono em desenho */}
          {points.length >= 2 && (
            <Polygon
              positions={points}
              pathOptions={{
                color: "#E8651A",
                fillColor: "#E8651A",
                fillOpacity: done ? 0.15 : 0.1,
                weight: 2,
                dashArray: done ? undefined : "6 4",
              }}
            />
          )}

          {/* Pontos do polígono */}
          {points.map(([lat, lng], i) => (
            <Marker
              key={i}
              position={[lat, lng]}
              icon={L.divIcon({
                html: `<div style="
                  width:8px;height:8px;border-radius:50%;
                  background:#E8651A;border:2px solid white;
                  box-shadow:0 1px 3px rgba(0,0,0,.3);
                "></div>`,
                className: "",
                iconSize: [8, 8],
                iconAnchor: [4, 4],
              })}
            />
          ))}
        </MapContainer>

        {/* Botão de desenho (canto superior direito) */}
        <div className="absolute top-3 right-3 z-[400] flex flex-col gap-2">
          {!done && (
            <button
              onClick={() => { setDrawing(!drawing); if (drawing) setPoints([]); }}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-sans font-semibold shadow-lg transition-colors ${
                drawing
                  ? "bg-brand text-white hover:bg-brand/90"
                  : "bg-white text-ink hover:bg-warm border border-border"
              }`}
            >
              <Pencil size={14} />
              {drawing ? "A desenhar…" : "Desenhar zona"}
            </button>
          )}

          {(points.length > 0 || done) && (
            <button
              onClick={clearZone}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-sans font-medium bg-white text-red-600 border border-red-200 hover:bg-red-50 shadow-lg transition-colors"
            >
              <Trash2 size={14} />
              Limpar zona
            </button>
          )}

          {drawing && points.length >= 3 && (
            <button
              onClick={finishDrawing}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-sans font-semibold bg-green-600 text-white hover:bg-green-700 shadow-lg transition-colors"
            >
              <Check size={14} />
              Fechar zona
            </button>
          )}
        </div>
      </div>

      {/* ── Footer ── */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-white shrink-0">
        {/* Instrução */}
        <div className="flex items-start gap-2 text-xs text-muted font-sans max-w-sm">
          <Info size={14} className="shrink-0 mt-0.5 text-faint" />
          {drawing
            ? <>Clique no mapa para adicionar pontos. <strong>Duplo-clique</strong> para fechar a zona.</>
            : done
            ? "Zona seleccionada. Clique em «Aplicar» para pesquisar dentro desta área."
            : "Clique em «Desenhar zona» e depois trace a área que pretende pesquisar."}
        </div>

        {/* Acções */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-border text-sm font-sans font-medium text-muted hover:text-ink hover:border-navy transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={applyZone}
            disabled={!done}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-brand text-white text-sm font-sans font-semibold hover:bg-brand/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <Check size={14} />
            Aplicar zona
          </button>
        </div>
      </div>
    </div>
  );
}
