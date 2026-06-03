import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { properties, propertyImages } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

// ── GET: buscar imóvel por ID (para pré-preencher formulário de edição) ──────
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const [property] = await db.select().from(properties)
    .where(and(eq(properties.id, id), eq(properties.userId, session.user.id)))
    .limit(1);

  if (!property) return NextResponse.json({ error: "Não encontrado" }, { status: 404 });

  const images = await db.select().from(propertyImages)
    .where(eq(propertyImages.propertyId, id));

  return NextResponse.json({ ...property, images });
}

// ── PUT: actualizar imóvel ────────────────────────────────────────────────────
const updateSchema = z.object({
  listingType:      z.enum(["sale", "rent"]).optional(),
  propertyType:     z.enum(["apartment","house","villa","commercial","land","garage"]).optional(),
  title:            z.string().min(10).max(100).optional(),
  description:      z.string().min(50).max(2000).optional(),
  price:            z.number().positive().optional(),
  priceNegotiable:  z.boolean().optional(),
  bedrooms:         z.number().min(0).max(10).optional(),
  bathrooms:        z.number().min(0).max(10).optional(),
  areaUseful:       z.number().positive().optional(),
  areaGross:        z.number().positive().optional(),
  floor:            z.number().optional(),
  totalFloors:      z.number().optional(),
  condition:        z.enum(["new","used","needs_renovation","under_construction"]).optional(),
  energyCertificate:z.enum(["A+","A","B","B-","C","D","E","F","exempt"]).optional(),
  hasGarage:        z.boolean().optional(),
  hasElevator:      z.boolean().optional(),
  hasPool:          z.boolean().optional(),
  hasGarden:        z.boolean().optional(),
  features:         z.array(z.string()).optional(),
  lat:              z.string().optional(),
  lng:              z.string().optional(),
  addressStreet:    z.string().optional(),
  addressParish:    z.string().optional(),
  addressMunicipality: z.string().optional(),
  addressDistrict:  z.string().optional(),
  addressPostalCode:z.string().optional(),
  images: z.array(z.object({
    url:      z.string().url(),
    key:      z.string().optional(),
    position: z.number(),
    isCover:  z.boolean(),
    width:    z.number().optional(),
    height:   z.number().optional(),
  })).optional(),
});

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  // Verifica propriedade do imóvel
  const [existing] = await db.select({ id: properties.id })
    .from(properties)
    .where(and(eq(properties.id, id), eq(properties.userId, session.user.id)))
    .limit(1);

  if (!existing) return NextResponse.json({ error: "Não encontrado ou sem permissão" }, { status: 404 });

  const body  = await req.json().catch(() => ({}));
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Dados inválidos", details: parsed.error.flatten() }, { status: 400 });

  const d = parsed.data;

  try {
    const updateData: Record<string, unknown> = { updatedAt: new Date() };
    if (d.listingType)       updateData.listingType       = d.listingType;
    if (d.propertyType)      updateData.propertyType      = d.propertyType;
    if (d.title)             updateData.title             = d.title;
    if (d.description)       updateData.description       = d.description;
    if (d.price !== undefined) updateData.price           = Math.round(d.price * 100);
    if (d.priceNegotiable !== undefined) updateData.priceNegotiable = d.priceNegotiable;
    if (d.bedrooms !== undefined) updateData.bedrooms     = d.bedrooms;
    if (d.bathrooms !== undefined) updateData.bathrooms   = d.bathrooms;
    if (d.areaUseful !== undefined) updateData.areaUseful = d.areaUseful;
    if (d.areaGross !== undefined)  updateData.areaGross  = d.areaGross;
    if (d.floor !== undefined)      updateData.floor      = d.floor;
    if (d.totalFloors !== undefined) updateData.totalFloors = d.totalFloors;
    if (d.condition)         updateData.condition         = d.condition;
    if (d.energyCertificate) updateData.energyCertificate = d.energyCertificate;
    if (d.hasGarage !== undefined)   updateData.hasGarage   = d.hasGarage;
    if (d.hasElevator !== undefined) updateData.hasElevator = d.hasElevator;
    if (d.hasPool !== undefined)     updateData.hasPool     = d.hasPool;
    if (d.hasGarden !== undefined)   updateData.hasGarden   = d.hasGarden;
    if (d.features)          updateData.features          = d.features;
    if (d.lat)               updateData.lat               = d.lat;
    if (d.lng)               updateData.lng               = d.lng;
    if (d.addressStreet)     updateData.addressStreet     = d.addressStreet;
    if (d.addressParish)     updateData.addressParish     = d.addressParish;
    if (d.addressMunicipality) updateData.addressMunicipality = d.addressMunicipality;
    if (d.addressDistrict)   updateData.addressDistrict   = d.addressDistrict;
    if (d.addressPostalCode) updateData.addressPostalCode = d.addressPostalCode;

    await db.update(properties).set(updateData as never).where(eq(properties.id, id));

    // Actualiza imagens se fornecidas
    if (d.images !== undefined) {
      await db.delete(propertyImages).where(eq(propertyImages.propertyId, id));
      if (d.images.length > 0) {
        await db.insert(propertyImages).values(
          d.images.map(img => ({
            propertyId: id,
            url:        img.url,
            position:   img.position,
            isCover:    img.isCover,
            width:      img.width,
            height:     img.height,
          }))
        );
      }
    }

    return NextResponse.json({ success: true, id });
  } catch (err) {
    console.error("[properties PUT]", err);
    return NextResponse.json({ error: "Erro ao actualizar" }, { status: 500 });
  }
}

// ── DELETE ────────────────────────────────────────────────────────────────────
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const [existing] = await db.select({ id: properties.id })
    .from(properties)
    .where(and(eq(properties.id, id), eq(properties.userId, session.user.id)))
    .limit(1);

  if (!existing) return NextResponse.json({ error: "Não encontrado" }, { status: 404 });

  await db.delete(properties).where(eq(properties.id, id));
  return NextResponse.json({ success: true });
}
