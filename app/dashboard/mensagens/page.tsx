import type { Metadata } from "next";
import { MessageSquare, Mail, Phone } from "lucide-react";

export const metadata: Metadata = { title: "Mensagens" };

const MOCK_LEADS = [
  { id:"1", name:"Ana Rodrigues",    email:"ana@email.com",  phone:"912345678", property:"Apt T2 Campo de Ourique", message:"Olá, tenho interesse neste imóvel. Podem contactar-me? Obrigado.", date:"2026-05-29T14:30:00", read:false },
  { id:"2", name:"Miguel Santos",    email:"m.santos@mail.pt",phone:"961234567", property:"Moradia T3 Cascais",      message:"Boa tarde, gostaria de agendar uma visita ao imóvel para o próximo fim de semana. É possível?", date:"2026-05-28T10:15:00", read:false },
  { id:"3", name:"Sofia Ferreira",   email:"sofia.f@gmail.com",phone:"",          property:"Vivenda T4 Sintra",       message:"Tenho interesse. Qual é o preço negociável mínimo?", date:"2026-05-27T16:45:00", read:true  },
  { id:"4", name:"Carlos Mendes",    email:"carlos@work.pt",  phone:"935678901", property:"Apt T1 Mouraria",         message:"Estou interessado mas gostaria de saber se inclui estacionamento.", date:"2026-05-26T09:20:00", read:true  },
  { id:"5", name:"Beatriz Costa",    email:"beatriz@email.com",phone:"966543210", property:"Apt T2 Príncipe Real",   message:"O apartamento ainda está disponível? Quero arrendar a partir de Julho.", date:"2026-05-25T18:00:00", read:true  },
];

export default function MensagensPage() {
  const unread = MOCK_LEADS.filter((l) => !l.read).length;

  return (
    <div className="space-y-5 max-w-[900px]">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted font-sans">
            {unread > 0
              ? <span className="text-brand font-semibold">{unread} não lidas</span>
              : "Todas as mensagens lidas"}
            {" "}· {MOCK_LEADS.length} mensagens no total
          </p>
        </div>
        <select className="text-sm font-sans border border-border rounded-lg px-3 py-2 text-muted outline-none bg-white">
          <option>Todas</option>
          <option>Não lidas</option>
          <option>Lidas</option>
        </select>
      </div>

      {/* Messages list */}
      <div className="flex flex-col gap-3">
        {MOCK_LEADS.map((lead) => (
          <div
            key={lead.id}
            className={`bg-white rounded-xl border shadow-sm p-5 transition-all ${
              !lead.read ? "border-brand/30 shadow-brand/5" : "border-border/50"
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 min-w-0">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-navy/10 flex items-center justify-center shrink-0">
                  <span className="font-sans font-bold text-sm text-navy">
                    {lead.name.split(" ").map((n) => n[0]).slice(0,2).join("")}
                  </span>
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="font-sans font-semibold text-sm text-ink">{lead.name}</p>
                    {!lead.read && (
                      <span className="w-2 h-2 rounded-full bg-brand shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-brand font-sans font-medium mb-1">{lead.property}</p>
                  <p className="text-sm text-muted font-sans leading-relaxed line-clamp-2">
                    {lead.message}
                  </p>
                </div>
              </div>

              {/* Date */}
              <p className="text-xs text-faint font-sans shrink-0">
                {new Date(lead.date).toLocaleDateString("pt-PT", { day:"numeric", month:"short", hour:"2-digit", minute:"2-digit" })}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 mt-4 pt-4 border-t border-border">
              <a
                href={`mailto:${lead.email}?subject=Re: ${lead.property}`}
                className="flex items-center gap-1.5 text-xs font-sans font-semibold text-navy bg-warm hover:bg-warm-dark px-3 py-1.5 rounded-lg transition-colors"
              >
                <Mail size={13} /> Responder por email
              </a>
              {lead.phone && (
                <a
                  href={`tel:+351${lead.phone}`}
                  className="flex items-center gap-1.5 text-xs font-sans font-medium text-muted hover:text-ink px-3 py-1.5 rounded-lg hover:bg-warm transition-colors"
                >
                  <Phone size={13} /> {lead.phone}
                </a>
              )}
              <button className="ml-auto text-xs font-sans text-faint hover:text-muted transition-colors">
                Marcar como lida
              </button>
            </div>
          </div>
        ))}
      </div>

      {MOCK_LEADS.length === 0 && (
        <div className="bg-white rounded-xl border border-border/50 p-16 text-center">
          <MessageSquare size={36} className="text-faint mx-auto mb-3" />
          <p className="font-serif text-lg text-ink mb-1">Sem mensagens</p>
          <p className="text-sm text-muted font-sans">
            Quando alguém contactar os seus anúncios, as mensagens aparecerão aqui.
          </p>
        </div>
      )}
    </div>
  );
}
