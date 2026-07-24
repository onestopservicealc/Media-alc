-- =============================================================================
-- Media-alc — Row Level Security
-- แนวคิด: default-deny ทุกตาราง แล้วเปิดสิทธิ์เท่าที่จำเป็น
--   ประชาชน (authenticated ทั่วไป): ดู catalog/systems, ส่ง/ดูคำขอ "ของตัวเอง"
--   เจ้าหน้าที่ (is_staff()): จัดการ catalog + ดู/อัปเดตคำขอทั้งหมด
--   anon (ยังไม่ login): ดู catalog/systems ได้อย่างเดียว
-- =============================================================================

alter table staff           enable row level security;  -- ไม่มี policy = เข้าถึงตรงไม่ได้ (ใช้ผ่าน is_staff() เท่านั้น)
alter table media_materials enable row level security;
alter table systems         enable row level security;
alter table requests        enable row level security;
alter table request_items   enable row level security;

-- ---------------------------------------------------------------- media_materials
create policy media_public_read on media_materials
  for select to anon, authenticated using (is_archived = false or is_staff());
create policy media_staff_write on media_materials
  for all to authenticated using (is_staff()) with check (is_staff());

-- ---------------------------------------------------------------- systems
create policy systems_public_read on systems
  for select to anon, authenticated using (true);
create policy systems_staff_write on systems
  for all to authenticated using (is_staff()) with check (is_staff());

-- ---------------------------------------------------------------- requests
-- insert ทำผ่าน submit_request() (security definer) เท่านั้น
create policy requests_owner_read on requests
  for select to authenticated using (user_id = auth.uid() or is_staff());
create policy requests_staff_update on requests
  for update to authenticated using (is_staff()) with check (is_staff());

-- ---------------------------------------------------------------- request_items
create policy request_items_read on request_items
  for select to authenticated using (
    exists (
      select 1 from requests r
      where r.id = request_items.request_id
        and (r.user_id = auth.uid() or is_staff())
    )
  );

-- ---------------------------------------------------------------- grant execute ให้ RPC
grant execute on function submit_request(jsonb)                    to authenticated;
grant execute on function set_request_status(uuid, request_status) to authenticated;
grant execute on function is_staff()                               to authenticated;

-- ---------------------------------------------------------------- table privileges
-- PostgREST ต้องมี GRANT ระดับตารางก่อน RLS ถึงจะทำงาน (RLS กรองแถวหลังจากนั้น)
grant usage on schema public to anon, authenticated;
grant select                     on public.media_materials to anon, authenticated;
grant insert, update, delete     on public.media_materials to authenticated;
grant select                     on public.systems         to anon, authenticated;
grant insert, update, delete     on public.systems         to authenticated;
grant select, update             on public.requests        to authenticated;
grant select                     on public.request_items   to authenticated;
-- staff: ไม่ grant — เข้าถึงผ่าน is_staff() (security definer) เท่านั้น
-- requests/request_items insert: ผ่าน RPC submit_request (definer) จึงไม่ต้อง grant insert

-- ---------------------------------------------------------------- Storage: bucket 'media-previews'
-- (สร้าง bucket แบบ public ใน dashboard ก่อน) — จำกัดสิทธิ์ upload/แก้/ลบ ให้ staff
create policy media_previews_public_read on storage.objects
  for select to anon, authenticated using (bucket_id = 'media-previews');
create policy media_previews_staff_write on storage.objects
  for insert to authenticated with check (bucket_id = 'media-previews' and is_staff());
create policy media_previews_staff_update on storage.objects
  for update to authenticated using (bucket_id = 'media-previews' and is_staff());
create policy media_previews_staff_delete on storage.objects
  for delete to authenticated using (bucket_id = 'media-previews' and is_staff());
