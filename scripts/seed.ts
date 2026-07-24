/**
 * Seed: รายชื่อเจ้าหน้าที่ (allowlist) + ลิงก์ระบบราชการ เข้า Supabase
 * -----------------------------------------------------------------------------
 * ต้องติดตั้งก่อน:  npm i (มี @supabase/supabase-js แล้ว)
 * รันด้วย:
 *   SUPABASE_URL=https://xxxx.supabase.co \
 *   SUPABASE_SERVICE_ROLE_KEY=... \
 *   npx tsx scripts/seed.ts
 * ใช้ service-role key ฝั่ง local เท่านั้น — ห้าม commit / ห้าม ship
 *
 * แก้ ADMIN_EMAILS ให้เป็นอีเมล Google ของเจ้าหน้าที่จริงก่อนรัน
 */
import { createClient } from '@supabase/supabase-js';
import { SYSTEMS } from '../src/data/systems';

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) throw new Error('ต้องตั้ง SUPABASE_URL และ SUPABASE_SERVICE_ROLE_KEY');

const db = createClient(url, key, { auth: { persistSession: false } });

// >>> แก้รายชื่ออีเมลแอดมินที่อนุญาตให้เข้า Backoffice ที่นี่ <<<
const ADMIN_EMAILS = [
  'webex.alc@ddc.mail.go.th',
  // 'someone.else@ddc.mail.go.th',
];

async function main() {
  const staff = ADMIN_EMAILS.map(email => ({ email, role: 'admin' }));
  const { error: e0 } = await db.from('staff').upsert(staff, { onConflict: 'email' });
  if (e0) throw e0;
  console.log(`seeded ${staff.length} staff (allowlist)`);

  const systems = SYSTEMS.map((s, i) => ({
    name: s.name, url: s.url, description: s.desc, category: s.cat,
    icon: s.icon, image_url: s.imageUrl ?? null, sort_order: i,
  }));
  const { error: e2 } = await db.from('systems').insert(systems);
  if (e2) throw e2;
  console.log(`seeded ${systems.length} systems`);
}

main().then(() => process.exit(0)).catch(err => { console.error(err); process.exit(1); });
