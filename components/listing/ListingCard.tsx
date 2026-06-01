"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Bed, Bath, Square, ShieldCheck, Star, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { cn, formatPrice, bedroomsLabel, timeAgo } from "@/lib/utils";
import type { Property } from "@/types/property";

interface ListingCardProps {
  property: Property;
  priority?: boolean;
  activePin?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export function ListingCard({
  property,
  priority = false,
  activePin = false,
  onMouseEnter,
  onMouseLeave,
}: ListingCardProps) {
  const [saved, setSaved] = React.useState(false);
  const cover = property.images?.find((i) => i.isCover) ?? property.images?.[0];
  const suffix = property.listingType === "rent" ? "/mês" : "";

  return (
    <Link
      href={`/imovel/${property.slug}`}
      className={cn(
        "group block bg-white rounded-xl overflow-hidden transition-all duration-200",
        "border border-border/50",
        activePin
          ? "shadow-xl ring-2 ring-brand"
          : "shadow-sm hover:shadow-md hover:-translate-y-0.5"
      )}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Photo */}
      <div className="relative aspect-[4/3] overflow-hidden bg-warm-dark">
        {cover ? (
          <Image
            src={cover.url}
            alt={property.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={priority}
          />
        ) : (
          /* placeholder quando não há fotos */
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-navy/80 to-navy-dark">
            <span className="font-serif text-white/30 text-lg">Sua Morada</span>
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {/* Badges top-left */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
          {property.verified && (
            <Badge variant="verified" className="flex items-center gap-1">
              <ShieldCheck size={10} aria-hidden="true" />
              Verificado
            </Badge>
          )}
          {property.createdAt &&
            Date.now() - new Date(property.createdAt).getTime() < 7 * 86400000 && (
              <Badge variant="new">Novo</Badge>
            )}
        </div>

        {/* Badge destaque top-right */}
        {property.featured && (
          <div className="absolute top-2.5 right-10">
            <Badge variant="featured" className="flex items-center gap-1">
              <Star size={10} aria-hidden="true" />
              Destaque
            </Badge>
          </div>
        )}

        {/* Favorite button */}
        <button
          onClick={(e) => { e.preventDefault(); setSaved(!saved); }}
          aria-label={saved ? "Remover dos favoritos" : "Guardar imóvel"}
          className={cn(
            "absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center",
            "bg-white/90 backdrop-blur-sm transition-all duration-150",
            "hover:scale-110 active:scale-95"
          )}
        >
          <Heart
            size={15}
            className={cn("transition-colors", saved ? "fill-brand text-brand" : "text-muted")}
            aria-hidden="true"
          />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Price */}
        <p className="font-serif text-2xl text-ink leading-tight mb-1">
          {formatPrice(property.price, suffix)}
        </p>

        {/* Title */}
        <p className="font-sans font-medium text-sm text-ink line-clamp-1 mb-1">
          {property.title}
        </p>

        {/* Location */}
        <p className="flex items-center gap-1 text-xs text-muted mb-3">
          <MapPin size={12} aria-hidden="true" />
          {property.addressParish
            ? `${property.addressParish}, ${property.addressMunicipality}`
            : property.addressMunicipality}
        </p>

        {/* Divider */}
        <div className="h-px bg-border mb-3" />

        {/* Stats */}
        <div className="flex items-center gap-4 text-xs text-muted">
          <span className="flex items-center gap-1">
            <Bed size={13} aria-hidden="true" />
            {bedroomsLabel(property.bedrooms)}
          </span>
          {property.bathrooms && (
            <span className="flex items-center gap-1">
              <Bath size={13} aria-hidden="true" />
              {property.bathrooms} WC
            </span>
          )}
          {property.areaUseful && (
            <span className="flex items-center gap-1">
              <Square size={13} aria-hidden="true" />
              {property.areaUseful} m²
            </span>
          )}
          {property.publishedAt && (
            <span className="ml-auto text-faint">
              {timeAgo(property.publishedAt)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

/* Skeleton para loading state */
export function ListingCardSkeleton() {
  return (
    <div className="bg-white rounded-xl overflow-hidden border border-border/50 shadow-sm animate-pulse">
      <div className="aspect-[4/3] bg-warm-dark" />
      <div className="p-4 space-y-3">
        <div className="h-7 bg-warm-dark rounded w-2/3" />
        <div className="h-4 bg-warm-dark rounded w-4/5" />
        <div className="h-3 bg-warm-dark rounded w-1/2" />
        <div className="h-px bg-border" />
        <div className="flex gap-4">
          <div className="h-3 bg-warm-dark rounded w-12" />
          <div className="h-3 bg-warm-dark rounded w-12" />
          <div className="h-3 bg-warm-dark rounded w-16" />
        </div>
      </div>
    </div>
  );
}
