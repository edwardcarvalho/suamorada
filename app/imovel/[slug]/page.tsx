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
import { formatPrice, bedroomsLabel, timeAgo } from "@/lib/utils";
import { CONDITION_LABELS, LISTING_TYPE_LABELS } from "@/types/property";
import {
  getPropertyBySlug,
  getSimilarProperties,
  incrementViews,
} from "@/lib/db/queries/properties";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = await getPropertyBySlug(slug);
  if (!p) return {};
  const suffix = p.listingType === "rent" ? "/mês" : "";

  return {
    title: `${p.title} — ${formatPrice(p.price, suffix)}`,
    description: p.description?.slice(0, 155),
    openGraph: {
      type: "website",
      title: p.title,
      description: p.description?.slice(0, 155) ?? undefined,
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
  const p = await getPropertyBySlug(slug);
  if (!p) notFound();

  // Incrementa views em background (sem bloquear render)
  void incrementViews(p.id);

  const suffix = p.listingType === "rent" ? "/mês" : "";
  const similar = await getSimilarProperties(p, 3);

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
              { href: "/",                                                        label: "Início"              },
              { href: "/comprar",                                                  label: "Comprar"             },
              { href: `/comprar/${p.addressDistrict.toLowerCase()}`,               label: p.addressDistrict     },
              { href: `/comprar/${p.addressDistrict.toLowerCase()}/apartamentos`,  label: "Apartamentos"        },
              { href: "#",                                                         label: p.title.slice(0, 30) + "…" },
            ].map((b, i, arr) => (
              <React.Fragment key={b.href + i}>
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
          <PropertyGallery
            images={p.images.map((img) => ({
              ...img,
              width:  img.width  ?? undefined,
              height: img.height ?? undefined,
            }))}
            title={p.title}
            price={p.price}
            listingType={p.listingType}
            details={[
              p.areaGross  ? `${p.areaGross} m² área bruta` : null,
              `T${p.bedrooms}`,
              p.floor != null ? `${p.floor}º andar${p.hasElevator ? " com elevador" : ""}` : null,
            ].filter(Boolean).join(" | ")}
          />

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

              <h1 className="font-serif text-3xl text-ink leading-snug mb-2">{p.title}</h1>

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
                {p.publishedAt && (
                  <span>Publicado {new Date(p.publishedAt).toLocaleDateString("pt-PT")}</span>
                )}
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
                  { icon: Bed,          label: "Quartos",       val: bedroomsLabel(p.bedrooms)                      },
                  { icon: Bath,         label: "Casa de banho", val: p.bathrooms != null ? `${p.bathrooms}` : "—"   },
                  { icon: Square,       label: "Área útil",     val: p.areaUseful  ? `${p.areaUseful} m²`  : "—"   },
                  { icon: Square,       label: "Área bruta",    val: p.areaGross   ? `${p.areaGross} m²`   : "—"   },
                  { icon: Building2,    label: "Andar",         val: p.floor != null ? `${p.floor}º de ${p.totalFloors ?? "?"}` : "—" },
                  { icon: Zap,          label: "Energia",       val: p.energyCertificate ?? "—"                     },
                  { icon: Car,          label: "Garagem",       val: p.hasGarage ? "Incluída" : "Não incluída"       },
                  { icon: CheckCircle2, label: "Estado",        val: p.condition ? CONDITION_LABELS[p.condition] : "—" },
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
              {p.description && (
                <section aria-label="Descrição" className="mb-6">
                  <h2 className="font-sans font-semibold text-base text-ink mb-3">Descrição</h2>
                  <div className="prose prose-sm max-w-none text-muted font-sans leading-relaxed">
                    {p.description.split("\n\n").map((para, i) => (
                      <p key={i} className="mb-3">{para}</p>
                    ))}
                  </div>
                </section>
              )}

              {/* ── AD 2: Rectangle (após descrição) ── */}
              <AdUnit
                slot={process.env.NEXT_PUBLIC_AD_SLOT_RECTANGLE_1 ?? "0"}
                format="rectangle"
                className="mb-6"
              />

              {/* Features */}
              {p.features && p.features.length > 0 && (
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
                      {p.addressParish ? `${p.addressParish}, ` : ""}{p.addressMunicipality}
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

              {/* Similar properties */}
              {similar.length > 0 && (
                <section aria-label="Imóveis similares" className="mb-6">
                  <h2 className="font-sans font-semibold text-base text-ink mb-3">
                    Imóveis Semelhantes em {p.addressMunicipality}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {similar.map((s) => {
                      const sSuffix = s.listingType === "rent" ? "/mês" : "";
                      return (
                        <Link
                          key={s.id}
                          href={`/imovel/${s.slug}`}
                          className="group block bg-white rounded-xl overflow-hidden border border-border/50 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                        >
                          <div className="relative aspect-[4/3] bg-warm-dark overflow-hidden">
                            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-navy/80 to-navy-dark">
                              <span className="font-serif text-white/30 text-sm">Sua Morada</span>
                            </div>
                          </div>
                          <div className="p-3">
                            <p className="font-serif text-xl text-ink mb-0.5">{formatPrice(s.price, sSuffix)}</p>
                            <p className="font-sans text-xs text-ink font-medium line-clamp-1 mb-1">{s.title}</p>
                            <p className="flex items-center gap-1 text-[11px] text-muted mb-2">
                              <MapPin size={11} />{s.addressParish ? `${s.addressParish}, ` : ""}{s.addressMunicipality}
                            </p>
                            <div className="flex gap-3 text-[11px] text-muted border-t border-border pt-2">
                              <span className="flex items-center gap-0.5"><Bed size={11} />{bedroomsLabel(s.bedrooms)}</span>
                              {s.areaUseful && <span className="flex items-center gap-0.5"><Square size={11} />{s.areaUseful} m²</span>}
                              {s.publishedAt && <span className="ml-auto">{timeAgo(s.publishedAt)}</span>}
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </section>
              )}

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
                agentName={p.agent?.name ?? undefined}
                agentRating={undefined}
                agentReviews={undefined}
                agencyName={p.agent?.agency?.name ?? undefined}
                phone={p.agent?.phone ?? undefined}
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
