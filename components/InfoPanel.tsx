'use client';

import { Volume2, X } from 'lucide-react';
import type { Hotspot } from '@/data/scenes';

interface InfoPanelProps {
  hotspot: Hotspot;
  onClose: () => void;
}

function speak(text: string) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  utterance.rate = 0.85;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}

export default function InfoPanel({ hotspot, onClose }: InfoPanelProps) {
  return (
    <div className="absolute bottom-6 left-1/2 w-[92%] max-w-md -translate-x-1/2 rounded-2xl bg-white p-5 shadow-2xl ring-1 ring-black/5">
      <button
        onClick={onClose}
        aria-label="닫기"
        className="absolute right-3 top-3 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
      >
        <X size={18} />
      </button>

      <div className="flex items-center gap-3">
        <h2 className="text-2xl font-bold text-ink">{hotspot.word}</h2>
        <button
          onClick={() => speak(hotspot.word)}
          aria-label="발음 듣기"
          className="rounded-full bg-sky/20 p-2 text-sky-700 hover:bg-sky/40"
        >
          <Volume2 size={20} />
        </button>
      </div>

      <p className="mt-1 text-sm text-slate-500">{hotspot.ipa}</p>
      <p className="mt-2 text-lg font-medium text-slate-700">{hotspot.korean}</p>

      <div className="mt-3 flex items-center gap-2 rounded-xl bg-slate-50 p-3">
        <p className="flex-1 text-sm text-slate-600">{hotspot.example}</p>
        <button
          onClick={() => speak(hotspot.example)}
          aria-label="예문 발음 듣기"
          className="shrink-0 rounded-full p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-600"
        >
          <Volume2 size={16} />
        </button>
      </div>
    </div>
  );
}
