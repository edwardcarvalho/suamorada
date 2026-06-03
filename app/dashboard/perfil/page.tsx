"use client";

import * as React from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { ShieldCheck, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import toast from "react-hot-toast";

export default function PerfilPage() {
  const { data: session, update: updateSession } = useSession();
  const user = session?.user;

  const [nome,     setNome]     = React.useState("");
  const [telefone, setTelefone] = React.useState("");
  const [saving,   setSaving]   = React.useState(false);
  const [loaded,   setLoaded]   = React.useState(false);

  // Carrega dados reais da BD
  React.useEffect(() => {
    fetch("/api/user/profile")
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        if (d) {
          setNome(d.name ?? "");
          setTelefone(d.phone ?? "");
        }
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/user/profile", {
        method:  "PUT",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ name: nome, phone: telefone || null }),
      });
      if (!res.ok) throw new Error();
      await updateSession({ name: nome }); // actualiza sessão NextAuth
      toast.success("Perfil actualizado com sucesso.");
    } catch {
      toast.error("Erro ao guardar. Tente novamente.");
    } finally {
      setSaving(false);
    }
  }

  const initials = nome.split(" ").slice(0, 2).map(n => n[0]?.toUpperCase() ?? "").join("");

  if (!loaded) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="w-8 h-8 border-2 border-navy border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">

      {/* Avatar */}
      <div className="bg-white rounded-xl border border-border/50 shadow-sm p-6">
        <h2 className="font-sans font-semibold text-sm text-ink mb-5">Foto de perfil</h2>
        <div className="flex items-center gap-5">
          <div className="relative shrink-0">
            {user?.image ? (
              <Image
                src={user.image}
                alt={nome}
                width={80} height={80}
                className="rounded-full object-cover"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-navy flex items-center justify-center">
                <span className="text-white text-2xl font-sans font-bold">
                  {initials || "?"}
                </span>
              </div>
            )}
          </div>
          <div>
            <p className="font-sans font-semibold text-sm text-ink">{nome || "—"}</p>
            <p className="text-xs text-muted font-sans mb-1">{user?.email}</p>
            <p className="text-xs text-faint font-sans">
              {user?.image ? "Foto sincronizada com o Google" : "Sem foto de perfil"}
            </p>
          </div>
        </div>
      </div>

      {/* Dados pessoais */}
      <div className="bg-white rounded-xl border border-border/50 shadow-sm p-6">
        <h2 className="font-sans font-semibold text-sm text-ink mb-5">Dados pessoais</h2>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Nome completo"
              value={nome}
              onChange={e => setNome(e.target.value)}
              placeholder="O seu nome"
            />
            <Input
              label="Telefone"
              value={telefone}
              onChange={e => setTelefone(e.target.value)}
              type="tel"
              placeholder="9XX XXX XXX"
              hint="Mostrado nos seus anúncios"
            />
          </div>
          <Input
            label="Email"
            value={user?.email ?? ""}
            readOnly
            hint="O email é gerido pelo Google e não pode ser alterado aqui."
            className="opacity-60 cursor-not-allowed"
          />
          <div className="flex justify-end pt-2">
            <Button type="submit" variant="primary" size="md" loading={saving}>
              Guardar alterações
            </Button>
          </div>
        </form>
      </div>

      {/* Segurança */}
      <div className="bg-white rounded-xl border border-border/50 shadow-sm p-6">
        <h2 className="font-sans font-semibold text-sm text-ink mb-4">Segurança</h2>
        <div className="flex items-center justify-between py-2">
          <div>
            <p className="font-sans text-sm font-medium text-ink flex items-center gap-2">
              Google <ShieldCheck size={14} className="text-trust" />
            </p>
            <p className="text-xs text-faint font-sans">Conta ligada: {user?.email}</p>
          </div>
          <span className="text-xs font-sans text-trust font-semibold bg-trust/10 px-3 py-1.5 rounded-lg">
            Activo
          </span>
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
          onClick={() => toast.error("Para eliminar a conta, contacte o suporte.")}
          className="text-xs font-sans font-semibold text-red-600 border border-red-200 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors"
        >
          Eliminar conta
        </button>
      </div>
    </div>
  );
}
