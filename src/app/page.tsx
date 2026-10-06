'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import {
  Sparkles,
  ArrowRight,
  Clock,
  Users,
  CheckCircle2,
  Sun,
  Moon,
  AlertCircle,
  Share2,
  Compass,
  ShieldCheck,
  Award,
  BookOpen,
} from 'lucide-react';

const AREAS_PREVIEW = [
  {
    code: 'RH',
    name: 'Recursos Humanos',
    short: 'Pessoas & Cultura',
    color: '#0284C7',
    bg: '#E0F2FE',
    border: '#BAE6FD',
  },
  {
    code: 'MKT',
    name: 'Marketing',
    short: 'Criatividade & Mercado',
    color: '#7C3AED',
    bg: '#EDE9FE',
    border: '#DDD6FE',
  },
  {
    code: 'FIN',
    name: 'Financeiro',
    short: 'Análise & Estratégia',
    color: '#059669',
    bg: '#D1FAE5',
    border: '#A7F3D0',
  },
  {
    code: 'LOG',
    name: 'Logística',
    short: 'Processos & Eficiência',
    color: '#EA580C',
    bg: '#FFEDD5',
    border: '#FED7AA',
  },
  {
    code: 'COM',
    name: 'Comercial',
    short: 'Vendas & Negociação',
    color: '#DC2626',
    bg: '#FEE2E2',
    border: '#FECACA',
  },
  {
    code: 'EMP',
    name: 'Empreendedorismo',
    short: 'Inovação & Liderança',
    color: '#D97706',
    bg: '#FEF3C7',
    border: '#FDE68A',
  },
];

export default function HomePage() {
  const router = useRouter();
  const [periodo, setPeriodo] = useState<number | null>(null);
  const [turno, setTurno] = useState<'MANHA' | 'NOITE' | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleStart = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!periodo || !turno) {
      setError('Por favor, selecione seu período e turno para liberar o quiz.');
      if (formRef.current) {
        formRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/quiz/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ periodo, turno }),
      });

      if (!res.ok) {
        throw new Error('Falha ao iniciar o teste.');
      }

      const data = await res.json();
      sessionStorage.setItem('quiz_session_id', data.sessionId);
      sessionStorage.setItem('quiz_periodo', String(periodo));
      sessionStorage.setItem('quiz_turno', turno);

      router.push('/quiz');
    } catch (err) {
      console.error(err);
      setError('Ocorreu um erro ao conectar com o servidor. Tente novamente.');
      setLoading(false);
    }
  };

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Header />

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-12 sm:space-y-16">
        {/* SEÇÃO PRINCIPAL (HERO) */}
        <section aria-labelledby="hero-title" className="relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            
            {/* COLUNA ESQUERDA: APRESENTAÇÃO & IMAGEM HUMANIZADA */}
            <div className="lg:col-span-7 flex flex-col space-y-6">
              
              {/* Badge da Instituição */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-fumec-primary text-xs font-bold uppercase tracking-wide">
                  <Image
                    src="/fumec_icon.png"
                    alt=""
                    width={16}
                    height={16}
                    className="w-4 h-4 object-contain"
                    aria-hidden="true"
                  />
                  FUMEC • FACE
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  Curso de Administração
                </span>
              </div>

              {/* Título Principal */}
              <div>
                <h1
                  id="hero-title"
                  className="text-3xl sm:text-4xl lg:text-5xl font-black text-fumec-navy tracking-tight leading-[1.15]"
                >
                  ADMINISTRAÇÃO <br className="hidden sm:inline" />
                  <span className="text-fumec-primary">SEM LIMITES</span>
                </h1>
                <p className="mt-3 text-lg sm:text-xl font-bold text-slate-800">
                  Descubra quais áreas da gestão mais combinam com o seu perfil.
                </p>
                <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl">
                  Em 10 situações práticas do dia a dia, analise suas reações diante de desafios reais
                  e receba um diagnóstico detalhado entre as 6 grandes áreas profissionais.
                </p>
              </div>

              {/* Imagem Humanizada dos Estudantes com Card Informativo */}
              <div className="relative rounded-2xl overflow-hidden shadow-md border border-slate-200 bg-white group">
                <div className="relative h-56 sm:h-72 w-full">
                  <Image
                    src="/hero-students.jpg"
                    alt="Estudantes de administração da faculdade reunidos estudando e conversando em um ambiente colaborativo e moderno"
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 650px"
                    className="object-cover object-center group-hover:scale-[1.02] transition-transform duration-500 ease-out"
                  />
                  {/* Gradiente sutil para legibilidade */}
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"
                    aria-hidden="true"
                  />

                  {/* Informação sobreposta na foto */}
                  <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 flex items-end justify-between gap-2 text-white">
                    <div>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-white/20 backdrop-blur-md text-[11px] sm:text-xs font-semibold text-white mb-1">
                        <Users className="w-3.5 h-3.5" aria-hidden="true" />
                        Comunidade Universitária
                      </span>
                      <p className="text-xs sm:text-sm font-semibold leading-snug drop-shadow-sm">
                        +500 alunos da FACE já descobriram sua vocação
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={scrollToForm}
                      className="lg:hidden px-3.5 py-2 rounded-xl bg-fumec-primary hover:bg-fumec-navy text-white text-xs font-bold transition-all shadow-md active:scale-95 flex items-center gap-1.5 whitespace-nowrap"
                    >
                      Fazer teste <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </div>

                {/* Micro-pilares informativos de acessibilidade rápida */}
                <div className="grid grid-cols-3 divide-x divide-slate-100 py-3 bg-white text-center text-xs text-slate-700">
                  <div className="flex flex-col items-center justify-center gap-0.5 px-2">
                    <span className="font-extrabold text-fumec-navy flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5 text-fumec-primary" aria-hidden="true" />
                      10
                    </span>
                    <span className="text-[11px] text-slate-500">Situações reais</span>
                  </div>
                  <div className="flex flex-col items-center justify-center gap-0.5 px-2">
                    <span className="font-extrabold text-fumec-navy flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-fumec-primary" aria-hidden="true" />
                      ~3 min
                    </span>
                    <span className="text-[11px] text-slate-500">Rápido e direto</span>
                  </div>
                  <div className="flex flex-col items-center justify-center gap-0.5 px-2">
                    <span className="font-extrabold text-fumec-navy flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-fumec-primary" aria-hidden="true" />
                      100%
                    </span>
                    <span className="text-[11px] text-slate-500">Anônimo e livre</span>
                  </div>
                </div>
              </div>

              {/* Vitrine visual das 6 áreas de Administração */}
              <div className="pt-2">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
                  Áreas avaliadas no teste:
                </p>
                <div className="flex flex-wrap gap-2" role="list" aria-label="Áreas de administração analisadas">
                  {AREAS_PREVIEW.map((area) => (
                    <div
                      key={area.code}
                      role="listitem"
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium transition-all"
                      style={{
                        backgroundColor: area.bg,
                        borderColor: area.border,
                        color: area.color,
                      }}
                    >
                      <span
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: area.color }}
                        aria-hidden="true"
                      />
                      <span className="font-bold">{area.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* COLUNA DIREITA: FORMULÁRIO ERGONÔMICO E ACESSÍVEL */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 relative">
                
                {/* Header do Card */}
                <div className="border-b border-slate-100 pb-4 mb-6">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Início Imediato
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-fumec-navy tracking-tight">
                    Comece seu teste
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1">
                    Selecione seu período e turno para calibrar o diagnóstico acadêmico.
                  </p>
                </div>

                {/* Formulário com Semântica e Acessibilidade Plena */}
                <form
                  ref={formRef}
                  onSubmit={handleStart}
                  className="space-y-6"
                  noValidate
                  aria-label="Configuração inicial do participante"
                >
                  {/* Seletor de Período */}
                  <div className="space-y-2">
                    <div className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-800">
                      <span id="periodo-heading">Qual o seu período na faculdade?</span>
                      {periodo && (
                        <span className="text-fumec-primary font-bold normal-case text-xs flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                          {periodo}º período
                        </span>
                      )}
                    </div>
                    <p id="periodo-help" className="text-[11px] text-slate-500">
                      Toque na opção correspondente ao seu semestre atual (1º ao 8º).
                    </p>

                    <div
                      role="radiogroup"
                      aria-labelledby="periodo-heading"
                      aria-describedby="periodo-help"
                      className="grid grid-cols-4 sm:grid-cols-8 gap-2 pt-1"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => {
                        const isChecked = periodo === num;
                        return (
                          <button
                            key={num}
                            type="button"
                            role="radio"
                            aria-checked={isChecked}
                            aria-label={`${num}º período`}
                            onClick={() => {
                              setPeriodo(num);
                              if (error) setError(null);
                            }}
                            className={`min-h-[50px] w-full flex items-center justify-center rounded-xl border text-sm sm:text-base font-bold select-none transition-all cursor-pointer touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fumec-primary focus-visible:ring-offset-2 ${
                              isChecked
                                ? 'bg-fumec-primary text-white border-fumec-primary shadow-sm scale-[1.02]'
                                : 'bg-white text-slate-700 border-slate-200 hover:border-fumec-primary/60 hover:bg-slate-50 active:scale-95'
                            }`}
                          >
                            {num}º
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Seletor de Turno */}
                  <div className="space-y-2">
                    <div className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-800">
                      <span id="turno-heading">Qual é o seu turno?</span>
                      {turno && (
                        <span className="text-fumec-primary font-bold normal-case text-xs flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                          {turno === 'MANHA' ? 'Manhã' : 'Noite'}
                        </span>
                      )}
                    </div>

                    <div
                      role="radiogroup"
                      aria-labelledby="turno-heading"
                      className="grid grid-cols-2 gap-3 pt-1"
                    >
                      {[
                        { key: 'MANHA' as const, label: 'Manhã', icon: Sun },
                        { key: 'NOITE' as const, label: 'Noite', icon: Moon },
                      ].map((item) => {
                        const isChecked = turno === item.key;
                        const Icon = item.icon;
                        return (
                          <button
                            key={item.key}
                            type="button"
                            role="radio"
                            aria-checked={isChecked}
                            aria-label={`Turno ${item.label}`}
                            onClick={() => {
                              setTurno(item.key);
                              if (error) setError(null);
                            }}
                            className={`min-h-[54px] px-4 w-full flex items-center justify-center gap-2.5 rounded-xl border text-sm font-bold select-none transition-all cursor-pointer touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fumec-primary focus-visible:ring-offset-2 ${
                              isChecked
                                ? 'bg-fumec-primary text-white border-fumec-primary shadow-sm scale-[1.02]'
                                : 'bg-white text-slate-700 border-slate-200 hover:border-fumec-primary/60 hover:bg-slate-50 active:scale-95'
                            }`}
                          >
                            <Icon className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                            <span>{item.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Feedback de Erro Acessível */}
                  {error && (
                    <div
                      role="alert"
                      aria-live="assertive"
                      className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm font-medium flex items-center gap-2 animate-fadeIn"
                    >
                      <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600" aria-hidden="true" />
                      <span>{error}</span>
                    </div>
                  )}

                  {/* Botão de Ação Primário com Alvo Tátil WCAG e Feedback de Estado */}
                  <div className="space-y-2 pt-1">
                    <button
                      type="submit"
                      disabled={loading}
                      aria-busy={loading}
                      aria-label={
                        loading
                          ? 'Iniciando o questionário...'
                          : !periodo || !turno
                          ? 'Selecione período e turno para começar o quiz'
                          : 'Começar o questionário agora'
                      }
                      className={`w-full min-h-[56px] rounded-2xl font-black text-sm sm:text-base flex items-center justify-center gap-2.5 transition-all shadow-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-fumec-primary/30 active:scale-[0.99] touch-manipulation ${
                        loading
                          ? 'bg-slate-300 text-slate-500 cursor-wait'
                          : !periodo || !turno
                          ? 'bg-slate-200 text-slate-500 hover:bg-slate-300 cursor-pointer'
                          : 'bg-fumec-primary hover:bg-fumec-navy text-white hover:shadow-lg active:scale-95'
                      }`}
                    >
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" aria-hidden="true" />
                          <span>Preparando o quiz...</span>
                        </>
                      ) : (
                        <>
                          <span>COMEÇAR O QUIZ</span>
                          <ArrowRight className="w-5 h-5 text-fumec-cyan" aria-hidden="true" />
                        </>
                      )}
                    </button>

                    <p className="text-center text-[11px] sm:text-xs text-slate-500">
                      {!periodo || !turno
                        ? '👆 Selecione acima o período e o turno para prosseguir.'
                        : '✅ Tudo pronto! O teste leva cerca de 3 minutos.'}
                    </p>
                  </div>
                </form>
              </div>
            </div>

          </div>
        </section>

        {/* SEÇÃO INFERIOR: COMO FUNCIONA & EXPERIÊNCIA MOBILE / SOCIAL */}
        <section
          aria-labelledby="how-it-works-title"
          className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm"
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            {/* Foto Secundária: Aluna no Campus com Smartphone */}
            <div className="md:col-span-5 order-2 md:order-1 flex justify-center">
              <div className="relative w-full max-w-sm rounded-2xl overflow-hidden border border-slate-200 shadow-sm aspect-[3/4]">
                <Image
                  src="/student-mobile.jpg"
                  alt="Estudante universitária sorrindo ao visualizar o resultado do quiz no celular no campus da faculdade"
                  fill
                  sizes="(max-width: 768px) 100vw, 380px"
                  className="object-cover object-top"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"
                  aria-hidden="true"
                />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/20 backdrop-blur-md text-xs font-bold text-white mb-1.5">
                    <Share2 className="w-3.5 h-3.5" aria-hidden="true" />
                    Card Compartilhável
                  </div>
                  <p className="text-xs sm:text-sm font-semibold leading-snug">
                    Ao finalizar, baixe seu card exclusivo ou envie direto no WhatsApp e Instagram Stories!
                  </p>
                </div>
              </div>
            </div>

            {/* Explicação dos 3 Passos */}
            <div className="md:col-span-7 order-1 md:order-2 space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-fumec-primary">
                  Etapas do Quiz
                </span>
                <h2
                  id="how-it-works-title"
                  className="text-2xl sm:text-3xl font-black text-fumec-navy tracking-tight mt-1"
                >
                  Criado para estudantes, direto ao ponto
                </h2>
                <p className="text-sm sm:text-base text-slate-600 mt-2 leading-relaxed">
                  Sem perguntas teóricas cansativas. O teste coloca você no centro de dilemas e projetos
                  do ambiente empresarial para mapear sua vocação autêntica.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="w-9 h-9 rounded-xl bg-blue-100 text-fumec-primary flex items-center justify-center font-black text-sm flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">
                      10 Situações da Prática Universitária e do Mercado
                    </h3>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                      Escolha a resposta que mais parece com o que você faria de verdade em uma equipe ou empresa.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-black text-sm flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">
                      Diagnóstico e Ranking Percentual Completo
                    </h3>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                      Descubra sua área predominante e como suas afinidades se distribuem entre as outras 5 áreas.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-black text-sm flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">
                      Trilhas e Áreas para Você Conhecer
                    </h3>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                      Sugestões de especializações, cargos e competências alinhadas aos seus pontos fortes.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={scrollToForm}
                  className="inline-flex items-center gap-2 text-sm font-bold text-fumec-primary hover:text-fumec-navy transition-colors"
                >
                  <span>Ir para o início do teste</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </div>

          </div>
        </section>
      </main>

      {/* Footer Institucional Acessível */}
      <footer className="w-full bg-white border-t border-slate-200 mt-12 py-8 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Image
              src="/fumec_universidade.webp"
              alt="Universidade FUMEC"
              width={100}
              height={108}
              className="h-10 w-auto object-contain"
            />
            <div className="text-left border-l border-slate-200 pl-3">
              <p className="font-extrabold text-slate-800 text-xs">FUMEC • FACE</p>
              <p className="text-[11px] text-slate-500">Administração Sem Limites</p>
            </div>
          </div>
          <div className="text-center sm:text-right">
            <p>© {new Date().getFullYear()} Universidade FUMEC — Todos os direitos reservados.</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Desenvolvido para orientação acadêmica e profissional dos estudantes de Administração.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
