import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { properties, propertyImages } from "@/lib/db/schema";
import { slugify } from "@/lib/utils";
import { randomBytes } from "crypto";

const imageSchema = z.object({
  url:      z.string().url(),
  key:      z.string(),
  position: z.number(),
  isCover:  z.boolean(),
  width:    z.number().optional(),
  height:   z.number().optional(),
});

const schema = z.object({
  listingType:     z.enum(["sale", "rent"]),
  propertyType:    z.enum(["apartment","house","villa","commercial","land","garage"]),
  title:           z.string().min(10).max(100),
  description:     z.string().min(50).max(2000),
  price:           z.number().positive(),         // em euros (convertemos para cêntimos)
  priceNegotiable: z.boolean().default(false),
  bedrooms:        z.number().min(0).max(10),
  bathrooms:       z.number().min(0).max(10).optional(),
  areaUseful:      z.number().positive().optional(),
  areaGross:       z.number().positive().optional(),
  floor:           z.number().optional(),
  totalFloors:     z.number().optional(),
  condition:       z.enum(["new","used","needs_renovation","under_construction"]).optional(),
  energyCertificate: z.enum(["A+","A","B","B-","C","D","E","F","exempt"]).optional(),
  hasGarage:       z.boolean().default(false),
  hasElevator:     z.boolean().default(false),
  hasPool:         z.boolean().default(false),
  hasGarden:       z.boolean().default(false),
  features:        z.array(z.string()).default([]),
  lat:             z.string(),
  lng:             z.string(),
  addressStreet:   z.string().optional(),
  addressParish:   z.string().optional(),
  addressMunicipality: z.string().min(2),
  addressDistrict: z.string().min(2),
  addressPostalCode: z.string().optional(),
  images:          z.array(imageSchema).min(1, "Mínimo 1 foto obrigatória"),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Autenticação necessária" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Dados inválidos", details: parsed.error.flatten() }, { status: 400 });
  }

  const d = parsed.data;

  // Gerar slug único
  const baseSlug = slugify(
    `${d.propertyType}-t${d.bedrooms}-${d.addressParish ?? d.addressMunicipality}-${d.addressMunicipality}`
  );
  const uid = randomBytes(3).toString("hex");
  const slug = `${baseSlug}-${uid}`;

  try {
    const [property] = await db.insert(properties).values({
      slug,
      title:            d.title,
      description:      d.description,
      propertyType:     d.propertyType,
      listingType:      d.listingType,
      price:            Math.round(d.price * 100),
      priceNegotiable:  d.priceNegotiable,
      areaUseful:       d.areaUseful,
      areaGross:        d.areaGross,
      bedrooms:         d.bedrooms,
      bathrooms:        d.bathrooms,
      floor:            d.floor,
      totalFloors:      d.totalFloors,
      condition:        d.condition,
      energyCertificate:d.energyCertificate,
      hasGarage:        d.hasGarage,
      hasElevator:      d.hasElevator,
      hasPool:          d.hasPool,
      hasGarden:        d.hasGarden,
      features:         d.features,
      lat:              d.lat,
      lng:              d.lng,
      addressStreet:    d.addressStreet,
      addressParish:    d.addressParish,
      addressMunicipality: d.addressMunicipality,
      addressDistrict:  d.addressDistrict,
      addressPostalCode:d.addressPostalCode,
      status:           "active",
      publishedAt:      new Date(),
      userId:           session.user.id,
    }).returning();

    if (d.images.length) {
      await db.insert(propertyImages).values(
        d.images.map((img) => ({
          propertyId: property.id,
          url:        img.url,
          position:   img.position,
          isCover:    img.isCover,
          width:      img.width,
          height:     img.height,
        }))
      );
    }

    return NextResponse.json({ id: property.id, slug, status: "pending_review" }, { status: 201 });
  } catch (err) {
    console.error("[properties POST]", err);
    return NextResponse.json({ error: "Erro ao criar anúncio" }, { status: 500 });
  }
}
