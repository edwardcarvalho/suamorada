import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { properties, propertyImages } from "@/lib/db/schema";
import { eq, and, gte, lte, sql, desc, asc } from "drizzle-orm";

const schema = z.object({
  tipo:         z.enum(["comprar", "arrendar"]).optional(),
  propertyType: z.string().optional(),
  distrito:     z.string().optional(),
  municipio:    z.string().optional(),
  minPrice:     z.coerce.number().positive().optional(),
  maxPrice:     z.coerce.number().positive().optional(),
  minArea:      z.coerce.number().positive().optional(),
  maxArea:      z.coerce.number().positive().optional(),
  quartos:      z.coerce.number().min(0).max(10).optional(),
  lat:          z.coerce.number().optional(),
  lng:          z.coerce.number().optional(),
  radiusKm:     z.coerce.number().positive().max(50).default(10),
  page:         z.coerce.number().positive().default(1),
  limit:        z.coerce.number().positive().max(50).default(20),
  sort:         z.enum(["price_asc","price_desc","newest","relevance"]).default("newest"),
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

  if (p.tipo === "comprar")   conditions.push(eq(properties.listingType, "sale"));
  if (p.tipo === "arrendar")  conditions.push(eq(properties.listingType, "rent"));
  if (p.propertyType)         conditions.push(eq(properties.propertyType, p.propertyType as never));
  if (p.distrito)             conditions.push(eq(properties.addressDistrict, p.distrito));
  if (p.municipio)            conditions.push(eq(properties.addressMunicipality, p.municipio));
  if (p.minPrice)             conditions.push(gte(properties.price, p.minPrice * 100));
  if (p.maxPrice)             conditions.push(lte(properties.price, p.maxPrice * 100));
  if (p.minArea)              conditions.push(gte(properties.areaUseful, p.minArea));
  if (p.maxArea)              conditions.push(lte(properties.areaUseful, p.maxArea));
  if (p.quartos !== undefined) conditions.push(eq(properties.bedrooms, p.quartos));

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

    // Busca imagens de capa em paralelo
    const coverImages = rows.length
      ? await db.select().from(propertyImages)
          .where(and(
            eq(propertyImages.isCover, true),
            sql`${propertyImages.propertyId} = ANY(ARRAY[${sql.join(rows.map(r => sql`${r.id}::uuid`), sql`, `)}])`
          ))
      : [];

    const coverMap = new Map(coverImages.map((i) => [i.propertyId, i]));

    const results = rows.map((r) => ({
      ...r,
      images: coverMap.has(r.id) ? [{ ...coverMap.get(r.id)!, isCover: true }] : [],
    }));

    const total = countRows[0]?.count ?? 0;

    return NextResponse.json(
      { results, total, page: p.page, totalPages: Math.ceil(total / p.limit) },
      { headers: { "Cache-Control": "s-maxage=300, stale-while-revalidate=600" } }
    );
  } catch (err) {
    console.error("[search] DB error:", err);
    // Em desenvolvimento sem DB, retorna vazio graciosamente
    return NextResponse.json(
      { results: [], total: 0, page: 1, totalPages: 0 },
      { headers: { "Cache-Control": "no-store" } }
    );
  }
}
