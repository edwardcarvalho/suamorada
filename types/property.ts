export type PropertyType =
  | "apartment"
  | "house"
  | "villa"
  | "commercial"
  | "land"
  | "garage";

export type ListingType = "sale" | "rent";

export type PropertyCondition =
  | "new"
  | "used"
  | "needs_renovation"
  | "under_construction";

export type EnergyClass = "A+" | "A" | "B" | "B-" | "C" | "D" | "E" | "F" | "exempt";

export type PropertyStatus =
  | "draft"
  | "pending_review"
  | "active"
  | "paused"
  | "sold"
  | "rented"
  | "expired";

export interface PropertyImage {
  id: string;
  url: string;
  position: number;
  isCover: boolean;
  width?: number;
  height?: number;
}

export interface Agency {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  licenseNumber?: string;
  verified: boolean;
}

export interface Agent {
  id: string;
  name: string;
  avatarUrl?: string;
  phone?: string;
  email: string;
  agency?: Agency;
  responseTime?: string;
  rating?: number;
  reviewCount?: number;
}

export interface Property {
  id: string;
  slug: string;
  title: string;
  description?: string;
  propertyType: PropertyType;
  listingType: ListingType;
  price: number;           // em cêntimos
  priceNegotiable: boolean;
  areaGross?: number;
  areaUseful?: number;
  bedrooms: number;
  bathrooms: number;
  floor?: number;
  totalFloors?: number;
  condition?: PropertyCondition;
  energyCertificate?: EnergyClass;
  hasGarage: boolean;
  hasElevator: boolean;
  hasPool: boolean;
  hasGarden: boolean;
  features: string[];
  lat: number;
  lng: number;
  addressStreet?: string;
  addressParish?: string;
  addressMunicipality: string;
  addressDistrict: string;
  addressPostalCode?: string;
  status: PropertyStatus;
  verified: boolean;
  featured: boolean;
  viewsCount: number;
  contactsCount: number;
  publishedAt?: string;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
  images: PropertyImage[];
  agent?: Agent;
}

export interface PropertySearchParams {
  tipo?: "comprar" | "arrendar";
  propertyType?: PropertyType;
  distrito?: string;
  municipio?: string;
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
  quartos?: string;             // vírgula-separado: "0,1,2" (4 = T4+, ≥4)
  casasBanho?: number;          // mínimo de casas de banho
  energia?: string;             // vírgula-separado: "A+,A,B"
  estado?: string;              // vírgula-separado: "new,used"
  extras?: string;              // vírgula-separado: "garage,elevator,pool,garden,ac,balcony,wardrobe,storage"
  andar?: string;               // "ultimo" | "intermedio" | "res_chao"
  publicado?: string;           // "48h" | "semana" | "mes"
  lat?: number;
  lng?: number;
  radiusKm?: number;
  page?: number;
  limit?: number;
  sort?: "price_asc" | "price_desc" | "newest" | "relevance";
}

export interface PropertySearchResult {
  results: Property[];
  total: number;
  page: number;
  totalPages: number;
  bounds?: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
}

// ── Label helpers ──────────────────────────────────────────────────────────────

export const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
  apartment:  "Apartamento",
  house:      "Moradia",
  villa:      "Vivenda",
  commercial: "Comercial",
  land:       "Terreno",
  garage:     "Garagem",
};

export const LISTING_TYPE_LABELS: Record<ListingType, string> = {
  sale: "Venda",
  rent: "Arrendamento",
};

export const CONDITION_LABELS: Record<PropertyCondition, string> = {
  new:                "Novo",
  used:               "Usado",
  needs_renovation:   "Para recuperar",
  under_construction: "Em construção",
};

export const DISTRICT_SLUGS: Record<string, string> = {
  lisboa:   "Lisboa",
  porto:    "Porto",
  braga:    "Braga",
  setubal:  "Setúbal",
  faro:     "Faro",
  aveiro:   "Aveiro",
  coimbra:  "Coimbra",
  leiria:   "Leiria",
  viseu:    "Viseu",
  santarem: "Santarém",
};

export const PROPERTY_TYPE_SLUGS: Record<string, PropertyType> = {
  apartamentos: "apartment",
  moradias:     "house",
  vivendas:     "villa",
  comercial:    "commercial",
  terrenos:     "land",
  garagens:     "garage",
};
