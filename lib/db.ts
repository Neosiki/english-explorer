'use client';

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// ---------------------------------------------------------------------------
// STEP 04. 온라인 DB 연동하기
//
// .env.local에 NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY를
// 채워넣기 전까지는 이 브라우저의 localStorage에만 학습 기록이 저장됩니다.
// 값을 채우면 자동으로 Supabase(클라우드 DB)로 전환됩니다.
// ---------------------------------------------------------------------------
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

let client: SupabaseClient | null = null;
function getClient(): SupabaseClient | null {
  if (!isSupabaseConfigured) return null;
  if (!client) client = createClient(SUPABASE_URL as string, SUPABASE_ANON_KEY as string);
  return client;
}

export interface ProgressRecord {
  hotspot_id: string;
  studied_on: string; // YYYY-MM-DD
}

function getUserId(): string {
  if (typeof window === 'undefined') return '';
  let id = localStorage.getItem('explorer_user_id');
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem('explorer_user_id', id);
  }
  return id;
}

export function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

export async function saveProgress(hotspotId: string): Promise<void> {
  const studiedOn = todayStr();
  const db = getClient();
  if (db) {
    await db.from('progress').insert({
      user_id: getUserId(),
      hotspot_id: hotspotId,
      studied_on: studiedOn,
    });
    return;
  }
  if (typeof window === 'undefined') return;
  const data: ProgressRecord[] = JSON.parse(localStorage.getItem('explorer_progress') || '[]');
  data.push({ hotspot_id: hotspotId, studied_on: studiedOn });
  localStorage.setItem('explorer_progress', JSON.stringify(data));
}

export async function loadProgress(): Promise<ProgressRecord[]> {
  const db = getClient();
  if (db) {
    const { data, error } = await db
      .from('progress')
      .select('hotspot_id, studied_on')
      .eq('user_id', getUserId())
      .order('studied_on', { ascending: false });
    if (error) {
      console.error('Supabase 조회 실패:', error.message);
      return [];
    }
    return data as ProgressRecord[];
  }
  if (typeof window === 'undefined') return [];
  return JSON.parse(localStorage.getItem('explorer_progress') || '[]');
}

export function computeStreak(records: ProgressRecord[]): number {
  const days = new Set(records.map((r) => r.studied_on));
  let streak = 0;
  const cursor = new Date();
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const key = cursor.toISOString().slice(0, 10);
    if (!days.has(key)) break;
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}
