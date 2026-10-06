'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { QUIZ_QUESTIONS, QuestionAlternative, AreaCode } from '@/data/quiz-questions';
import { shuffleAlternatives, calculateQuizResult } from '@/lib/quiz-engine';
import { ArrowLeft, ArrowRight, RotateCcw, CheckCircle2 } from 'lucide-react';

export default function QuizPage() {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // 0 a 9
  const [answers, setAnswers] = useState<Record<number, AreaCode>>({});
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Inicialização: carrega sessão e garante que o usuário passou pela landing
  useEffect(() => {
    const sId = sessionStorage.getItem('quiz_session_id');
    if (!sId) {
      router.replace('/');
      return;
    }
    setSessionId(sId);

    // Carrega respostas salvas na sessão local se houver refresh
    const savedAnswers = sessionStorage.getItem('quiz_answers');
    if (savedAnswers) {
      try {
        setAnswers(JSON.parse(savedAnswers));
      } catch {
        // ignore
      }
    }
  }, [router]);

  // Embaralha as alternativas de cada pergunta uma única vez por sessão (idempotente)
  const shuffledQuestions = useMemo(() => {
    return QUIZ_QUESTIONS.map((q) => ({
      ...q,
      alternatives: shuffleAlternatives(q.alternatives),
    }));
  }, []);

  const currentQuestion = shuffledQuestions[currentQuestionIndex];
  const totalQuestions = QUIZ_QUESTIONS.length;
  const progressPct = ((currentQuestionIndex + 1) / totalQuestions) * 100;
  const selectedAreaForCurrent = answers[currentQuestion?.id];

  const handleSelectAlternative = (alt: QuestionAlternative) => {
    const questionId = currentQuestion.id;
    const updatedAnswers = { ...answers, [questionId]: alt.area };
    setAnswers(updatedAnswers);
    sessionStorage.setItem('quiz_answers', JSON.stringify(updatedAnswers));

    // Grava resposta em background para análise de drop-off (sem avançar de tela)
    if (sessionId) {
      fetch('/api/quiz/answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          questionIndex: questionId,
          selectedArea: alt.area,
        }),
      }).catch((err) => console.error('Erro ao salvar resposta:', err));
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (!selectedAreaForCurrent) return;

    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      handleFinishQuiz(answers);
    }
  };

  const handleRestart = () => {
    if (confirm('Deseja realmente reiniciar o quiz do início?')) {
      sessionStorage.removeItem('quiz_answers');
      setAnswers({});
      setCurrentQuestionIndex(0);
    }
  };

  const handleFinishQuiz = async (finalAnswers: Record<number, AreaCode>) => {
    setSubmitting(true);
    const result = calculateQuizResult(finalAnswers);

    if (sessionId) {
      try {
        await fetch('/api/quiz/complete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId,
            primaryProfile: result.primaryArea.code,
            secondaryProfile: result.secondaryArea ? result.secondaryArea.code : null,
            scores: result.scores,
          }),
        });
      } catch (err) {
        console.error('Erro ao finalizar sessão no backend:', err);
      }
    }

    sessionStorage.setItem('quiz_final_result', JSON.stringify(result));
    router.push('/resultado');
  };

  if (!currentQuestion) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-fumec-surface"
        role="status"
        aria-live="polite"
      >
        <span className="sr-only">Carregando questionário...</span>
        <div className="w-8 h-8 border-4 border-fumec-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      {/* Região anunciada dinamicamente para tecnologias assistivas */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        Pergunta {currentQuestionIndex + 1} de {totalQuestions}: {currentQuestion.statement}
      </div>

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-6 sm:py-10">
        <div className="w-full max-w-2xl bg-white rounded-3xl border border-fumec-border shadow-sm p-6 sm:p-10 flex flex-col justify-between min-h-[580px]">
          {/* Barra de Progresso Superior com Acessibilidade ARIA */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-fumec-secondary mb-2">
              <span className="flex items-center gap-1.5 uppercase tracking-wider text-fumec-navy">
                Questão {currentQuestionIndex + 1} de {totalQuestions}
              </span>
              <span className="text-fumec-cyan font-bold" aria-hidden="true">
                {Math.round(progressPct)}%
              </span>
            </div>

            <div
              className="h-2 w-full bg-slate-100 rounded-full overflow-hidden"
              role="progressbar"
              aria-valuenow={currentQuestionIndex + 1}
              aria-valuemin={1}
              aria-valuemax={totalQuestions}
              aria-valuetext={`Pergunta ${currentQuestionIndex + 1} de ${totalQuestions}`}
            >
              <div
                className="h-full bg-gradient-to-r from-fumec-primary to-fumec-cyan rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progressPct}%` }}
              />
            </div>

            {/* Enunciado da Pergunta */}
            <div className="mt-8 mb-6">
              <span className="text-xs font-bold text-fumec-muted uppercase tracking-widest block mb-1">
                Situação #{currentQuestion.id}
              </span>
              <h2
                id="question-heading"
                className="text-lg sm:text-2xl font-extrabold text-fumec-navy leading-snug"
              >
                {currentQuestion.statement}
              </h2>
            </div>

            {/* Grupo de Alternativas Acessíveis (Radio Group) */}
            <div
              role="radiogroup"
              aria-labelledby="question-heading"
              className="space-y-3"
            >
              {currentQuestion.alternatives.map((alt, idx) => {
                const isSelected = selectedAreaForCurrent === alt.area;
                return (
                  <button
                    key={alt.id}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => handleSelectAlternative(alt)}
                    disabled={submitting}
                    className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start gap-3.5 group min-h-[56px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fumec-primary focus-visible:ring-offset-2 ${
                      isSelected
                        ? 'bg-blue-50/90 border-2 border-fumec-primary shadow-sm text-fumec-navy'
                        : 'bg-white border-fumec-border hover:border-fumec-primary/70 hover:bg-slate-50/90 text-slate-700'
                    }`}
                  >
                    {/* Indicador visual de rádio */}
                    <div
                      className={`w-5 h-5 rounded-full mt-0.5 flex-shrink-0 flex items-center justify-center transition-colors border ${
                        isSelected
                          ? 'border-fumec-primary bg-fumec-primary text-white'
                          : 'border-slate-300 bg-white group-hover:border-fumec-primary'
                      }`}
                      aria-hidden="true"
                    >
                      {isSelected ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      ) : (
                        <span className="text-[10px] font-bold text-slate-400 group-hover:text-fumec-primary">
                          {String.fromCharCode(65 + idx)}
                        </span>
                      )}
                    </div>

                    <span className="text-sm sm:text-base font-medium leading-relaxed flex-1">
                      {alt.text}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Rodapé de Navegação Acessível */}
          <div className="pt-8 mt-6 border-t border-fumec-border flex items-center justify-between">
            <button
              type="button"
              onClick={handleBack}
              disabled={currentQuestionIndex === 0 || submitting}
              aria-label="Voltar para a questão anterior"
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold min-h-[44px] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fumec-primary focus-visible:ring-offset-2 ${
                currentQuestionIndex === 0 || submitting
                  ? 'opacity-30 cursor-not-allowed text-slate-400'
                  : 'text-fumec-secondary hover:bg-slate-100 active:scale-95'
              }`}
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" /> Voltar
            </button>

            <button
              type="button"
              onClick={handleRestart}
              disabled={submitting}
              aria-label="Reiniciar o questionário do início"
              className="text-xs font-semibold text-slate-400 hover:text-red-600 flex items-center gap-1 transition-colors px-2 py-2 min-h-[44px] rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" /> Reiniciar
            </button>

            <button
              type="button"
              onClick={handleNext}
              disabled={!selectedAreaForCurrent || submitting}
              aria-label={
                currentQuestionIndex === totalQuestions - 1
                  ? 'Finalizar o quiz e visualizar resultado'
                  : 'Avançar para a próxima pergunta'
              }
              className={`flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold min-h-[44px] transition-all shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fumec-primary focus-visible:ring-offset-2 ${
                !selectedAreaForCurrent || submitting
                  ? 'opacity-40 cursor-not-allowed bg-slate-200 text-slate-400 shadow-none'
                  : 'bg-fumec-primary text-white hover:bg-fumec-navy hover:shadow active:scale-95'
              }`}
            >
              {currentQuestionIndex === totalQuestions - 1 ? (
                submitting ? 'Calculando...' : 'Ver Resultado'
              ) : (
                <>
                  Próxima <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </>
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
