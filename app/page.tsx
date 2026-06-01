import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SearchBar } from "@/components/search/SearchBar";
import { ShieldCheck, Clock, Star, TrendingUp, ArrowRight } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sua Morada — Comprar, Vender e Arrendar Imóveis em Portugal",
  description:
    "Encontre o imóvel ideal em Portugal. Milhares de apartamentos, moradias e vivendas verificados para compra e arrendamento em Lisboa, Porto, Algarve e todo o país.",
};

const POPULAR_SEARCHES = [
  { href: "/comprar/lisboa/apartamentos",   label: "Apartamentos Lisboa" },
  { href: "/comprar/porto/apartamentos",    label: "Apartamentos Porto"  },
  { href: "/arrendar/lisboa/apartamentos",  label: "Arrendar Lisboa"     },
  { href: "/comprar/faro",                  label: "Imóveis Algarve"     },
  { href: "/comprar/lisboa/moradias",       label: "Moradias Lisboa"     },
  { href: "/comprar/braga",                 label: "Imóveis Braga"       },
];

const TRUST_STATS = [
  { icon: ShieldCheck, value: "10.000+", label: "Imóveis verificados",     color: "text-trust"  },
  { icon: Clock,       value: "< 24h",   label: "Tempo de verificação",    color: "text-brand"  },
  { icon: Star,        value: "4.9 / 5", label: "Avaliação dos utilizadores", color: "text-yellow-400" },
  { icon: TrendingUp,  value: "100%",    label: "Grátis para compradores", color: "text-trust"  },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Pesquise",
    desc: "Filtre por localização, tipologia, preço e área. Use o mapa para encontrar o imóvel perfeito.",
  },
  {
    step: "02",
    title: "Compare",
    desc: "Veja fotos reais, plantas e estimativas de valor. Guarde os favoritos para comparar depois.",
  },
  {
    step: "03",
    title: "Contacte",
    desc: "Fale directamente com o agente. Resposta garantida em menos de 24 horas.",
  },
];

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        {/* ── HERO ── */}
        <section
          className="relative min-h-[88vh] flex flex-col items-center justify-center px-6 pb-16 overflow-hidden"
          style={{
            background: "linear-gradient(160deg, #0d2035 0%, #1B3A5C 55%, #162d47 100%)",
          }}
        >
          {/* Skyline decorativa */}
          <div className="absolute bottom-0 left-0 right-0 h-64 opacity-[0.06] pointer-events-none"
            style={{
              background: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1440' height='200'%3E%3Crect x='0' y='80' width='80' height='120' fill='white'/%3E%3Crect x='85' y='60' width='70' height='140' fill='white'/%3E%3Crect x='160' y='90' width='60' height='110' fill='white'/%3E%3Crect x='225' y='50' width='100' height='150' fill='white'/%3E%3Crect x='330' y='70' width='80' height='130' fill='white'/%3E%3Crect x='415' y='40' width='120' height='160' fill='white'/%3E%3Crect x='540' y='65' width='85' height='135' fill='white'/%3E%3Crect x='630' y='35' width='110' height='165' fill='white'/%3E%3Crect x='745' y='55' width='90' height='145' fill='white'/%3E%3Crect x='840' y='30' width='130' height='170' fill='white'/%3E%3Crect x='975' y='60' width='85' height='140' fill='white'/%3E%3Crect x='1065' y='45' width='105' height='155' fill='white'/%3E%3Crect x='1175' y='70' width='75' height='130' fill='white'/%3E%3Crect x='1255' y='35' width='115' height='165' fill='white'/%3E%3Crect x='1375' y='60' width='65' height='140' fill='white'/%3E%3C/svg%3E\") bottom center / cover no-repeat",
            }}
          />

          {/* Eyebrow */}
          <div className="flex items-center gap-2 bg-brand/20 border border-brand/30 rounded-full px-4 py-1.5 mb-8">
            <ShieldCheck size={14} className="text-brand" />
            <span className="text-xs font-sans font-semibold text-brand tracking-wide uppercase">
              Portal imobiliário verificado em Portugal
            </span>
          </div>

          {/* Headline */}
          <h1
            className="text-center font-serif leading-tight mb-4"
            style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)", color: "#FFFFFF" }}
          >
            Encontre a sua morada
            <br />
            <span style={{ color: "#E8651A" }}>ideal em Portugal</span>
          </h1>

          <p className="text-center font-sans text-lg text-white/65 mb-10 max-w-xl">
            Milhares de propriedades verificadas em todo o país.
            Resposta garantida em menos de 24 horas.
          </p>

          {/* Search bar */}
          <SearchBar className="w-full" />

          {/* Pesquisas populares */}
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            <span className="text-xs text-white/40 font-sans self-center">Popular:</span>
            {POPULAR_SEARCHES.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="text-xs font-sans text-white/60 hover:text-white border border-white/10 hover:border-white/30 rounded-full px-3 py-1 transition-all"
              >
                {s.label}
              </Link>
            ))}
          </div>
        </section>

        {/* ── TRUST STATS ── */}
        <section className="bg-navy py-12 px-6">
          <div className="mx-auto max-w-[1280px] grid grid-cols-2 lg:grid-cols-4 gap-6">
            {TRUST_STATS.map(({ icon: Icon, value, label, color }) => (
              <div key={label} className="flex items-center gap-3">
                <Icon size={28} className={cn(color, "shrink-0")} aria-hidden="true" />
                <div>
                  <p className="font-serif text-2xl text-white leading-none">{value}</p>
                  <p className="text-xs text-white/50 font-sans mt-0.5">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── COMO FUNCIONA ── */}
        <section className="py-20 px-6 bg-white">
          <div className="mx-auto max-w-[1280px]">
            <div className="text-center mb-12">
              <h2 className="font-serif text-4xl text-navy mb-3">Como funciona</h2>
              <p className="text-muted font-sans max-w-md mx-auto">
                Encontrar o imóvel certo nunca foi tão simples.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {HOW_IT_WORKS.map((step) => (
                <div key={step.step} className="relative">
                  <p
                    className="font-serif absolute -top-4 left-0 select-none pointer-events-none"
                    style={{ fontSize: "5rem", lineHeight: 1, color: "rgba(232,101,26,0.08)" }}
                  >
                    {step.step}
                  </p>
                  <div className="pt-8">
                    <h3 className="font-sans font-bold text-lg text-ink mb-2">{step.title}</h3>
                    <p className="text-sm text-muted font-sans leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PESQUISAS RÁPIDAS ── */}
        <section className="py-20 px-6 bg-warm">
          <div className="mx-auto max-w-[1280px]">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-serif text-3xl text-navy">Explore por zona</h2>
              <Link href="/comprar" className="text-sm text-brand font-sans font-semibold flex items-center gap-1 hover:gap-2 transition-all">
                Ver todos <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                { href: "/comprar/lisboa",  label: "Lisboa",   count: "2.400+" },
                { href: "/comprar/porto",   label: "Porto",    count: "1.800+" },
                { href: "/comprar/braga",   label: "Braga",    count: "950+"   },
                { href: "/comprar/faro",    label: "Algarve",  count: "1.200+" },
                { href: "/comprar/setubal", label: "Setúbal",  count: "680+"   },
                { href: "/comprar/aveiro",  label: "Aveiro",   count: "420+"   },
              ].map((z) => (
                <Link
                  key={z.href}
                  href={z.href}
                  className="group bg-white rounded-xl p-5 border border-border hover:border-navy hover:shadow-md transition-all text-center"
                >
                  <p className="font-sans font-semibold text-ink group-hover:text-navy transition-colors">{z.label}</p>
                  <p className="text-xs text-faint mt-1">{z.count} imóveis</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA VENDER ── */}
        <section
          className="py-20 px-6"
          style={{ background: "linear-gradient(135deg, #1B3A5C 0%, #0d2035 100%)" }}
        >
          <div className="mx-auto max-w-[1280px] flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="font-serif text-3xl text-white mb-3">
                Quer vender ou arrendar o seu imóvel?
              </h2>
              <p className="text-white/65 font-sans max-w-lg">
                Publique gratuitamente. Verificação em 24h. Chegue a milhares de compradores qualificados.
              </p>
            </div>
            <div className="flex gap-3 shrink-0">
              <Link
                href="/vender"
                className="bg-brand hover:bg-brand-dark text-white font-sans font-semibold text-sm px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
              >
                Publicar grátis <ArrowRight size={16} />
              </Link>
              <Link
                href="/avaliar"
                className="bg-white/10 hover:bg-white/20 text-white font-sans font-semibold text-sm px-6 py-3 rounded-lg transition-colors border border-white/20"
              >
                Avaliar imóvel
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}
