"use client";

import * as React from "react";
import { Camera, ShieldCheck, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import toast from "react-hot-toast";

export default function PerfilPage() {
  const [nome,     setNome]     = React.useState("João Cardoso");
  const [email,    setEmail]    = React.useState("joao.cardoso@era.pt");
  const [telefone, setTelefone] = React.useState("912 345 678");
  const [saving,   setSaving]   = React.useState(false);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    toast.success("Perfil actualizado com sucesso.");
  }

  return (
    <div className="max-w-2xl space-y-6">

      {/* Avatar */}
      <div className="bg-white rounded-xl border border-border/50 shadow-sm p-6">
        <h2 className="font-sans font-semibold text-sm text-ink mb-5">Foto de perfil</h2>
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-navy flex items-center justify-center">
              <span className="text-white text-2xl font-sans font-bold">JC</span>
            </div>
            <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-brand rounded-full flex items-center justify-center shadow-md hover:bg-brand-dark transition-colors">
              <Camera size={13} className="text-white" />
            </button>
          </div>
          <div>
            <p className="font-sans font-semibold text-sm text-ink">João Cardoso</p>
            <p className="text-xs text-muted font-sans mb-2">Agente ERA Lisboa Centro</p>
            <button className="text-xs font-sans text-brand font-semibold hover:underline">
              Alterar foto
            </button>
          </div>
        </div>
      </div>

      {/* Dados pessoais */}
      <div className="bg-white rounded-xl border border-border/50 shadow-sm p-6">
        <h2 className="font-sans font-semibold text-sm text-ink mb-5">Dados pessoais</h2>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Nome completo" value={nome}     onChange={(e) => setNome(e.target.value)} />
            <Input label="Telefone"      value={telefone} onChange={(e) => setTelefone(e.target.value)} type="tel" />
          </div>
          <Input label="Email" value={email} onChange={(e) => setEmail(e.target.value)} type="email"
            hint="Alterar o email requer verificação por email." />
          <div className="flex justify-end pt-2">
            <Button type="submit" variant="primary" size="md" loading={saving}>
              Guardar alterações
            </Button>
          </div>
        </form>
      </div>

      {/* Segurança */}
      <div className="bg-white rounded-xl border border-border/50 shadow-sm p-6">
        <h2 className="font-sans font-semibold text-sm text-ink mb-5">Segurança</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-sans text-sm font-medium text-ink">Password</p>
              <p className="text-xs text-faint font-sans">Última alteração há 3 meses</p>
            </div>
            <button className="text-xs font-sans font-semibold text-navy bg-warm hover:bg-warm-dark px-3 py-2 rounded-lg transition-colors">
              Alterar password
            </button>
          </div>
          <div className="h-px bg-border" />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-sans text-sm font-medium text-ink flex items-center gap-2">
                Google <ShieldCheck size={14} className="text-trust" />
              </p>
              <p className="text-xs text-faint font-sans">Conta ligada: joao@gmail.com</p>
            </div>
            <button className="text-xs font-sans font-semibold text-muted hover:text-red-500 px-3 py-2 rounded-lg transition-colors">
              Desligar
            </button>
          </div>
        </div>
      </div>

      {/* Zona de perigo */}
      <div className="bg-white rounded-xl border border-red-200 shadow-sm p-6">
        <h2 className="font-sans font-semibold text-sm text-red-600 mb-1 flex items-center gap-2">
          <AlertTriangle size={15} /> Zona de perigo
        </h2>
        <p className="text-xs text-muted font-sans mb-4">
          Ao eliminar a conta, todos os seus anúncios e dados serão permanentemente removidos.
        </p>
        <button
          onClick={() => {
            if (confirm('Escreva "ELIMINAR" para confirmar')) {
              toast.error("Funcionalidade disponível em breve.");
            }
          }}
          className="text-xs font-sans font-semibold text-red-600 border border-red-200 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors"
        >
          Eliminar conta
        </button>
      </div>
    </div>
  );
}
