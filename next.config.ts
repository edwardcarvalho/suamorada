import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Porta 3001 para não colidir com outros projectos locais
  experimental: {},
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "pub-*.r2.dev"            },
      { protocol: "https", hostname: "*.r2.cloudflarestorage.com" },
      { protocol: "https", hostname: "imagedelivery.net"    },
      { protocol: "https", hostname: "picsum.photos"        },
      { protocol: "https", hostname: "fastly.picsum.photos"        },
      { protocol: "https", hostname: "lh3.googleusercontent.com"  },
    ],
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
