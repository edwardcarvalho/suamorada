import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { properties, propertyImages } from "@/lib/db/schema";
import { eq, and, gte, lte, sql, desc, asc, inArray, or } from "drizzle-orm";

const schema = z.object({
  tipo:        z.enum(["comprar", "arrendar"]).optional(),
  propertyType:z.string().optional(),
  distrito:    z.string().optional(),
  municipio:   z.string().optional(),
  minPrice:    z.coerce.number().positive().optional(),
  maxPrice:    z.coerce.number().positive().optional(),
  minArea:     z.coerce.number().positive().optional(),
  maxArea:     z.coerce.number().positive().optional(),
  quartos:     z.string().optional(),              // "0,1,2,4" — 4 significa >=4
  casasBanho:  z.coerce.number().min(1).max(10).optional(),
  energia:     z.string().optional(),              // "A+,A,B"
  estado:      z.string().optional(),              // "new,used,needs_renovation"
  extras:      z.string().optional(),              // "garage,elevator,pool,garden,ac,balcony,wardrobe,storage"
  andar:       z.string().optional(),
  publicado:   z.string().optional(),
  minLat:      z.coerce.number().optional(),
  maxLat:      z.coerce.number().optional(),
  minLng:      z.coerce.number().optional(),
  maxLng:      z.coerce.number().optional(),
  lat:         z.coerce.number().optional(),
  lng:         z.coerce.number().optional(),
  radiusKm:    z.coerce.number().positive().max(50).default(10),
  page:        z.coerce.number().positive().default(1),
  limit:       z.coerce.number().positive().max(50).default(20),
  sort:        z.enum(["price_asc","price_desc","newest","relevance"]).default("newest"),
});

export async function GET(req: NextRequest) {
  const parsed = schema.safeParse(Object.fromEntries(req.nextUrl.searchParams));
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Parâmetros inválidos", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const p = parsed.data;
  const conditions = [eq(properties.status, "active")];

  if (p.tipo === "comprar")  conditions.push(eq(properties.listingType, "sale"));
  if (p.tipo === "arrendar") conditions.push(eq(properties.listingType, "rent"));
  if (p.propertyType)        conditions.push(eq(properties.propertyType, p.propertyType as never));
  // Suporte a múltiplos distritos (OR) via "distritos" vírgula-separado
  if (p.distrito) {
    const vals = p.distrito.split(",").map(s => s.trim()).filter(Boolean);
    if (vals.length === 1) conditions.push(eq(properties.addressDistrict, vals[0]));
    else if (vals.length > 1) conditions.push(inArray(properties.addressDistrict, vals));
  }
  if (p.municipio) {
    const vals = p.municipio.split(",").map((s: string) => s.trim()).filter(Boolean);
    if (vals.length === 1) conditions.push(eq(properties.addressMunicipality, vals[0]));
    else if (vals.length > 1) conditions.push(inArray(properties.addressMunicipality, vals));
  }
  if (p.minPrice)            conditions.push(gte(properties.price, p.minPrice * 100));
  if (p.maxPrice)            conditions.push(lte(properties.price, p.maxPrice * 100));
  if (p.minArea)             conditions.push(gte(properties.areaUseful, p.minArea));
  if (p.maxArea)             conditions.push(lte(properties.areaUseful, p.maxArea));
  if (p.casasBanho)          conditions.push(gte(properties.bathrooms, p.casasBanho));

  // ── Quartos (multi-select, 4 = T4+) ──────────────────────────────────────
  if (p.quartos) {
    const vals = p.quartos.split(",").map(Number).filter((n) => !isNaN(n));
    if (vals.length > 0) {
      const hasFourPlus = vals.includes(4);
      const exact = vals.filter((v) => v < 4);
      const orParts = [
        ...(exact.length > 0 ? [inArray(properties.bedrooms, exact)] : []),
        ...(hasFourPlus       ? [gte(properties.bedrooms, 4)]         : []),
      ];
      if (orParts.length === 1) conditions.push(orParts[0]);
      else if (orParts.length > 1) conditions.push(or(...orParts)!);
    }
  }

  // ── Estado ────────────────────────────────────────────────────────────────
  if (p.estado) {
    const vals = p.estado.split(",").filter(Boolean);
    // Mapeia "bom_estado" → "used", "nova" → "new"+"under_construction"
    const dbVals: string[] = [];
    for (const v of vals) {
      if (v === "bom_estado")    dbVals.push("used");
      else if (v === "nova")     dbVals.push("new", "under_construction");
      else                       dbVals.push(v);
    }
    const unique = [...new Set(dbVals)];
    if (unique.length === 1)     conditions.push(eq(properties.condition, unique[0] as never));
    else if (unique.length > 1)  conditions.push(inArray(properties.condition, unique as never[]));
  }

  // ── Energia ───────────────────────────────────────────────────────────────
  if (p.energia) {
    // Suporta grupos: "alta" → A+,A,B | "media" → B-,C | "baixa" → D,E,F
    const vals = p.energia.split(",").filter(Boolean);
    const expanded: string[] = [];
    for (const v of vals) {
      if (v === "alta")       expanded.push("A+", "A", "B");
      else if (v === "media") expanded.push("B-", "C");
      else if (v === "baixa") expanded.push("D", "E", "F");
      else                    expanded.push(v);
    }
    const unique = [...new Set(expanded)];
    if (unique.length === 1)    conditions.push(eq(properties.energyCertificate, unique[0] as never));
    else if (unique.length > 1) conditions.push(inArray(properties.energyCertificate, unique as never[]));
  }

  // ── Extras (booleanos + features array) ──────────────────────────────────
  if (p.extras) {
    const vals = p.extras.split(",").filter(Boolean);
    if (vals.includes("garage"))   conditions.push(eq(properties.hasGarage,   true));
    if (vals.includes("elevator")) conditions.push(eq(properties.hasElevator, true));
    if (vals.includes("pool"))     conditions.push(eq(properties.hasPool,     true));
    if (vals.includes("garden"))   conditions.push(eq(properties.hasGarden,   true));
    // Features armazenadas no array text[]
    const featureMap: Record<string, string> = {
      ac:       "Ar condicionado",
      balcony:  "Varanda",
      terrace:  "Terraço",
      wardrobe: "Armários embutidos",
      storage:  "Arrecadação",
      adapted:  "Casa adaptada",
    };
    for (const key of Object.keys(featureMap)) {
      if (vals.includes(key)) {
        conditions.push(sql`${properties.features} @> ARRAY[${featureMap[key]}]::text[]`);
      }
    }
  }

  // ── Andar ─────────────────────────────────────────────────────────────────
  if (p.andar === "res_chao") {
    conditions.push(lte(properties.floor, 0));
  } else if (p.andar === "ultimo") {
    conditions.push(sql`${properties.floor} IS NOT NULL AND ${properties.totalFloors} IS NOT NULL AND ${properties.floor} = ${properties.totalFloors}`);
  } else if (p.andar === "intermedio") {
    conditions.push(sql`${properties.floor} IS NOT NULL AND ${properties.totalFloors} IS NOT NULL AND ${properties.floor} > 0 AND ${properties.floor} < ${properties.totalFloors}`);
  }

  // ── Bounding box (zona desenhada no mapa) ────────────────────────────────
  // lat/lng estão guardados como TEXT → cast para float no SQL
  if (p.minLat) conditions.push(sql`${properties.lat}::float >= ${p.minLat}`);
  if (p.maxLat) conditions.push(sql`${properties.lat}::float <= ${p.maxLat}`);
  if (p.minLng) conditions.push(sql`${properties.lng}::float >= ${p.minLng}`);
  if (p.maxLng) conditions.push(sql`${properties.lng}::float <= ${p.maxLng}`);

  // ── Publicado ─────────────────────────────────────────────────────────────
  if (p.publicado) {
    const now = new Date();
    const cutoff = new Date(now);
    if      (p.publicado === "48h")   cutoff.setHours(cutoff.getHours() - 48);
    else if (p.publicado === "semana") cutoff.setDate(cutoff.getDate() - 7);
    else if (p.publicado === "mes")    cutoff.setDate(cutoff.getDate() - 30);
    if (p.publicado !== "indiferente") {
      conditions.push(gte(properties.publishedAt, cutoff));
    }
  }

  const orderBy = {
    price_asc:  asc(properties.price),
    price_desc: desc(properties.price),
    newest:     desc(properties.publishedAt),
    relevance:  desc(properties.featured),
  }[p.sort];

  const offset = (p.page - 1) * p.limit;

  try {
    const [rows, countRows] = await Promise.all([
      db.select().from(properties)
        .where(and(...conditions))
        .orderBy(desc(properties.featured), orderBy)
        .limit(p.limit).offset(offset),
      db.select({ count: sql<number>`count(*)::int` })
        .from(properties).where(and(...conditions)),
    ]);

    const coverImages = rows.length
      ? await db.select().from(propertyImages)
          .where(and(
            eq(propertyImages.isCover, true),
            sql`${propertyImages.propertyId} = ANY(ARRAY[${sql.join(rows.map(r => sql`${r.id}::uuid`), sql`, `)}])`
          ))
      : [];

    const coverMap = new Map(coverImages.map((i) => [i.propertyId, i]));
    const results  = rows.map((r) => ({
      ...r,
      images: coverMap.has(r.id) ? [{ ...coverMap.get(r.id)!, isCover: true }] : [],
    }));

    const total = countRows[0]?.count ?? 0;

    return NextResponse.json(
      { results, total, page: p.page, totalPages: Math.ceil(total / p.limit) },
      { headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate=300" } }
    );
  } catch (err) {
    console.error("[search] DB error:", err);
    return NextResponse.json(
      { results: [], total: 0, page: 1, totalPages: 0 },
      { headers: { "Cache-Control": "no-store" } }
    );
  }
}
