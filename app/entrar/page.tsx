"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Mail, Home } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import toast from "react-hot-toast";

function EntrarContent() {
  const params  = useSearchParams();
  const cb      = params.get("callbackUrl") ?? "/dashboard";
  const [email, setEmail]     = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [sent, setSent]       = React.useState(false);

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    // NextAuth signIn via fetch
    const res = await fetch("/api/auth/signin/resend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, callbackUrl: cb }),
    });
    setLoading(false);
    if (res.ok) { setSent(true); }
    else { toast.error("Erro ao enviar email. Tente novamente."); }
  }

  async function handleGoogle() {
    window.location.href = `/api/auth/signin/google?callbackUrl=${encodeURIComponent(cb)}`;
  }

  return (
    <div className="min-h-screen bg-warm flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <Home size={24} className="text-brand" />
          <span className="font-sans font-bold text-xl text-navy">Sua</span>
          <span className="font-serif text-xl text-brand">Morada</span>
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-border/50 p-8">
          {sent ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-trust/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail size={28} className="text-trust" />
              </div>
              <h2 className="font-serif text-2xl text-ink mb-2">Verifique o seu email</h2>
              <p className="text-sm text-muted font-sans">
                Enviámos um link de acesso para <strong>{email}</strong>.
                Clique no link para entrar na sua conta.
              </p>
              <p className="text-xs text-faint font-sans mt-4">
                Não recebeu? Verifique a pasta de spam.
              </p>
            </div>
          ) : (
            <>
              <h1 className="font-serif text-2xl text-ink mb-1 text-center">Entrar</h1>
              <p className="text-sm text-muted font-sans text-center mb-6">
                Aceda à sua conta ou crie uma nova
              </p>

              {/* Google */}
              <button
                onClick={handleGoogle}
                className="w-full flex items-center justify-center gap-3 border border-border rounded-xl py-3 text-sm font-sans font-medium text-ink hover:bg-warm transition-colors mb-4"
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4"/>
                  <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/>
                  <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05"/>
                  <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z" fill="#EA4335"/>
                </svg>
                Continuar com Google
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs text-faint font-sans">ou</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              {/* Magic link */}
              <form onSubmit={handleMagicLink} className="space-y-4">
                <Input
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="o.seu@email.pt"
                  required
                />
                <Button type="submit" variant="primary" size="lg" className="w-full" loading={loading}>
                  <Mail size={16} />
                  Entrar com Magic Link
                </Button>
              </form>

              <p className="text-xs text-faint font-sans text-center mt-6 leading-relaxed">
                Ao entrar, aceita os nossos{" "}
                <Link href="/termos" className="text-brand hover:underline">Termos de Uso</Link>
                {" "}e{" "}
                <Link href="/privacidade" className="text-brand hover:underline">Política de Privacidade</Link>.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function EntrarPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-warm flex items-center justify-center"><div className="w-8 h-8 border-2 border-navy border-t-transparent rounded-full animate-spin" /></div>}>
      <EntrarContent />
    </React.Suspense>
  );
}
