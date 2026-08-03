'use client';

import { useEffect, useState } from 'react';
import { Volume2, X } from 'lucide-react';
import type { Hotspot } from '@/data/scenes';
import { initSpeech, isLikelyInAppBrowser, speak } from '@/lib/speech';

interface InfoPanelProps {
  hotspot: Hotspot;
  onClose: () => void;
}

export default function InfoPanel({ hotspot, onClose }: InfoPanelProps) {
  const [soundIssue, setSoundIssue] = useState(false);

  useEffect(() => {
    initSpeech();
  }, []);

  const handleSpeak = (text: string) => {
    setSoundIssue(false);
    speak(text, () => setSoundIssue(true));
  };

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
          onClick={() => handleSpeak(hotspot.word)}
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
          onClick={() => handleSpeak(hotspot.example)}
          aria-label="예문 발음 듣기"
          className="shrink-0 rounded-full p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-600"
        >
          <Volume2 size={16} />
        </button>
      </div>

      {soundIssue && (
        <p className="mt-2 text-xs text-amber-600">
          {isLikelyInAppBrowser()
            ? '이 앱 안에서는 발음이 안 나올 수 있어요. 오른쪽 위 메뉴에서 \'다른 브라우저로 열기\'를 눌러주세요.'
            : '소리가 안 들리면 기기 음량이나 무음 모드를 확인해보세요.'}
        </p>
      )}
    </div>
  );
}
