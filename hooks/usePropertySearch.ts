"use client";

import useSWR from "swr";
import type { PropertySearchResult, PropertySearchParams } from "@/types/property";

const fetcher = (url: string) =>
  fetch(url).then((r) => {
    if (!r.ok) throw new Error("Erro na pesquisa");
    return r.json() as Promise<PropertySearchResult>;
  });

export function usePropertySearch(params: PropertySearchParams) {
  const q = new URLSearchParams();

  if (params.tipo)          q.set("tipo",         params.tipo);
  if (params.propertyType)  q.set("propertyType", params.propertyType);
  if (params.distrito)      q.set("distrito",     params.distrito);
  if (params.municipio)     q.set("municipio",    params.municipio);
  if (params.minPrice)      q.set("minPrice",     String(params.minPrice));
  if (params.maxPrice)      q.set("maxPrice",     String(params.maxPrice));
  if (params.minArea)       q.set("minArea",      String(params.minArea));
  if (params.maxArea)       q.set("maxArea",      String(params.maxArea));
  if (params.quartos)       q.set("quartos",      params.quartos);
  if (params.casasBanho)    q.set("casasBanho",   String(params.casasBanho));
  if (params.energia)       q.set("energia",      params.energia);
  if (params.estado)        q.set("estado",       params.estado);
  if (params.extras)        q.set("extras",       params.extras);
  if (params.andar)         q.set("andar",        params.andar);
  if (params.publicado)     q.set("publicado",    params.publicado);
  if (params.minLat)        q.set("minLat",       String(params.minLat));
  if (params.maxLat)        q.set("maxLat",       String(params.maxLat));
  if (params.minLng)        q.set("minLng",       String(params.minLng));
  if (params.maxLng)        q.set("maxLng",       String(params.maxLng));
  if (params.lat)           q.set("lat",          String(params.lat));
  if (params.lng)           q.set("lng",          String(params.lng));
  if (params.page)          q.set("page",         String(params.page));
  if (params.limit)         q.set("limit",        String(params.limit));
  if (params.sort)          q.set("sort",         params.sort);

  const url = `/api/properties/search?${q.toString()}`;

  const { data, error, isLoading, mutate } = useSWR<PropertySearchResult>(url, fetcher, {
    revalidateOnFocus: false,
    keepPreviousData:  true,
  });

  return {
    results:    data?.results ?? [],
    total:      data?.total ?? 0,
    totalPages: data?.totalPages ?? 0,
    page:       data?.page ?? 1,
    isLoading,
    isError:    !!error,
    refresh:    mutate,
  };
}
