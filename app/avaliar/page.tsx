import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Avaliar Imóvel — Estimativa de Valor Gratuita",
  description: "Descubra quanto vale o seu imóvel gratuitamente. Estimativa baseada em dados reais do mercado português em tempo real.",
  alternates: { canonical: "https://suamorada.pt/avaliar" },
};

export default function AvaliarPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-warm">
      <p className="font-serif text-2xl text-navy">Avaliar — em construção</p>
    </main>
  );
}
