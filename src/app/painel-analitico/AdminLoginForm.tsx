'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, ArrowRight, ShieldAlert } from 'lucide-react';

export function AdminLoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Acesso negado.');
      }

      router.refresh();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Erro ao validar acesso.');
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-fumec-surface px-4">
      <div className="w-full max-w-sm bg-white rounded-3xl border border-fumec-border shadow-sm p-8 text-center">
        <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 text-fumec-primary flex items-center justify-center mx-auto mb-4">
          <Lock className="w-6 h-6" />
        </div>

        <h1 className="text-xl font-extrabold text-fumec-navy">Acesso Restrito</h1>
        <p className="text-xs text-fumec-muted mt-1 mb-6">
          Painel analítico do Quiz de Administração FUMEC.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-fumec-navy mb-1.5">
              Senha de Acesso
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite a chave mestra..."
              autoFocus
              className="w-full px-4 py-3 rounded-xl border border-fumec-border focus:border-fumec-primary focus:outline-none text-sm transition-colors"
            />
          </div>

          {error && (
            <div className="p-3 text-xs rounded-xl bg-red-50 text-red-700 border border-red-200 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-sm ${
              loading || !password
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-fumec-primary text-white hover:bg-fumec-navy active:scale-95'
            }`}
          >
            {loading ? 'Validando...' : 'Entrar no Painel'}
            <ArrowRight className="w-4 h-4 text-fumec-cyan" />
          </button>
        </form>
      </div>
    </div>
  );
}
