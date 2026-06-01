"use client";

import dynamic from "next/dynamic";
import type { ComponentProps } from "react";
import type { ListingResultsClient as LRC } from "./ListingResultsClient";

const ListingResultsClient = dynamic(
  () => import("./ListingResultsClient").then((m) => m.ListingResultsClient),
  {
    ssr: false,
    loading: () => (
      <div className="flex-1 flex items-center justify-center py-20 bg-warm">
        <div className="w-8 h-8 border-2 border-navy border-t-transparent rounded-full animate-spin" />
      </div>
    ),
  }
);

type Props = ComponentProps<typeof LRC>;

export function ListingResultsWrapper(props: Props) {
  return <ListingResultsClient {...props} />;
}
