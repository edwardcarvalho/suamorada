"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Home, MessageSquare, BarChart2,
  User, LogOut, PlusCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/dashboard",            label: "Visão Geral",      icon: LayoutDashboard },
  { href: "/dashboard/imoveis",    label: "Os Meus Imóveis",  icon: Home            },
  { href: "/dashboard/mensagens",  label: "Mensagens",        icon: MessageSquare   },
  { href: "/dashboard/perfil",     label: "Perfil",           icon: User            },
] as const;

export function DashboardSidebar() {
  const path = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-60 bg-navy shrink-0 h-full">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-white/10">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-sans font-bold text-lg text-white">Sua</span>
          <span className="font-serif text-lg text-brand">Morada</span>
        </Link>
      </div>

      {/* User */}
      <div className="px-6 py-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center shrink-0">
            <span className="text-white text-sm font-sans font-bold">JC</span>
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-sans font-semibold truncate">João Cardoso</p>
            <p className="text-white/45 text-xs font-sans truncate">Agente ERA Lisboa</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1" aria-label="Dashboard">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = path === href || (href !== "/dashboard" && path.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-sans font-medium transition-colors",
                active
                  ? "bg-white/15 text-white"
                  : "text-white/55 hover:bg-white/8 hover:text-white"
              )}
            >
              {active && <span className="absolute left-0 w-1 h-8 bg-brand rounded-r-full" />}
              <Icon size={17} aria-hidden="true" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom actions */}
      <div className="px-3 py-4 border-t border-white/10 flex flex-col gap-1">
        <Link
          href="/publicar"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-sans font-semibold text-brand hover:bg-brand/10 transition-colors"
        >
          <PlusCircle size={17} />
          Publicar Anúncio
        </Link>
        <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-sans text-white/45 hover:bg-white/8 hover:text-white transition-colors w-full text-left">
          <LogOut size={17} />
          Sair
        </button>
      </div>
    </aside>
  );
}
