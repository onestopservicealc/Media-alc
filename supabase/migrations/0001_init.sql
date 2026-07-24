-- =============================================================================
-- Media-alc — schema + auth model (Supabase)
-- ที่มา: src/types.ts  |  รันใน Supabase SQL editor หรือ supabase db push
-- =============================================================================

-- สถานะคำขอ (คงค่าเป็นภาษาไทยเพื่อไม่ต้องแก้ src/lib/ui.ts และ logic เดิม)
create type request_status as enum ('รอการอนุมัติ', 'กำลังจัดส่ง', 'เสร็จสิ้น');

-- ---------------------------------------------------------------- staff (allowlist แอดมิน)
-- เจ้าหน้าที่ = อีเมล Google ที่อยู่ในตารางนี้เท่านั้น (seed ด้วย scripts/seed.ts)
create table staff (
  email      text primary key,
  role       text not null default 'admin',
  created_at timestamptz not null default now()
);

-- ตรวจว่าผู้ใช้ที่ล็อกอินอยู่เป็นเจ้าหน้าที่หรือไม่ (อ่านอีเมลจาก JWT)
-- security definer → เช็คได้โดยไม่ต้องเปิด SELECT ตาราง staff ให้ client
create or replace function is_staff() returns boolean
language sql security definer stable set search_path = public as $$
  select exists (select 1 from staff where email = auth.jwt() ->> 'email');
$$;

-- ---------------------------------------------------------------- media_materials
create table media_materials (
  id              text primary key default gen_random_uuid()::text, -- คง 'mat-001' เดิมได้
  title           text        not null,
  category        text        not null,
  description     text        not null,
  max_allowed     int         not null default 50 check (max_allowed between 1 and 50),
  available_stock int         not null default 0  check (available_stock >= 0),
  image_url       text,                          -- public URL ของ bucket 'media-previews'
  is_archived     boolean     not null default false, -- soft delete
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- ---------------------------------------------------------------- requests
create sequence req_ref_seq start 4822;

create table requests (
  id               uuid primary key default gen_random_uuid(),
  ref_number       text        unique not null,   -- ALC-{ปีพ.ศ.}-#### สร้างใน RPC
  user_id          uuid        not null references auth.users(id) on delete cascade, -- เจ้าของคำขอ
  full_name        text        not null,
  agency_name      text        not null,
  phone_number     text        not null,
  required_date    date        not null,
  shipping_address text        not null,
  purpose          text        not null,
  status           request_status not null default 'รอการอนุมัติ',
  submitted_at     timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
create index requests_status_idx on requests (status);
create index requests_user_idx   on requests (user_id);

-- ---------------------------------------------------------------- request_items
create table request_items (
  id          bigint generated always as identity primary key,
  request_id  uuid not null references requests(id)        on delete cascade,
  material_id text not null references media_materials(id)  on delete restrict,
  quantity    int  not null check (quantity between 1 and 50),
  unique (request_id, material_id)
);

-- ---------------------------------------------------------------- systems (ลิงก์ระบบอื่น)
create table systems (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  url         text not null,
  description text not null,
  category    text not null,
  icon        text not null,
  image_url   text,
  sort_order  int  not null default 0
);

-- ---------------------------------------------------------------- updated_at trigger
create or replace function set_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

create trigger media_materials_updated before update on media_materials
  for each row execute function set_updated_at();
create trigger requests_updated before update on requests
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------- RPC: ส่งคำขอ + ตัด stock (atomic)
-- ผูกคำขอกับ user ที่ล็อกอิน (auth.uid()); ต้อง authenticated เท่านั้น
create or replace function submit_request(payload jsonb)
returns table (id uuid, ref_number text, submitted_at timestamptz)
language plpgsql security definer set search_path = public as $$
declare
  uid uuid := auth.uid();
  new_id uuid; new_ref text; item jsonb;
begin
  if uid is null then
    raise exception 'AUTH_REQUIRED';
  end if;

  new_ref := 'ALC-' || (extract(year from now())::int + 543)
             || '-' || lpad(nextval('req_ref_seq')::text, 4, '0');

  insert into requests (ref_number, user_id, full_name, agency_name, phone_number,
                        required_date, shipping_address, purpose)
  values (new_ref, uid, payload->>'fullName', payload->>'agencyName', payload->>'phoneNumber',
          (payload->>'requiredDate')::date, payload->>'shippingAddress', payload->>'purpose')
  returning requests.id, requests.submitted_at
    into new_id, submit_request.submitted_at;

  for item in select * from jsonb_array_elements(payload->'selectedMaterials') loop
    update media_materials
       set available_stock = available_stock - (item->>'quantity')::int
     where media_materials.id = item->>'materialId'
       and available_stock >= (item->>'quantity')::int
       and (item->>'quantity')::int <= max_allowed;
    if not found then
      raise exception 'INSUFFICIENT_STOCK_OR_LIMIT:%', item->>'materialId';
    end if;
    insert into request_items (request_id, material_id, quantity)
      values (new_id, item->>'materialId', (item->>'quantity')::int);
  end loop;

  id := new_id; ref_number := new_ref; return next;
end $$;

-- ---------------------------------------------------------------- RPC: เปลี่ยนสถานะ (staff เท่านั้น)
create or replace function set_request_status(req_id uuid, new_status request_status)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not is_staff() then
    raise exception 'FORBIDDEN';
  end if;
  update requests set status = new_status where id = req_id;
end $$;
