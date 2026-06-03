import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { properties } from "@/lib/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { Eye, Phone, Heart, Home, ArrowRight, TrendingUp, PlusCircle } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { ViewsChart } from "@/components/dashboard/ViewsChart";
import { Badge } from "@/components/ui/Badge";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = { title: "Visão Geral" };

export default async function DashboardPage() {
  const session = await auth();
  const userId  = session?.user?.id;
  const userName = session?.user?.name ?? "Utilizador";
  const firstName = userName.split(" ")[0];

  // Imóveis do utilizador
  const myListings = userId
    ? await db.select().from(properties)
        .where(eq(properties.userId, userId))
        .orderBy(desc(properties.createdAt))
        .limit(10)
    : [];

  const activeListings  = myListings.filter(p => p.status === "active");
  const totalViews      = myListings.reduce((s, p) => s + (p.viewsCount ?? 0), 0);
  const totalContacts   = myListings.reduce((s, p) => s + (p.contactsCount ?? 0), 0);
  const topListings     = [...myListings].sort((a, b) => (b.viewsCount ?? 0) - (a.viewsCount ?? 0)).slice(0, 3);

  return (
    <div className="space-y-6 max-w-[1100px]">

      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-sans font-semibold text-lg text-ink">
            Bem-vindo, {firstName} 👋
          </h2>
          <p className="text-sm text-muted font-sans mt-0.5">
            {myListings.length === 0
              ? "Ainda não publicou nenhum anúncio."
              : `Tem ${activeListings.length} anúncio${activeListings.length !== 1 ? "s" : ""} activo${activeListings.length !== 1 ? "s" : ""}.`}
          </p>
        </div>
        {myListings.length === 0 && (
          <Link
            href="/publicar"
            className="flex items-center gap-2 bg-brand text-white text-sm font-sans font-semibold px-4 py-2 rounded-xl hover:bg-brand/90 transition-colors"
          >
            <PlusCircle size={16} />
            Publicar primeiro anúncio
          </Link>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Imóveis Activos"     value={String(activeListings.length)} sub={`de ${myListings.length} total`}   icon={Home}  accent="#1B3A5C" trend="neutral" />
        <StatCard label="Visualizações total" value={totalViews.toLocaleString("pt-PT")} sub="todos os anúncios"            icon={Eye}   accent="#2D9E6B" trend="up"      />
        <StatCard label="Contactos total"     value={String(totalContacts)}  sub="todos os anúncios"                        icon={Phone} accent="#E8651A" trend="neutral" />
        <StatCard label="Favoritos"           value="—"                      sub="Em breve"                                 icon={Heart} accent="#8B5CF6" trend="neutral" />
      </div>

      {myListings.length > 0 ? (
        <>
          {/* Chart + Top listings */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4">
            <ViewsChart />

            {topListings.length > 0 && (
              <div className="bg-white rounded-xl border border-border/50 shadow-sm p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-sans font-semibold text-sm text-ink">Mais vistos</h3>
                  <TrendingUp size={14} className="text-faint" />
                </div>
                <div className="flex flex-col gap-3">
                  {topListings.map((l) => (
                    <div key={l.id} className="flex items-center justify-between gap-2 py-2 border-b border-border last:border-0">
                      <p className="font-sans text-xs text-ink font-medium truncate">{l.title}</p>
                      <span className="text-xs font-sans font-semibold text-brand shrink-0">
                        {l.viewsCount} views
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Tabela de imóveis */}
          <div className="bg-white rounded-xl border border-border/50 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h3 className="font-sans font-semibold text-sm text-ink">Os Meus Imóveis</h3>
              <Link href="/dashboard/imoveis"
                className="text-xs font-sans text-brand font-semibold flex items-center gap-1 hover:gap-2 transition-all">
                Ver todos <ArrowRight size={12} />
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    {["Imóvel","Status","Preço","Views","Contactos","Acções"].map(h => (
                      <th key={h} className="text-left px-5 py-3 text-[10px] font-sans font-semibold uppercase tracking-wider text-faint">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {myListings.slice(0, 5).map((l, i) => (
                    <tr key={l.id} className={i % 2 === 0 ? "bg-warm/30" : ""}>
                      <td className="px-5 py-3.5">
                        <p className="font-sans font-semibold text-sm text-ink truncate max-w-[220px]">{l.title}</p>
                      </td>
                      <td className="px-5 py-3.5">
                        <Badge variant={l.status === "active" ? "verified" : "paused"}>
                          {l.status === "active" ? "Activo" : l.status === "paused" ? "Pausado" : l.status}
                        </Badge>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="font-sans font-semibold text-sm text-ink">
                          {formatPrice(l.price, l.listingType === "rent" ? "/mês" : "")}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-sm font-sans text-muted">{l.viewsCount}</td>
                      <td className="px-5 py-3.5 text-sm font-sans text-muted">{l.contactsCount}</td>
                      <td className="px-5 py-3.5">
                        <Link href={`/imovel/${l.slug}`}
                          className="text-xs font-sans font-semibold text-navy bg-warm hover:bg-warm-dark px-3 py-1.5 rounded-lg transition-colors">
                          Ver
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        /* Estado vazio */
        <div className="bg-white rounded-xl border border-border/50 shadow-sm p-12 text-center">
          <div className="w-16 h-16 bg-warm rounded-full flex items-center justify-center mx-auto mb-4">
            <Home size={28} className="text-faint" />
          </div>
          <h3 className="font-serif text-xl text-ink mb-2">Sem anúncios ainda</h3>
          <p className="text-sm text-muted font-sans mb-6 max-w-sm mx-auto">
            Publique o seu primeiro imóvel e comece a receber contactos de potenciais compradores ou inquilinos.
          </p>
          <Link
            href="/publicar"
            className="inline-flex items-center gap-2 bg-brand text-white text-sm font-sans font-semibold px-6 py-3 rounded-xl hover:bg-brand/90 transition-colors"
          >
            <PlusCircle size={16} />
            Publicar Anúncio
          </Link>
        </div>
      )}
    </div>
  );
}
