import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PublishForm } from "@/components/publish/PublishForm";

export const metadata: Metadata = {
  title: "Publicar Anúncio — Vender ou Arrendar Imóvel Grátis",
  description: "Publique o seu imóvel gratuitamente na Sua Morada. Verificação em 24 horas e acesso a milhares de compradores qualificados.",
  robots: { index: false, follow: false },
};

export default function PublicarPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-warm py-10 px-4">
        <div className="mx-auto max-w-2xl">
          {/* Header da página */}
          <div className="text-center mb-8">
            <h1 className="font-serif text-3xl text-navy mb-2">Publicar o seu imóvel</h1>
            <p className="text-muted font-sans text-sm">
              Grátis · Verificação em 24h · Chegue a milhares de compradores
            </p>
          </div>

          {/* Form (client component com Zustand) */}
          <PublishForm />
        </div>
      </main>
      <Footer />
    </>
  );
}
