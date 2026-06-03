"use client";

import * as React from "react";
import {
  MapContainer, TileLayer, Marker, useMapEvents, useMap,
  Polygon, GeoJSON,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  X, Search, MapPin, Navigation, PenLine,
  Satellite, Map, Loader2, Check, Trash2,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ── Tipos públicos ──────────────────────────────────────────────────── */
export interface LocationResult {
  label: string;
  level: "district" | "municipality" | "parish";
  lat?:  number;
  lng?:  number;
  bbox?: {
    minLat: number; maxLat: number;
    minLng: number; maxLng: number;
    points: [number, number][];
  };
}

export interface LocationSelection {
  locations: LocationResult[];
  drawBBox?: LocationResult["bbox"];
}

interface Props {
  onSelect:      (sel: LocationSelection) => void;
  onClose:       () => void;
  initialValue?: string;
}

/* ── Nominatim proxy ─────────────────────────────────────────────────── */
interface NomResult {
  place_id: number; display_name: string;
  lat: string; lon: string;
  address: Record<string, string>;
}

async function apiSearch(q: string): Promise<NomResult[]> {
  try {
    const r = await fetch(`/api/geocode/search?q=${encodeURIComponent(q)}`);
    return r.ok ? r.json() : [];
  } catch { return []; }
}

function extractLabel(r: NomResult): string {
  const a = r.address;
  return a.city || a.town || a.village || a.county || a.state_district || a.state || r.display_name.split(",")[0];
}

/* ── Cores ───────────────────────────────────────────────────────────── */
const PIN_COLORS = ["#1B3A5C","#E8651A","#2D9E6B","#8B5CF6","#EF4444","#F59E0B"];

function pinIcon(color: string) {
  return L.divIcon({
    html: `<div style="width:14px;height:14px;border-radius:50%;background:${color};border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,.4);"></div>`,
    className: "", iconSize: [14, 14], iconAnchor: [7, 7],
  });
}
const dotIcon = () => L.divIcon({
  html: `<div style="width:7px;height:7px;border-radius:50%;background:#E8651A;border:2px solid white;"></div>`,
  className: "", iconSize: [7, 7], iconAnchor: [3, 3],
});
function pendingIcon() {
  return L.divIcon({
    html: `<div style="width:14px;height:14px;border-radius:50%;background:rgba(232,101,26,.5);border:2px dashed #E8651A;"></div>`,
    className: "", iconSize: [14, 14], iconAnchor: [7, 7],
  });
}

/* ── Estilos GeoJSON ─────────────────────────────────────────────────── */
type GeoStyle = { color: string; weight: number; fillColor: string; fillOpacity: number };

function layerStyle(isSelected: boolean, isHover = false): GeoStyle {
  if (isSelected) return { color: "#E8651A", weight: 3,   fillColor: "#E8651A", fillOpacity: 0.22 };
  if (isHover)    return { color: "#1B3A5C", weight: 2.5, fillColor: "#1B3A5C", fillOpacity: 0.14 };
  return               { color: "#1B3A5C", weight: 2,   fillColor: "#1B3A5C", fillOpacity: 0    };
}

/* ── Camada GeoJSON genérica ─────────────────────────────────────────── */
function GeoLayer({ data, nameKey, selectedLabels, tooltipLabel, onClick, showLabels = false }: {
  data: GeoJSON.FeatureCollection;
  nameKey: string;
  selectedLabels: string[];
  tooltipLabel?: string;
  onClick: (name: string, bounds: L.LatLngBounds, center: L.LatLng) => void;
  showLabels?: boolean;
}) {
  const key = selectedLabels.join("|") + data.features.length;

  function style(f?: GeoJSON.Feature): L.PathOptions {
    const name = f?.properties?.[nameKey] ?? "";
    return layerStyle(selectedLabels.includes(name)) as L.PathOptions;
  }

  function onEachFeature(f: GeoJSON.Feature, layer: L.Layer) {
    const name: string = f.properties?.[nameKey] ?? "";
    const path = layer as L.Path;

    // Label permanente (só quando showLabels=true)
    if (showLabels) {
      path.bindTooltip(name, {
        permanent: true,
        direction: "center",
        className: "leaflet-label-geo",
      });
    }

    path.on({
      mouseover(e) {
        if (!selectedLabels.includes(name)) (e.target as L.Path).setStyle(layerStyle(false, true) as L.PathOptions);
        if (!showLabels) {
          (e.target as L.Path).bindTooltip(
            `<b>${name}</b>${tooltipLabel ? `<br/><span style="font-size:10px;opacity:.7">${tooltipLabel}</span>` : ""}`,
            { permanent: false, sticky: true, className: "leaflet-tooltip-district" }
          ).openTooltip();
        }
      },
      mouseout(e) {
        const sel = selectedLabels.includes(name);
        (e.target as L.Path).setStyle(layerStyle(sel) as L.PathOptions);
        if (!showLabels) (e.target as L.Path).closeTooltip();
      },
      click(e: L.LeafletMouseEvent) {
        L.DomEvent.stopPropagation(e);
        const bounds = (e.target as L.Polygon).getBounds();
        onClick(name, bounds, bounds.getCenter());
      },
    });
  }

  return <GeoJSON key={key} data={data} style={style} onEachFeature={onEachFeature} />;
}

/* ── Helpers mapa ────────────────────────────────────────────────────── */
function ZoomTracker({ onZoom }: { onZoom: (z: number) => void }) {
  useMapEvents({ zoomend(e) { onZoom((e.target as L.Map).getZoom()); } });
  return null;
}

function FlyTo({ pos, seq }: { pos: [number, number] | null; seq?: number }) {
  const map = useMap();
  React.useEffect(() => {
    if (!pos) return;
    // seq muda → força re-fly mesmo para a mesma posição (ex: voltar a Portugal)
    const z = seq !== undefined ? 7 : Math.max(map.getZoom(), 11);
    map.flyTo(pos, z, { duration: 0.8 });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pos, seq]);
  return null;
}

function FlyToBounds({ bounds }: { bounds: L.LatLngBounds | null }) {
  const map = useMap();
  const prev = React.useRef("");
  React.useEffect(() => {
    if (!bounds) return;
    const k = bounds.toBBoxString();
    if (k === prev.current) return;
    prev.current = k;
    map.flyToBounds(bounds, { padding: [40, 40], maxZoom: 13, duration: 0.8 });
  }, [bounds, map]);
  return null;
}

function DrawTool({ active, onPoint, onFinish, points }: {
  active: boolean; onPoint: (l: L.LatLng) => void;
  onFinish: () => void; points: [number, number][];
}) {
  const map = useMap();
  React.useEffect(() => { map.getContainer().style.cursor = active ? "crosshair" : ""; }, [active, map]);
  useMapEvents({
    click(e) { if (active) onPoint(e.latlng); },
    dblclick(e) { if (active && points.length >= 3) { e.originalEvent.preventDefault(); onFinish(); } },
  });
  return null;
}

/* ── Estado da hierarquia ────────────────────────────────────────────── */
type DrillLevel = "district" | "municipality" | "parish";

interface DrillState {
  level: DrillLevel;
  district: string | null;     // distrito activo no drill
  municipality: string | null; // concelho activo no drill
}

/* ── Componente principal ────────────────────────────────────────────── */
type TileMode = "standard" | "satellite";

export function LocationPickerModal({ onSelect, onClose, initialValue = "" }: Props) {
  const [query,       setQuery]      = React.useState(initialValue);
  const [suggestions, setSuggestions]= React.useState<NomResult[]>([]);
  const [searching,   setSearching]  = React.useState(false);
  const [tileMode,    setTileMode]   = React.useState<TileMode>("standard");
  const [drawMode,    setDrawMode]   = React.useState(false);
  const [selected,    setSelected]   = React.useState<LocationResult[]>([]);
  const [flyTo,       setFlyTo]      = React.useState<[number, number] | null>(null);
  const [flyBounds,   setFlyBounds]  = React.useState<L.LatLngBounds | null>(null);
  const [drawPoints,  setDrawPoints] = React.useState<[number, number][]>([]);
  const [drawDone,    setDrawDone]   = React.useState(false);
  const [pendingPin,  setPendingPin] = React.useState<[number, number] | null>(null);
  const [revLoading,  setRevLoading] = React.useState(false);

  // GeoJSON — datasets IMUTÁVEIS (nunca filtrados)
  const [districtGeo,     setDistrictGeo]     = React.useState<GeoJSON.FeatureCollection | null>(null);
  const [municipalityFull,setMunicipalityFull]= React.useState<GeoJSON.FeatureCollection | null>(null);
  const [parishGeo,       setParishGeo]       = React.useState<GeoJSON.FeatureCollection | null>(null);
  const [geoLoading,      setGeoLoading]      = React.useState(true);
  const [parishLoading,   setParishLoading]   = React.useState(false);

  // Cache de bounds dos distritos (para voltar atrás no breadcrumb)
  const districtBoundsCache = React.useRef<Record<string, L.LatLngBounds>>({});

  // Hierarquia de drill-down
  const [drill, setDrill] = React.useState<DrillState>({ level: "district", district: null, municipality: null });
  // Contador para forçar re-fly (mesmo para a mesma posição)
  const [flySeq, setFlySeq] = React.useState(0);

  const inputRef = React.useRef<HTMLInputElement>(null);
  const debounce = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 100);
    document.body.style.overflow = "hidden";

    // Carrega distritos
    fetch("/api/geo/districts")
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d) setDistrictGeo(d); })
      .catch(() => {})
      .finally(() => setGeoLoading(false));

    // Carrega municípios em background (guarda o dataset COMPLETO, nunca filtrar)
    fetch("/api/geo/municipalities")
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d) setMunicipalityFull(d); })
      .catch(() => {});

    return () => { document.body.style.overflow = ""; };
  }, []);

  // Pesquisa
  React.useEffect(() => {
    if (debounce.current) clearTimeout(debounce.current);
    if (!query.trim() || query.length < 2) { setSuggestions([]); return; }
    debounce.current = setTimeout(async () => {
      setSearching(true);
      try { setSuggestions(await apiSearch(query)); }
      finally { setSearching(false); }
    }, 400);
  }, [query]);

  /* ── Selecção ── */
  function toggleLocation(loc: LocationResult) {
    setSelected(prev =>
      prev.some(s => s.label === loc.label && s.level === loc.level)
        ? prev.filter(s => !(s.label === loc.label && s.level === loc.level))
        : [...prev, loc]
    );
    setQuery(""); setSuggestions([]);
  }
  function addLocation(loc: LocationResult) {
    setSelected(prev => prev.some(s => s.label === loc.label) ? prev : [...prev, loc]);
    setQuery(""); setSuggestions([]);
  }
  function removeLocation(label: string) {
    setSelected(prev => prev.filter(s => s.label !== label));
  }

  /* ── Drill: clique num distrito ── */
  function drillDistrict(name: string, bounds: L.LatLngBounds) {
    districtBoundsCache.current[name] = bounds;
    toggleLocation({ label: name, level: "district" });
    setDrill({ level: "municipality", district: name, municipality: null });
    setFlyBounds(bounds);
  }

  /* ── Drill: clique num concelho ── */
  async function drillMunicipality(name: string, bounds: L.LatLngBounds) {
    setDrill(d => ({ ...d, level: "parish", municipality: name }));
    setFlyBounds(bounds);
    // Carrega freguesias do concelho
    setParishLoading(true);
    setParishGeo(null);
    try {
      const r = await fetch(`/api/geo/parishes?municipality=${encodeURIComponent(name)}`);
      const d = r.ok ? await r.json() : null;
      if (d) setParishGeo(d);
    } catch {}
    finally { setParishLoading(false); }
  }

  /* ── Drill: clique numa freguesia ── */
  function selectParish(name: string, center: L.LatLng) {
    addLocation({ label: name, level: "parish", lat: center.lat, lng: center.lng });
  }

  /* ── Navegar no breadcrumb ── */
  function goToLevel(level: DrillLevel) {
    if (level === "district") {
      setDrill({ level: "district", district: null, municipality: null });
      setParishGeo(null);
      setFlyBounds(null);
      // força re-fly para Portugal mesmo que coords sejam iguais
      setFlySeq(s => s + 1);
      setFlyTo([39.5, -8.0]);
    } else if (level === "municipality" && drill.district) {
      setDrill(d => ({ ...d, level: "municipality", municipality: null }));
      setParishGeo(null);
      // volta para os bounds do distrito (guardados no cache)
      const b = districtBoundsCache.current[drill.district];
      if (b) setFlyBounds(b);
    }
  }

  /* ── GeoJSON a mostrar conforme o nível ── */
  const showDistricts      = drill.level === "district";
  const showMunicipalities = drill.level === "municipality" && !!municipalityFull;
  const showParishes       = drill.level === "parish";

  // Municípios filtrados — usa sempre o dataset COMPLETO
  const visibleMunicipalities: GeoJSON.FeatureCollection | null = React.useMemo(() => {
    if (!municipalityFull || drill.level !== "municipality") return null;
    if (!drill.district) return municipalityFull;
    return {
      ...municipalityFull,
      features: municipalityFull.features.filter(f => f.properties?.NAME_1 === drill.district),
    };
  }, [municipalityFull, drill.level, drill.district]);

  /* ── Desenho ── */
  function finishDraw() { if (drawPoints.length >= 3) { setDrawDone(true); setDrawMode(false); } }
  function clearDraw()  { setDrawPoints([]); setDrawDone(false); }

  /* ── Geolocalização ── */
  async function geolocate() {
    navigator.geolocation?.getCurrentPosition(async ({ coords }) => {
      const { latitude: lat, longitude: lng } = coords;
      setPendingPin([lat, lng]);
      setRevLoading(true);
      try {
        const r = await fetch(`/api/geocode/reverse?lat=${lat}&lng=${lng}`);
        const d: NomResult = r.ok ? await r.json() : null;
        if (d) { addLocation({ label: extractLabel(d), level: "municipality", lat, lng }); setFlyTo([lat, lng]); }
      } finally { setPendingPin(null); setRevLoading(false); }
    });
  }

  function confirm() {
    const drawBBox = drawDone && drawPoints.length >= 3 ? (() => {
      const lats = drawPoints.map(p => p[0]), lngs = drawPoints.map(p => p[1]);
      return { minLat: Math.min(...lats), maxLat: Math.max(...lats), minLng: Math.min(...lngs), maxLng: Math.max(...lngs), points: drawPoints };
    })() : undefined;
    if (selected.length === 0 && !drawBBox) return;
    onSelect({ locations: selected, drawBBox });
  }

  const tileUrl = tileMode === "satellite"
    ? "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
    : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png";

  /* ── Breadcrumb ── */
  const breadcrumb: { label: string; level: DrillLevel }[] = [{ label: "Portugal", level: "district" }];
  if (drill.district)     breadcrumb.push({ label: drill.district,     level: "municipality" });
  if (drill.municipality) breadcrumb.push({ label: drill.municipality, level: "parish"       });

  const levelLabel = { district: "Distritos", municipality: "Concelhos", parish: "Freguesias" }[drill.level];

  return (
    <div className="fixed inset-0 z-[300] flex flex-col bg-white">

      {/* HEADER */}
      <div className="flex items-center gap-3 px-5 py-3 border-b border-border bg-white shrink-0">
        <h2 className="font-sans font-semibold text-base text-ink shrink-0">Selecionar zona</h2>

        <div className="flex-1 relative">
          <div className="flex items-center gap-2 border border-border rounded-xl px-3 py-2 focus-within:border-navy bg-white transition-colors">
            {searching ? <Loader2 size={15} className="text-faint animate-spin shrink-0" /> : <Search size={15} className="text-faint shrink-0" />}
            <input ref={inputRef} value={query} onChange={e => setQuery(e.target.value)}
              placeholder="Zona, cidade, freguesia…"
              className="flex-1 text-sm font-sans text-ink placeholder:text-faint outline-none"
            />
            {query && <button onClick={() => { setQuery(""); setSuggestions([]); }}><X size={13} className="text-faint hover:text-ink" /></button>}
          </div>

          {suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-border rounded-xl shadow-xl z-20 overflow-hidden">
              {suggestions.map(s => {
                const label = extractLabel(s);
                return (
                  <button key={s.place_id}
                    onClick={() => { addLocation({ label, level: "municipality", lat: parseFloat(s.lat), lng: parseFloat(s.lon) }); setFlyTo([parseFloat(s.lat), parseFloat(s.lon)]); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-ink hover:bg-warm text-left border-b border-border/40 last:border-0"
                  >
                    <MapPin size={13} className="text-brand shrink-0" />
                    <span className="font-medium">{label}</span>
                    <span className="text-xs text-faint ml-auto truncate max-w-[140px]">
                      {s.display_name.split(",").slice(1, 3).join(",").trim()}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <button onClick={onClose} className="text-sm font-sans font-medium text-navy hover:underline shrink-0">Cancelar</button>
      </div>

      {/* BREADCRUMB + BADGES */}
      <div className="flex items-center justify-between px-5 py-2 border-b border-border bg-warm shrink-0 gap-4 flex-wrap">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1 text-sm font-sans">
          {breadcrumb.map((b, i) => (
            <React.Fragment key={`${i}-${b.label}`}>
              {i > 0 && <ChevronRight size={13} className="text-faint" />}
              <button
                onClick={() => i < breadcrumb.length - 1 ? goToLevel(b.level) : undefined}
                className={cn(
                  "transition-colors",
                  i === breadcrumb.length - 1
                    ? "font-semibold text-ink cursor-default"
                    : "text-navy hover:underline cursor-pointer"
                )}
              >
                {b.label}
              </button>
            </React.Fragment>
          ))}
          <span className="ml-2 text-xs text-faint">— {levelLabel}</span>
        </nav>

        {/* Zonas seleccionadas */}
        {selected.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap">
            {selected.map((loc, i) => (
              <span key={`${loc.level}-${loc.label}`}
                className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-sans font-semibold text-white"
                style={{ background: PIN_COLORS[i % PIN_COLORS.length] }}
              >
                {loc.label}
                <button onClick={() => removeLocation(loc.label)} className="opacity-80 hover:opacity-100"><X size={10} /></button>
              </span>
            ))}
            <button onClick={() => setSelected([])} className="text-xs text-muted hover:text-ink">Limpar</button>
          </div>
        )}
      </div>

      {/* MAPA */}
      <div className="flex-1 relative">
        <MapContainer
          center={[39.5, -8.0]} zoom={7} minZoom={5}
          className="w-full h-full"
          attributionControl={false}
          doubleClickZoom={false}
          zoomControl={true}
        >
          <TileLayer url={tileUrl} />
          <FlyTo pos={flyTo} seq={flySeq} />
          <FlyToBounds bounds={flyBounds} />

          <DrawTool
            active={drawMode}
            onPoint={l => setDrawPoints(p => [...p, [l.lat, l.lng]])}
            onFinish={finishDraw}
            points={drawPoints}
          />

          {/* DISTRITOS */}
          {showDistricts && districtGeo && (
            <GeoLayer
              data={districtGeo}
              nameKey="NAME_1"
              selectedLabels={selected.filter(s => s.level === "district").map(s => s.label)}
              tooltipLabel="Clique para ver concelhos"
              showLabels={true}
              onClick={(name, bounds) => drillDistrict(name, bounds)}
            />
          )}

          {/* CONCELHOS */}
          {showMunicipalities && visibleMunicipalities && (
            <GeoLayer
              data={visibleMunicipalities}
              nameKey="NAME_2"
              selectedLabels={selected.filter(s => s.level === "municipality").map(s => s.label)}
              tooltipLabel="Clique para ver freguesias"
              showLabels={true}
              onClick={(name, bounds, center) => {
                toggleLocation({ label: name, level: "municipality", lat: center.lat, lng: center.lng });
                drillMunicipality(name, bounds);
              }}
            />
          )}

          {/* FREGUESIAS */}
          {showParishes && parishGeo && (
            <GeoLayer
              data={parishGeo}
              nameKey="NAME_3"
              selectedLabels={selected.filter(s => s.level === "parish").map(s => s.label)}
              tooltipLabel="Clique para seleccionar"
              showLabels={true}
              onClick={(name, _bounds, center) => {
                toggleLocation({ label: name, level: "parish", lat: center.lat, lng: center.lng });
              }}
            />
          )}

          {/* Pin temporário + seleccionados */}
          {pendingPin && <Marker position={pendingPin} icon={pendingIcon()} />}
          {selected.map((loc, i) => loc.lat && loc.lng && (
            <Marker key={loc.label} position={[loc.lat, loc.lng]} icon={pinIcon(PIN_COLORS[i % PIN_COLORS.length])} />
          ))}

          {/* Polígono desenhado */}
          {drawPoints.length >= 2 && (
            <Polygon positions={drawPoints}
              pathOptions={{ color: "#E8651A", fillColor: "#E8651A", fillOpacity: drawDone ? 0.15 : 0.08, weight: 2.5, dashArray: drawDone ? undefined : "6 4" }}
            />
          )}
          {drawPoints.map(([lat, lng], i) => <Marker key={i} position={[lat, lng]} icon={dotIcon()} />)}
        </MapContainer>

        {/* OVERLAY BOTÕES */}

        {/* Desenhar zona */}
        <div className="absolute top-3 right-14 z-[400] flex flex-col gap-2">
          {!drawDone ? (
            <button onClick={drawMode ? () => setDrawMode(false) : () => setDrawMode(true)}
              className={cn("flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-sans font-semibold shadow-lg transition-colors",
                drawMode ? "bg-brand text-white" : "bg-white text-ink border border-border hover:bg-warm")}
            >
              <PenLine size={14} />
              {drawMode ? "A desenhar…" : "Desenha a tua zona"}
            </button>
          ) : (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-sans font-semibold bg-green-600 text-white shadow-lg">
              <Check size={14} /> Zona desenhada
            </div>
          )}
          {drawMode && drawPoints.length >= 3 && (
            <button onClick={finishDraw} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-sans font-semibold bg-green-600 text-white shadow-lg hover:bg-green-700">
              <Check size={14} /> Fechar zona
            </button>
          )}
          {(drawPoints.length > 0 || drawDone) && (
            <button onClick={clearDraw} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-sans font-medium bg-white text-red-600 border border-red-200 shadow-lg hover:bg-red-50">
              <Trash2 size={14} /> Limpar
            </button>
          )}
        </div>

        {/* Loading */}
        {(geoLoading || parishLoading) && (
          <div className="absolute top-3 left-3 z-[400] flex items-center gap-2 bg-white/90 border border-border px-3 py-1.5 rounded-xl shadow text-xs font-sans text-muted">
            <Loader2 size={12} className="text-brand animate-spin" />
            {parishLoading ? "A carregar freguesias…" : "A carregar distritos…"}
          </div>
        )}

        {revLoading && (
          <div className="absolute bottom-16 left-3 z-[400] flex items-center gap-2 bg-white border border-border px-3 py-2 rounded-xl shadow">
            <Loader2 size={13} className="text-brand animate-spin" />
            <span className="text-xs font-sans text-muted">A identificar zona…</span>
          </div>
        )}

        {/* Geolocalização */}
        <button onClick={geolocate} className="absolute bottom-16 right-3 z-[400] flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-border shadow-lg text-sm font-sans font-medium text-ink hover:bg-warm">
          <Navigation size={14} /> A tua localização
        </button>

        {/* Padrão / Satélite */}
        <div className="absolute bottom-3 right-3 z-[400] flex rounded-lg overflow-hidden border border-border shadow-lg">
          {(["standard", "satellite"] as TileMode[]).map(m => (
            <button key={m} onClick={() => setTileMode(m)}
              className={cn("flex items-center gap-1.5 px-3 py-2 text-xs font-sans font-medium transition-colors",
                tileMode === m ? "bg-navy text-white" : "bg-white text-ink hover:bg-warm")}
            >
              {m === "standard" ? <Map size={13} /> : <Satellite size={13} />}
              {m === "standard" ? "Padrão" : "Satélite"}
            </button>
          ))}
        </div>

        {drawMode && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-[400] bg-black/70 text-white text-xs font-sans px-4 py-2 rounded-full pointer-events-none">
            Clique para adicionar pontos · Duplo-clique para fechar
          </div>
        )}
      </div>

      {/* FOOTER */}
      <div className="flex items-center justify-between px-5 py-3 border-t border-border bg-white shrink-0">
        <p className="text-xs text-muted font-sans">
          {selected.length > 0
            ? `${selected.length} zona${selected.length > 1 ? "s" : ""} seleccionada${selected.length > 1 ? "s" : ""}${drawDone ? " + zona desenhada" : ""}`
            : drill.level === "district" ? "Clique num distrito para ver os concelhos"
            : drill.level === "municipality" ? "Clique num concelho para seleccionar ou ver freguesias"
            : "Clique numa freguesia para seleccionar"}
        </p>
        <div className="flex gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border border-border text-sm font-sans text-muted hover:text-ink hover:border-navy transition-colors">
            Cancelar
          </button>
          <button onClick={confirm} disabled={selected.length === 0 && !drawDone}
            className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-brand text-white text-sm font-sans font-semibold hover:bg-brand/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <Check size={14} />
            {drawDone ? "Pesquisar nesta zona" : selected.length > 1 ? `Pesquisar (${selected.length})` : "Pesquisar aqui"}
          </button>
        </div>
      </div>
    </div>
  );
}
