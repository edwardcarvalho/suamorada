import type { Metadata } from "next";
import Link from "next/link";
import { PlusCircle, Search } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatPrice, timeAgo } from "@/lib/utils";

export const metadata: Metadata = { title: "Os Meus Imóveis" };

const MOCK = [
  { id:"1", slug:"apt-t2-campo-ourique-a1b2c3", title:"Apt T2 com varanda — Campo de Ourique",   type:"Apartamento", listing:"Venda",      price:28500000, views:142, contacts:12, status:"active"  as const, publishedAt:"2026-05-27" },
  { id:"2", slug:"moradia-t3-cascais-d4e5f6",   title:"Moradia T3 com jardim — Cascais",          type:"Moradia",     listing:"Venda",      price:42000000, views:98,  contacts:7,  status:"active"  as const, publishedAt:"2026-05-22" },
  { id:"3", slug:"apt-t1-mouraria-g7h8i9",       title:"Apt T1 renovado — Mouraria",               type:"Apartamento", listing:"Venda",      price:19500000, views:67,  contacts:4,  status:"paused"  as const, publishedAt:"2026-05-15" },
  { id:"4", slug:"apt-t2-principe-real-j0k1",    title:"Apt T2 mobilado — Príncipe Real",          type:"Apartamento", listing:"Arrendamento",price:135000,  views:87,  contacts:9,  status:"active"  as const, publishedAt:"2026-05-28" },
  { id:"5", slug:"vivenda-t4-sintra-m3n4",        title:"Vivenda T4 com piscina — Sintra",          type:"Vivenda",     listing:"Venda",      price:89500000, views:341, contacts:28, status:"active"  as const, publishedAt:"2026-05-10" },
  { id:"6", slug:"apt-t3-porto-foz-p6q7",         title:"Apt T3 novo na Foz do Douro",             type:"Apartamento", listing:"Venda",      price:52000000, views:267, contacts:22, status:"pending_review" as const, publishedAt:"2026-05-29" },
];

const STATUS_CONFIG = {
  active:         { label: "Activo",      variant: "verified" as const },
  paused:         { label: "Pausado",     variant: "paused"   as const },
  pending_review: { label: "Em revisão",  variant: "pending"  as const },
  sold:           { label: "Vendido",     variant: "sold"     as const },
  expired:        { label: "Expirado",    variant: "paused"   as const },
};

export default function ImoveisPage() {
  return (
    <div className="space-y-5 max-w-[1100px]">

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-faint" />
          <input
            placeholder="Pesquisar imóveis..."
            className="pl-9 pr-4 py-2 text-sm font-sans border border-border rounded-lg bg-white outline-none focus:border-navy w-64"
          />
        </div>

        <div className="flex items-center gap-3">
          {/* Filter chips */}
          {["Todos","Activos","Pausados","Em revisão"].map((f, i) => (
            <button key={f}
              className={`text-xs font-sans font-medium px-3 py-1.5 rounded-full border transition-colors ${
                i === 0
                  ? "bg-navy text-white border-navy"
                  : "border-border text-muted hover:border-navy hover:text-navy bg-white"
              }`}>
              {f}
            </button>
          ))}

          <Button variant="primary" size="sm" asChild>
            <Link href="/publicar" className="flex items-center gap-1.5">
              <PlusCircle size={14} /> Publicar
            </Link>
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-border/50 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-border bg-warm/50">
                {["Imóvel","Tipo","Status","Preço","Views","Contactos","Publicado","Acções"].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-[10px] font-sans font-semibold uppercase tracking-wider text-faint whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {MOCK.map((l) => {
                const st = STATUS_CONFIG[l.status] ?? STATUS_CONFIG.paused;
                const suffix = l.listing === "Arrendamento" ? "/mês" : "";
                return (
                  <tr key={l.id} className="hover:bg-warm/30 transition-colors">
                    <td className="px-5 py-4 max-w-[220px]">
                      <Link href={`/imovel/${l.slug}`}
                        className="font-sans font-semibold text-sm text-ink hover:text-brand transition-colors line-clamp-1">
                        {l.title}
                      </Link>
                    </td>
                    <td className="px-5 py-4 text-xs font-sans text-muted whitespace-nowrap">{l.type}</td>
                    <td className="px-5 py-4">
                      <Badge variant={st.variant}>{st.label}</Badge>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className="font-sans font-semibold text-sm text-ink">
                        {formatPrice(l.price, suffix)}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm font-sans text-muted">{l.views}</td>
                    <td className="px-5 py-4 text-sm font-sans text-muted">{l.contacts}</td>
                    <td className="px-5 py-4 text-xs font-sans text-faint whitespace-nowrap">
                      {new Date(l.publishedAt).toLocaleDateString("pt-PT", { day:"numeric", month:"short" })}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5">
                        <button className="text-xs font-sans font-medium text-navy bg-warm hover:bg-warm-dark px-2.5 py-1.5 rounded-lg transition-colors">
                          Editar
                        </button>
                        <button className="text-xs font-sans font-medium text-muted hover:text-brand px-2.5 py-1.5 rounded-lg hover:bg-warm transition-colors">
                          ↗
                        </button>
                        <button className="text-xs font-sans font-medium text-red-400 hover:text-red-600 px-2.5 py-1.5 rounded-lg hover:bg-red-50 transition-colors">
                          ✕
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Table footer */}
        <div className="px-5 py-3 border-t border-border bg-warm/30 flex items-center justify-between">
          <p className="text-xs font-sans text-faint">{MOCK.length} imóveis</p>
          <div className="flex gap-1">
            {[1,2,3].map((p) => (
              <button key={p}
                className={`w-7 h-7 rounded text-xs font-sans ${p === 1 ? "bg-navy text-white" : "text-muted hover:bg-warm border border-border"}`}>
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
