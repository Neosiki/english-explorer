'use client';

import { useEffect, useMemo, useState } from 'react';
import { scenes } from '@/data/scenes';
import { speak } from '@/lib/speech';
import { authConfigured, currentUser, dueNow, getSupabase, loadReviewStates, makeQuiz, mergeLocalReviewStates, scheduleReview, sendMagicLink, signInWithGoogle, signOut, saveReviewState, type QuizQuestion, type ReviewRating, type ReviewState } from '@/lib/review';

const items = scenes.flatMap((scene) => scene.hotspots);
const ratingLabels: Record<ReviewRating, string> = { again: '다시', hard: '어려움', good: '알겠음', easy: '쉬움' };

type Recognition = { lang: string; interimResults: boolean; onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null; onerror: (() => void) | null; start: () => void };

type WindowSpeech = Window & { SpeechRecognition?: new () => Recognition; webkitSpeechRecognition?: new () => Recognition };

export default function UpgradeDashboard() {
  const [tab, setTab] = useState<'review' | 'quiz' | 'dashboard'>('review');
  const [states, setStates] = useState<ReviewState[]>([]);
  const [email, setEmail] = useState('');
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [transcript, setTranscript] = useState('');
  const [installPrompt, setInstallPrompt] = useState<Event & { prompt?: () => Promise<void> } | null>(null);

  const refresh = async () => {
    const user = await currentUser();
    if (user) await mergeLocalReviewStates(user);
    const nextStates = await loadReviewStates();
    setStates(nextStates);
    setUserEmail(user?.email ?? null);
    setQuiz(makeQuiz(items, nextStates));
  };

  useEffect(() => {
    refresh();
    if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js').catch(() => undefined);
    const client = getSupabase();
    const subscription = client?.auth.onAuthStateChange(() => refresh());
    const onInstall = (event: Event) => { event.preventDefault?.(); setInstallPrompt(event as Event & { prompt?: () => Promise<void> }); };
    window.addEventListener('beforeinstallprompt', onInstall);
    return () => { subscription?.data.subscription.unsubscribe(); window.removeEventListener('beforeinstallprompt', onInstall); };
  }, []);

  const dueItems = useMemo(() => items.filter((item) => { const state = states.find((row) => row.item_id === item.id); return !state || dueNow(state); }), [states]);
  const learned = states.filter((state) => state.repetitions > 0).length;
  const currentQuestion = quiz[quizIndex];

  const rate = async (itemId: string, rating: ReviewRating) => {
    const next = scheduleReview(states.find((state) => state.item_id === itemId) || { item_id: itemId, due_at: new Date().toISOString(), interval_days: 0, ease_factor: 2.5, repetitions: 0, lapses: 0 }, rating);
    next.item_id = itemId;
    await saveReviewState(next, rating);
    await refresh();
    setMessage(`${ratingLabels[rating]}로 기록했습니다. 다음 복습일이 예약되었습니다.`);
  };

  const loginMagic = async () => {
    if (!email.includes('@')) { setMessage('이메일 주소를 입력해 주세요.'); return; }
    try { await sendMagicLink(email); setMessage('로그인 링크를 이메일로 보냈습니다. 메일의 링크를 눌러 돌아오세요.'); } catch (error) { setMessage(error instanceof Error ? error.message : '로그인 요청에 실패했습니다.'); }
  };

  const loginGoogle = async () => {
    try { await signInWithGoogle(); } catch (error) { setMessage(error instanceof Error ? error.message : 'Google 로그인 설정을 확인해 주세요.'); }
  };

  const startSpeaking = () => {
    const SpeechRecognition = (window as WindowSpeech).SpeechRecognition || (window as WindowSpeech).webkitSpeechRecognition;
    if (!SpeechRecognition) { setMessage('이 브라우저는 음성 인식을 지원하지 않습니다. 듣기 연습은 계속 사용할 수 있습니다.'); return; }
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US'; recognition.interimResults = false;
    recognition.onresult = (event) => setTranscript(event.results[0][0].transcript);
    recognition.onerror = () => setMessage('마이크 권한 또는 브라우저 음성 인식 설정을 확인해 주세요.');
    recognition.start();
    setMessage('문장을 영어로 말해 보세요.');
  };

  return <section aria-labelledby="upgrade-title" className="mx-auto max-w-6xl px-4 pb-16 pt-8">
    <div className="rounded-3xl border border-indigo-100 bg-white p-5 shadow-xl shadow-indigo-100/40 sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div><p className="text-xs font-black uppercase tracking-[0.2em] text-indigo-500">P1 Upgrade Lab</p><h2 id="upgrade-title" className="mt-2 text-3xl font-black tracking-tight text-slate-900">내 복습실</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">기존 3D 탐험과 문장 모드는 그대로 두고, 복습 예약·회상 퀴즈·계정 동기화·말하기 연습을 추가한 고도화 영역입니다.</p></div>
        <div className="rounded-2xl bg-indigo-50 px-4 py-3 text-sm text-indigo-800"><b>{dueItems.length}</b>개 복습 예정 · <b>{learned}</b>개 숙련 시작</div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2" role="tablist" aria-label="고도화 학습 기능"><button onClick={() => setTab('review')} className={`rounded-full px-4 py-2 text-sm font-bold ${tab === 'review' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}>오늘 복습</button><button onClick={() => setTab('quiz')} className={`rounded-full px-4 py-2 text-sm font-bold ${tab === 'quiz' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}>회상 퀴즈</button><button onClick={() => setTab('dashboard')} className={`rounded-full px-4 py-2 text-sm font-bold ${tab === 'dashboard' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}>학습 대시보드</button></div>

      {tab === 'review' && <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{dueItems.slice(0, 9).map((item) => <article key={item.id} className="rounded-2xl border border-slate-200 p-4"><div className="flex items-start justify-between gap-3"><div><h3 className="text-lg font-black text-slate-900">{item.word}</h3><p className="text-sm text-slate-500">{item.korean} · {item.ipa}</p></div><button aria-label={`${item.word} 발음 듣기`} onClick={() => speak(item.word)} className="rounded-full bg-indigo-50 px-3 py-2 text-lg">🔊</button></div><p className="mt-3 text-sm text-slate-700">{item.example}</p><p className="text-xs text-slate-400">{item.exampleKo}</p><div className="mt-4 grid grid-cols-4 gap-1">{(['again', 'hard', 'good', 'easy'] as ReviewRating[]).map((rating) => <button key={rating} onClick={() => rate(item.id, rating)} className="rounded-lg bg-slate-100 px-1 py-2 text-[11px] font-bold text-slate-600 hover:bg-lime-200">{ratingLabels[rating]}</button>)}</div></article>)}{!dueItems.length && <div className="rounded-2xl bg-lime-50 p-5 text-sm text-lime-900 sm:col-span-2 lg:col-span-3">오늘 복습할 항목이 없습니다. 3D 장면에서 단어를 학습하거나 퀴즈를 진행하면 다음 복습 일정이 생성됩니다.</div>}</div>}

      {tab === 'quiz' && <div className="mt-6 rounded-2xl bg-slate-950 p-5 text-white sm:p-7">{currentQuestion ? <><div className="flex items-center justify-between text-xs text-slate-400"><span>회상 퀴즈 {quizIndex + 1} / {quiz.length}</span><span>점수 {quizScore}</span></div><h3 className="mt-8 text-3xl font-black">{currentQuestion.prompt}</h3><p className="mt-2 text-sm text-slate-400">뜻을 기억해서 선택해 보세요.</p><div className="mt-6 grid gap-2 sm:grid-cols-2">{currentQuestion.choices.map((choice) => <button key={choice} onClick={async () => { const correct = choice === currentQuestion.answer; if (correct) setQuizScore((score) => score + 1); await rate(currentQuestion.itemId, correct ? 'good' : 'again'); setTranscript(''); setQuizIndex((index) => index + 1); }} className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-left font-bold hover:border-cyan-400">{choice}</button>)}</div><div className="mt-6 flex flex-wrap items-center gap-3"><button onClick={() => speak(items.find((item) => item.id === currentQuestion.itemId)?.example || '')} className="rounded-full bg-cyan-400 px-4 py-2 text-sm font-black text-slate-950">문장 듣기</button><button onClick={startSpeaking} className="rounded-full bg-lime-300 px-4 py-2 text-sm font-black text-slate-950">따라 말하기</button>{transcript && <span className="text-sm text-slate-300">인식 결과: {transcript}</span>}</div></> : <div><h3 className="text-2xl font-black">퀴즈 완료</h3><p className="mt-2 text-slate-300">오늘 점수 {quizScore}점입니다. 다시 복습하려면 버튼을 누르세요.</p><button onClick={() => { setQuizIndex(0); setQuizScore(0); setQuiz(makeQuiz(items, states)); }} className="mt-5 rounded-full bg-lime-300 px-4 py-2 font-black text-slate-950">새 퀴즈 시작</button></div>}</div>}

      {tab === 'dashboard' && <div className="mt-6 grid gap-4 sm:grid-cols-3"><div className="rounded-2xl bg-indigo-50 p-5"><p className="text-xs font-bold text-indigo-500">학습 항목</p><strong className="mt-2 block text-3xl font-black text-indigo-950">{items.length}</strong><p className="mt-1 text-xs text-indigo-700">전체 단어·장면 항목</p></div><div className="rounded-2xl bg-lime-50 p-5"><p className="text-xs font-bold text-lime-700">복습 예약</p><strong className="mt-2 block text-3xl font-black text-lime-950">{states.length}</strong><p className="mt-1 text-xs text-lime-800">개별 간격 반복 상태</p></div><div className="rounded-2xl bg-amber-50 p-5"><p className="text-xs font-bold text-amber-700">로그인 상태</p><strong className="mt-2 block truncate text-lg font-black text-amber-950">{userEmail || '체험 모드'}</strong><p className="mt-1 text-xs text-amber-800">{userEmail ? '기기 간 동기화 가능' : '현재 기기에 임시 저장'}</p></div></div>}

      <div className="mt-7 rounded-2xl border border-slate-200 bg-slate-50 p-4"><div className="flex flex-wrap items-center justify-between gap-3"><div><h3 className="font-black text-slate-900">계정·동기화</h3><p className="text-xs text-slate-500">{userEmail ? `${userEmail}로 로그인됨` : '로그인 전에는 이 기기에만 복습 상태가 저장됩니다.'}</p></div>{userEmail ? <button onClick={async () => { await signOut(); await refresh(); }} className="rounded-full bg-slate-900 px-4 py-2 text-xs font-bold text-white">로그아웃</button> : <div className="flex flex-wrap gap-2"><input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="이메일 주소" type="email" className="w-44 rounded-full border border-slate-300 px-3 py-2 text-xs" aria-label="로그인 이메일"/><button disabled={!authConfigured} onClick={loginMagic} className="rounded-full bg-indigo-600 px-4 py-2 text-xs font-bold text-white disabled:cursor-not-allowed disabled:opacity-40">매직 링크</button><button disabled={!authConfigured} onClick={loginGoogle} className="rounded-full bg-white px-4 py-2 text-xs font-bold text-slate-700 ring-1 ring-slate-300 disabled:cursor-not-allowed disabled:opacity-40">Google</button></div>}</div>{!authConfigured && <p className="mt-2 text-[11px] text-amber-700">Supabase 환경 변수가 비어 있어 현재는 체험 모드입니다. `.env.local`을 설정하면 로그인과 클라우드 동기화가 활성화됩니다.</p>}{message && <p role="status" className="mt-3 text-xs font-bold text-indigo-700">{message}</p>}</div>

      {installPrompt && <button onClick={async () => { await installPrompt.prompt?.(); setInstallPrompt(null); }} className="mt-4 w-full rounded-2xl bg-lime-300 px-4 py-3 text-sm font-black text-slate-900">이 앱을 스마트폰 홈 화면에 설치하기</button>}
    </div>
  </section>;
}
