'use client';

import { useEffect, useMemo, useState } from 'react';
import { Volume2, X } from 'lucide-react';
import { scenes } from '@/data/scenes';
import { sentences } from '@/data/sentences';
import { initSpeech, isLikelyInAppBrowser, speak } from '@/lib/speech';
import {
  computeStreak,
  isSupabaseConfigured,
  loadProgress,
  saveProgress,
  todayStr,
  type ProgressRecord,
} from '@/lib/db';

interface SentenceModeProps {
  onClose: () => void;
}

// Two content sources feed the same flashcard list: hotspot words (each with
// a word + IPA + example sentence, tied to a 3D scene) and standalone
// "생활 영어" phrases with no word focus. `word` being present is what tells
// the card renderer which layout to use.
interface ReviewCard {
  id: string;
  category: string;
  word?: string;
  ipa?: string;
  korean?: string;
  example: string;
  exampleKo: string;
}

const wordCards: ReviewCard[] = scenes.flatMap((scene) =>
  scene.hotspots.map((h) => ({
    id: h.id,
    category: scene.titleKo,
    word: h.word,
    ipa: h.ipa,
    korean: h.korean,
    example: h.example,
    exampleKo: h.exampleKo,
  }))
);

const phraseCards: ReviewCard[] = sentences.map((s) => ({
  id: s.id,
  category: s.cat,
  example: s.en,
  exampleKo: s.ko,
}));

const allCards: ReviewCard[] = [...wordCards, ...phraseCards];

export default function SentenceMode({ onClose }: SentenceModeProps) {
  const [index, setIndex] = useState(0);
  const [records, setRecords] = useState<ProgressRecord[]>([]);
  const [soundIssue, setSoundIssue] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    initSpeech();
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function refresh() {
    setRecords(await loadProgress());
  }

  const card = allCards[index];
  const studiedIds = useMemo(() => new Set(records.map((r) => r.hotspot_id)), [records]);
  const pct = Math.round((studiedIds.size / allCards.length) * 100);
  const streak = computeStreak(records);
  const studiedToday = records.some(
    (r) => r.hotspot_id === card.id && r.studied_on === todayStr()
  );

  const byDate = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => map.set(r.studied_on, (map.get(r.studied_on) || 0) + 1));
    return [...map.entries()].sort((a, b) => (a[0] < b[0] ? 1 : -1));
  }, [records]);

  const handleSpeak = (text: string) => {
    setSoundIssue(false);
    speak(text, () => {
      setSoundIssue(true);
    });
  };

  const handleLearned = async () => {
    setSaving(true);
    await saveProgress(card.id);
    await refresh();
    setSaving(false);
  };

  const go = (delta: number) => {
    setIndex((i) => (i + delta + allCards.length) % allCards.length);
  };

  return (
    <div className="fixed inset-0 z-30 flex justify-center overflow-y-auto bg-[#f2ede3] px-4 py-6">
      <div className="flex w-full max-w-md flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-extrabold text-ink">문장 모드</h1>
          <button
            onClick={onClose}
            aria-label="3D 모드로 돌아가기"
            className="rounded-full bg-white p-2 text-slate-500 shadow hover:text-ink"
          >
            <X size={20} />
          </button>
        </div>

        {isLikelyInAppBrowser() && (
          <div className="rounded-xl bg-amber-100 px-4 py-2 text-xs text-amber-900">
            카카오톡 등 앱 안에서는 발음이 안 나올 수 있어요. 메뉴에서 &apos;다른 브라우저로 열기&apos;를 눌러주세요.
          </div>
        )}

        {/* Progress */}
        <section className="rounded-2xl bg-white p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-ink">진행률</h2>
            <span className="text-xs font-semibold text-slate-500">🔥 {streak}일 연속</span>
          </div>
          <div className="mt-3 flex items-center gap-4">
            <div
              className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full"
              style={{
                background: `conic-gradient(#4f46e5 ${pct}%, #eef2ff 0)`,
              }}
            >
              <div className="absolute inset-[6px] rounded-full bg-white" />
              <span className="relative text-sm font-bold text-ink">{pct}%</span>
            </div>
            <div className="flex-1">
              <p className="mb-1 text-sm text-ink">
                <strong>{studiedIds.size}</strong> / {allCards.length} 단어·문장 학습
              </p>
              <div className="h-2 overflow-hidden rounded-full bg-indigo-50">
                <div
                  className="h-full rounded-full bg-indigo-600 transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Flashcard */}
        <section className="rounded-2xl bg-white p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-ink">Flashcard</h2>
            <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">
              {card.category}
            </span>
          </div>

          <div className="mt-4 rounded-2xl bg-[#f2ede3] p-5 text-center">
            {card.word && (
              <>
                <div className="flex items-center justify-center gap-2">
                  <p className="text-2xl font-extrabold text-ink">{card.word}</p>
                  <button
                    onClick={() => handleSpeak(card.word as string)}
                    aria-label="단어 발음 듣기"
                    className="rounded-full bg-sky/20 p-1.5 text-sky-700 hover:bg-sky/40"
                  >
                    <Volume2 size={16} />
                  </button>
                </div>
                <p className="mt-1 text-xs text-slate-500">{card.ipa}</p>
                <p className="mt-1 text-sm text-slate-600">{card.korean}</p>
                <div className="my-4 h-px bg-slate-200" />
              </>
            )}

            <div className="flex items-center justify-center gap-2">
              <p className={card.word ? 'text-base font-semibold text-ink' : 'text-xl font-extrabold text-ink'}>
                {card.example}
              </p>
              <button
                onClick={() => handleSpeak(card.example)}
                aria-label="예문 발음 듣기"
                className="shrink-0 rounded-full bg-sky/20 p-1.5 text-sky-700 hover:bg-sky/40"
              >
                <Volume2 size={16} />
              </button>
            </div>
            <p className="mt-1 text-sm text-slate-500">{card.exampleKo}</p>
          </div>

          <div className="mt-4 flex items-center justify-center gap-3">
            <button
              onClick={() => go(-1)}
              aria-label="이전 카드"
              className="h-11 w-11 rounded-full bg-indigo-50 text-lg hover:bg-indigo-100"
            >
              ◀
            </button>
            <button
              onClick={() => go(1)}
              aria-label="다음 카드"
              className="h-11 w-11 rounded-full bg-indigo-50 text-lg hover:bg-indigo-100"
            >
              ▶
            </button>
          </div>

          <button
            onClick={handleLearned}
            disabled={studiedToday || saving}
            className="mt-4 w-full rounded-xl bg-ink py-3 text-sm font-bold text-white transition-opacity disabled:opacity-50"
          >
            {studiedToday ? '오늘 이미 학습했어요 ✔' : '오늘 이 단어·문장 학습했어요 ✔'}
          </button>

          {soundIssue && (
            <p className="mt-2 text-center text-xs text-amber-600">
              {isLikelyInAppBrowser()
                ? "이 앱 안에서는 발음이 안 나올 수 있어요. 다른 브라우저로 열어주세요."
                : '소리가 안 들리면 기기 음량이나 무음 모드를 확인해보세요.'}
            </p>
          )}
        </section>

        {/* History */}
        <section className="rounded-2xl bg-white p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-ink">학습 기록</h2>
            <span
              className={`rounded-full px-3 py-1 text-xs font-bold ${
                isSupabaseConfigured ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-800'
              }`}
            >
              {isSupabaseConfigured ? 'Supabase 연결됨' : '로컬 저장 모드'}
            </span>
          </div>
          <div className="mt-3 flex flex-col gap-2">
            {byDate.length === 0 ? (
              <p className="py-2 text-center text-sm text-slate-500">
                아직 학습 기록이 없어요. 첫 카드를 학습해보세요!
              </p>
            ) : (
              byDate.map(([date, count]) => (
                <div
                  key={date}
                  className="flex items-center justify-between rounded-lg bg-[#f2ede3] px-3 py-2 text-sm"
                >
                  <span className="font-semibold text-ink">{date}</span>
                  <span className="text-slate-500">{count}개</span>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
