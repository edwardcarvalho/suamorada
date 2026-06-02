import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { DISTRICT_SLUGS, PROPERTY_TYPE_SLUGS, PROPERTY_TYPE_LABELS } from "@/types/property";
import { ListingResultsWrapper as ListingResultsClient } from "@/components/listing/ListingResultsWrapper";

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
  const label = DISTRICT_SLUGS[distrito];
  const tipoLabel = PROPERTY_TYPE_LABELS[PROPERTY_TYPE_SLUGS[tipo]];
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <ListingResultsClient
        listingType="arrendar"
        distrito={label}
        tipoImovel={PROPERTY_TYPE_SLUGS[tipo]}
        distritoLabel={label}
        tipoLabel={tipoLabel}
      />
    </div>
  );
}
