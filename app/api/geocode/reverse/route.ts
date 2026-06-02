import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const lat = req.nextUrl.searchParams.get("lat");
  const lng = req.nextUrl.searchParams.get("lng");
  if (!lat || !lng) return NextResponse.json(null);

  try {
    // zoom=8 devolve nível de distrito/município
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1&zoom=8&accept-language=pt-PT`;
    const r = await fetch(url, {
      headers: {
        "User-Agent": "SuaMorada/1.0 (suamorada.pt)",
        "Accept-Language": "pt-PT",
      },
      next: { revalidate: 0 },
    });
    const data = await r.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(null);
  }
}
