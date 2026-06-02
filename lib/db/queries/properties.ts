import { db } from "@/lib/db";
import { properties, propertyImages, users, agencies } from "@/lib/db/schema";
import { eq, and, gte, lte, sql, desc, asc } from "drizzle-orm";
import type { PropertySearchParams } from "@/types/property";

/** Busca imóveis com filtros dinâmicos */
export async function searchProperties(params: PropertySearchParams) {
  const {
    tipo, propertyType, distrito, municipio,
    minPrice, maxPrice, minArea, maxArea,
    quartos, page = 1, limit = 20,
    sort = "newest",
  } = params;

  const conditions = [eq(properties.status, "active")];

  if (tipo === "comprar") conditions.push(eq(properties.listingType, "sale"));
  if (tipo === "arrendar") conditions.push(eq(properties.listingType, "rent"));
  if (propertyType) conditions.push(eq(properties.propertyType, propertyType));
  if (distrito) conditions.push(eq(properties.addressDistrict, distrito));
  if (municipio) conditions.push(eq(properties.addressMunicipality, municipio));
  if (minPrice) conditions.push(gte(properties.price, minPrice * 100));
  if (maxPrice) conditions.push(lte(properties.price, maxPrice * 100));
  if (minArea) conditions.push(gte(properties.areaUseful, minArea));
  if (maxArea) conditions.push(lte(properties.areaUseful, maxArea));
  // quartos é agora string ("0,1,2,4") — na listagem só usamos o primeiro valor
  if (quartos !== undefined) {
    const val = Number(String(quartos).split(",")[0]);
    if (!isNaN(val)) conditions.push(eq(properties.bedrooms, val));
  }

  const orderBy = {
    price_asc:  asc(properties.price),
    price_desc: desc(properties.price),
    newest:     desc(properties.publishedAt),
    relevance:  desc(properties.featured),
  }[sort] ?? desc(properties.publishedAt);

  const offset = (page - 1) * limit;

  const [results, countResult] = await Promise.all([
    db
      .select()
      .from(properties)
      .where(and(...conditions))
      .orderBy(desc(properties.featured), orderBy)
      .limit(limit)
      .offset(offset),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(properties)
      .where(and(...conditions)),
  ]);

  const total = countResult[0]?.count ?? 0;

  return {
    results,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

/** Busca imóvel por slug com imagens, anunciante e agência */
export async function getPropertyBySlug(slug: string) {
  const [row] = await db
    .select({
      property: properties,
      user: {
        id: users.id,
        name: users.name,
        email: users.email,
        phone: users.phone,
        avatarUrl: users.avatarUrl,
      },
      agency: {
        id: agencies.id,
        name: agencies.name,
        slug: agencies.slug,
        verified: agencies.verified,
      },
    })
    .from(properties)
    .leftJoin(users, eq(properties.userId, users.id))
    .leftJoin(agencies, eq(properties.agencyId, agencies.id))
    .where(and(eq(properties.slug, slug), eq(properties.status, "active")))
    .limit(1);

  if (!row) return null;

  const images = await db
    .select()
    .from(propertyImages)
    .where(eq(propertyImages.propertyId, row.property.id))
    .orderBy(asc(propertyImages.position));

  return {
    ...row.property,
    images,
    agent: row.user
      ? { ...row.user, agency: row.agency?.id ? row.agency : undefined }
      : undefined,
  };
}

/** Incrementa contagem de views */
export async function incrementViews(id: string) {
  await db
    .update(properties)
    .set({ viewsCount: sql`${properties.viewsCount} + 1` })
    .where(eq(properties.id, id));
}

/** Imóveis similares (mesma zona, tipologia próxima, preço ±25%) */
export async function getSimilarProperties(property: typeof properties.$inferSelect, limit = 3) {
  const priceMin = Math.floor(property.price * 0.75);
  const priceMax = Math.ceil(property.price * 1.25);

  return db
    .select()
    .from(properties)
    .where(
      and(
        eq(properties.status, "active"),
        eq(properties.listingType, property.listingType),
        eq(properties.addressMunicipality, property.addressMunicipality),
        gte(properties.price, priceMin),
        lte(properties.price, priceMax),
        sql`${properties.id} != ${property.id}`
      )
    )
    .orderBy(desc(properties.featured))
    .limit(limit);
}
