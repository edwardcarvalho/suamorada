import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DISTRICT_SLUGS, PROPERTY_TYPE_SLUGS, PROPERTY_TYPE_LABELS } from "@/types/property";

interface Props {
  params: Promise<{ distrito: string; tipo: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { distrito, tipo } = await params;
  const distritoLabel = DISTRICT_SLUGS[distrito];
  const propertyType  = PROPERTY_TYPE_SLUGS[tipo];
  if (!distritoLabel || !propertyType) return {};
  const tipoLabel = PROPERTY_TYPE_LABELS[propertyType];
  return {
    title: `${tipoLabel} para Arrendar em ${distritoLabel}`,
    description: `Arrendar ${tipoLabel.toLowerCase()} em ${distritoLabel}. Anúncios verificados com fotos e contactos directos.`,
    alternates: { canonical: `https://suamorada.pt/arrendar/${distrito}/${tipo}` },
  };
}

export function generateStaticParams() {
  return Object.keys(DISTRICT_SLUGS).flatMap((distrito) =>
    Object.keys(PROPERTY_TYPE_SLUGS).map((tipo) => ({ distrito, tipo }))
  );
}

export default async function ArendarDistritoTipoPage({ params }: Props) {
  const { distrito, tipo } = await params;
  if (!DISTRICT_SLUGS[distrito] || !PROPERTY_TYPE_SLUGS[tipo]) notFound();
  return (
    <main className="min-h-screen flex items-center justify-center bg-warm">
      <p className="font-serif text-2xl text-navy">
        {PROPERTY_TYPE_LABELS[PROPERTY_TYPE_SLUGS[tipo]]} para arrendar em{" "}
        {DISTRICT_SLUGS[distrito]} — em construção
      </p>
    </main>
  );
}
