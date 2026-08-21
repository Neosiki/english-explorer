import { createClient, type SupabaseClient, type User } from '@supabase/supabase-js';
import type { Hotspot } from '@/data/scenes';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const authConfigured = Boolean(url && anonKey);
let supabase: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (!authConfigured) return null;
  if (!supabase) supabase = createClient(url as string, anonKey as string);
  return supabase;
}

export type ReviewRating = 'again' | 'hard' | 'good' | 'easy';

export interface ReviewState {
  item_id: string;
  user_id?: string;
  due_at: string;
  interval_days: number;
  ease_factor: number;
  repetitions: number;
  lapses: number;
  last_rating?: ReviewRating;
  updated_at?: string;
}

export interface QuizQuestion {
  itemId: string;
  prompt: string;
  answer: string;
  choices: string[];
  type: 'meaning' | 'sentence';
}

const LOCAL_KEY = 'english_explorer_review_state_v2';

function loadLocal(): ReviewState[] {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]'); } catch { return []; }
}

function saveLocal(rows: ReviewState[]) {
  if (typeof window !== 'undefined') localStorage.setItem(LOCAL_KEY, JSON.stringify(rows));
}

export function dueNow(row: ReviewState, now = new Date()) {
  return new Date(row.due_at).getTime() <= now.getTime();
}

export function scheduleReview(previous: ReviewState | undefined, rating: ReviewRating, now = new Date()): ReviewState {
  const base = previous || { item_id: '', due_at: now.toISOString(), interval_days: 0, ease_factor: 2.5, repetitions: 0, lapses: 0 };
  const intervals: Record<ReviewRating, number> = { again: 0.25, hard: Math.max(1, base.interval_days * 1.2), good: base.repetitions < 1 ? 1 : Math.max(2, base.interval_days * base.ease_factor), easy: base.repetitions < 1 ? 3 : Math.max(4, base.interval_days * base.ease_factor * 1.35) };
  const interval = intervals[rating];
  const ease = Math.min(3.1, Math.max(1.3, base.ease_factor + (rating === 'easy' ? 0.15 : rating === 'hard' ? -0.12 : rating === 'again' ? -0.2 : 0)));
  return { ...base, due_at: new Date(now.getTime() + interval * 86400000).toISOString(), interval_days: Number(interval.toFixed(2)), ease_factor: Number(ease.toFixed(2)), repetitions: rating === 'again' ? 0 : base.repetitions + 1, lapses: rating === 'again' ? base.lapses + 1 : base.lapses, last_rating: rating, updated_at: now.toISOString() };
}

export async function currentUser(): Promise<User | null> {
  const client = getSupabase();
  if (!client) return null;
  const { data } = await client.auth.getUser();
  return data.user ?? null;
}

export async function sendMagicLink(email: string, redirectTo?: string) {
  const client = getSupabase();
  if (!client) throw new Error('Supabase 환경 변수가 설정되지 않았습니다.');
  return client.auth.signInWithOtp({ email, options: { emailRedirectTo: redirectTo || window.location.origin } });
}

export async function signInWithGoogle(redirectTo?: string) {
  const client = getSupabase();
  if (!client) throw new Error('Supabase 환경 변수가 설정되지 않았습니다.');
  return client.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: redirectTo || window.location.origin } });
}

export async function signOut() {
  const client = getSupabase();
  if (client) await client.auth.signOut();
}

export async function loadReviewStates(): Promise<ReviewState[]> {
  const client = getSupabase();
  if (client) {
    const { data: authData } = await client.auth.getUser();
    if (authData.user) {
      const { data, error } = await client.from('explorer_review_state').select('*').order('due_at', { ascending: true });
      if (!error && data) return data as ReviewState[];
    }
  }
  return loadLocal();
}

export async function mergeLocalReviewStates(user: User) {
  const local = loadLocal();
  const client = getSupabase();
  if (!client || !local.length) return;
  const rows = local.map((state) => ({ ...state, user_id: user.id }));
  const { error } = await client.from('explorer_review_state').upsert(rows, { onConflict: 'user_id,item_id' });
  if (!error && typeof window !== 'undefined') localStorage.removeItem(LOCAL_KEY);
}

export async function saveReviewState(state: ReviewState, rating?: ReviewRating) {
  const client = getSupabase();
  if (client) {
    const { data: authData } = await client.auth.getUser();
    if (authData.user) {
      const { error } = await client.from('explorer_review_state').upsert({ ...state, user_id: authData.user.id }, { onConflict: 'user_id,item_id' });
      if (!error) {
        if (rating) await client.from('explorer_review_events').insert({ user_id: authData.user.id, item_id: state.item_id, rating });
        return;
      }
    }
  }
  const rows = loadLocal().filter((row) => row.item_id !== state.item_id);
  saveLocal([...rows, state]);
}

export function makeQuiz(items: Hotspot[], states: ReviewState[], limit = 5): QuizQuestion[] {
  const due = items.filter((item) => { const state = states.find((row) => row.item_id === item.id); return !state || dueNow(state); }).slice(0, limit);
  const meanings = items.map((item) => item.korean);
  return due.map((item, index) => {
    const distractors = meanings.filter((meaning) => meaning !== item.korean).sort(() => 0.5 - Math.random()).slice(0, 3);
    return { itemId: item.id, prompt: item.word, answer: item.korean, choices: [item.korean, ...distractors].sort((a, b) => (a === item.korean ? -1 : b === item.korean ? 1 : index % 2 ? a.localeCompare(b) : b.localeCompare(a))), type: 'meaning' };
  });
}
