"use client";

import useSWR from "swr";
import type { PropertySearchResult, PropertySearchParams } from "@/types/property";

const fetcher = (url: string) =>
  fetch(url).then((r) => {
    if (!r.ok) throw new Error("Erro na pesquisa");
    return r.json() as Promise<PropertySearchResult>;
  });

export function usePropertySearch(params: PropertySearchParams) {
  const query = new URLSearchParams();

  if (params.tipo)         query.set("tipo",          params.tipo);
  if (params.propertyType) query.set("propertyType",  params.propertyType);
  if (params.distrito)     query.set("distrito",      params.distrito);
  if (params.municipio)    query.set("municipio",     params.municipio);
  if (params.minPrice)     query.set("minPrice",      String(params.minPrice));
  if (params.maxPrice)     query.set("maxPrice",      String(params.maxPrice));
  if (params.minArea)      query.set("minArea",       String(params.minArea));
  if (params.maxArea)      query.set("maxArea",       String(params.maxArea));
  if (params.quartos !== undefined) query.set("quartos", String(params.quartos));
  if (params.lat)          query.set("lat",           String(params.lat));
  if (params.lng)          query.set("lng",           String(params.lng));
  if (params.page)         query.set("page",          String(params.page));
  if (params.limit)        query.set("limit",         String(params.limit));
  if (params.sort)         query.set("sort",          params.sort);

  const url = `/api/properties/search?${query.toString()}`;

  const { data, error, isLoading, mutate } = useSWR<PropertySearchResult>(url, fetcher, {
    revalidateOnFocus: false,
    keepPreviousData: true,
  });

  return {
    results:    data?.results ?? [],
    total:      data?.total ?? 0,
    totalPages: data?.totalPages ?? 0,
    page:       data?.page ?? 1,
    bounds:     data?.bounds,
    isLoading,
    isError:    !!error,
    refresh:    mutate,
  };
}
