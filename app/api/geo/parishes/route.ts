import { NextRequest, NextResponse } from "next/server";

// Cache do ficheiro completo em memória
let fullCache: GeoJSON.FeatureCollection | null = null;

async function getLevel3(): Promise<GeoJSON.FeatureCollection | null> {
  if (fullCache) return fullCache;
  try {
    const r = await fetch(
      "https://geodata.ucdavis.edu/gadm/gadm4.1/json/gadm41_PRT_3.json",
      {
        headers: { "User-Agent": "SuaMorada/1.0 (suamorada.pt)" },
        next: { revalidate: 86400 },
      }
    );
    if (!r.ok) return null;
    const data = await r.json() as GeoJSON.FeatureCollection;
    fullCache = data;
    return data;
  } catch { return null; }
}

export async function GET(req: NextRequest) {
  const municipality = req.nextUrl.searchParams.get("municipality");
  const data = await getLevel3();
  if (!data) return NextResponse.json(null, { status: 502 });

  // Filtra pelas freguesias do concelho pedido
  if (municipality) {
    const filtered: GeoJSON.FeatureCollection = {
      ...data,
      features: data.features.filter(
        (f) => f.properties?.NAME_2 === municipality
      ),
    };
    return NextResponse.json(filtered, {
      headers: { "Cache-Control": "public, max-age=3600" },
    });
  }

  return NextResponse.json(data, {
    headers: { "Cache-Control": "public, max-age=86400" },
  });
}
