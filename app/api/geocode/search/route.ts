import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") ?? "";
  if (!q.trim()) return NextResponse.json([]);

  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&countrycodes=pt&limit=6&addressdetails=1&accept-language=pt-PT`;
    const r = await fetch(url, {
      headers: {
        "User-Agent": "SuaMorada/1.0 (suamorada.pt)",
        "Accept-Language": "pt-PT",
      },
      next: { revalidate: 60 },
    });
    const data = await r.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json([]);
  }
}
