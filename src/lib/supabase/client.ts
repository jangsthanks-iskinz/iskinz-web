'use client'
import { createBrowserClient } from '@supabase/ssr'

// 클라이언트 컴포넌트에서 사용하는 Supabase 클라이언트 (싱글턴)
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) throw new Error('Supabase env vars not set — add them to .env.local')
  return createBrowserClient(url, key)
}
