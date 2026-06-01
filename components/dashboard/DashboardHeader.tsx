"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Bell, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

const TITLES: Record<string, string> = {
  "/dashboard":           "Visão Geral",
  "/dashboard/imoveis":   "Os Meus Imóveis",
  "/dashboard/mensagens": "Mensagens",
  "/dashboard/perfil":    "Perfil",
};

export function DashboardHeader() {
  const path  = usePathname();
  const title = TITLES[path] ?? "Dashboard";

  return (
    <header className="bg-white border-b border-border h-16 px-6 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-3">
        {/* Mobile menu (placeholder) */}
        <button className="lg:hidden p-2 text-muted hover:text-ink rounded-lg">
          <Menu size={20} />
        </button>
        <h1 className="font-sans font-semibold text-base text-ink">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        {/* Notifications */}
        <button className="relative p-2 text-muted hover:text-ink rounded-lg transition-colors">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand rounded-full" />
        </button>

        {/* CTA */}
        <Button variant="primary" size="sm" asChild>
          <Link href="/publicar" className="flex items-center gap-1.5">
            <PlusCircle size={14} />
            Novo Anúncio
          </Link>
        </Button>
      </div>
    </header>
  );
}
