import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PublishForm } from "@/components/publish/PublishForm";
import { ArrowRight, ShieldCheck, Clock, Star } from "lucide-react";

export const metadata: Metadata = {
  title: "Vender o seu Imóvel em Portugal — Grátis e Rápido",
  description: "Publique o seu imóvel gratuitamente na Sua Morada. Verificação em 24 horas, fotos ilimitadas e alcance a milhares de compradores.",
  alternates: { canonical: "https://suamorada.pt/vender" },
};

const BENEFITS = [
  { icon: ShieldCheck, title: "Verificação em 24h",    desc: "A nossa equipa valida cada anúncio manualmente." },
  { icon: Clock,       title: "100% Gratuito",          desc: "Sem comissões, sem taxas ocultas. Sempre."      },
  { icon: Star,        title: "Alcance máximo",         desc: "Milhares de compradores activos todos os dias." },
  { icon: ArrowRight,  title: "Publicação imediata",    desc: "Após verificação, o anúncio fica online em minutos." },
];

export default function VenderPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-warm">
        {/* Hero strip */}
        <div className="bg-navy py-10 px-6 text-center">
          <h1 className="font-serif text-3xl text-white mb-2">Venda o seu imóvel</h1>
          <p className="text-white/65 font-sans text-sm max-w-md mx-auto">
            Grátis · Verificação em 24h · Chegue a milhares de compradores qualificados
          </p>
        </div>

        <div className="mx-auto max-w-4xl px-4 py-10">
          {/* Benefits */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {BENEFITS.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white rounded-xl p-4 border border-border/50 text-center">
                <Icon size={22} className="text-brand mx-auto mb-2" />
                <p className="font-sans font-semibold text-sm text-ink mb-1">{title}</p>
                <p className="text-xs text-muted font-sans">{desc}</p>
              </div>
            ))}
          </div>

          {/* Form */}
          <div className="text-center mb-6">
            <h2 className="font-serif text-2xl text-navy mb-1">Publicar o seu imóvel</h2>
            <p className="text-muted font-sans text-sm">Demora menos de 5 minutos</p>
          </div>
          <PublishForm />
        </div>
      </main>
      <Footer />
    </>
  );
}
