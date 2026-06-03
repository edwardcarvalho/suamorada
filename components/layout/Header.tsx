"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Menu, X, Home, LayoutDashboard, LogOut, ChevronDown } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import * as Popover from "@radix-ui/react-popover";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/comprar",  label: "Comprar",  protected: false },
  { href: "/arrendar", label: "Arrendar", protected: false },
  { href: "/vender",   label: "Vender",   protected: true  },
] as const;

export function Header() {
  const pathname   = usePathname();
  const router     = useRouter();
  const { data: session, status } = useSession();
  const [scrolled,    setScrolled]    = React.useState(false);
  const [mobileOpen,  setMobileOpen]  = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isLoggedIn = status === "authenticated";
  const user       = session?.user;

  function handlePublicar() {
    router.push(isLoggedIn ? "/publicar" : "/entrar?callbackUrl=/publicar");
    setMobileOpen(false);
  }


  // Iniciais para avatar de fallback
  const initials = user?.name
    ?.split(" ").slice(0, 2).map(n => n[0]?.toUpperCase() ?? "").join("") ?? "U";

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-200",
        scrolled ? "bg-navy/95 backdrop-blur-md shadow-lg" : "bg-navy"
      )}
      style={{ minHeight: 64 }}
      role="banner"
    >
      <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-6">

        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 shrink-0 rounded focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2"
          aria-label="Sua Morada — página inicial"
        >
          <Home size={22} className="text-brand" aria-hidden="true" />
          <span className="font-sans font-bold text-xl text-white">Sua</span>
          <span className="font-serif text-xl text-brand -ml-1">Morada</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1" aria-label="Navegação principal">
          {NAV_LINKS.map((link) => {
            const active = pathname.startsWith(link.href);
            return (
              <Link key={link.href} href={link.href}
                aria-current={active ? "page" : undefined}
                onClick={link.protected && !isLoggedIn ? (e) => { e.preventDefault(); router.push(`/entrar?callbackUrl=${link.href}`); } : undefined}
                className={cn(
                  "relative px-4 py-2 text-sm font-sans font-medium rounded-lg transition-colors duration-150",
                  active ? "text-white" : "text-white/60 hover:text-white hover:bg-white/8"
                )}
              >
                {link.label}
                {active && <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-brand rounded-full" aria-hidden="true" />}
              </Link>
            );
          })}
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden lg:flex items-center gap-3">
          {isLoggedIn ? (
            /* Utilizador autenticado */
            <Popover.Root>
              <Popover.Trigger asChild>
                <button className="flex items-center gap-2 px-2 py-1 rounded-xl hover:bg-white/8 transition-colors">
                  {user?.image ? (
                    <Image src={user.image} alt={user.name ?? ""} width={32} height={32}
                      className="rounded-full object-cover" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-brand flex items-center justify-center">
                      <span className="text-white text-xs font-bold">{initials}</span>
                    </div>
                  )}
                  <span className="text-white text-sm font-sans font-medium max-w-[120px] truncate">
                    {user?.name?.split(" ")[0]}
                  </span>
                  <ChevronDown size={14} className="text-white/50" />
                </button>
              </Popover.Trigger>
              <Popover.Portal>
                <Popover.Content
                  className="bg-white rounded-xl shadow-xl border border-border z-[200] w-52 p-1.5 mt-2"
                  align="end"
                  sideOffset={8}
                >
                  <div className="px-3 py-2 border-b border-border mb-1">
                    <p className="text-xs font-sans font-semibold text-ink truncate">{user?.name}</p>
                    <p className="text-[11px] text-faint font-sans truncate">{user?.email}</p>
                  </div>
                  <Link href="/dashboard"
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-sans text-ink hover:bg-warm transition-colors">
                    <LayoutDashboard size={15} className="text-muted" /> Dashboard
                  </Link>
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-sans text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={15} /> Sair
                  </button>
                </Popover.Content>
              </Popover.Portal>
            </Popover.Root>
          ) : (
            <Button variant="ghost" size="sm" asChild
              className="text-white/70 hover:text-white hover:bg-white/8">
              <Link href="/entrar">Entrar</Link>
            </Button>
          )}

          <Button variant="primary" size="sm" onClick={handlePublicar}>
            Publicar Anúncio
          </Button>
        </div>

        {/* Mobile hamburger */}
        <Dialog.Root open={mobileOpen} onOpenChange={setMobileOpen}>
          <Dialog.Trigger asChild>
            <button className="lg:hidden p-2 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
              aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}>
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </Dialog.Trigger>

          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50 lg:hidden" />
            <Dialog.Content className="fixed right-0 top-0 h-full w-72 bg-navy z-50 flex flex-col shadow-2xl lg:hidden"
              aria-label="Menu de navegação" aria-describedby={undefined}>
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <Dialog.Title className="font-sans font-bold text-white text-lg">Menu</Dialog.Title>
                <Dialog.Close asChild>
                  <button className="p-2 text-white/70 hover:text-white rounded-lg hover:bg-white/10">
                    <X size={20} aria-hidden="true" />
                    <span className="sr-only">Fechar</span>
                  </button>
                </Dialog.Close>
              </div>

              {/* User info no mobile */}
              {isLoggedIn && (
                <div className="px-6 py-4 border-b border-white/10 flex items-center gap-3">
                  {user?.image ? (
                    <Image src={user.image} alt={user.name ?? ""} width={36} height={36} className="rounded-full" />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-brand flex items-center justify-center">
                      <span className="text-white text-xs font-bold">{initials}</span>
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-white text-sm font-semibold truncate">{user?.name}</p>
                    <p className="text-white/45 text-xs truncate">{user?.email}</p>
                  </div>
                </div>
              )}

              <nav className="flex flex-col gap-1 p-4 flex-1">
                {NAV_LINKS.map((link) => {
                  const active = pathname.startsWith(link.href);
                  return (
                    <Link key={link.href} href={link.href}
                      onClick={(e) => {
                        if (link.protected && !isLoggedIn) {
                          e.preventDefault();
                          router.push(`/entrar?callbackUrl=${link.href}`);
                        }
                        setMobileOpen(false);
                      }}
                      aria-current={active ? "page" : undefined}
                      className={cn("px-4 py-3 rounded-lg text-sm font-sans font-medium transition-colors",
                        active ? "bg-white/15 text-white" : "text-white/65 hover:bg-white/8 hover:text-white")}
                    >
                      {link.label}
                    </Link>
                  );
                })}
                {isLoggedIn && (
                  <Link href="/dashboard" onClick={() => setMobileOpen(false)}
                    className="px-4 py-3 rounded-lg text-sm font-sans font-medium text-white/65 hover:bg-white/8 hover:text-white transition-colors flex items-center gap-2">
                    <LayoutDashboard size={16} /> Dashboard
                  </Link>
                )}
              </nav>

              <div className="p-4 border-t border-white/10 flex flex-col gap-3">
                {isLoggedIn ? (
                  <Button variant="ghost" size="md" className="w-full text-red-400 hover:text-red-300 hover:bg-white/8"
                    onClick={() => { signOut({ callbackUrl: "/" }); setMobileOpen(false); }}>
                    <LogOut size={16} /> Sair
                  </Button>
                ) : (
                  <Button variant="ghost" size="md" asChild className="w-full text-white/70 hover:text-white hover:bg-white/8">
                    <Link href="/entrar" onClick={() => setMobileOpen(false)}>Entrar</Link>
                  </Button>
                )}
                <Button variant="primary" size="md" className="w-full" onClick={handlePublicar}>
                  Publicar Anúncio
                </Button>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    </header>
  );
}
