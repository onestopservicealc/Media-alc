import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!url || !anonKey) {
  // แจ้งเตือนชัดเจนถ้ายังไม่ได้ตั้งค่า .env.local
  throw new Error('ยังไม่ได้ตั้งค่า VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY (ดู .env.example)');
}

export const supabase = createClient(url, anonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true, // รับ session กลับจาก OAuth redirect
    flowType: 'pkce',
  },
});
