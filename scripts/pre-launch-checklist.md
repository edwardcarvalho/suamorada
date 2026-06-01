# Sua Morada — Checklist de Pré-Lançamento

## Build e Qualidade

- [ ] `npm run build` corre sem erros TypeScript
- [ ] `npm run type-check` limpo
- [ ] Lighthouse Performance > 85 em mobile (testar em Chrome DevTools)
- [ ] Lighthouse SEO > 90 em todas as páginas principais
- [ ] Core Web Vitals: LCP < 2.5s, CLS < 0.1, INP < 200ms
- [ ] Sem erros de consola em produção

## SEO

- [ ] Sitemap acessível em `/sitemap.xml` e submetido no Google Search Console
- [ ] `robots.txt` correcto em `/robots.txt`
- [ ] Metadata única em todas as páginas (title + description)
- [ ] JSON-LD válido — testar em: https://search.google.com/test/rich-results
- [ ] Open Graph correcto — testar em: https://developers.facebook.com/tools/debug/
- [ ] Canonical URLs configuradas
- [ ] Hreflang `pt-PT`

## Segurança

- [ ] SSL A+ em https://www.ssllabs.com/ssltest/
- [ ] Security headers em https://securityheaders.com
- [ ] NEXTAUTH_SECRET forte (32 chars mínimo)
- [ ] Variáveis de ambiente configuradas no Vercel (não expostas)
- [ ] Rate limiting activo nas APIs públicas

## Funcionalidade

- [ ] Pesquisa retorna resultados da DB
- [ ] Formulário de contacto envia email correctamente
- [ ] Upload de fotos para R2 funciona
- [ ] Login com Google funciona
- [ ] Login com Magic Link (email) funciona
- [ ] Dashboard mostra dados do utilizador
- [ ] Publicação de anúncio completa (4 steps)
- [ ] Página de detalhe com estrutura correcta
- [ ] AdSense placeholder substituído por slots reais

## Base de Dados

- [ ] Migrações aplicadas: `npm run db:migrate`
- [ ] Seed opcional: `npm run db:seed`
- [ ] Backups automáticos configurados (cron Hetzner → R2)
- [ ] Índices PostGIS criados (idx_properties_location)
- [ ] Connection pooling activo (max 10 conexões)

## Infraestrutura

- [ ] Vercel deployment activo (região: lhr1 — Londres)
- [ ] Hetzner VPS configurado (PostgreSQL + Redis)
- [ ] Cloudflare DNS configurado (proxy ligado)
- [ ] UptimeRobot monitor configurado (alerta email)
- [ ] Sentry DSN configurado e a receber eventos
- [ ] Plausible analytics a receber pageviews
- [ ] Google Search Console com sitemap submetido

## RGPD

- [ ] Cookie banner implementado
- [ ] Google Consent Mode v2 configurado
- [ ] Política de privacidade publicada em `/privacidade`
- [ ] Termos de uso publicados em `/termos`
- [ ] Formulário de contacto com checkbox RGPD

## Performance

- [ ] Imagens com `next/image` e `priority` nas above-the-fold
- [ ] Mapbox GL carregado com `dynamic` + `ssr: false`
- [ ] AdSense com `strategy="lazyOnload"` e IntersectionObserver
- [ ] Redis cache activo para queries frequentes
- [ ] CDN Cloudflare a servir assets estáticos

## Domínio

- [ ] `suamorada.pt` registado e a apontar para Vercel
- [ ] `www.suamorada.pt` com redirect para apex
- [ ] Certificado SSL emitido automaticamente pelo Vercel
- [ ] Email `noreply@suamorada.pt` configurado no Resend

---

*Gerado automaticamente — Sua Morada v0.1.0*
