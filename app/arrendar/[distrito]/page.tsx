import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { DISTRICT_SLUGS } from "@/types/property";
import { ListingResultsWrapper as ListingResultsClient } from "@/components/listing/ListingResultsWrapper";

interface Props { params: Promise<{ distrito: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { distrito } = await params;
  const label = DISTRICT_SLUGS[distrito];
  if (!label) return {};
  return {
    title: `Arrendar Imóvel em ${label}`,
    description: `Arrendamento em ${label}. Apartamentos e moradias verificados com fotos e preços actualizados.`,
    alternates: { canonical: `https://suamorada.pt/arrendar/${distrito}` },
  };
}

export function generateStaticParams() {
  return Object.keys(DISTRICT_SLUGS).map((distrito) => ({ distrito }));
}

export default async function ArendarDistritoPage({ params }: Props) {
  const { distrito } = await params;
  const label = DISTRICT_SLUGS[distrito];
  if (!label) notFound();
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <ListingResultsClient listingType="arrendar" distrito={label} distritoLabel={label} />
    </div>
  );
}
