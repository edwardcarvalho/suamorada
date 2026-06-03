"use client";

import dynamic from "next/dynamic";

const PropertyLocationMap = dynamic(
  () => import("./PropertyLocationMap").then(m => m.PropertyLocationMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-60 rounded-xl bg-warm-dark animate-pulse border border-border" />
    ),
  }
);

export { PropertyLocationMap };
