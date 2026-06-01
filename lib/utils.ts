import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Formata preço em cêntimos para string legível: 28500000 → "285.000 €" */
export function formatPrice(cents: number, suffix?: string): string {
  const euros = cents / 100;
  const formatted = new Intl.NumberFormat("pt-PT", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(euros);
  return suffix ? `${formatted}${suffix}` : formatted;
}

/** Converte string para slug PT: "Campo de Ourique" → "campo-de-ourique" */
export function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Tipologia numérica → label PT: 0→"Studio", 1→"T1", etc. */
export function bedroomsLabel(n: number): string {
  if (n === 0) return "Studio";
  return `T${n}`;
}

/** Data relativa: "há 3 dias" */
export function timeAgo(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const diff = (Date.now() - d.getTime()) / 1000;
  if (diff < 60) return "agora mesmo";
  if (diff < 3600) return `há ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `há ${Math.floor(diff / 3600)} horas`;
  if (diff < 604800) return `há ${Math.floor(diff / 86400)} dias`;
  return d.toLocaleDateString("pt-PT", { day: "numeric", month: "short" });
}
