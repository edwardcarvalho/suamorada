"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Heart, Share2, Phone, MessageCircle, Mail, ShieldCheck, Star } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { AdUnit } from "@/components/ads/AdUnit";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";

const schema = z.object({
  name:    z.string().min(2, "Nome obrigatório"),
  email:   z.string().email("Email inválido"),
  phone:   z.string().optional(),
  message: z.string().min(10, "Mensagem muito curta"),
});

type FormData = z.infer<typeof schema>;

interface Props {
  propertyId: string;
  price: number;
  listingType: "sale" | "rent";
  title: string;
  agentName?: string;
  agentRating?: number;
  agentReviews?: number;
  agencyName?: string;
  phone?: string;
}

export function ContactSidebar({
  propertyId, price, listingType, title,
  agentName = "Agente Imobiliário",
  agentRating = 4.9, agentReviews = 127,
  agencyName,
  phone,
}: Props) {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [saved, setSaved] = React.useState(false);

  const suffix = listingType === "rent" ? "/mês" : "";

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      message: `Olá, tenho interesse neste imóvel. Podem contactar-me? Obrigado.`,
    },
  });

  async function onSubmit(data: FormData) {
    try {
      await fetch(`/api/properties/${propertyId}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      toast.success("Mensagem enviada! O agente responderá em breve.");
      setModalOpen(false);
      reset();
    } catch {
      toast.error("Erro ao enviar. Tente novamente.");
    }
  }

  function handleShare() {
    if (navigator.share) {
      navigator.share({ title, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copiado!");
    }
  }

  const initials = agentName.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();

  return (
    <div className="sticky top-[88px] flex flex-col gap-4">
      {/* Contact card */}
      <div className="bg-white rounded-2xl shadow-xl border border-border/50 p-6">
        {/* Price */}
        <p className="font-serif text-3xl text-ink mb-1 leading-none">
          {formatPrice(price, suffix)}
        </p>
        <p className="text-xs text-muted font-sans mb-4">
          {title.slice(0, 45)}{title.length > 45 ? "…" : ""}
        </p>

        <div className="h-px bg-border mb-4" />

        {/* Agent */}
        <div className="flex items-start gap-3 mb-4">
          <div className="w-11 h-11 rounded-full bg-navy flex items-center justify-center shrink-0">
            <span className="text-white text-sm font-sans font-bold">{initials}</span>
          </div>
          <div className="min-w-0">
            <p className="font-sans font-semibold text-sm text-ink">{agentName}</p>
            {agencyName && <p className="text-xs text-muted">{agencyName}</p>}
            <div className="flex items-center gap-1 mt-1">
              <span className="bg-trust text-white text-[10px] font-sans font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                <ShieldCheck size={9} /> Responde em &lt; 2h
              </span>
            </div>
          </div>
        </div>

        {/* Stars */}
        <div className="flex items-center gap-2 mb-5">
          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={13} className={i < Math.round(agentRating) ? "fill-yellow-400 text-yellow-400" : "text-border"} />
            ))}
          </div>
          <span className="text-xs text-ink font-sans font-semibold">{agentRating}</span>
          <span className="text-xs text-faint font-sans">({agentReviews} avaliações)</span>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-2">
          <Button variant="primary" size="lg" className="w-full" onClick={() => setModalOpen(true)}>
            <Mail size={16} />
            Contactar Agente
          </Button>

          {phone && (
            <Button variant="trust" size="md" className="w-full" asChild>
              <a href={`https://wa.me/351${phone.replace(/\D/g, "")}?text=Olá, tenho interesse no imóvel: ${title}`}
                target="_blank" rel="noopener noreferrer">
                <MessageCircle size={15} />
                WhatsApp
              </a>
            </Button>
          )}

          <Button variant="secondary" size="md" className="w-full">
            <Phone size={15} />
            {phone ? `${phone.slice(0, 4)} *** ***` : "Ver telefone"}
          </Button>
        </div>

        <p className="text-center text-xs text-faint font-sans mt-3">
          Resposta típica em menos de 24 horas
        </p>

        <div className="h-px bg-border my-4" />

        {/* Save + Share */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => { setSaved(!saved); toast.success(saved ? "Removido dos favoritos" : "Guardado nos favoritos!"); }}
            className="flex items-center gap-1.5"
          >
            <Heart size={14} className={saved ? "fill-brand text-brand" : ""} />
            {saved ? "Guardado" : "Guardar"}
          </Button>
          <Button variant="ghost" size="sm" onClick={handleShare} className="flex items-center gap-1.5">
            <Share2 size={14} />
            Partilhar
          </Button>
        </div>
      </div>

      {/* AdSense half-page */}
      <AdUnit
        slot={process.env.NEXT_PUBLIC_AD_SLOT_HALF_PAGE ?? "0000000000"}
        format="half-page"
        className="w-full"
      />

      {/* Modal contacto */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h3 className="font-serif text-xl text-navy mb-4">Contactar Agente</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
              <Input label="Nome" error={errors.name?.message} {...register("name")} />
              <Input label="Email" type="email" error={errors.email?.message} {...register("email")} />
              <Input label="Telefone (opcional)" {...register("phone")} />
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-sans font-semibold uppercase tracking-wider text-faint">
                  Mensagem
                </label>
                <textarea
                  rows={4}
                  className="rounded-lg border border-border px-4 py-3 text-sm font-sans text-ink outline-none focus:border-navy resize-none"
                  {...register("message")}
                />
                {errors.message && <p className="text-xs text-red-600">{errors.message.message}</p>}
              </div>
              <div className="flex gap-2 pt-1">
                <Button type="button" variant="ghost" size="md" className="flex-1"
                  onClick={() => setModalOpen(false)}>Cancelar</Button>
                <Button type="submit" variant="primary" size="md" className="flex-1"
                  loading={isSubmitting}>Enviar mensagem</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
