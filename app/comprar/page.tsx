import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { ListingResultsClient } from "@/components/listing/ListingResultsClient";

export const metadata: Metadata = {
  title: "Comprar Imóvel em Portugal — Apartamentos, Moradias e Vivendas",
  description:
    "Encontre o imóvel ideal para comprar em Portugal. Milhares de apartamentos, moradias e vivendas em Lisboa, Porto, Algarve e todo o país.",
  alternates: { canonical: "https://suamorada.pt/comprar" },
};

export default function ComprarPage() {
  return (
    <>
      <Header />
      <ListingResultsClient listingType="comprar" />
    </>
  );
}
