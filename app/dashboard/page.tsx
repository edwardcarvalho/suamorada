import type { Metadata } from "next";
import Link from "next/link";
import { Eye, Phone, Heart, Home, ArrowRight, TrendingUp } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { ViewsChart } from "@/components/dashboard/ViewsChart";
import { Badge } from "@/components/ui/Badge";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = { title: "Visão Geral" };

const MOCK_LISTINGS = [
  { id: "1", title: "Apt T2 Campo de Ourique", price: 28500000, views: 142, contacts: 12, status: "active"  as const, daysAgo: 3  },
  { id: "2", title: "Moradia T3 Cascais",      price: 42000000, views: 98,  contacts: 7,  status: "active"  as const, daysAgo: 8  },
  { id: "3", title: "Apt T1 Mouraria",          price: 19500000, views: 67,  contacts: 4,  status: "paused"  as const, daysAgo: 15 },
];

const TOP_LISTINGS = [...MOCK_LISTINGS].sort((a, b) => b.views - a.views).slice(0, 3);

export default function DashboardPage() {
  return (
    <div className="space-y-6 max-w-[1100px]">

      {/* Welcome */}
      <div>
        <h2 className="font-sans font-semibold text-lg text-ink">Bem-vindo de volta, João</h2>
        <p className="text-sm text-muted font-sans">
          Aqui está o resumo da actividade dos seus anúncios.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Imóveis Activos"      value="8"     sub="+1 este mês"          icon={Home}       accent="#1B3A5C" trend="up"      />
        <StatCard label="Visualizações (30d)"  value="1.247" sub="+18% vs mês anterior"  icon={Eye}        accent="#2D9E6B" trend="up"      />
        <StatCard label="Contactos (30d)"      value="34"    sub="Taxa: 2.7%"            icon={Phone}      accent="#E8651A" trend="neutral" />
        <StatCard label="Favoritos"            value="89"    sub="Em 23 imóveis"         icon={Heart}      accent="#8B5CF6" trend="up"      />
      </div>

      {/* Chart + Top listings */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4">
        <ViewsChart />

        {/* Mais vistos */}
        <div className="bg-white rounded-xl border border-border/50 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-sans font-semibold text-sm text-ink">Mais vistos</h3>
            <TrendingUp size={14} className="text-faint" />
          </div>
          <div className="flex flex-col gap-3">
            {TOP_LISTINGS.map((l) => (
              <div key={l.id} className="flex items-center justify-between gap-2 py-2 border-b border-border last:border-0">
                <p className="font-sans text-xs text-ink font-medium truncate">{l.title}</p>
                <span className="text-xs font-sans font-semibold text-brand shrink-0">
                  {l.views} views
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Listings table */}
      <div className="bg-white rounded-xl border border-border/50 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h3 className="font-sans font-semibold text-sm text-ink">Os Meus Imóveis Activos</h3>
          <Link href="/dashboard/imoveis"
            className="text-xs font-sans text-brand font-semibold flex items-center gap-1 hover:gap-2 transition-all">
            Ver todos <ArrowRight size={12} />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                {["Imóvel","Status","Preço","Views","Contactos","Publicado","Acções"].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-[10px] font-sans font-semibold uppercase tracking-wider text-faint">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MOCK_LISTINGS.map((l, i) => (
                <tr key={l.id} className={i % 2 === 0 ? "bg-warm/30" : ""}>
                  <td className="px-5 py-3.5">
                    <p className="font-sans font-semibold text-sm text-ink">{l.title}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <Badge variant={l.status === "active" ? "verified" : "paused"}>
                      {l.status === "active" ? "Activo" : "Pausado"}
                    </Badge>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="font-sans font-semibold text-sm text-ink">
                      {formatPrice(l.price)}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-sm font-sans text-muted">{l.views}</td>
                  <td className="px-5 py-3.5 text-sm font-sans text-muted">{l.contacts}</td>
                  <td className="px-5 py-3.5 text-xs font-sans text-faint">há {l.daysAgo} dias</td>
                  <td className="px-5 py-3.5">
                    <div className="flex gap-2">
                      <button className="text-xs font-sans font-semibold text-navy bg-warm hover:bg-warm-dark px-3 py-1.5 rounded-lg transition-colors">
                        Editar
                      </button>
                      <button className={`text-xs font-sans font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                        l.status === "active"
                          ? "text-muted bg-warm hover:bg-warm-dark"
                          : "text-trust bg-trust/10 hover:bg-trust/20"
                      }`}>
                        {l.status === "active" ? "Pausar" : "Activar"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
