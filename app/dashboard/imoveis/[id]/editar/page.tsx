import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { properties, propertyImages } from "@/lib/db/schema";
import { eq, and, asc } from "drizzle-orm";
import { EditPropertyForm } from "@/components/publish/EditPropertyForm";

export const metadata: Metadata = { title: "Editar Anúncio" };

interface Props { params: Promise<{ id: string }> }

export default async function EditarImoveiPage({ params }: Props) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect("/entrar?callbackUrl=/dashboard/imoveis");

  const [property] = await db.select().from(properties)
    .where(and(eq(properties.id, id), eq(properties.userId, session.user.id)))
    .limit(1);

  if (!property) notFound();

  const images = await db.select().from(propertyImages)
    .where(eq(propertyImages.propertyId, id))
    .orderBy(asc(propertyImages.position));

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm font-sans text-muted">
        <Link href="/dashboard/imoveis" className="flex items-center gap-1 hover:text-navy transition-colors">
          <ChevronLeft size={15} /> Os Meus Imóveis
        </Link>
        <span>/</span>
        <span className="text-ink font-medium truncate max-w-[200px]">{property.title}</span>
      </div>

      <div>
        <h1 className="font-serif text-2xl text-navy">Editar Anúncio</h1>
        <p className="text-sm text-muted font-sans mt-1">
          Altere os detalhes do seu imóvel. As alterações ficam imediatamente visíveis.
        </p>
      </div>

      <EditPropertyForm
        property={{
          ...property,
          images: images.map(img => ({
            id:       img.id,
            url:      img.url,
            position: img.position,
            isCover:  img.isCover,
            width:    img.width,
            height:   img.height,
          })),
        }}
      />
    </div>
  );
}
