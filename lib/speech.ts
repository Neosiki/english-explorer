'use client';

let voiceCache: SpeechSynthesisVoice[] = [];
let lastUtterance: SpeechSynthesisUtterance | null = null;
let unlocked = false;
let keepAliveTimer: ReturnType<typeof setInterval> | null = null;

function refreshVoices() {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  voiceCache = window.speechSynthesis.getVoices();
}

function pickEnglishVoice(): SpeechSynthesisVoice | null {
  if (!voiceCache.length) return null;
  return (
    voiceCache.find((v) => v.lang === 'en-US') ||
    voiceCache.find((v) => v.lang?.startsWith('en')) ||
    null
  );
}

function ensureKeepAlive() {
  // Chrome (desktop and Android) silently pauses speech synthesis after
  // ~15s of continuous use; nudging pause/resume keeps it alive. No-op
  // the rest of the time.
  if (keepAliveTimer || typeof window === 'undefined') return;
  keepAliveTimer = setInterval(() => {
    const synth = window.speechSynthesis;
    if (synth.speaking && !synth.paused) {
      synth.pause();
      synth.resume();
    }
  }, 4000);
}

function unlockOnce() {
  if (unlocked || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  unlocked = true;
  // iOS Safari only allows audio from the first speechSynthesis call made
  // inside a real user gesture; a silent warm-up utterance here unlocks
  // every call that follows, including ones triggered later from React state updates.
  const warm = new SpeechSynthesisUtterance(' ');
  warm.volume = 0;
  window.speechSynthesis.speak(warm);
}

export function initSpeech() {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  refreshVoices();
  window.speechSynthesis.onvoiceschanged = refreshVoices;
  ensureKeepAlive();
  window.addEventListener('pointerdown', unlockOnce, { once: true });
}

export function speak(text: string, onError?: () => void) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    onError?.();
    return;
  }
  const synth = window.speechSynthesis;
  synth.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  utterance.rate = 0.85;
  const voice = pickEnglishVoice();
  if (voice) utterance.voice = voice;
  utterance.onerror = () => onError?.();
  // Safari can silently drop utterances with no other live reference to them.
  lastUtterance = utterance;
  synth.speak(utterance);
}
