'use client';

import React, { useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import { AreaInfo } from '@/data/quiz-questions';
import { Download, Share2, Check, Sparkles } from 'lucide-react';

interface ShareableCardProps {
  primaryArea: AreaInfo;
  secondaryArea?: AreaInfo;
  isTie: boolean;
  score: number;
}

export function ShareableCard({
  primaryArea,
  secondaryArea,
  isTie,
  score,
}: ShareableCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setDownloading(true);

    try {
      // Pequeno timeout para garantir renderização de fontes
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2.5,
        quality: 0.95,
      });

      const link = document.createElement('a');
      link.download = `perfil-administracao-${primaryArea.code.toLowerCase()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Erro ao gerar imagem:', err);
      alert('Não foi possível gerar a imagem no seu dispositivo.');
    } finally {
      setDownloading(false);
    }
  };

  const handleShare = async () => {
    if (!cardRef.current) return;
    setDownloading(true);

    try {
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2.5,
      });

      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], 'meu-perfil-fumec.png', { type: 'image/png' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Meu Perfil na Administração - FUMEC',
          text: `Fiz o quiz "Administração Sem Limites" da FUMEC e minha maior afinidade é com ${primaryArea.name}!`,
        });
      } else {
        // Fallback: download da imagem
        handleDownload();
      }
    } catch (err) {
      console.error('Erro ao compartilhar:', err);
      handleDownload();
    } finally {
      setDownloading(false);
    }
  };

  const titleText = isTie && secondaryArea
    ? `${primaryArea.shortName} + ${secondaryArea.shortName}`
    : primaryArea.name;

  return (
    <div className="flex flex-col items-center">
      {/* Card visual renderizado com proporção para Stories/Feed */}
      <div
        ref={cardRef}
        className="w-full max-w-[340px] aspect-[4/5] rounded-3xl p-6 flex flex-col justify-between text-white relative overflow-hidden shadow-2xl"
        style={{
          background: 'linear-gradient(145deg, #002746 0%, #004472 50%, #00629E 100%)',
        }}
      >
        {/* Efeitos decorativos sutis */}
        <div
          className="absolute -top-16 -right-16 w-36 h-36 rounded-full blur-2xl opacity-40 pointer-events-none"
          style={{ backgroundColor: primaryArea.color }}
        />
        <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-blue-400/20 rounded-full blur-2xl pointer-events-none" />

        {/* Topo institucional */}
        <div className="relative z-10 flex items-center justify-between border-b border-white/15 pb-3">
          <div className="flex items-center gap-2">
            <img
              src="/fumec_icon.png"
              alt="FUMEC"
              className="w-5 h-5 object-contain drop-shadow-xs"
              crossOrigin="anonymous"
            />
            <span className="text-xs font-black tracking-widest uppercase text-white">
              FUMEC
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white/20 text-white">
              FACE
            </span>
          </div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-blue-100">
            Administração Sem Limites
          </span>
        </div>

        {/* Miolo com Destaque do Perfil */}
        <div className="relative z-10 my-auto text-center py-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[11px] font-bold uppercase tracking-wider text-blue-200 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-fumec-accent" />
            Meu Perfil Predominante
          </span>

          <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight text-white">
            {titleText}
          </h3>

          <div className="mt-3 inline-block px-3 py-1 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20">
            <span className="text-xs font-bold text-white">
              {score}% de Afinidade
            </span>
          </div>

          <p className="mt-4 text-xs text-white/80 line-clamp-3 leading-relaxed px-2 font-medium">
            "{primaryArea.description}"
          </p>
        </div>

        {/* Rodapé do Card */}
        <div className="relative z-10 border-t border-white/10 pt-3 flex items-center justify-between text-[10px] text-white/70">
          <span>Descubra o seu perfil</span>
          <span className="font-bold text-white">#OrgulhoFUMEC</span>
        </div>
      </div>

      {/* Ações de Compartilhamento */}
      <div className="flex items-center gap-3 mt-4 w-full max-w-[340px]">
        <button
          onClick={handleShare}
          disabled={downloading}
          className="flex-1 py-3 px-4 rounded-xl bg-fumec-primary hover:bg-fumec-navy text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95"
        >
          <Share2 className="w-4 h-4 text-fumec-cyan" />
          {downloading ? 'Processando...' : 'Compartilhar'}
        </button>

        <button
          onClick={handleDownload}
          disabled={downloading}
          className="py-3 px-4 rounded-xl bg-white border border-fumec-border hover:bg-slate-50 text-fumec-navy text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95"
        >
          <Download className="w-4 h-4" />
          Baixar Imagem
        </button>
      </div>
    </div>
  );
}
