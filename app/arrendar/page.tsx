import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { ListingResultsWrapper as ListingResultsClient } from "@/components/listing/ListingResultsWrapper";

export const metadata: Metadata = {
  title: "Arrendar Imovel em Portugal",
  description: "Encontre o imovel ideal para arrendar em Portugal.",
  alternates: { canonical: "https://suamorada.pt/arrendar" },
};

export default function ArendarPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <ListingResultsClient listingType="arrendar" />
    </div>
  );
}
