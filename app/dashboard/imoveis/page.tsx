import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { properties } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { PlusCircle } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = { title: "Os Meus Imóveis" };

const STATUS_CONFIG: Record<string, { label: string; variant: "verified"|"paused"|"pending"|"sold"|"new" }> = {
  active:         { label: "Activo",      variant: "verified" },
  paused:         { label: "Pausado",     variant: "paused"   },
  pending_review: { label: "Em revisão",  variant: "pending"  },
  sold:           { label: "Vendido",     variant: "sold"     },
  rented:         { label: "Arrendado",   variant: "sold"     },
  expired:        { label: "Expirado",    variant: "paused"   },
  draft:          { label: "Rascunho",    variant: "new"      },
};

const LISTING_LABEL: Record<string, string> = {
  sale: "Venda", rent: "Arrendamento",
};

const TYPE_LABEL: Record<string, string> = {
  apartment: "Apartamento", house: "Moradia", villa: "Vivenda",
  commercial: "Comercial",  land: "Terreno",  garage: "Garagem",
};

export default async function ImoveisPage() {
  const session = await auth();
  const userId  = session?.user?.id;

  const myListings = userId
    ? await db.select().from(properties)
        .where(eq(properties.userId, userId))
        .orderBy(desc(properties.createdAt))
    : [];

  return (
    <div className="space-y-5 max-w-[1100px]">

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div>
          <h2 className="font-sans font-semibold text-lg text-ink">Os Meus Imóveis</h2>
          <p className="text-sm text-muted font-sans">{myListings.length} anúncio{myListings.length !== 1 ? "s" : ""}</p>
        </div>
        <Button variant="primary" size="sm" asChild>
          <Link href="/publicar" className="flex items-center gap-1.5">
            <PlusCircle size={14} /> Publicar Anúncio
          </Link>
        </Button>
      </div>

      {myListings.length === 0 ? (
        <div className="bg-white rounded-xl border border-border/50 shadow-sm p-12 text-center">
          <h3 className="font-serif text-xl text-ink mb-2">Sem anúncios ainda</h3>
          <p className="text-sm text-muted font-sans mb-6">
            Publique o seu primeiro imóvel gratuitamente.
          </p>
          <Button variant="primary" asChild>
            <Link href="/publicar" className="flex items-center gap-2">
              <PlusCircle size={16} /> Publicar Anúncio
            </Link>
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-border/50 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b border-border bg-warm/50">
                  {["Imóvel","Tipo","Status","Preço","Views","Contactos","Data","Acções"].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-[10px] font-sans font-semibold uppercase tracking-wider text-faint whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {myListings.map(l => {
                  const st      = STATUS_CONFIG[l.status] ?? STATUS_CONFIG.paused;
                  const suffix  = l.listingType === "rent" ? "/mês" : "";
                  const isLive  = l.status === "active";
                  return (
                    <tr key={l.id} className="hover:bg-warm/30 transition-colors">
                      <td className="px-5 py-4 max-w-[220px]">
                        {isLive ? (
                          <Link href={`/imovel/${l.slug}`}
                            className="font-sans font-semibold text-sm text-ink hover:text-brand transition-colors line-clamp-1">
                            {l.title}
                          </Link>
                        ) : (
                          <span className="font-sans font-semibold text-sm text-ink line-clamp-1">{l.title}</span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-xs font-sans text-muted whitespace-nowrap">
                        {TYPE_LABEL[l.propertyType] ?? l.propertyType} · {LISTING_LABEL[l.listingType] ?? l.listingType}
                      </td>
                      <td className="px-5 py-4">
                        <Badge variant={st.variant}>{st.label}</Badge>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className="font-sans font-semibold text-sm text-ink">
                          {formatPrice(l.price, suffix)}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm font-sans text-muted">{l.viewsCount}</td>
                      <td className="px-5 py-4 text-sm font-sans text-muted">{l.contactsCount}</td>
                      <td className="px-5 py-4 text-xs font-sans text-faint whitespace-nowrap">
                        {l.publishedAt
                          ? new Date(l.publishedAt).toLocaleDateString("pt-PT", { day: "numeric", month: "short", year: "2-digit" })
                          : "—"}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5">
                          <Link href={`/dashboard/imoveis/${l.id}/editar`}
                            className="text-xs font-sans font-medium text-navy bg-warm hover:bg-warm-dark px-2.5 py-1.5 rounded-lg transition-colors">
                            Editar
                          </Link>
                          {isLive && (
                            <Link href={`/imovel/${l.slug}`}
                              className="text-xs font-sans font-medium text-muted hover:text-brand px-2.5 py-1.5 rounded-lg hover:bg-warm transition-colors"
                              title="Ver anúncio público" target="_blank">
                              ↗
                            </Link>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-3 border-t border-border bg-warm/30">
            <p className="text-xs font-sans text-faint">{myListings.length} imóvel{myListings.length !== 1 ? "is" : ""}</p>
          </div>
        </div>
      )}
    </div>
  );
}
