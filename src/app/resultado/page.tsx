'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Header } from '@/components/Header';
import { QuizCalculationResult } from '@/lib/quiz-engine';
import { ShareableCard } from '@/components/ShareableCard';
import { RotateCcw, CheckCircle, Sparkles, Compass, Award } from 'lucide-react';

export default function ResultadoPage() {
  const router = useRouter();
  const [result, setResult] = useState<QuizCalculationResult | null>(null);

  useEffect(() => {
    const rawResult = sessionStorage.getItem('quiz_final_result');
    if (!rawResult) {
      router.replace('/');
      return;
    }
    try {
      setResult(JSON.parse(rawResult));
    } catch {
      router.replace('/');
    }
  }, [router]);

  const handleRestart = () => {
    sessionStorage.removeItem('quiz_answers');
    sessionStorage.removeItem('quiz_final_result');
    sessionStorage.removeItem('quiz_session_id');
    router.push('/');
  };

  if (!result) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-fumec-surface"
        role="status"
        aria-live="polite"
      >
        <span className="sr-only">Carregando resultado oficial...</span>
        <div className="w-8 h-8 border-4 border-fumec-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const { primaryArea, secondaryArea, isTie, tiedAreas, ranking, otherMatches } = result;
  const primaryScore = ranking[0]?.percentage || 0;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-8 sm:py-12 space-y-8">
        {/* Banner Principal de Resultado */}
        <section
          aria-labelledby="resultado-principal-heading"
          className="bg-white rounded-3xl border border-fumec-border shadow-sm p-6 sm:p-10 relative overflow-hidden"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-fumec-primary text-xs font-bold uppercase tracking-wider mb-3">
            <Image
              src="/fumec_icon.png"
              alt=""
              width={16}
              height={16}
              className="w-4 h-4 object-contain"
              aria-hidden="true"
            />
            Seu Resultado Oficial • FUMEC FACE
          </div>

          <h1
            id="resultado-principal-heading"
            className="text-2xl sm:text-3xl font-extrabold text-fumec-navy tracking-tight"
          >
            Sua maior afinidade é:{' '}
            <span
              className="underline decoration-wavy decoration-fumec-cyan decoration-2"
              style={{ color: primaryArea.color }}
            >
              {isTie && secondaryArea
                ? `${primaryArea.shortName} + ${secondaryArea.shortName} (Perfil Combinado)`
                : primaryArea.name}
            </span>
          </h1>

          {/* Descrição do Perfil Vencedor (ou dos perfis empatados) */}
          <div className="mt-4 space-y-3">
            {isTie ? (
              tiedAreas.map((area) => (
                <div
                  key={area.code}
                  className="p-4 rounded-2xl border bg-slate-50/70 border-fumec-border"
                >
                  <span
                    className="text-xs font-extrabold uppercase tracking-wider"
                    style={{ color: area.color }}
                  >
                    {area.name}
                  </span>
                  <p className="text-sm text-slate-700 mt-1 leading-relaxed">
                    {area.description}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-base text-slate-700 leading-relaxed font-medium">
                {primaryArea.description}
              </p>
            )}
          </div>
        </section>

        {/* Ranking de Afinidade em Barras (6 Áreas) */}
        <section
          aria-labelledby="ranking-heading"
          className="bg-white rounded-3xl border border-fumec-border shadow-sm p-6 sm:p-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 id="ranking-heading" className="text-lg sm:text-xl font-extrabold text-fumec-navy">
                Ranking de Afinidade
              </h2>
              <p className="text-xs text-fumec-muted">
                Distribuição percentual calculada com base nas suas 10 respostas
              </p>
            </div>
            <span className="text-xs font-bold text-fumec-secondary px-2.5 py-1 rounded-lg bg-slate-100">
              Total: 100%
            </span>
          </div>

          <div className="space-y-4">
            {ranking.map((item) => (
              <div key={item.code} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs sm:text-sm font-semibold">
                  <span className="text-fumec-navy flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: item.area.color }}
                      aria-hidden="true"
                    />
                    {item.area.name}
                  </span>
                  <span className="font-extrabold text-slate-800">{item.percentage}%</span>
                </div>

                <div
                  role="progressbar"
                  aria-valuenow={item.percentage}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${item.area.name}: ${item.percentage}% de afinidade`}
                  className="h-3 w-full bg-slate-100 rounded-full overflow-hidden"
                >
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: `${item.percentage}%`,
                      backgroundColor: item.area.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Outras Áreas que Podem Combinar & Áreas para Conhecer */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Áreas Complementares (2º e 3º lugares) */}
          <section
            aria-labelledby="complementary-areas-heading"
            className="bg-white rounded-3xl border border-fumec-border shadow-sm p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-fumec-accent" aria-hidden="true" />
              <h3
                id="complementary-areas-heading"
                className="text-sm font-extrabold uppercase tracking-wider text-fumec-navy"
              >
                Outras áreas que combinam com você
              </h3>
            </div>

            {otherMatches.length > 0 ? (
              <div className="space-y-3">
                {otherMatches.map((area) => (
                  <div key={area.code} className="p-3 rounded-xl border border-fumec-border bg-slate-50">
                    <span
                      className="text-xs font-bold"
                      style={{ color: area.color }}
                    >
                      {area.name}
                    </span>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                      {area.description}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-fumec-muted">
                Seu perfil teve afinidade totalmente concentrada na área principal.
              </p>
            )}
          </section>

          {/* Áreas para Você Conhecer (Cargos e atuações) */}
          <section
            aria-labelledby="areas-to-explore-heading"
            className="bg-white rounded-3xl border border-fumec-border shadow-sm p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <Compass className="w-4 h-4 text-fumec-cyan" aria-hidden="true" />
              <h3
                id="areas-to-explore-heading"
                className="text-sm font-extrabold uppercase tracking-wider text-fumec-navy"
              >
                Áreas práticas para você conhecer
              </h3>
            </div>

            <p className="text-xs text-fumec-muted mb-3">
              Oportunidades de estágio, projetos e carreira dentro de {primaryArea.name}:
            </p>

            <ul className="flex flex-wrap gap-2 list-none" aria-label="Lista de áreas recomendadas para conhecer">
              {primaryArea.areasToExplore.map((item, idx) => (
                <li
                  key={idx}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-50/70 border border-blue-100 text-fumec-navy flex items-center gap-1.5"
                >
                  <CheckCircle className="w-3 h-3 text-fumec-cyan" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Card Compartilhável (Stories/WhatsApp/Download) */}
        <section
          aria-labelledby="share-section-heading"
          className="bg-white rounded-3xl border border-fumec-border shadow-sm p-6 sm:p-10 flex flex-col items-center text-center"
        >
          <span className="text-xs font-extrabold uppercase tracking-widest text-fumec-muted mb-1">
            Compartilhe seu Resultado
          </span>
          <h2 id="share-section-heading" className="text-xl sm:text-2xl font-extrabold text-fumec-navy mb-6">
            Mostre aos seus colegas qual é o seu perfil!
          </h2>

          <ShareableCard
            primaryArea={primaryArea}
            secondaryArea={secondaryArea}
            isTie={isTie}
            score={primaryScore}
          />
        </section>

        {/* Botão Refazer Quiz */}
        <div className="text-center pt-4 pb-10">
          <button
            type="button"
            onClick={handleRestart}
            aria-label="Reiniciar o questionário do zero"
            className="inline-flex items-center gap-2 text-sm font-bold text-fumec-secondary hover:text-fumec-navy hover:underline transition-colors px-4 py-2.5 min-h-[44px] rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fumec-primary"
          >
            <RotateCcw className="w-4 h-4 text-fumec-accent" aria-hidden="true" /> Refazer o quiz do zero
          </button>
        </div>
      </main>
    </div>
  );
}
