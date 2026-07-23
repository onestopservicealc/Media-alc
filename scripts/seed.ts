/**
 * Seed สื่อ 21 รายการ + ลิงก์ระบบ 8 อัน จากไฟล์ข้อมูลเดิมเข้า Supabase
 * -----------------------------------------------------------------------------
 * เตรียมไว้สำหรับตอนต่อ Supabase (ยังไม่ใช้ในเฟส localStorage)
 * ต้องติดตั้งก่อน:  npm i -D @supabase/supabase-js
 * รันด้วย:         SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npx tsx scripts/seed.ts
 * ใช้ service-role key ฝั่ง local เท่านั้น — ห้าม commit / ห้าม ship
 */
import { createClient } from '@supabase/supabase-js';
import { INITIAL_MEDIA_MATERIALS } from '../src/data/mediaCatalog';
import { SYSTEMS } from '../src/data/systems';

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) throw new Error('ต้องตั้ง SUPABASE_URL และ SUPABASE_SERVICE_ROLE_KEY');

const db = createClient(url, key, { auth: { persistSession: false } });

async function main() {
  const materials = INITIAL_MEDIA_MATERIALS.map(m => ({
    id: m.id,
    title: m.title,
    category: m.category,
    description: m.description,
    max_allowed: m.maxAllowed,
    available_stock: m.availableStock ?? 0,
    image_url: m.imageUrl ?? null,
    file_size: m.fileSize ?? null,
    file_type: m.fileType ?? null,
  }));
  const { error: e1 } = await db.from('media_materials').upsert(materials, { onConflict: 'id' });
  if (e1) throw e1;
  console.log(`seeded ${materials.length} media_materials`);

  const systems = SYSTEMS.map((s, i) => ({
    name: s.name, url: s.url, description: s.desc, category: s.cat,
    icon: s.icon, image_url: s.imageUrl ?? null, sort_order: i,
  }));
  const { error: e2 } = await db.from('systems').insert(systems);
  if (e2) throw e2;
  console.log(`seeded ${systems.length} systems`);
}

main().then(() => process.exit(0)).catch(err => { console.error(err); process.exit(1); });
