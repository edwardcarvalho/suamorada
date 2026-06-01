import Link from "next/link";
import { Home, ShieldCheck, Lock } from "lucide-react";

const FOOTER_LINKS = {
  "Sobre Nós": [
    { href: "/sobre",     label: "Quem Somos"        },
    { href: "/como-funciona", label: "Como Funciona" },
    { href: "/blog",      label: "Blog"               },
    { href: "/contacto",  label: "Contacto"           },
  ],
  "Comprar": [
    { href: "/comprar/lisboa/apartamentos",  label: "Apartamentos em Lisboa"  },
    { href: "/comprar/porto/apartamentos",   label: "Apartamentos no Porto"   },
    { href: "/comprar/lisboa/moradias",      label: "Moradias em Lisboa"      },
    { href: "/comprar/faro",                 label: "Imóveis no Algarve"      },
  ],
  "Arrendar": [
    { href: "/arrendar/lisboa/apartamentos", label: "Arrendar em Lisboa"      },
    { href: "/arrendar/porto/apartamentos",  label: "Arrendar no Porto"       },
    { href: "/arrendar/braga",               label: "Arrendar em Braga"       },
    { href: "/arrendar/faro",                label: "Arrendar no Algarve"     },
  ],
  "Anunciantes": [
    { href: "/publicar",    label: "Publicar Anúncio"  },
    { href: "/vender",      label: "Vender o seu Imóvel" },
    { href: "/avaliar",     label: "Avaliar Imóvel"    },
    { href: "/agencias",    label: "Para Agências"     },
  ],
} as const;

export function Footer() {
  return (
    <footer className="bg-ink text-white/70" role="contentinfo">
      <div className="mx-auto max-w-[1280px] px-6 py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">

          {/* Brand column */}
          <div className="col-span-2 md:col-span-1 lg:col-span-1">
            <Link
              href="/"
              className="flex items-center gap-2 mb-4 focus-visible:outline-2 focus-visible:outline-brand rounded"
              aria-label="Sua Morada"
            >
              <Home size={20} className="text-brand" aria-hidden="true" />
              <span className="font-sans font-bold text-white text-lg">Sua</span>
              <span className="font-serif text-brand text-lg -ml-1">Morada</span>
            </Link>
            <p className="text-sm leading-relaxed mb-6 max-w-xs">
              O portal imobiliário português que coloca o comprador em primeiro lugar.
            </p>
            {/* Trust badges */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-xs">
                <ShieldCheck size={14} className="text-trust shrink-0" aria-hidden="true" />
                <span>RGPD Compliant</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Lock size={14} className="text-trust shrink-0" aria-hidden="true" />
                <span>Ligação SSL Segura</span>
              </div>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <div key={section}>
              <h3 className="text-white font-sans font-semibold text-sm mb-4 uppercase tracking-wider">
                {section}
              </h3>
              <ul className="flex flex-col gap-2.5" role="list">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm hover:text-white transition-colors duration-150 focus-visible:outline-brand"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} Sua Morada. Todos os direitos reservados.
          </p>
          <div className="flex gap-6">
            {[
              { href: "/termos",       label: "Termos de Uso"      },
              { href: "/privacidade",  label: "Política de Privacidade" },
              { href: "/cookies",      label: "Cookies"            },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-xs text-white/40 hover:text-white/70 transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
