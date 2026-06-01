import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { DISTRICT_SLUGS } from "@/types/property";
import { ListingResultsClient } from "@/components/listing/ListingResultsClient";

interface Props { params: Promise<{ distrito: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { distrito } = await params;
  const label = DISTRICT_SLUGS[distrito];
  if (!label) return {};
  return {
    title: `Imóveis para Venda em ${label}`,
    description: `Comprar imóvel em ${label}. Apartamentos, moradias e vivendas verificados com fotos e preços actualizados.`,
    alternates: { canonical: `https://suamorada.pt/comprar/${distrito}` },
  };
}

export function generateStaticParams() {
  return Object.keys(DISTRICT_SLUGS).map((distrito) => ({ distrito }));
}

export default async function ComprarDistritoPage({ params }: Props) {
  const { distrito } = await params;
  const label = DISTRICT_SLUGS[distrito];
  if (!label) notFound();
  return (
    <>
      <Header />
      <ListingResultsClient listingType="comprar" distrito={distrito} distritoLabel={label} />
    </>
  );
}
