import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { ListingResultsClient } from "@/components/listing/ListingResultsClient";

export const metadata: Metadata = {
  title: "Arrendar Imóvel em Portugal",
  description: "Encontre o imóvel ideal para arrendar em Portugal. Milhares de apartamentos e moradias verificados em Lisboa, Porto e por todo o país.",
  alternates: { canonical: "https://suamorada.pt/arrendar" },
};

export default function ArendarPage() {
  return (
    <>
      <Header />
      <ListingResultsClient listingType="arrendar" />
    </>
  );
}
