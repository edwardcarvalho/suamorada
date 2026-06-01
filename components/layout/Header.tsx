"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Home } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/comprar",  label: "Comprar"  },
  { href: "/arrendar", label: "Arrendar" },
  { href: "/vender",   label: "Vender"   },
] as const;

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-200",
        scrolled
          ? "bg-navy/95 backdrop-blur-md shadow-lg"
          : "bg-navy"
      )}
      style={{ minHeight: 64 }}
      role="banner"
    >
      <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-6">

        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 shrink-0 focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2 rounded"
          aria-label="Sua Morada — página inicial"
        >
          <Home size={22} className="text-brand" aria-hidden="true" />
          <span className="font-sans font-bold text-xl text-white">Sua</span>
          <span className="font-serif text-xl text-brand -ml-1">Morada</span>
        </Link>

        {/* Desktop nav */}
        <nav
          className="hidden lg:flex items-center gap-1"
          role="navigation"
          aria-label="Navegação principal"
        >
          {NAV_LINKS.map((link) => {
            const active = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative px-4 py-2 text-sm font-sans font-medium rounded-lg transition-colors duration-150",
                  active
                    ? "text-white"
                    : "text-white/60 hover:text-white hover:bg-white/8"
                )}
              >
                {link.label}
                {active && (
                  <span
                    className="absolute bottom-0 left-4 right-4 h-0.5 bg-brand rounded-full"
                    aria-hidden="true"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden lg:flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild
            className="text-white/70 hover:text-white hover:bg-white/8">
            <Link href="/entrar">Entrar</Link>
          </Button>
          <Button variant="primary" size="sm" asChild>
            <Link href="/publicar">Publicar Anúncio</Link>
          </Button>
        </div>

        {/* Mobile hamburger */}
        <Dialog.Root open={mobileOpen} onOpenChange={setMobileOpen}>
          <Dialog.Trigger asChild>
            <button
              className="lg:hidden p-2 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
              aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </Dialog.Trigger>

          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50 lg:hidden" />
            <Dialog.Content
              className="fixed right-0 top-0 h-full w-72 bg-navy z-50 flex flex-col shadow-2xl lg:hidden"
              aria-label="Menu de navegação"
              aria-describedby={undefined}
            >
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <Dialog.Title className="font-sans font-bold text-white text-lg">Menu</Dialog.Title>
                <Dialog.Close asChild>
                  <button className="p-2 text-white/70 hover:text-white rounded-lg hover:bg-white/10">
                    <X size={20} aria-hidden="true" />
                    <span className="sr-only">Fechar</span>
                  </button>
                </Dialog.Close>
              </div>

              <nav className="flex flex-col gap-1 p-4 flex-1" aria-label="Navegação mobile">
                {NAV_LINKS.map((link) => {
                  const active = pathname.startsWith(link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "px-4 py-3 rounded-lg text-sm font-sans font-medium transition-colors",
                        active
                          ? "bg-white/15 text-white"
                          : "text-white/65 hover:bg-white/8 hover:text-white"
                      )}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </nav>

              <div className="p-4 border-t border-white/10 flex flex-col gap-3">
                <Button variant="ghost" size="md" asChild
                  className="w-full text-white/70 hover:text-white hover:bg-white/8">
                  <Link href="/entrar" onClick={() => setMobileOpen(false)}>Entrar</Link>
                </Button>
                <Button variant="primary" size="md" asChild className="w-full">
                  <Link href="/publicar" onClick={() => setMobileOpen(false)}>
                    Publicar Anúncio
                  </Link>
                </Button>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    </header>
  );
}
