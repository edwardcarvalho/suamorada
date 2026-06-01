"use client";

import * as React from "react";
import Script from "next/script";
import { cn } from "@/lib/utils";

type AdFormat = "leaderboard" | "rectangle" | "half-page" | "mobile-banner";

const DIMENSIONS: Record<AdFormat, { w: number; h: number; label: string }> = {
  "leaderboard":    { w: 728, h: 90,  label: "728×90" },
  "rectangle":      { w: 300, h: 250, label: "300×250" },
  "half-page":      { w: 300, h: 600, label: "300×600" },
  "mobile-banner":  { w: 320, h: 50,  label: "320×50"  },
};

interface AdUnitProps {
  slot: string;
  format: AdFormat;
  className?: string;
}

let adsenseLoaded = false;

export function AdUnit({ slot, format, className }: AdUnitProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [visible, setVisible] = React.useState(false);
  const [consent, setConsent] = React.useState(false);
  const dim = DIMENSIONS[format];
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  const isDev = process.env.NODE_ENV === "development";

  // Consent check
  React.useEffect(() => {
    const stored = document.cookie.includes("consent_ads=true") ||
      localStorage.getItem("consent_ads") === "true";
    setConsent(stored || isDev);
  }, [isDev]);

  // Intersection Observer — carrega só quando visível
  React.useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { rootMargin: "200px" }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  // Push AdSense quando slot visível e com consent
  React.useEffect(() => {
    if (!visible || !consent || !client || isDev) return;
    try {
      // @ts-expect-error adsbygoogle global
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {}
  }, [visible, consent, client, isDev]);

  // Placeholder de desenvolvimento
  if (isDev || !client) {
    return (
      <div
        className={cn(
          "flex items-center justify-center text-xs font-sans text-faint",
          "border-2 border-dashed border-border/60 bg-warm rounded-lg",
          className
        )}
        style={{ minHeight: dim.h, minWidth: Math.min(dim.w, 320) }}
        aria-hidden="true"
      >
        AdSense · {dim.label} · {format}
      </div>
    );
  }

  return (
    <>
      {!adsenseLoaded && (
        <Script
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`}
          strategy="lazyOnload"
          crossOrigin="anonymous"
          onLoad={() => { adsenseLoaded = true; }}
        />
      )}
      <div
        ref={ref}
        className={className}
        style={{ minHeight: dim.h, display: "block" }}
      >
        {visible && consent && (
          <ins
            className="adsbygoogle"
            style={{ display: "block", width: "100%", height: dim.h }}
            data-ad-client={client}
            data-ad-slot={slot}
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        )}
      </div>
    </>
  );
}
