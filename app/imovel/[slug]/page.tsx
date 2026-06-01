import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Bed, Bath, Square, Building2, Zap, Car, CheckCircle2,
  MapPin, Eye, Phone, ChevronRight,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/Badge";
import { AdUnit } from "@/components/ads/AdUnit";
import { PropertyGallery } from "@/components/listing/PropertyGallery";
import { ContactSidebar } from "@/components/listing/ContactSidebar";
import { formatPrice, bedroomsLabel } from "@/lib/utils";
import { CONDITION_LABELS, LISTING_TYPE_LABELS } from "@/types/property";

/* Mock enquanto a DB não está ligada — Semana 4 usa dados reais */
function getMockProperty(slug: string) {
  return {
    id: "mock-id-1",
    slug,
    title: "Apartamento T2 com varanda e vista para jardim",
    description: `Excelente apartamento T2 situado no coração de Campo de Ourique, um dos bairros mais tranquilos e residenciais de Lisboa. O imóvel foi totalmente renovado em 2022, com acabamentos de qualidade superior, cozinha equipada com electrodomésticos de topo e casa de banho moderna.

O apartamento dispõe de uma ampla varanda com exposição solar a Sul, soalho flutuante em toda a área habitável e janelas duplas para isolamento acústico e térmico.

Localizado a 5 minutos a pé do jardim, comércio local, supermercados e rede de transportes públicos. Excelente investimento ou habitação própria.`,
    propertyType: "apartment" as const,
    listingType: "sale" as "sale" | "rent",
    price: 28500000,
    priceNegotiable: false,
    areaUseful: 85,
    areaGross: 95,
    bedrooms: 2,
    bathrooms: 1,
    floor: 3,
    totalFloors: 6,
    condition: "used" as const,
    energyCertificate: "B" as const,
    hasGarage: false,
    hasElevator: true,
    hasPool: false,
    hasGarden: false,
    hasBalcony: true,
    features: ["Varanda", "Elevador", "Porteiro", "Arrecadação", "Cozinha equipada", "Ar condicionado"],
    lat: "38.7223", lng: "-9.1590",
    addressStreet: "Rua Ferreira Borges",
    addressParish: "Campo de Ourique",
    addressMunicipality: "Lisboa",
    addressDistrict: "Lisboa",
    addressPostalCode: "1350-119",
    status: "active" as const,
    verified: true,
    featured: true,
    viewsCount: 142,
    contactsCount: 12,
    publishedAt: new Date("2026-05-27").toISOString(),
    createdAt: new Date("2026-05-27").toISOString(),
    updatedAt: new Date("2026-05-27").toISOString(),
    images: [] as Array<{ id: string; url: string; position: number; isCover: boolean }>,
    agent: {
      id: "agent-1",
      name: "Margarida Lima",
      email: "margarida@era.pt",
      phone: "912345678",
      rating: 4.9,
      reviewCount: 127,
      agency: { id: "a1", name: "ERA Lisboa Centro", slug: "era-lisboa-centro", verified: true },
    },
  };
}

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = getMockProperty(slug);
  const suffix = p.listingType === "rent" ? "/mês" : "";

  return {
    title: `${p.title} — ${formatPrice(p.price, suffix)}`,
    description: p.description?.slice(0, 155),
    openGraph: {
      type: "website",
      title: p.title,
      description: p.description?.slice(0, 155),
      images: p.images[0] ? [{ url: p.images[0].url, width: 1200, height: 630 }] : [],
    },
    alternates: { canonical: `https://suamorada.pt/imovel/${slug}` },
  };
}

const ENERGY_COLORS: Record<string, string> = {
  "A+": "bg-green-600",  A: "bg-green-500",
  B:    "bg-lime-500",  "B-": "bg-yellow-400",
  C:    "bg-amber-400",  D: "bg-orange-400",
  E:    "bg-red-400",    F: "bg-red-600",
};

export default async function ImovelPage({ params }: Props) {
  const { slug } = await params;
  const p = getMockProperty(slug);
  if (!p) notFound();

  const suffix = p.listingType === "rent" ? "/mês" : "";
  const listingLabel = LISTING_TYPE_LABELS[p.listingType];

  /* JSON-LD structured data */
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: p.title,
    description: p.description,
    url: `https://suamorada.pt/imovel/${slug}`,
    price: p.price / 100,
    priceCurrency: "EUR",
    address: {
      "@type": "PostalAddress",
      streetAddress: p.addressStreet,
      addressLocality: p.addressMunicipality,
      addressRegion: p.addressDistrict,
      postalCode: p.addressPostalCode,
      addressCountry: "PT",
    },
    numberOfRooms: p.bedrooms,
    floorSize: { "@type": "QuantitativeValue", value: p.areaUseful, unitCode: "MTK" },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Header />
      <main className="bg-warm min-h-screen">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 py-6">

          {/* Breadcrumb */}
          <nav aria-label="Localização" className="flex items-center gap-1.5 text-xs text-muted font-sans mb-6 flex-wrap">
            {[
              { href: "/",                          label: "Início"              },
              { href: "/comprar",                   label: "Comprar"             },
              { href: `/comprar/${p.addressDistrict.toLowerCase()}`, label: p.addressDistrict },
              { href: `/comprar/${p.addressDistrict.toLowerCase()}/apartamentos`, label: "Apartamentos" },
              { href: "#",                          label: p.title.slice(0, 30) + "…" },
            ].map((b, i, arr) => (
              <React.Fragment key={b.href}>
                {i < arr.length - 1 ? (
                  <Link href={b.href} className="hover:text-navy transition-colors">{b.label}</Link>
                ) : (
                  <span className="text-ink font-medium">{b.label}</span>
                )}
                {i < arr.length - 1 && <ChevronRight size={12} className="text-faint" />}
              </React.Fragment>
            ))}
          </nav>

          {/* Gallery */}
          <PropertyGallery images={p.images} title={p.title} />

          {/* ── CONTENT GRID ── */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 mt-8">

            {/* ── LEFT COLUMN ── */}
            <div className="min-w-0">

              {/* Header */}
              <div className="flex flex-wrap items-start gap-3 mb-2">
                {p.verified && (
                  <Badge variant="verified" className="flex items-center gap-1">
                    <CheckCircle2 size={11} /> Verificado
                  </Badge>
                )}
                {p.featured && <Badge variant="featured">Destaque</Badge>}
              </div>

              <h1 className="font-serif text-3xl text-ink leading-snug mb-2">
                {p.title}
              </h1>

              <p className="flex items-center gap-1.5 text-sm text-muted font-sans mb-4">
                <MapPin size={14} className="text-brand shrink-0" />
                {[p.addressStreet, p.addressParish, p.addressMunicipality].filter(Boolean).join(", ")}
              </p>

              <div className="flex items-baseline gap-4 flex-wrap mb-2">
                <span className="font-serif text-4xl text-brand">{formatPrice(p.price, suffix)}</span>
                {p.priceNegotiable && (
                  <span className="text-sm text-muted font-sans">Preço negociável</span>
                )}
              </div>

              <div className="flex items-center gap-4 text-xs text-faint font-sans mb-6">
                <span className="flex items-center gap-1"><Eye size={12} />{p.viewsCount} visualizações</span>
                <span className="flex items-center gap-1"><Phone size={12} />{p.contactsCount} contactos</span>
                <span>Publicado {p.publishedAt ? new Date(p.publishedAt).toLocaleDateString("pt-PT") : "—"}</span>
              </div>

              {/* ── AD 1: Leaderboard ── */}
              <AdUnit
                slot={process.env.NEXT_PUBLIC_AD_SLOT_LEADERBOARD_1 ?? "0"}
                format="leaderboard"
                className="mb-6 hidden md:block"
              />
              <AdUnit
                slot={process.env.NEXT_PUBLIC_AD_SLOT_RECTANGLE_1 ?? "0"}
                format="rectangle"
                className="mb-6 md:hidden"
              />

              {/* Stats grid */}
              <div className="bg-white rounded-xl border border-border/50 shadow-sm p-5 grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                {[
                  { icon: Bed,       label: "Quartos",       val: bedroomsLabel(p.bedrooms)                  },
                  { icon: Bath,      label: "Casa de banho",  val: `${p.bathrooms ?? "—"}`                    },
                  { icon: Square,    label: "Área útil",      val: p.areaUseful ? `${p.areaUseful} m²` : "—" },
                  { icon: Square,    label: "Área bruta",     val: p.areaGross  ? `${p.areaGross} m²`  : "—" },
                  { icon: Building2, label: "Andar",          val: p.floor !== undefined ? `${p.floor}º de ${p.totalFloors}` : "—" },
                  { icon: Zap,       label: "Energia",        val: p.energyCertificate ?? "—"                },
                  { icon: Car,       label: "Garagem",        val: p.hasGarage ? "Incluída" : "Não incluída"  },
                  { icon: CheckCircle2, label: "Estado",      val: p.condition ? CONDITION_LABELS[p.condition] : "—" },
                ].map(({ icon: Icon, label, val }) => (
                  <div key={label} className="flex flex-col gap-1">
                    <span className="text-[10px] font-sans font-semibold uppercase tracking-wider text-faint flex items-center gap-1">
                      <Icon size={11} aria-hidden="true" /> {label}
                    </span>
                    <span className="font-sans font-semibold text-sm text-ink">{val}</span>
                  </div>
                ))}
              </div>

              {/* Description */}
              <section aria-label="Descrição" className="mb-6">
                <h2 className="font-sans font-semibold text-base text-ink mb-3">Descrição</h2>
                <div className="prose prose-sm max-w-none text-muted font-sans leading-relaxed">
                  {p.description?.split("\n\n").map((para, i) => (
                    <p key={i} className="mb-3">{para}</p>
                  ))}
                </div>
              </section>

              {/* ── AD 2: Rectangle (após descrição) ── */}
              <AdUnit
                slot={process.env.NEXT_PUBLIC_AD_SLOT_RECTANGLE_1 ?? "0"}
                format="rectangle"
                className="mb-6"
              />

              {/* Features */}
              {p.features.length > 0 && (
                <section aria-label="Características" className="mb-6">
                  <h2 className="font-sans font-semibold text-base text-ink mb-3">Características</h2>
                  <div className="flex flex-wrap gap-2">
                    {p.features.map((f) => (
                      <span key={f}
                        className="text-xs font-sans font-medium text-navy bg-navy/8 border border-navy/15 px-3 py-1.5 rounded-full">
                        {f}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {/* ── AD 3: Leaderboard (antes do mapa) ── */}
              <AdUnit
                slot={process.env.NEXT_PUBLIC_AD_SLOT_LEADERBOARD_2 ?? "0"}
                format="leaderboard"
                className="mb-6 hidden md:block"
              />

              {/* Map placeholder */}
              <section aria-label="Localização no mapa" className="mb-6">
                <h2 className="font-sans font-semibold text-base text-ink mb-3">Localização</h2>
                <div className="bg-warm-dark rounded-xl h-60 flex items-center justify-center border border-border">
                  <div className="text-center">
                    <MapPin size={28} className="text-faint mx-auto mb-2" />
                    <p className="text-sm text-muted font-sans">
                      {p.addressParish}, {p.addressMunicipality}
                    </p>
                    <p className="text-xs text-faint font-sans mt-1">
                      Localização aproximada por privacidade
                    </p>
                  </div>
                </div>
              </section>

              {/* ── AD 4: após mapa ── */}
              <AdUnit
                slot={process.env.NEXT_PUBLIC_AD_SLOT_RECTANGLE_1 ?? "0"}
                format="rectangle"
                className="mb-6"
              />

              {/* Similar properties placeholder */}
              <section aria-label="Imóveis similares" className="mb-6">
                <h2 className="font-sans font-semibold text-base text-ink mb-3">
                  Imóveis Semelhantes em {p.addressMunicipality}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[1,2,3].map((i) => (
                    <div key={i} className="bg-white rounded-xl border border-border/50 p-4 animate-pulse">
                      <div className="aspect-[4/3] bg-warm-dark rounded-lg mb-3" />
                      <div className="h-5 bg-warm-dark rounded w-2/3 mb-2" />
                      <div className="h-4 bg-warm-dark rounded w-full mb-2" />
                      <div className="h-3 bg-warm-dark rounded w-1/2" />
                    </div>
                  ))}
                </div>
              </section>

              {/* ── AD 5: final da página ── */}
              <AdUnit
                slot={process.env.NEXT_PUBLIC_AD_SLOT_LEADERBOARD_3 ?? "0"}
                format="leaderboard"
                className="hidden md:block"
              />
            </div>

            {/* ── RIGHT COLUMN (Sidebar) ── */}
            <div className="lg:block">
              <ContactSidebar
                propertyId={p.id}
                price={p.price}
                listingType={p.listingType}
                title={p.title}
                agentName={p.agent?.name}
                agentRating={p.agent?.rating}
                agentReviews={p.agent?.reviewCount}
                agencyName={p.agent?.agency?.name}
                phone={p.agent?.phone}
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
