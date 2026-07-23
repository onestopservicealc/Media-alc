-- =============================================================================
-- Media-alc — Row Level Security (เตรียมไว้สำหรับตอนต่อ Supabase)
-- แนวคิด: default-deny ทุกตาราง แล้วเปิดสิทธิ์เท่าที่จำเป็น
--   staff = authenticated user (ปิด public sign-up ใน Auth settings)
--   ประชาชน = anon: อ่าน catalog/systems ได้, ส่ง/ดูคำขอผ่าน RPC เท่านั้น
-- =============================================================================

alter table media_materials enable row level security;
alter table systems         enable row level security;
alter table requests        enable row level security;
alter table request_items   enable row level security;

-- ---------------------------------------------------------------- media_materials
create policy media_public_read on media_materials
  for select to anon using (is_archived = false);
create policy media_staff_read on media_materials
  for select to authenticated using (true);
create policy media_staff_write on media_materials
  for all to authenticated using (true) with check (true);

-- ---------------------------------------------------------------- systems
create policy systems_public_read on systems
  for select to anon, authenticated using (true);
create policy systems_staff_write on systems
  for all to authenticated using (true) with check (true);

-- ---------------------------------------------------------------- requests / request_items
-- anon ไม่มีสิทธิ์ตรง — ส่งผ่าน submit_request() และอ่านผ่าน get_requests_by_token()
-- (ทั้งคู่เป็น security definer จึง bypass RLS ได้อย่างควบคุม)
create policy requests_staff_all on requests
  for all to authenticated using (true) with check (true);
create policy request_items_staff_all on request_items
  for all to authenticated using (true) with check (true);

-- ---------------------------------------------------------------- grant execute ให้ RPC
grant execute on function submit_request(jsonb)        to anon, authenticated;
grant execute on function get_requests_by_token(uuid[]) to anon, authenticated;
grant execute on function set_request_status(uuid, request_status) to authenticated;
