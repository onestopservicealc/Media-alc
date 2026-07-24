-- =============================================================================
-- Media-alc — GRANT สิทธิ์ระดับตารางให้ role anon / authenticated
-- -----------------------------------------------------------------------------
-- PostgREST เข้าถึงตารางต้องผ่าน 2 ชั้น: (1) GRANT ให้ role ก่อน แล้ว (2) RLS กรองแถว
-- ไฟล์นี้เติมชั้น (1) ที่ขาดไป — RLS policy ใน 0002 ยังคุมสิทธิ์รายแถวเหมือนเดิม
-- วิธีใช้: Supabase dashboard → SQL Editor → วางทั้งไฟล์ → Run
-- =============================================================================

grant usage on schema public to anon, authenticated;

-- อ่าน catalog + systems (ประชาชน/ทุกคน) — RLS ยังกรอง is_archived อยู่
grant select on public.media_materials to anon, authenticated;
grant select on public.systems         to anon, authenticated;

-- จัดการ catalog/systems — RLS จำกัดเฉพาะ is_staff() อยู่แล้ว
grant insert, update, delete on public.media_materials to authenticated;
grant insert, update, delete on public.systems         to authenticated;

-- คำขอ: อ่าน (ของตัวเอง/staff ตาม RLS) + staff อัปเดตสถานะ
-- (insert ทำผ่าน RPC submit_request ซึ่งเป็น security definer จึงไม่ต้อง grant insert)
grant select, update on public.requests     to authenticated;
grant select        on public.request_items to authenticated;

-- staff: ไม่ต้อง grant — เข้าถึงผ่านฟังก์ชัน is_staff() (security definer) เท่านั้น
