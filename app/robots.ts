import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard/", "/api/", "/admin/", "/publicar/step-"],
      },
    ],
    sitemap: "https://suamorada.pt/sitemap.xml",
  };
}
