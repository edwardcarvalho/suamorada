import type { MetadataRoute } from "next";
import { DISTRICT_SLUGS, PROPERTY_TYPE_SLUGS } from "@/types/property";

const BASE = "https://suamorada.pt";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Páginas estáticas
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE,              lastModified: now, changeFrequency: "daily",   priority: 1.0 },
    { url: `${BASE}/comprar`, lastModified: now, changeFrequency: "daily",   priority: 0.9 },
    { url: `${BASE}/arrendar`,lastModified: now, changeFrequency: "daily",   priority: 0.9 },
    { url: `${BASE}/vender`,  lastModified: now, changeFrequency: "weekly",  priority: 0.7 },
    { url: `${BASE}/avaliar`, lastModified: now, changeFrequency: "weekly",  priority: 0.7 },
    { url: `${BASE}/agencias`,lastModified: now, changeFrequency: "weekly",  priority: 0.6 },
    { url: `${BASE}/sobre`,   lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${BASE}/contacto`,lastModified: now, changeFrequency: "monthly", priority: 0.4 },
  ];

  // Páginas de distrito/tipo (alta prioridade SEO)
  const distritos = Object.keys(DISTRICT_SLUGS);
  const tipos     = Object.keys(PROPERTY_TYPE_SLUGS);

  const listingPages: MetadataRoute.Sitemap = distritos.flatMap((d) => [
    // /comprar/[distrito]
    { url: `${BASE}/comprar/${d}`,  lastModified: now, changeFrequency: "daily" as const, priority: 0.85 },
    // /arrendar/[distrito]
    { url: `${BASE}/arrendar/${d}`, lastModified: now, changeFrequency: "daily" as const, priority: 0.85 },
    // /comprar/[distrito]/[tipo]
    ...tipos.map((t) => ({
      url: `${BASE}/comprar/${d}/${t}`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),
    // /arrendar/[distrito]/[tipo]
    ...tipos.map((t) => ({
      url: `${BASE}/arrendar/${d}/${t}`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),
  ]);

  return [...staticPages, ...listingPages];
  // Na Semana 4 adicionamos as páginas de imóvel dinâmicas da DB
}
