import { NextResponse } from "next/server";

// Cache em memória para não re-fazer o fetch a cada pedido
let cachedGeoJson: unknown = null;

export async function GET() {
  if (cachedGeoJson) {
    return NextResponse.json(cachedGeoJson, {
      headers: { "Cache-Control": "public, max-age=86400" },
    });
  }

  try {
    const r = await fetch(
      "https://geodata.ucdavis.edu/gadm/gadm4.1/json/gadm41_PRT_1.json",
      {
        headers: { "User-Agent": "SuaMorada/1.0 (suamorada.pt)" },
        next: { revalidate: 86400 },
      }
    );
    if (!r.ok) throw new Error(`GADM status ${r.status}`);
    const data = await r.json();
    cachedGeoJson = data;
    return NextResponse.json(data, {
      headers: { "Cache-Control": "public, max-age=86400" },
    });
  } catch (e) {
    console.error("[geo/districts]", e);
    return NextResponse.json(null, { status: 502 });
  }
}
