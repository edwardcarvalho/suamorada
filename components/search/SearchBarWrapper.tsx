"use client";

import dynamic from "next/dynamic";

// Client-only — evita hydration mismatch de extensões de browser (Dashlane, etc.)
const SearchBar = dynamic(
  () => import("./SearchBar").then((m) => m.SearchBar),
  {
    ssr: false,
    loading: () => (
      <div className="w-full max-w-[920px] flex flex-col gap-1">
        <div className="flex gap-1">
          <div className="w-24 h-10 bg-white/15 rounded-t-lg animate-pulse" />
          <div className="w-24 h-10 bg-white/10 rounded-t-lg animate-pulse" />
        </div>
        <div className="bg-white/10 rounded-b-2xl rounded-tr-2xl h-[84px] animate-pulse" />
      </div>
    ),
  }
);

export { SearchBar };
