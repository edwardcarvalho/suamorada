import { NextResponse } from "next/server";

let cache: unknown = null;

export async function GET() {
  if (cache) {
    return NextResponse.json(cache, {
      headers: { "Cache-Control": "public, max-age=86400" },
    });
  }

  try {
    const r = await fetch(
      "https://geodata.ucdavis.edu/gadm/gadm4.1/json/gadm41_PRT_2.json",
      {
        headers: { "User-Agent": "SuaMorada/1.0 (suamorada.pt)" },
        next: { revalidate: 86400 },
      }
    );
    if (!r.ok) throw new Error(`GADM municipalities status ${r.status}`);
    const data = await r.json();
    cache = data;
    return NextResponse.json(data, {
      headers: { "Cache-Control": "public, max-age=86400" },
    });
  } catch (e) {
    console.error("[geo/municipalities]", e);
    return NextResponse.json(null, { status: 502 });
  }
}
