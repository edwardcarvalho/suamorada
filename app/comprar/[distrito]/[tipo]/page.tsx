import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DISTRICT_SLUGS, PROPERTY_TYPE_SLUGS, PROPERTY_TYPE_LABELS } from "@/types/property";
import { ListingResultsClient } from "@/components/listing/ListingResultsClient";

interface Props {
  params: Promise<{ distrito: string; tipo: string }>;
  searchParams: Promise<Record<string, string>>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { distrito, tipo } = await params;
  const distritoLabel = DISTRICT_SLUGS[distrito];
  const propertyType  = PROPERTY_TYPE_SLUGS[tipo];
  if (!distritoLabel || !propertyType) return {};

  const tipoLabel = PROPERTY_TYPE_LABELS[propertyType];
  return {
    title: `${tipoLabel} para Venda em ${distritoLabel}`,
    description: `Encontre ${tipoLabel.toLowerCase()} para comprar em ${distritoLabel}. Anúncios verificados com fotos, preços e contactos directos.`,
    alternates: { canonical: `https://suamorada.pt/comprar/${distrito}/${tipo}` },
  };
}

export function generateStaticParams() {
  return Object.keys(DISTRICT_SLUGS).flatMap((distrito) =>
    Object.keys(PROPERTY_TYPE_SLUGS).map((tipo) => ({ distrito, tipo }))
  );
}

export default async function ComprarDistritoTipoPage({ params, searchParams }: Props) {
  const { distrito, tipo } = await params;
  const sp = await searchParams;
  if (!DISTRICT_SLUGS[distrito] || !PROPERTY_TYPE_SLUGS[tipo]) notFound();

  const propertyType = PROPERTY_TYPE_SLUGS[tipo];
  const distritoLabel = DISTRICT_SLUGS[distrito];
  const tipoLabel = PROPERTY_TYPE_LABELS[propertyType];

  return (
    <ListingResultsClient
      listingType="comprar"
      distrito={distrito}
      tipoImovel={tipo}
      distritoLabel={distritoLabel}
      tipoLabel={tipoLabel}
      initialSort={(sp.sort as string) ?? "newest"}
    />
  );
}
