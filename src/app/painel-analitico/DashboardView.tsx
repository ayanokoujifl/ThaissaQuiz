'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { QuizMetrics } from '@/services/quiz.service';
import { QUIZ_QUESTIONS } from '@/data/quiz-questions';
import {
  Users,
  CheckCircle,
  TrendingUp,
  BarChart3,
  PieChart,
  LogOut,
  Filter,
  Layers,
  ArrowDownRight,
} from 'lucide-react';

interface DashboardViewProps {
  metrics: QuizMetrics;
  currentPeriodo: string;
  currentTurno: string;
}

export function DashboardView({
  metrics,
  currentPeriodo,
  currentTurno,
}: DashboardViewProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.refresh();
  };

  const handleFilterChange = (periodo: string, turno: string) => {
    const params = new URLSearchParams();
    if (periodo) params.set('periodo', periodo);
    if (turno) params.set('turno', turno);
    router.push(`/painel-analitico?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-fumec-surface flex flex-col">
      {/* Topo do Painel */}
      <header className="bg-fumec-navy text-white border-b border-fumec-navy/40 sticky top-0 z-30 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center font-bold text-fumec-cyan">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm sm:text-base">Painel Analítico</span>
                <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-fumec-accent text-white">
                  Thaíssa
                </span>
              </div>
              <p className="text-[11px] text-blue-200 hidden sm:block">
                FUMEC • Faculdade de Ciências Empresariais (FACE)
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors"
          >
            <LogOut className="w-3.5 h-3.5 text-blue-200" /> Sair
          </button>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
        {/* Barra de Filtros */}
        <div className="bg-white rounded-2xl border border-fumec-border p-4 shadow-sm flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-bold text-fumec-navy uppercase tracking-wider">
            <Filter className="w-4 h-4 text-fumec-primary" />
            Filtros Acadêmicos:
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Filtro Período */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-fumec-muted font-medium">Período:</span>
              <select
                value={currentPeriodo}
                onChange={(e) => handleFilterChange(e.target.value, currentTurno)}
                className="px-2.5 py-1.5 rounded-lg border border-fumec-border bg-slate-50 text-xs font-semibold text-slate-800 focus:outline-none focus:border-fumec-primary"
              >
                <option value="">Todos os Períodos</option>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((p) => (
                  <option key={p} value={String(p)}>
                    {p}º Período
                  </option>
                ))}
              </select>
            </div>

            {/* Filtro Turno */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-fumec-muted font-medium">Turno:</span>
              <select
                value={currentTurno}
                onChange={(e) => handleFilterChange(currentPeriodo, e.target.value)}
                className="px-2.5 py-1.5 rounded-lg border border-fumec-border bg-slate-50 text-xs font-semibold text-slate-800 focus:outline-none focus:border-fumec-primary"
              >
                <option value="">Todos os Turnos</option>
                <option value="MANHA">Manhã</option>
                <option value="NOITE">Noite</option>
              </select>
            </div>
          </div>
        </div>

        {/* KPI 1: Cards de Volume e Taxa de Conclusão */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl border border-fumec-border p-5 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-fumec-muted">
                Questionários Iniciados
              </p>
              <h3 className="text-3xl font-extrabold text-fumec-navy mt-1">
                {metrics.totalStarted}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-fumec-primary flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-fumec-border p-5 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-fumec-muted">
                Finalizados com Sucesso
              </p>
              <h3 className="text-3xl font-extrabold text-fumec-navy mt-1">
                {metrics.totalCompleted}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-fumec-border p-5 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-fumec-muted">
                Taxa de Conclusão
              </p>
              <h3 className="text-3xl font-extrabold text-fumec-navy mt-1">
                {metrics.completionRate}%
              </h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-orange-50 text-fumec-accent flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Funil de Drop-Off por Pergunta */}
        <div className="bg-white rounded-2xl border border-fumec-border p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-extrabold text-fumec-navy flex items-center gap-2">
                <ArrowDownRight className="w-4 h-4 text-fumec-primary" />
                Funil de Retenção & Drop-Off por Questão
              </h3>
              <p className="text-xs text-fumec-muted">
                Acompanhe em qual pergunta os alunos abandonam o questionário
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-10 gap-2">
            {metrics.dropOff.map((step) => {
              const pctOfStarted =
                metrics.totalStarted > 0
                  ? Math.round((step.respondents / metrics.totalStarted) * 100)
                  : 0;
              return (
                <div
                  key={step.questionIndex}
                  className="p-3 rounded-xl border border-fumec-border bg-slate-50 text-center flex flex-col justify-between"
                >
                  <span className="text-[10px] font-bold text-fumec-muted uppercase">
                    Q{step.questionIndex}
                  </span>
                  <div className="my-1.5">
                    <span className="text-lg font-black text-fumec-navy">
                      {step.respondents}
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold text-fumec-primary">
                    {pctOfStarted}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Grid de 2 Colunas: Distribuição de Perfis (KPI 2) & Médias de Afinidade (KPI 3) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* KPI 2: Distribuição Percentual de Perfis Predominantes */}
          <div className="bg-white rounded-2xl border border-fumec-border p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <PieChart className="w-4 h-4 text-fumec-accent" />
              <h3 className="text-base font-extrabold text-fumec-navy">
                Distribuição de Perfis Predominantes
              </h3>
            </div>
            <p className="text-xs text-fumec-muted mb-4">
              Qual área da Administração foi a vencedora na escolha dos alunos
            </p>

            <div className="space-y-3.5">
              {metrics.profileDistribution.map((item) => (
                <div key={item.profile} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-fumec-navy flex items-center gap-1.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      {item.name} ({item.profile})
                    </span>
                    <span className="font-extrabold text-slate-700">
                      {item.count} alunos ({item.percentage}%)
                    </span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${item.percentage}%`,
                        backgroundColor: item.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* KPI 3: Média Geral de Afinidade por Área */}
          <div className="bg-white rounded-2xl border border-fumec-border p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-4 h-4 text-fumec-primary" />
              <h3 className="text-base font-extrabold text-fumec-navy">
                Média Geral de Afinidade por Área
              </h3>
            </div>
            <p className="text-xs text-fumec-muted mb-4">
              Média percentual de pontuação acumulada por área em todas as respostas
            </p>

            <div className="space-y-3.5">
              {metrics.averageAffinities.map((item) => (
                <div key={item.code} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-fumec-navy flex items-center gap-1.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      {item.name}
                    </span>
                    <span className="font-extrabold text-slate-700">
                      {item.averageScore}% de afinidade média
                    </span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(100, item.averageScore * 2.5)}%`,
                        backgroundColor: item.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* KPI 4: Matriz de Respostas por Pergunta (Detalhamento Questão x Alternativa) */}
        <div className="bg-white rounded-2xl border border-fumec-border p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Layers className="w-4 h-4 text-fumec-primary" />
            <h3 className="text-base font-extrabold text-fumec-navy">
              Matriz de Votos por Questão (Pergunta x Área)
            </h3>
          </div>
          <p className="text-xs text-fumec-muted mb-6">
            Descubra quais foram as alternativas mais escolhidas em cada situação do dia a dia
          </p>

          <div className="space-y-6">
            {metrics.questionMatrix.map((q) => {
              const questionObj = QUIZ_QUESTIONS.find((item) => item.id === q.questionIndex);
              return (
                <div
                  key={q.questionIndex}
                  className="p-4 rounded-xl border border-fumec-border bg-slate-50/60 space-y-3"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="text-[11px] font-black uppercase text-fumec-primary">
                        Questão {q.questionIndex}
                      </span>
                      <h4 className="text-xs sm:text-sm font-bold text-fumec-navy mt-0.5">
                        {questionObj?.statement}
                      </h4>
                    </div>
                    <span className="text-[11px] font-semibold text-fumec-muted flex-shrink-0 bg-white px-2 py-1 rounded-md border border-fumec-border">
                      {q.totalVotes} votos
                    </span>
                  </div>

                  {/* Barras das 6 alternativas para esta questão */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 pt-1">
                    {q.distribution.map((dist) => (
                      <div
                        key={dist.area}
                        className="bg-white p-2.5 rounded-lg border border-fumec-border flex flex-col justify-between"
                      >
                        <div className="flex items-center justify-between text-[11px] font-bold">
                          <span style={{ color: dist.color }}>{dist.area}</span>
                          <span className="text-slate-600">{dist.votes}</span>
                        </div>
                        <div className="mt-1 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${dist.percentage}%`,
                              backgroundColor: dist.color,
                            }}
                          />
                        </div>
                        <span className="text-[10px] text-slate-400 mt-1 font-medium">
                          {dist.percentage}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
