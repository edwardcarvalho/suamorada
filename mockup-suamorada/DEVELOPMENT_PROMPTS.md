# Sua Morada — Prompts de Desenvolvimento por Fase

> Stack: Next.js 15 + TypeScript + Tailwind CSS + PostgreSQL + PostGIS + Redis + Mapbox + Cloudflare R2
> Hosting: Vercel (frontend) + Hetzner (backend/DB) + Cloudflare (CDN/DNS)
> Mercado: Portugal — portal de compra/venda/arrendamento de imóveis

---

## DESIGN SYSTEM — Referência Visual Completa

> Esta secção define a identidade visual do Sua Morada. Todos os prompts de
> desenvolvimento devem respeitar estas definições. É a fonte única de verdade para UI/UX.

---

### Filosofia de Design — "Confiança Mediterrânica"

O Sua Morada comunica através de **clareza, espaço e autoridade discreta**.
O design não grita — convence. Cada elemento existe por uma razão: guiar o utilizador
para a decisão certa sem fricção, transmitindo a seriedade de uma transacção imobiliária
com a leveza de uma experiência digital moderna.

Inspirações: Airbnb (UX), Financial Times (tipografia editorial), Zara Home (elegância
contida), azulejaria portuguesa (padrão, ritmo, detalhe).

---

### Paleta de Cores

```
┌─────────────────────────────────────────────────────────────────┐
│  CORES PRIMÁRIAS                                                │
│                                                                 │
│  Navy Principal    #1B3A5C   → Navbar, headings, textos chave  │
│  Laranja Acção     #E8651A   → CTAs, botões primários, destaques│
│  Verde Confiança   #2D9E6B   → "Verificado", sucesso, badges   │
│                                                                 │
│  CORES NEUTRAS                                                  │
│                                                                 │
│  Fundo Quente      #F7F6F3   → Background geral (não branco frio)│
│  Branco            #FFFFFF   → Cards, modais, inputs           │
│  Texto Principal   #1C1C2E   → Corpo de texto                  │
│  Texto Secundário  #6B7280   → Labels, metadados, placeholders │
│  Borda Suave       #E5E4E0   → Separadores, borders de cards   │
│                                                                 │
│  CORES DE ESTADO                                                │
│                                                                 │
│  Erro              #DC2626   → Validação, alertas              │
│  Aviso             #D97706   → Preço acima da média, expirar   │
│  Info              #2563EB   → Tooltips, informação neutral    │
└─────────────────────────────────────────────────────────────────┘
```

**Regra de uso de cor:**
- Navy (#1B3A5C) nunca em fundos de página — só em elementos (navbar, badges, footers)
- Laranja (#E8651A) máximo 1 elemento por secção — escassez = impacto
- Verde (#2D9E6B) exclusivo para estados de confiança/verificação — nunca decorativo
- O fundo quente (#F7F6F3) em vez de branco puro cria sensação de qualidade premium

**Tailwind config:**
```js
colors: {
  navy:   { DEFAULT: '#1B3A5C', light: '#2A5080', dark: '#122640' },
  brand:  { DEFAULT: '#E8651A', light: '#F07840', dark: '#C4520E' },
  trust:  { DEFAULT: '#2D9E6B', light: '#38B87D', dark: '#207A51' },
  warm:   { DEFAULT: '#F7F6F3', dark: '#EEECEA' },
  ink:    { DEFAULT: '#1C1C2E', muted: '#6B7280', faint: '#9CA3AF' },
  border: { DEFAULT: '#E5E4E0', strong: '#D1D0CC' },
}
```

---

### Tipografia

```
┌─────────────────────────────────────────────────────────────────┐
│  FONTES                                                         │
│                                                                 │
│  DM Serif Display  → Headlines h1, h2, preços em destaque      │
│  Inter             → Corpo, labels, navegação, botões          │
│                                                                 │
│  ESCALA TIPOGRÁFICA (rem base 16px)                            │
│                                                                 │
│  display-2xl   3.75rem / 60px  → Headline hero homepage        │
│  display-xl    3rem    / 48px  → Títulos de secção principais  │
│  display-lg    2.25rem / 36px  → Títulos de página             │
│  display-md    1.875rem/ 30px  → Preço em destaque no card     │
│  xl            1.25rem / 20px  → Títulos de card               │
│  lg            1.125rem/ 18px  → Corpo de texto principal      │
│  md            1rem    / 16px  → Texto padrão                  │
│  sm            0.875rem/ 14px  → Labels, metadados             │
│  xs            0.75rem / 12px  → Badges, captions              │
│                                                                 │
│  PESOS                                                          │
│                                                                 │
│  DM Serif Display: sempre 400 (regular) — a fonte é o peso    │
│  Inter: 400 (texto), 500 (labels/nav), 600 (botões), 700 (preço)│
└─────────────────────────────────────────────────────────────────┘
```

**Google Fonts import:**
```css
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Inter:wght@400;500;600;700&display=swap');
```

---

### Espaçamento e Grid

```
Grid: 12 colunas | Gutter: 24px | Max-width: 1280px | Padding lateral: 24px (mobile) / 48px (desktop)

Escala de espaçamento (múltiplos de 4px):
  4px   → Micro (entre ícone e label)
  8px   → XS (padding interno de badges)
  12px  → SM (gap entre elementos inline)
  16px  → MD (padding de inputs, gap entre cards)
  24px  → LG (padding de cards, gap entre secções pequenas)
  32px  → XL (espaço entre componentes)
  48px  → 2XL (padding de secções)
  64px  → 3XL (separação entre secções maiores)
  96px  → 4XL (hero padding vertical)
```

---

### Border Radius e Sombras

```
Border Radius:
  sm:   4px   → Badges, chips, tags
  md:   8px   → Inputs, botões, tooltips
  lg:   12px  → Cards de imóvel, modais
  xl:   16px  → Cards de destaque, drawers
  full: 9999px → Avatares, toggles

Sombras (shadow system):
  xs:  0 1px 2px rgba(28,28,46,0.05)                      → Inputs em focus
  sm:  0 1px 3px rgba(28,28,46,0.08), 0 1px 2px -1px ...  → Cards em repouso
  md:  0 4px 6px rgba(28,28,46,0.07), 0 2px 4px -2px ...  → Cards em hover
  lg:  0 10px 15px rgba(28,28,46,0.08), 0 4px 6px -4px ... → Modais, dropdowns
  xl:  0 20px 25px rgba(28,28,46,0.10)                     → Sidebar sticky
```

---

### Componentes — Especificações Visuais

#### Botões

```
PRIMARY (Laranja):
  Background: #E8651A | Texto: #FFFFFF | Font: Inter 600 | Border-radius: 8px
  Padding: 12px 24px (md) / 10px 20px (sm) / 14px 32px (lg)
  Hover: background #C4520E | Transition: 150ms ease
  Focus: ring 2px #E8651A offset 2px
  Loading: spinner branco substitui texto

SECONDARY (Navy outline):
  Background: transparent | Border: 1.5px #1B3A5C | Texto: #1B3A5C
  Hover: background #F0F4F8

GHOST:
  Background: transparent | Texto: #6B7280
  Hover: background #F7F6F3 | Texto: #1C1C2E

DANGER:
  Background: #DC2626 | Texto: #FFFFFF
  Hover: background #B91C1C
```

#### Cards de Imóvel

```
Container:
  Background: #FFFFFF
  Border-radius: 12px
  Shadow: sm (repouso) → md (hover)
  Transition: shadow 200ms ease, transform 200ms ease
  Hover: translateY(-2px) + shadow md

Foto:
  Aspect-ratio: 4/3
  Border-radius: 12px 12px 0 0
  object-fit: cover
  Overlay gradient bottom (para badges de preço futuros)

Badges sobre a foto:
  "Verificado": background #2D9E6B, texto #FFF, Inter 500 xs, padding 4px 8px, border-radius 4px
  "Destaque":   background #E8651A, texto #FFF, Inter 500 xs, padding 4px 8px, border-radius 4px
  "Novo":       background #1B3A5C, texto #FFF, Inter 500 xs, padding 4px 8px, border-radius 4px
  Posição: top-left stack vertical com gap 4px

Coração (favorito):
  Posição: top-right 12px 12px
  Background: rgba(255,255,255,0.9) blur(4px)
  Border-radius: full
  Padding: 8px
  Hover: fill #E8651A | Transition: fill 150ms

Conteúdo do card (padding 16px):
  Preço: DM Serif Display 24px #1C1C2E — linha 1
  Título: Inter 500 16px #1C1C2E — linha 2, truncate 1 linha
  Localização: Inter 400 14px #6B7280 com ícone pin — linha 3
  Stats: flex row gap 16px, Inter 400 14px #6B7280 com ícones lucide 14px
  Divider: border-top 1px #E5E4E0 margin 12px 0
  Agência: logo 24px height + nome Inter 400 12px #9CA3AF
```

#### Navbar

```
Height: 64px (desktop) / 56px (mobile)
Background: #FFFFFF | Border-bottom: 1px #E5E4E0
Sticky top: 0 | z-index: 50
Backdrop blur quando scrolled > 10px: backdrop-filter: blur(8px), background: rgba(255,255,255,0.92)

Logo: "Sua Morada" — "Virtual" Inter 700 navy, "Realty" DM Serif Display navy
  (ou SVG com casa estilizada à esquerda do texto)

Nav links: Inter 500 15px #6B7280
  Hover: #1C1C2E | Transition: 150ms
  Active: #1B3A5C com underline 2px #E8651A

CTA "Publicar Anúncio": botão Primary tamanho sm

Mobile: hamburger → Sheet lateral com links em lista, CTA em baixo
```

#### Search Bar (Hero)

```
Container:
  Background: #FFFFFF
  Border-radius: 12px
  Shadow: xl
  Padding: 8px
  Max-width: 820px

Tabs (Comprar / Arrendar):
  Activa: background #1B3A5C, texto #FFF, border-radius 8px
  Inactiva: texto #6B7280
  Transição: 200ms

Inputs internos:
  Sem border visível (border: none, outline: none)
  Separados por dividers 1px #E5E4E0
  Padding: 12px 20px
  Label acima (Inter 500 11px uppercase #9CA3AF): "LOCALIZAÇÃO", "TIPO", "QUARTOS"
  Value (Inter 500 16px #1C1C2E)
  Placeholder (Inter 400 16px #9CA3AF)

Botão Pesquisar:
  Primary lg, border-radius 8px
  Ícone Search 18px + "Pesquisar"
  Flex-shrink: 0
```

#### Trust Badges (abaixo da search bar)

```
Flex row, gap 32px, centrado
Cada badge: ícone 20px (cor #E8651A) + texto Inter 500 14px #FFFFFF
Background: nenhum (sobre o hero escuro)
Mobile: wrap, gap 16px
```

---

### Padrões de Layout por Página

#### Homepage

```
[NAVBAR fixo]
[HERO — 100vh mínimo]
  → Background: foto Lisboa com overlay gradient #1B3A5C/70% a #1C1C2E/40%
  → Headline: DM Serif Display 60px branco, max-width 700px
  → Subtítulo: Inter 400 20px rgba(255,255,255,0.8)
  → Search bar flutuante sobre o hero (position relative, translateY 50%)

[SECÇÃO — Imóveis em Destaque]
  → Padding: 96px 0
  → Background: #F7F6F3
  → Título secção: DM Serif Display 36px navy
  → Grid: 3 cards desktop, 2 tablet, 1 mobile (scroll horizontal)
  → CTA "Ver todos": botão secondary

[SECÇÃO — Como Funciona]
  → Background: #FFFFFF
  → 3 steps com ícone grande (48px, cor navy), número (DM Serif Display 64px laranja transparente),
    título (Inter 600 20px), descrição (Inter 400 16px muted)

[SECÇÃO — Porquê o Sua Morada]
  → Background: #1B3A5C (navy escuro)
  → Texto branco
  → Grid 4 colunas de stats: "10.000+" imóveis, "24h" resposta, "100%" verificados, "4.9★" avaliação
  → Cada stat: número DM Serif Display 48px laranja, label Inter 400 16px rgba(branco,0.7)

[SECÇÃO — Últimas Adições]
  → Grid de cards com ISR (revalida de 5 em 5 min)

[SECÇÃO — Para Agências]
  → Split layout: texto esquerda (benefícios), imagem/mockup direita
  → CTA "Publicar gratuitamente"

[FOOTER]
  → Background: #1C1C2E (quase preto)
  → Texto: rgba(255,255,255,0.7)
  → Logo branco topo
  → 4 colunas de links
  → Bottom bar: copyright + RGPD + selos de confiança
```

#### Página de Resultados

```
[NAVBAR]
[SEARCH BAR compacta — sticky, 64px height]
  → Versão condensada da hero search bar, background navy
  → Filtros activos como chips removíveis

[BODY — 2 painéis]
  → Esquerda (42%): lista + ordenação + contador
  → Direita (58%): mapa Mapbox (sticky, 100vh - navbar - search)

Mobile:
  → Tabs "Lista" | "Mapa" com tab bar sticky
  → Botão flutuante "Filtros" (fab, bottom-right, shadow xl)
```

#### Página de Detalhe

```
[NAVBAR]

[GALERIA — full width até max 1280px]
  → Layout mosaico: 1 foto grande esquerda (60%) + 2 fotos direita (40%) empilhadas
  → Botão "Ver todas (X fotos)" bottom-right da galeria
  → Border-radius: 12px em todas as fotos com gap 8px

[BODY — 2 colunas, max-width 1280px]
  → Principal (65%): breadcrumb → header → AD-1 → características → descrição → AD-2 → features → AD-4 → mapa → AD-5 → similares → AD-6
  → Sidebar (35%): card contacto → AD-3

Sidebar card contacto:
  → Background: #FFFFFF | Shadow xl | Border-radius 16px | Padding 24px
  → Sticky top: 88px (navbar + padding)
  → Preço repetido no topo do card (visível sem scroll)
  → Agente: foto circular 48px + nome + agência
  → Botões empilhados, full-width:
      "Contactar Agente" → Primary
      "WhatsApp" → background #25D366 texto branco
      "Telefonar" → Secondary
  → Micro-texto: "Resposta típica em menos de 24h" abaixo dos botões
  → Divider
  → "Guardar" + "Partilhar" → ghost, side by side
```

---

### Animações e Transições

```
Princípio: subtil, funcional, nunca decorativo.

Durations padrão:
  100ms → Micro-interações (checkbox, toggle)
  150ms → Hover states (cor, shadow)
  200ms → Cards (elevação, transform)
  300ms → Modais, sheets (entrada/saída)
  400ms → Transições de página (fade)

Easings:
  ease-out    → Elementos que entram (modais, dropdowns)
  ease-in     → Elementos que saem
  ease-in-out → Transforms (hover cards)

Animações específicas:
  Card hover:    transform: translateY(-2px) + shadow upgrade | 200ms ease-in-out
  Modal open:    opacity 0→1 + scale 0.97→1 | 300ms ease-out
  Sheet mobile:  translateX(100%→0) | 300ms ease-out
  Skeleton:      shimmer gradient animado | 1.5s infinite
  Badge pulse:   scale 1→1.05→1 uma vez ao aparecer | 400ms ease
  Foto lightbox: opacity 0→1 | 200ms ease-out
```

---

### Trust Signals — Padrão Visual

```
O utilizador português é desconfiado por natureza com plataformas novas.
Cada página deve ter pelo menos 3 sinais de confiança visíveis.

Tipos de trust signals e onde usar:

1. Badge "Verificado" (verde):
   → Em cada card de imóvel verificado
   → Na página de detalhe, ao lado do título (tamanho md)
   → Tooltip ao hover: "Imóvel verificado pela equipa Sua Morada"

2. Contador de visualizações:
   → Página de detalhe: "142 pessoas viram este imóvel esta semana"
   → Gera urgência social sem ser agressivo

3. Resposta do agente:
   → No card de contacto: "Responde tipicamente em < 2 horas" (se agente activo)
   → Badge verde ao lado do nome do agente

4. Avaliações da agência:
   → Stars (★★★★☆) + "4.8 (127 avaliações)" no card de contacto
   → Link para perfil completo da agência

5. Selos no footer e checkout:
   → RGPD Compliant | SSL Seguro | Licença AMI verificada | MCI (se aplicável)

6. Número de contactos:
   → "12 pessoas contactaram este imóvel" — social proof discreto
```

---

### Iconografia

```
Biblioteca: lucide-react (consistente, clean, MIT license)

Ícones por contexto (tamanhos standardizados):
  Navegação/UI:    16px
  Inline com texto: 16px
  Features/stats:  20px
  Hero/ilustrativo: 32-48px

Ícones específicos do domínio:
  Quartos:        Bed (lucide)
  Casas de banho: Bath (lucide)
  Área:           Square (lucide) ou "m²" texto
  Garagem:        Car (lucide)
  Elevador:       ArrowUpDown (lucide)
  Piscina:        Waves (lucide)
  Jardim:         TreePine (lucide)
  Localização:    MapPin (lucide)
  Verificado:     ShieldCheck (lucide) em verde
  Destaque:       Star (lucide) em laranja
  Favorito:       Heart (lucide)
  Partilhar:      Share2 (lucide)
  Energia:        Zap (lucide) com cor por classe (A+=verde escuro ... F=vermelho)
```

---

### Responsive Breakpoints

```
sm:   640px   → Mobile landscape, pequenos tablets
md:   768px   → Tablets
lg:   1024px  → Laptops pequenos
xl:   1280px  → Desktops (max-width do layout)
2xl:  1536px  → Monitores grandes (sem alterações de layout, só mais espaço)

Mobile-first: escrever sempre o estilo mobile base, depois overrides com sm:/md:/lg:

Regras críticas mobile:
- Touch targets mínimo 44×44px (botões, links, ícones clicáveis)
- Font-size mínimo 16px em inputs (evita zoom automático iOS)
- Sem hover-only interactions (tudo acessível por tap)
- Bottom navigation apenas em /dashboard (não no portal público)
- Cards em scroll horizontal (não grid 2 colunas) abaixo de 480px
```

---

### Acessibilidade (WCAG 2.1 AA — obrigatório)

```
Contraste mínimo:
  Texto normal:  4.5:1
  Texto grande:  3:1
  UI components: 3:1

Verificações de contraste das cores definidas:
  #1C1C2E sobre #F7F6F3 → 16.8:1  ✓
  #FFFFFF sobre #1B3A5C → 7.2:1   ✓
  #FFFFFF sobre #E8651A → 3.1:1   ✓ (apenas para texto 18px+)
  #6B7280 sobre #FFFFFF → 4.6:1   ✓

Focus styles:
  Todos os elementos interactivos: outline 2px #E8651A, offset 2px
  Nunca remover outline sem substituir por alternativa visível

ARIA obrigatório:
  - aria-label em todos os ícones sem texto
  - role="navigation" no navbar
  - aria-current="page" no link activo
  - aria-live="polite" em contadores de resultados dinâmicos
  - alt text descritivo em todas as fotos de imóveis
```

---

## FASE 1 — MVP (Semanas 1–8)

---

### SEMANA 1 — Setup do Projecto e Fundação

#### Prompt 1.1 — Inicialização do Projecto Next.js

```
Cria um projecto Next.js 15 com App Router, TypeScript, Tailwind CSS e ESLint para um portal
imobiliário português chamado Sua Morada. O projecto deve incluir:

- next.config.ts com optimização de imagens configurada para Cloudflare R2 (domínio a definir)
- tailwind.config.ts com design tokens: cores primárias (azul escuro #1B2B4B, branco #FFFFFF,
  laranja de destaque #E85D26), fontes (Inter para corpo, Merriweather para headings)
- Estrutura de pastas: app/, components/ui/, components/layout/, components/search/,
  components/listing/, lib/, types/, hooks/
- .env.local.example com todas as variáveis necessárias:
  DATABASE_URL, REDIS_URL, NEXT_PUBLIC_MAPBOX_TOKEN, CLOUDFLARE_R2_*, NEXTAUTH_*, RESEND_API_KEY
- tsconfig.json com path aliases: @/components, @/lib, @/types, @/hooks
- prettier.config.js e .eslintrc.json configurados
- Um layout raiz (app/layout.tsx) com metadata base para SEO: title template, description,
  Open Graph, robots, canonical
- Uma página home mínima (app/page.tsx) que renderiza "Sua Morada — Em construção"
- README.md com instruções de setup local

Garante que `next build` corre sem erros.
```

#### Prompt 1.2 — Design System e Componentes Base

```
Cria o design system base para o Sua Morada em Next.js 15 com Tailwind CSS. Implementa os
seguintes componentes em components/ui/:

Button.tsx:
- Variantes: primary (laranja #E85D26), secondary (azul #1B2B4B), ghost, outline
- Tamanhos: sm, md, lg
- Estado: loading (spinner), disabled
- Usa class-variance-authority (cva) para variantes

Input.tsx:
- Label, placeholder, error state, helper text
- Variantes: default, search (com ícone de lupa)

Select.tsx:
- Dropdown nativo estilizado com Tailwind
- Suporta opções agrupadas

Badge.tsx:
- Variantes: green ("Verificado"), orange ("Destaque"), gray ("Pausado"), blue ("Novo")

Card.tsx:
- Container genérico com shadow e border-radius

Icon.tsx:
- Wrapper para lucide-react com tamanhos padronizados

Todos os componentes devem:
- Ser totalmente acessíveis (aria-labels, roles, keyboard navigation)
- Suportar dark mode via Tailwind (classe dark:)
- Ter tipos TypeScript completos com React.ComponentProps extension
- Ser documentados com um exemplo de uso em comentário JSDoc
```

#### Prompt 1.3 — Layout Principal e Navegação

```
Cria o layout principal do Sua Morada com os seguintes componentes em components/layout/:

Header.tsx (Server Component):
- Logo "Sua Morada" à esquerda (SVG inline simples)
- Navegação central: Comprar | Arrendar | Vender | Avaliar
- CTA direito: "Publicar Anúncio" (botão laranja) + "Entrar" (ghost)
- Sticky com backdrop-blur quando scrolled
- Menu hamburger para mobile com Sheet lateral (usando @radix-ui/react-dialog)
- Totalmente responsivo: desktop nav horizontal, mobile nav em Sheet

Footer.tsx (Server Component):
- 4 colunas: Sobre Nós, Comprar, Arrendar, Contacto
- Links: Quem Somos, Como Funciona, Publicar Anúncio, Blog, Termos, Privacidade
- Copyright + badges de segurança (RGPD compliant)
- Responsivo: colapsa para accordion em mobile

app/layout.tsx:
- Integra Header e Footer
- Fonte Inter via next/font/google
- Analytics placeholder (Plausible script tag com next/script strategy="afterInteractive")
- Toast notifications com react-hot-toast

Garante que o layout passa Core Web Vitals: sem layout shift no header (min-height fixo),
imagens com width/height explícitos.
```

---

### SEMANA 2 — Estrutura de URLs e Base de Dados

#### Prompt 2.1 — Schema da Base de Dados

```
Cria o schema PostgreSQL completo para o Sua Morada. Usa Drizzle ORM com suporte a PostGIS.

Tabelas necessárias:

properties (imóveis):
- id: uuid primary key (gen_random_uuid())
- slug: text unique not null (ex: "apartamento-t2-campo-de-ourique-lisboa-abc123")
- title: text not null
- description: text
- property_type: enum ('apartment', 'house', 'villa', 'commercial', 'land', 'garage')
- listing_type: enum ('sale', 'rent')
- price: integer not null (em cêntimos para evitar floats)
- price_negotiable: boolean default false
- area_gross: integer (m²)
- area_useful: integer (m²)
- bedrooms: integer (0=studio, 1=T1, 2=T2, etc.)
- bathrooms: integer
- floor: integer nullable
- total_floors: integer nullable
- condition: enum ('new', 'used', 'needs_renovation', 'under_construction')
- energy_certificate: enum ('A+', 'A', 'B', 'B-', 'C', 'D', 'E', 'F', 'exempt')
- has_garage: boolean default false
- has_elevator: boolean default false
- has_pool: boolean default false
- has_garden: boolean default false
- features: text[] (array de features livres)
- location: geometry(Point, 4326) [PostGIS]
- address_street: text
- address_parish: text (freguesia)
- address_municipality: text (concelho)
- address_district: text (distrito)
- address_postal_code: varchar(8)
- status: enum ('draft', 'pending_review', 'active', 'paused', 'sold', 'rented', 'expired')
- verified: boolean default false
- featured: boolean default false
- views_count: integer default 0
- contacts_count: integer default 0
- published_at: timestamp
- expires_at: timestamp
- created_at: timestamp default now()
- updated_at: timestamp default now()

property_images:
- id: uuid primary key
- property_id: uuid references properties(id) on delete cascade
- url: text not null (URL do Cloudflare R2)
- position: integer (ordem das fotos)
- is_cover: boolean default false
- width: integer
- height: integer
- created_at: timestamp default now()

users:
- id: uuid primary key
- email: text unique not null
- name: text
- phone: varchar(20)
- role: enum ('buyer', 'agent', 'agency_admin', 'admin')
- avatar_url: text
- email_verified: timestamp
- created_at: timestamp default now()

agencies:
- id: uuid primary key
- name: text not null
- slug: text unique not null
- logo_url: text
- website: text
- phone: text
- email: text
- license_number: text (licença AMI)
- verified: boolean default false
- created_at: timestamp default now()

Índices obrigatórios:
- idx_properties_location: GIST index na coluna location (PostGIS)
- idx_properties_search: GIN index em (to_tsvector('portuguese', title || ' ' || description))
- idx_properties_status_type: (status, listing_type, property_type)
- idx_properties_price: (listing_type, price) onde status = 'active'
- idx_properties_municipality: (address_municipality, status)

Cria também as migrações Drizzle e um seed script com 20 imóveis fictícios em Lisboa e Porto.
```

#### Prompt 2.2 — Estrutura de URLs e Routing SEO

```
Implementa a estrutura de routing do Sua Morada em Next.js 15 App Router optimizada para SEO.

Estrutura de ficheiros app/:

app/
├── page.tsx                          (homepage)
├── comprar/
│   ├── page.tsx                      (listagem geral compra)
│   └── [distrito]/
│       ├── page.tsx                  (ex: /comprar/lisboa)
│       └── [tipo]/
│           └── page.tsx              (ex: /comprar/lisboa/apartamentos)
├── arrendar/
│   ├── page.tsx
│   └── [distrito]/
│       └── [tipo]/
│           └── page.tsx
├── imovel/
│   └── [slug]/
│       └── page.tsx                  (detalhe do imóvel)
├── avaliar/
│   └── page.tsx                      (calculadora AVM - placeholder)
├── publicar/
│   └── page.tsx                      (formulário de anúncio)
├── agencias/
│   └── [slug]/
│       └── page.tsx
└── sitemap.ts                        (sitemap dinâmico)

Para cada route, implementa:

1. generateMetadata() dinâmico com:
   - title: "[Tipo] [Tipologia] em [Zona] | Sua Morada"
   - description gerada a partir dos dados do imóvel
   - Open Graph com imagem de capa do imóvel
   - canonical URL correcta
   - robots: index, follow (ou noindex para drafts)

2. generateStaticParams() para as páginas de distrito/tipo mais comuns:
   Distritos: lisboa, porto, braga, setubal, faro, aveiro, coimbra, leiria
   Tipos: apartamentos, moradias, vivendas, comercial, terrenos, garagens

3. Breadcrumbs estruturados (JSON-LD BreadcrumbList) em cada página

4. sitemap.ts que gera dinamicamente:
   - Todas as propriedades activas (changefreq: 'daily', priority: 0.8)
   - Páginas de distrito/tipo (changefreq: 'weekly', priority: 0.9)
   - Páginas estáticas (changefreq: 'monthly', priority: 0.5)

5. robots.ts que bloqueia /admin/, /api/, /publicar/step-*

Usa slugs em português sem acentos: "t2" não "T2", "apartamentos" não "apartment".
```

---

### SEMANA 3 — Motor de Pesquisa

#### Prompt 3.1 — API de Pesquisa de Imóveis

```
Cria a API de pesquisa de imóveis para o Sua Morada em Next.js 15 Route Handlers.

Ficheiro: app/api/properties/search/route.ts

Parâmetros aceites (query string):
- tipo: 'comprar' | 'arrendar'
- property_type: 'apartamento' | 'moradia' | 'vivenda' | 'comercial' | 'terreno' | 'garagem'
- distrito: string (ex: 'lisboa', 'porto')
- municipio: string (ex: 'cascais', 'sintra')
- min_price: number
- max_price: number
- min_area: number
- max_area: number
- quartos: number (0=studio, 1, 2, 3, 4, 5=5+)
- lat: number (para pesquisa por proximidade)
- lng: number
- radius_km: number (default 10, usado com lat/lng)
- features: string[] (ex: 'garage,pool,elevator')
- energy: string (ex: 'A,B')
- page: number (default 1)
- limit: number (default 20, max 50)
- sort: 'price_asc' | 'price_desc' | 'newest' | 'relevance'

Lógica:
1. Valida parâmetros com zod
2. Constrói query Drizzle ORM dinâmica:
   - Se lat/lng fornecidos: usa ST_DWithin(location, ST_MakePoint(lng, lat)::geography, radius_km * 1000)
   - Se distrito/município: WHERE address_district = ? OR address_municipality = ?
   - Filtros de preço, área, quartos, features (array @> ARRAY[...])
   - Sempre filtra status = 'active'
3. Retorna:
   {
     results: Property[],
     total: number,
     page: number,
     total_pages: number,
     bounds: { north, south, east, west } // para centrar o mapa
   }
4. Cache com Redis: TTL 5 minutos para queries sem lat/lng, 1 minuto com lat/lng
5. Rate limiting: 60 requests/minuto por IP

Cria também:
- app/api/properties/[slug]/route.ts — detalhe de um imóvel (incrementa views_count)
- lib/db/queries/properties.ts — funções reutilizáveis de query
- types/property.ts — tipos TypeScript completos derivados do schema Drizzle
```

#### Prompt 3.2 — Componente de Pesquisa (Search Bar)

```
Cria o componente de pesquisa principal do Sua Morada: components/search/SearchBar.tsx

É o componente hero da homepage e topo das páginas de listagem. Deve ter:

Tabs superiores: "Comprar" | "Arrendar" (muda o contexto dos filtros)

Linha de filtros principais (numa linha em desktop, stack em mobile):
1. Campo de localização com autocomplete:
   - Input text com debounce de 300ms
   - Dropdown com sugestões: distritos, municípios, freguesias (da DB ou hardcoded inicialmente)
   - Ícone de pin à esquerda
   - Sugestões: "Lisboa", "Porto", "Cascais", "Sintra", "Braga", etc.

2. Select de Tipologia:
   - Opções: Todos, Apartamentos, Moradias, Vivendas, Comercial, Terrenos, Garagens

3. Select de Quartos:
   - Opções: Todos, Studio, T1, T2, T3, T4, T5+

4. Range de Preço:
   - Dois inputs numéricos: "Mín €" e "Máx €"
   - Formatação automática: 250000 → "250.000 €"
   - Em desktop: numa linha; em mobile: dois campos separados

5. Botão "Pesquisar" (laranja, tamanho lg, ícone lupa)

Link "Filtros avançados +" que expande:
- Área mínima / máxima (m²)
- Casas de banho
- Certificado energético (multi-select: A+, A, B, B-, C, D, E, F)
- Features: checkbox grid (Garagem, Elevador, Piscina, Jardim, Varanda, Terraço, Arrecadação)

Comportamento:
- Em submit, navega para /comprar/[distrito]/[tipo]?[params] ou /arrendar/...
- Os filtros são reflectidos na URL (useSearchParams)
- Estado persistido na URL — ao partilhar o link, os filtros mantêm-se
- Em mobile: botão flutuante "Filtros" que abre Sheet com todos os filtros

Usa react-hook-form + zod para validação. Totalmente acessível (fieldset, legend, labels).
```

#### Prompt 3.3 — Página de Resultados com Mapa

```
Cria a página de resultados de pesquisa do Sua Morada: app/comprar/[distrito]/[tipo]/page.tsx
(e equivalente para /arrendar/)

Layout em dois painéis (desktop):
- Painel esquerdo (40%): lista de cards de imóveis com scroll
- Painel direito (60%): mapa Mapbox com pins

Em mobile: tabs para alternar entre "Lista" e "Mapa"

Componente ListingCard (components/listing/ListingCard.tsx):
- Foto de capa com next/image (aspect-ratio 4:3, lazy loading excepto os 3 primeiros)
- Badge de status: "Novo" (< 7 dias), "Destaque", "Preço Reduzido"
- Preço em grande: "250.000 €" ou "1.200 €/mês"
- Tipologia + área: "T2 • 85 m²"
- Localização: "Campo de Ourique, Lisboa"
- Ícones de quartos 🛏 e casas de banho 🚿
- Badge "Verificado" se verified=true
- Botão de favorito (coração) no canto superior direito
- Hover state: elevação de sombra, foto faz zoom suave
- Ao clicar: navega para /imovel/[slug]

Mapa Mapbox (components/search/PropertyMap.tsx):
- Usa mapbox-gl com React wrapper
- Pins personalizados com preço ("€250k") em bubble laranja
- Pin activo (quando hover no card) fica maior e muda de cor
- Cluster de pins quando muitos pontos próximos
- Ao clicar num pin: abre popup com mini-card do imóvel (foto, preço, tipologia)
- Botão "Pesquisar nesta área" aparece ao mover o mapa (rebusca com bounds do mapa)
- Controls: zoom +/-, fullscreen, geolocalização

Toolbar de ordenação acima da lista:
- "X imóveis encontrados"
- Select de ordenação: Relevância, Preço ↑, Preço ↓, Mais recentes
- Toggle view: grid (2 colunas) | lista (1 coluna)

Paginação infinita (scroll) na lista, não paginação por páginas.

Server Component para o fetch inicial (SSR), Client Component para interactividade do mapa.
Usa Suspense + loading.tsx com skeleton cards enquanto carrega.
```

---

### SEMANA 4 — Página de Detalhe do Imóvel

#### Prompt 4.1 — Página de Detalhe do Imóvel (com Google AdSense)

```
Cria a página de detalhe de imóvel do Sua Morada: app/imovel/[slug]/page.tsx

Esta é a página mais importante para SEO e para receita AdSense — cada imóvel é uma
landing page indexável com alto tempo de sessão (ideal para anúncios display).

─── ESTRATÉGIA ADSENSE ────────────────────────────────────────────────────────

Posicionamentos de anúncios (6 slots no total, todos lazy-loaded):

DESKTOP:
  [AD-1] Leaderboard 728×90 — entre a galeria de fotos e o header do imóvel
          Visibilidade máxima: acima do fold em monitores médios
  [AD-2] Rectangle 300×250 — no meio da descrição (após o 3º parágrafo)
          Alta taxa de clique em contexto de leitura
  [AD-3] Rectangle 300×600 (half-page) — na sidebar, abaixo do card de contacto
          Sticky parcial: acompanha o scroll até ao fim da sidebar
  [AD-4] Leaderboard 728×90 — entre "Características" e "Mapa"
          Segunda passagem de scroll — utilizador ainda está engajado
  [AD-5] Rectangle 300×250 — abaixo do mapa, antes dos "Imóveis Similares"
  [AD-6] Leaderboard 728×90 — após os "Imóveis Similares" (footer da página)

MOBILE (breakpoint < 768px):
  [AD-M1] Banner 320×50 — sticky no bottom da tela (fixed, z-index alto)
           Máxima visibilidade, não bloqueia conteúdo principal
  [AD-M2] Rectangle 300×250 — entre galeria e header do imóvel
  [AD-M3] Rectangle 300×250 — no meio da descrição
  [AD-M4] Rectangle 300×250 — entre características e mapa
  [AD-M5] Rectangle 300×250 — após imóveis similares

Componente AdUnit (components/ads/AdUnit.tsx):
- Props: slot (string), format ('leaderboard'|'rectangle'|'half-page'|'mobile-banner')
- Carrega o script AdSense via next/script strategy="lazyOnload" (não bloqueia LCP)
- Wrapper com altura mínima reservada (evita CLS — Cumulative Layout Shift):
  leaderboard: min-height: 90px, rectangle: min-height: 250px, half-page: min-height: 600px
- Placeholder visível (fundo cinza claro #F5F5F5) enquanto o anúncio não carrega
- Em desenvolvimento: mostra placeholder "AdSense [formato] [dimensões]" em laranja tracejado
- Respeita RGPD: só inicializa AdSense após consentimento de cookies (integra com banner RGPD)
- data-ad-client, data-ad-slot via env vars: NEXT_PUBLIC_ADSENSE_CLIENT, NEXT_PUBLIC_AD_SLOT_*

Env vars necessárias:
NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-XXXXXXXXXX
NEXT_PUBLIC_AD_SLOT_LEADERBOARD_1=XXXXXXXXXX
NEXT_PUBLIC_AD_SLOT_LEADERBOARD_2=XXXXXXXXXX
NEXT_PUBLIC_AD_SLOT_LEADERBOARD_3=XXXXXXXXXX
NEXT_PUBLIC_AD_SLOT_RECTANGLE_1=XXXXXXXXXX
NEXT_PUBLIC_AD_SLOT_RECTANGLE_2=XXXXXXXXXX
NEXT_PUBLIC_AD_SLOT_HALF_PAGE=XXXXXXXXXX
NEXT_PUBLIC_AD_SLOT_MOBILE_BANNER=XXXXXXXXXX
NEXT_PUBLIC_AD_SLOT_MOBILE_1=XXXXXXXXXX
NEXT_PUBLIC_AD_SLOT_MOBILE_2=XXXXXXXXXX
NEXT_PUBLIC_AD_SLOT_MOBILE_3=XXXXXXXXXX

Regra importante: anúncios de concorrentes imobiliários directos (Idealista, Imovirtual,
Supercasa) podem aparecer via AdSense — é inevitável. Não bloquear na conta AdSense
a não ser que representem > 30% dos anúncios mostrados (nesse caso usar Ad Category Blocking).

─── LAYOUT DA PÁGINA ──────────────────────────────────────────────────────────

Structured Data (JSON-LD) obrigatório no <head>:
- Schema.org RealEstateListing com: name, description, price, address, geo, numberOfRooms,
  floorSize, image (array), url
- BreadcrumbList: Home > Comprar > Lisboa > Apartamentos > [título do imóvel]

Layout (desktop: 2 colunas, mobile: 1 coluna stack):

COLUNA PRINCIPAL (65%):

1. Galeria de fotos:
   - Foto principal grande com aspect-ratio 16:9 e priority={true} (acima do fold → LCP)
   - Thumbnails horizontais em baixo (scroll horizontal)
   - Lightbox ao clicar (usa yet-another-react-lightbox, dynamic import)
   - Botão "Ver todas as X fotos"
   - Badge "Verificado" se verified=true

━━━ [AD-1] AdUnit leaderboard 728×90 (desktop) / AdUnit rectangle 300×250 (mobile AD-M2) ━━━

2. Header do imóvel:
   - Tipologia + tipo: "Apartamento T2 para Venda"
   - Endereço: "Campo de Ourique, Lisboa"
   - Preço em destaque: "250.000 €" (tamanho h1-equivalente)
   - Indicador de preço vs mercado (placeholder AVM): "Preço dentro da média para T2 em
     Campo de Ourique"
   - Data de publicação: "Publicado há 3 dias" | Views: "142 visualizações"

3. Características principais (grid 4 colunas, 2 em mobile):
   - Quartos | Casas de banho | Área útil | Área bruta
   - Andar | Certificado energético | Garagem | Estado

4. Descrição:
   - Primeiros 300 chars visíveis, botão "Ler mais" expande (sem navegação)
   - Formatação: parágrafos com line-height generoso (melhora tempo de leitura → mais views AdSense)

━━━ [AD-2] AdUnit rectangle 300×250 inserido inline após o 3º parágrafo da descrição ━━━
   (inserção dinâmica: conta parágrafos do texto e injeta o AdUnit entre eles)

5. Features adicionais:
   - Grid de chips: Elevador, Piscina, Jardim, Varanda, Terraço, Arrecadação, etc.

━━━ [AD-4] AdUnit leaderboard 728×90 (desktop) / AdUnit rectangle 300×250 (mobile AD-M4) ━━━

6. Mapa da localização:
   - Mapbox estático (dynamic import, ssr: false)
   - Pin aproximado com raio de privacidade
   - "Localização aproximada por privacidade"
   - Botão "Ver no Google Maps"

━━━ [AD-5] AdUnit rectangle 300×250 — abaixo do mapa ━━━

7. Imóveis similares:
   - Título: "Imóveis Semelhantes em [Zona]"
   - Grid de 3 ListingCards (mesma tipologia, zona, preço ±20%)
   - Scroll horizontal em mobile

━━━ [AD-6] AdUnit leaderboard 728×90 (desktop) / AdUnit rectangle 300×250 (mobile AD-M5) ━━━

SIDEBAR (35%), sticky top: 80px em desktop:

- Card de contacto (sempre visível, alta prioridade visual):
  - Logo/nome da agência com link para /agencias/[slug]
  - Nome do agente responsável
  - Botão primário "Contactar" (laranja) → abre modal com formulário
  - Botão "Telefonar" (ícone + número parcialmente mascarado: "912 *** ***", revela ao clicar)
  - Botão "WhatsApp" → wa.me/351XXXXXXXXX?text=Tenho interesse...
  - Divider
  - Botão ghost "Guardar" (ícone coração)
  - Botão ghost "Partilhar" → Web Share API

━━━ [AD-3] AdUnit half-page 300×600 (desktop apenas) — abaixo do card de contacto ━━━
   Sticky parcial: acompanha scroll mas para ao chegar ao footer da sidebar

MOBILE STICKY BOTTOM:
━━━ [AD-M1] AdUnit banner 320×50 — fixed bottom: 0, z-index: 50 ━━━
   Botão "×" para dispensar (esconde por 24h via localStorage)
   Não aparece se o utilizador está a ver o modal de contacto

─── FORMULÁRIO DE CONTACTO (modal) ───────────────────────────────────────────

Campos: nome*, email*, telefone, mensagem (pré-preenchida: "Olá, tenho interesse neste
imóvel. Podem contactar-me? Obrigado.")
- Validação react-hook-form + zod
- Submit: POST /api/properties/[id]/contact
  - Envia email à agência via Resend com template React Email
  - Incrementa contacts_count na DB
  - Regista lead na tabela leads (para o dashboard do anunciante)
- Após submit: mensagem de sucesso + sugere "Guardar este imóvel"

─── PERFORMANCE / ADSENSE COMPATIBILITY ──────────────────────────────────────

Atenção: o AdSense pode conflituar com Core Web Vitals se mal implementado.
Mitigações obrigatórias:

1. Reserva de espaço (anti-CLS):
   Cada AdUnit wrapper deve ter dimensões fixas via CSS antes do anúncio carregar:
   .ad-leaderboard { min-height: 90px; min-width: 728px; }
   .ad-rectangle   { min-height: 250px; min-width: 300px; }
   .ad-half-page   { min-height: 600px; min-width: 300px; }

2. Lazy load dos AdUnits:
   Usa Intersection Observer para só inicializar o anúncio quando o slot
   entra no viewport (melhora LCP e TTI da página)

3. Script AdSense com strategy="lazyOnload":
   <Script src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
           strategy="lazyOnload" />
   Nunca usar strategy="beforeInteractive" — bloqueia o render

4. Verificar que as páginas de imóvel mantêm LCP < 2.5s com os anúncios activos
   (testar com Lighthouse em modo throttled 4G)

─── CONSENTIMENTO RGPD ────────────────────────────────────────────────────────

O AdSense personalizado (targetado) requer consentimento explícito na UE/Portugal.

Implementa componente CookieBanner (components/gdpr/CookieBanner.tsx):
- Aparece na primeira visita, fixed bottom
- Opções: "Aceitar Todos" | "Apenas Essenciais" | "Personalizar"
- Decisão guardada em cookie (consent_analytics, consent_ads) por 12 meses
- AdSense só carrega se consent_ads = true
- Se recusado: AdSense não-personalizado (non-personalized ads) via:
  window.googletag.pubads().setRequestNonPersonalizedAds(1)
- Integrar com Google Consent Mode v2 (obrigatório para Portugal desde 2024)

Garante que o banner RGPD não causa CLS — usar position: fixed e reservar espaço
no body com padding-bottom quando o banner está visível.
```

---

### SEMANA 5 — Publicação de Anúncios

#### Prompt 5.1 — Formulário Multi-step de Publicação

```
Cria o formulário de publicação de imóveis do Sua Morada: app/publicar/page.tsx

Formulário multi-step com progress bar (4 passos):

Step 1 — Tipo de Anúncio:
- O que pretende fazer? [Vender] [Arrendar]
- Tipo de imóvel: Apartamento | Moradia | Vivenda | Comercial | Terreno | Garagem
  (cards visuais com ícone, não selects)
- Ao clicar num card, avança automaticamente para o step 2

Step 2 — Localização:
- Morada (rua, número)
- Código Postal (formato 0000-000, valida e preenche cidade/distrito automaticamente)
- Freguesia e Município (preenchidos auto via API de CP)
- Distrito (select)
- Mapa interactivo: utilizador confirma/ajusta o pin da localização
- Checkbox "Não mostrar morada exacta no anúncio" (preenche coordenadas aproximadas)

Step 3 — Detalhes:
- Título do anúncio (max 100 chars, contador)
- Descrição (min 100 chars, max 2000, contador)
- Preço (€) + checkbox "Preço negociável"
- Quartos (0=Studio, T1 a T5+) — botões numéricos +/-
- Casas de banho — botões +/-
- Área útil (m²) e Área bruta (m²)
- Andar / Total de andares
- Ano de construção
- Estado: Novo | Usado | Para recuperar | Em construção
- Certificado energético: A+ a F | Isento
- Características (checkboxes): Garagem, Elevador, Piscina, Jardim, Varanda, Terraço,
  Arrecadação, Ar condicionado, Aquecimento central, Video-porteiro, Mobilado,
  Equipado (cozinha), Animais permitidos

Step 4 — Fotos:
- Dropzone com drag-and-drop (react-dropzone)
- Mínimo 3 fotos, máximo 30
- Preview de thumbnails com botão de remover
- Drag para reordenar (usando @dnd-kit/sortable)
- Upload para Cloudflare R2 via signed URL (app/api/upload/route.ts)
- Validação: JPG/PNG, max 10MB por foto, min 800x600px
- Barra de progresso por ficheiro
- Primeira foto = foto de capa (marcada com badge "Capa")

Revisão final (após step 4):
- Preview do anúncio como ficará publicado
- Resumo: tipo, localização, preço, quartos, fotos
- Botão "Publicar Anúncio" → POST /api/properties

Estado gerido com Zustand (persiste no localStorage para não perder dados ao navegar).
Navegação entre steps sem perder dados. Validação com zod por step.
```

#### Prompt 5.2 — API de Publicação e Upload

```
Cria as APIs de backend para publicação de imóveis no Sua Morada.

1. app/api/upload/signed-url/route.ts (POST):
   - Recebe: { filename: string, contentType: string, size: number }
   - Valida: contentType em ['image/jpeg', 'image/png', 'image/webp'], size <= 10MB
   - Gera uma signed URL do Cloudflare R2 para upload directo do browser (sem passar pelo servidor)
   - Retorna: { uploadUrl: string, publicUrl: string, key: string }
   - Requer autenticação (NextAuth session)

2. app/api/properties/route.ts (POST):
   - Recebe o payload completo do formulário multi-step
   - Valida com zod (schema completo de criação de imóvel)
   - Gera o slug automaticamente:
     "{tipo}-{tipologia}-{freguesia}-{municipio}-{random6chars}"
     ex: "apartamento-t2-campo-de-ourique-lisboa-a4x9kl"
     Garante unicidade (verifica na DB e adiciona sufixo se necessário)
   - Insere na tabela properties com status = 'pending_review' (ou 'active' se agência verificada)
   - Insere as imagens em property_images com posição e is_cover para a primeira
   - Converte coordenadas para PostGIS: ST_SetSRID(ST_MakePoint(lng, lat), 4326)
   - Envia email de confirmação ao utilizador via Resend
   - Envia notificação interna para moderação (se pending_review)
   - Retorna: { id, slug, status }

3. app/api/properties/[id]/route.ts (PATCH):
   - Permite editar imóvel próprio (verifica ownership)
   - Campos editáveis: todos excepto slug e created_at
   - Muda status para 'pending_review' se estava 'active' e preço/localização mudou

Middleware de autenticação reutilizável: lib/auth/withAuth.ts
Rate limiting na publicação: máximo 5 imóveis por hora por utilizador.
```

---

### SEMANA 6 — Painel do Anunciante

#### Prompt 6.1 — Dashboard do Anunciante

```
Cria o painel de gestão de anúncios do Sua Morada para agentes/particulares.

Route: app/dashboard/page.tsx (protegida por NextAuth middleware)

Layout:
- Sidebar de navegação (desktop) / Bottom tabs (mobile):
  - 📊 Visão Geral
  - 🏠 Os Meus Anúncios
  - 📩 Mensagens
  - 👤 Perfil
  - (para agências) 🏢 A Minha Agência

Página "Visão Geral" (app/dashboard/page.tsx):
- Cartões de métricas:
  - Total de anúncios activos
  - Visualizações nos últimos 30 dias (soma)
  - Contactos recebidos nos últimos 30 dias
  - Taxa de conversão (contactos / visualizações %)
- Gráfico simples de views por dia (últimos 30 dias) — usar recharts
- Lista dos 5 imóveis mais vistos com link para o anúncio

Página "Os Meus Anúncios" (app/dashboard/listings/page.tsx):
- Tabela com colunas: Foto | Título | Status | Preço | Views | Contactos | Publicado | Acções
- Status com badge colorido: Activo (verde), Pausado (cinza), Pendente (laranja), Expirado (vermelho)
- Acções por linha:
  - Editar → /publicar/editar/[id]
  - Pausar/Activar (toggle)
  - Partilhar (copia link)
  - Eliminar (confirmação modal)
- Filtro por status acima da tabela
- Paginação (20 por página)
- Botão "Publicar Novo Anúncio" em destaque

Página "Mensagens" (app/dashboard/messages/page.tsx):
- Lista de conversações recebidas por imóvel
- Cada item: nome do interessado, imóvel, preview da mensagem, data, novo/lido
- Ao clicar: abre thread de mensagens completa (apenas leitura no MVP — resposta por email)
- Badge de não lidas no menu

Todas as páginas do dashboard são Client Components com SWR para revalidação automática.
Layout do dashboard em app/dashboard/layout.tsx separado do layout principal.
```

---

### SEMANA 7 — SEO Técnico e Performance

#### Prompt 7.1 — SEO Técnico Completo

```
Implementa o SEO técnico completo do Sua Morada para máximo ranking no Google Portugal.

1. Metadata dinâmica por tipo de página:

Homepage (app/page.tsx):
- title: "Sua Morada — Comprar, Vender e Arrendar Imóveis em Portugal"
- description: "Encontre o imóvel ideal em Portugal. Milhares de apartamentos, moradias e
  vivendas para compra e arrendamento em Lisboa, Porto, Algarve e todo o país."
- keywords: não usar (Google ignora, mas adiciona para Bing)
- og:image: imagem estática 1200x630 da marca

Páginas de listagem (/comprar/lisboa/apartamentos):
- title: "Apartamentos para Venda em Lisboa — X anúncios | Sua Morada"
- description: "X apartamentos para venda em Lisboa. Filtre por preço, área e tipologia.
  Veja fotos e contacte directamente o anunciante."
- og:image: collage dinâmica das 4 primeiras fotos (usando @vercel/og)

Páginas de imóvel (/imovel/[slug]):
- title: "[Título do Imóvel] — [Preço formtado] | Sua Morada"
- description: primeiros 155 chars da descrição (truncada em palavra completa)
- og:image: foto de capa do imóvel com overlay de preço (usando @vercel/og)
- og:type: "product"

2. Structured Data (JSON-LD) em cada página:

Homepage: WebSite com SearchAction (sitelinks search box)
{
  "@type": "WebSite",
  "url": "https://Sua Morada.pt",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://Sua Morada.pt/comprar?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}

Página de imóvel: RealEstateListing + BreadcrumbList + AggregateRating (quando tiver reviews)

3. Sitemap dinâmico (app/sitemap.ts):
- Prioridade 1.0: homepage
- Prioridade 0.9: /comprar, /arrendar, páginas de distrito/tipo
- Prioridade 0.8: cada imóvel activo
- Prioridade 0.5: páginas estáticas (/sobre, /contacto)
- lastModified: updated_at de cada imóvel
- Divide em múltiplos sitemaps se > 50.000 URLs (sitemap index)

4. robots.ts:
- Bloqueia: /dashboard/, /api/, /admin/, /publicar/step-*
- Permite: tudo o resto
- Aponta para sitemap

5. Core Web Vitals — optimizações:
- Todas as imagens com next/image: width, height, priority para above-the-fold, sizes correcto
- Fontes com display: swap e preload
- No layout shift: skeleton com mesmas dimensões dos elementos reais
- Lazy loading de Mapbox (dynamic import com ssr: false)
- Bundle analyzer: next-bundle-analyzer para garantir < 200KB JS inicial

6. Hreflang (para versão PT e PT-BR futura):
<link rel="alternate" hreflang="pt-PT" href="https://Sua Morada.pt/..." />

Verifica com Lighthouse que todas as páginas atingem > 90 em SEO e > 85 em Performance.
```

#### Prompt 7.2 — Optimização de Performance

```
Optimiza a performance do Sua Morada para atingir Core Web Vitals verde em todas as páginas.

1. Optimização de imagens:
- Configura next/image com loader do Cloudflare Images:
  - Formatos: AVIF > WebP > JPEG (automático por browser)
  - Sizes correcto por componente:
    - ListingCard: sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    - Hero da página de detalhe: sizes="(max-width: 768px) 100vw, 65vw"
  - priority={true} nas 3 primeiras ListingCards (above the fold)
  - placeholder="blur" com blurDataURL gerado no upload

2. Caching strategy:
- API routes de pesquisa: Cache-Control: s-maxage=300, stale-while-revalidate=600
- Páginas de listagem (ISR): revalidate = 300 (5 min)
- Páginas de imóvel (ISR): revalidate = 3600 (1 hora)
- Dados estáticos (distritos, tipos): revalidate = 86400 (24 horas)

3. Code splitting:
- Mapbox GL: dynamic(() => import('./PropertyMap'), { ssr: false, loading: () => <MapSkeleton /> })
- Lightbox: dynamic import apenas quando utilizador clica nas fotos
- Dashboard charts: dynamic import apenas na rota /dashboard

4. Prefetching inteligente:
- <Link prefetch={true}> nos primeiros 6 cards de resultados
- <Link prefetch={false}> em links de footer e navegação secundária
- Router.prefetch('/imovel/[slug]') no hover de ListingCard (300ms delay)

5. Redis caching para queries frequentes:
- lib/cache/redis.ts com funções: get, set, del, getOrSet
- getOrSet(key, fetcher, ttl): verifica cache antes de ir à DB
- Invalidação: quando imóvel é editado, limpa cache das pesquisas afectadas

6. Database connection pooling:
- Usa @neondatabase/serverless ou pg com pool de conexões
- Máximo 10 conexões simultâneas
- Timeout de query: 5 segundos

7. Monitoring:
- Sentry para error tracking (dsn via env var)
- Vercel Speed Insights activado
- Web Vitals reportados para analytics: lib/vitals.ts com reportWebVitals

Meta: Lighthouse Performance > 85, LCP < 2.5s, CLS < 0.1, INP < 200ms em mobile.
```

---

### SEMANA 8 — Lançamento

#### Prompt 8.1 — Autenticação e Contas de Utilizador

```
Implementa o sistema de autenticação do Sua Morada com NextAuth.js v5 (Auth.js).

Configuração (auth.ts na raiz):
Providers:
- Email (magic link via Resend — sem senha, mais seguro e melhor UX)
- Google OAuth
- Credentials (email + password com bcrypt — para compatibilidade)

Adaptador: DrizzleAdapter com as tabelas users, accounts, sessions, verification_tokens

Fluxo de registo (app/auth/register/page.tsx):
- Campos: Nome, Email, Telefone (opcional)
- Tipo de conta: "Particular" | "Agente / Agência"
- Se Agente: campo adicional para nº de licença AMI
- Checkbox RGPD obrigatório
- Após registo: email de boas-vindas via Resend com template React Email

Fluxo de login (app/auth/login/page.tsx):
- Magic link por email (recomendado) OU email+password
- Botão "Continuar com Google"
- Link para registo

Protecção de rotas:
- middleware.ts: protege /dashboard/*, /publicar/* (redireciona para /auth/login)
- Nas API routes: usa getServerSession(authOptions) ou auth() do Auth.js v5

Perfil (app/dashboard/profile/page.tsx):
- Editar nome, telefone, avatar (upload para R2)
- Alterar email (requer verificação do novo email)
- Alterar password
- Ligar/desligar conta Google
- Zona de perigo: Eliminar conta (confirmação com palavra "ELIMINAR")

Segurança:
- CSRF protection nativa do NextAuth
- Rate limiting no login: 5 tentativas por IP por 15 minutos (Redis)
- Sessões JWT com expiração de 30 dias (renovação automática)
- HttpOnly cookies, SameSite=Strict, Secure em produção
```

#### Prompt 8.2 — Deploy e Configuração de Produção

```
Configura o deploy de produção do Sua Morada em Vercel + Hetzner.

1. Vercel (frontend Next.js):
Ficheiro vercel.json:
{
  "regions": ["lhr1"],  // Londres (mais próximo de Portugal na Vercel)
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-XSS-Protection", "value": "1; mode=block" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=(self)" }
      ]
    },
    {
      "source": "/static/(.*)",
      "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }]
    }
  ]
}

Variáveis de ambiente no Vercel (production + preview separados):
- DATABASE_URL (Hetzner PostgreSQL via SSL)
- REDIS_URL (Hetzner Redis)
- NEXTAUTH_SECRET (openssl rand -base64 32)
- NEXTAUTH_URL (https://Sua Morada.pt)
- NEXT_PUBLIC_MAPBOX_TOKEN
- CLOUDFLARE_R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME
- NEXT_PUBLIC_R2_PUBLIC_URL
- RESEND_API_KEY
- GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
- SENTRY_DSN

2. Hetzner (VPS CX22 — 3.92€/mês):
Script de setup (scripts/setup-server.sh):
- Ubuntu 24.04
- Docker + Docker Compose
- docker-compose.yml com:
  - PostgreSQL 16 com PostGIS extension
  - Redis 7 com password e persistência AOF
  - Backups automáticos para Cloudflare R2 (pg_dump diário via cron)
- Firewall: apenas portas 22 (SSH), 5432 (Postgres, só IP Vercel), 6379 (Redis, só IP Vercel)
- SSL para conexões PostgreSQL (certificado auto-assinado para conexões internas)

3. Domínio e DNS (Cloudflare):
- A record: Sua Morada.pt → Vercel IP
- CNAME: www → cname.vercel-dns.com
- MX records para email (se usar domínio próprio para Resend)
- Cloudflare proxy (laranja) activado para protecção DDoS

4. Monitorização pós-lançamento:
- UptimeRobot (free): ping a cada 5 min, alerta por email se down
- Sentry: error tracking com alertas por email
- Vercel Analytics: Core Web Vitals reais dos utilizadores
- Google Search Console: submeter sitemap, monitorizar indexação
- Script de health check: app/api/health/route.ts retorna status da DB e Redis

5. Checklist pré-lançamento (scripts/pre-launch-checklist.md):
☐ next build corre sem erros
☐ Lighthouse > 85 Performance, > 90 SEO em mobile
☐ Sitemap acessível em /sitemap.xml
☐ robots.txt correcto
☐ Todas as páginas têm title e description únicos
☐ Structured data válido (Google Rich Results Test)
☐ Open Graph correcto (Facebook Sharing Debugger)
☐ Formulário de contacto envia email correctamente
☐ Upload de fotos funciona
☐ Pesquisa por localização retorna resultados
☐ Mapa carrega correctamente
☐ Login/registo funcionam
☐ Dashboard mostra anúncios do utilizador
☐ SSL A+ no SSL Labs
☐ Security headers correctos (securityheaders.com)
☐ Google Analytics / Plausible a receber dados
☐ Backups da DB configurados e testados
☐ DNS propagado e HTTPS a funcionar
```

---

## FASE 2 — Diferenciação (Semanas 9–16)

### Prompts de alto nível para planear no momento

#### Prompt 9 — Sistema de Alertas por Email
```
Cria o sistema de alertas de imóveis do Sua Morada. Os utilizadores configuram pesquisas
guardadas e recebem email quando aparecem novos imóveis que correspondem.

Tabela saved_searches na DB:
- id, user_id, name, filters (jsonb), last_notified_at, active

Cron job (Vercel Cron ou worker Hetzner) a cada hora:
- Para cada saved_search activa
- Executa a query de pesquisa com updated_at > last_notified_at
- Se há resultados novos: envia email com digest (max 5 imóveis, link para ver todos)
- Actualiza last_notified_at

Template de email (React Email): imóveis em cards com foto, preço, localização.
Unsubscribe link tokenizado em cada email.
```

#### Prompt 10 — Badge de Verificação e Anti-fraude
```
Implementa o sistema de verificação de anúncios do Sua Morada, o principal diferenciador
face ao Idealista (que tem 6.7% de resposta a reclamações).

Processo de verificação:
1. Ao publicar: anúncio fica em status 'pending_review'
2. Admin recebe notificação e acede a /admin/moderation
3. Checks automáticos:
   - Preço vs. mediana da zona (alerta se ±50% da mediana — possível fraude)
   - Fotos únicas (hash MD5 das imagens — detecta cópias de outros anúncios)
   - Número de telefone válido PT
4. Admin aprova → status 'active' + verified=true → Badge "Verificado" no anúncio
5. SLA público: verificação em 24 horas úteis

Painel de moderação (/admin/moderation/page.tsx):
- Lista de imóveis pendentes
- Visualização lado a lado: anúncio + dados do anunciante
- Botões: Aprovar, Rejeitar com motivo, Pedir mais informação
- Histórico de decisões
```

#### Prompt 11 — PWA e Experiência Mobile
```
Converte o Sua Morada numa Progressive Web App (PWA) para experiência mobile nativa.

next-pwa configuração:
- Manifest.json com ícones 192x192 e 512x512 (SVG gerado programaticamente)
- Theme color: #1B2B4B
- Display: standalone
- Start URL: /?source=pwa

Service Worker com workbox:
- Cache de assets estáticos (CSS, JS, fontes): CacheFirst
- Cache de API de pesquisa: StaleWhileRevalidate (serve cache, actualiza em background)
- Cache de imagens: CacheFirst com max 100 entradas
- Offline fallback: página /offline com últimas pesquisas guardadas

Funcionalidades específicas mobile:
- Pesquisa por geolocalização: "Imóveis perto de mim" (usa navigator.geolocation)
- Share API nativa ao partilhar imóvel (usa navigator.share)
- Prompt de instalação personalizado (BeforeInstallPrompt event)
- Pull-to-refresh na lista de resultados
```

---

## FASE 3 — Vantagem Competitiva (Semanas 17–28)

### Prompts estratégicos para fase avançada

#### Prompt 12 — AVM (Estimativa de Valor Automática)
```
Implementa a calculadora de valor de mercado do Sua Morada — equivalente ao Zestimate do
Zillow, funcionalidade inexistente em qualquer portal português.

Modelo MVP (sem ML no início — usa mediana estatística):
Dados necessários: todos os imóveis activos + vendidos nos últimos 12 meses

API: app/api/valuation/route.ts
Input: { lat, lng, property_type, bedrooms, area_useful }
Output: {
  estimated_value: number,
  confidence: 'low' | 'medium' | 'high',
  range_min: number,
  range_max: number,
  comparable_count: number,  // nº de imóveis usados no cálculo
  price_per_sqm: number,
  zone_median_price_sqm: number
}

Algoritmo (regressão linear simples):
1. Filtra imóveis activos num raio de 1km com mesma tipologia (±1 quarto)
2. Calcula preço/m² mediano dos comparáveis
3. Aplica coeficientes: andar (+2% por andar), elevador (+5%), garagem (+8%), jardim (+10%)
4. Range: mediana ±15%
5. Confiança: high se >= 10 comparáveis, medium se 3-9, low se < 3

Página pública: /avaliar
- Formulário: morada, tipo, tipologia, área
- Resultado visual com gauge/termómetro de preço
- "Este imóvel estaria X% acima/abaixo da estimativa" ao ver um anúncio
- CTA: "Publique por este preço" → /publicar
```

#### Prompt 13 — Dashboard para Agências e Ferramentas Pro
```
Cria o painel profissional para agências imobiliárias no Sua Morada — o que nenhum portal
consumer português oferece, inspirado no CASAFARI mas integrado no portal.

Funcionalidades:
1. Gestão de equipa: admin da agência adiciona agentes, define permissões
2. CRM básico de leads: pipeline visual (Kanban) com estados:
   Novo Lead → Contactado → Visita Agendada → Proposta → Fechado/Perdido
3. Estatísticas de agência: total de anúncios, leads por agente, taxa de conversão
4. Upload em bulk de imóveis via CSV/XML (para importar da base existente)
5. Feed XML/RSS para sincronização automática com o site da agência

Planos de subscrição (Stripe):
- Free: 3 anúncios activos, sem destaque
- Pro (29€/mês): 20 anúncios, 1 destaque/mês, estatísticas
- Business (79€/mês): ilimitado, 5 destaques/mês, CRM, feed XML, badge verificado automático
- Enterprise (contacto): multi-agência, API access, SLA dedicado
```

#### Prompt 14 — Agregação de Inventário (o diferenciador #1)
```
Implementa a agregação de inventário cross-portal do Sua Morada — o feature que resolve
o problema do "tenho de ver 5 sites" e é o principal gap do mercado português.

Arquitectura:
- Worker separado em Hetzner (Node.js + BullMQ para filas de jobs)
- Scraping ético: respeita robots.txt, rate limiting gentil, identifica o bot

Sources iniciais (apenas com dados públicos):
1. Feed XML de agências parceiras (formato OpenImmo ou personalizado)
2. APIs públicas de redes: ERA, RE/MAX (se disponíveis)
3. Anúncios de particulares de OLX (se termos permitem)

Pipeline por imóvel agregado:
1. Extração: preço, localização, tipologia, fotos, contacto, source URL
2. Deduplicação: hash de (lat, lng arredondado, preço, quartos) para detectar o mesmo imóvel
3. Normalização: converter para o schema interno
4. Enriquecimento: geocoding se coordenadas em falta (Nominatim/OpenStreetMap)
5. Armazenamento: tabela aggregated_listings separada (não mistura com listings próprias na UI)

UI:
- Toggle "Incluir resultados de outros portais" na pesquisa
- Cards de imóveis agregados com badge "Via [Source]" e link para anúncio original
- Não rouba o lead — o contacto vai para o portal original

Importante: consultar termos de serviço de cada portal antes de agregar.
```

---

## NOTAS DE IMPLEMENTAÇÃO

```
ORDEM DE PRIORIDADE ABSOLUTA:
1. SEO técnico correctamente desde o dia 1 (URLs, metadata, structured data)
   → É 10x mais difícil de corrigir depois com conteúdo indexado
2. Performance mobile (Core Web Vitals)
   → Google penaliza sites lentos em mobile nos rankings PT
3. Qualidade dos anúncios (verificação, fotos obrigatórias)
   → É o principal diferenciador vs. Idealista/Imovirtual

CONVENÇÕES DE CÓDIGO:
- Português nas strings visíveis ao utilizador, Inglês no código
- Preços sempre em cêntimos na DB (integer), formatar apenas na UI
- Coordenadas: sempre (longitude, latitude) na ordem PostGIS/GeoJSON
- Slugs: sem acentos, lowercase, hífens (usar slugify com locale pt)
- Datas: UTC na DB, converter para Europe/Lisbon apenas na UI

SEGURANÇA OBRIGATÓRIA:
- Sanitizar todos os inputs com DOMPurify antes de renderizar HTML
- Nunca expor coordenadas exactas de imóveis habitados na API pública
- Rate limiting em todas as API routes públicas
- RGPD: cookie banner, política de privacidade, direito ao esquecimento
```

---

*Documento gerado em 2026-05-30 | Sua Morada — Portal Imobiliário Portugal*
*Stack: Next.js 15 + PostgreSQL/PostGIS + Redis + Mapbox + Cloudflare R2 + Vercel + Hetzner*

