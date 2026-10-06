import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export function Header() {
  return (
    <header className="w-full bg-white border-b border-fumec-border sticky top-0 z-40 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 sm:h-20 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-3 sm:gap-4 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fumec-primary rounded-xl p-1 -m-1 transition-transform active:scale-[0.99]"
          aria-label="Página inicial - Quiz Administração Sem Limites | Universidade FUMEC"
        >
          {/* Logo Oficial com Ícone e Título da Universidade */}
          <div className="relative h-11 sm:h-13 w-auto flex items-center">
            <Image
              src="/fumec_universidade.webp"
              alt="Universidade FUMEC"
              width={160}
              height={173}
              priority
              className="h-11 sm:h-13 w-auto object-contain transition-opacity group-hover:opacity-90"
            />
          </div>

          {/* Divisor e Identificação do Curso / Faculdade */}
          <div className="border-l border-slate-200 pl-3 sm:pl-4 flex flex-col justify-center">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xs sm:text-sm text-fumec-navy tracking-tight">
                FACE
              </span>
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-blue-50 text-fumec-primary border border-blue-100">
                Administração
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-500 font-medium leading-none mt-0.5 hidden min-[440px]:block">
              Administração Sem Limites
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <span className="text-[11px] sm:text-xs font-bold text-fumec-primary bg-blue-50/80 border border-blue-200/70 px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-fumec-primary" aria-hidden="true" />
            Quiz de Carreira
          </span>
        </div>
      </div>
    </header>
  );
}
