-- =============================================================================
-- Media-alc — schema เริ่มต้น (เตรียมไว้สำหรับตอนต่อ Supabase)
-- ที่มา: src/types.ts  |  รันด้วย: supabase db push  หรือผ่าน SQL editor
-- =============================================================================

-- สถานะคำขอ (คงค่าเป็นภาษาไทยเพื่อไม่ต้องแก้ src/lib/ui.ts และ logic เดิม)
create type request_status as enum ('รอการอนุมัติ', 'กำลังจัดส่ง', 'เสร็จสิ้น');

-- ---------------------------------------------------------------- media_materials
create table media_materials (
  id              text primary key default gen_random_uuid()::text, -- คง 'mat-001' เดิมได้
  title           text        not null,
  category        text        not null,
  description     text        not null,
  max_allowed     int         not null default 50 check (max_allowed between 1 and 50),
  available_stock int         not null default 0  check (available_stock >= 0),
  image_url       text,                          -- URL รูปพรีวิว (public bucket 'media-previews')
  is_archived     boolean     not null default false, -- soft delete
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- ---------------------------------------------------------------- requests
create sequence req_ref_seq start 4822;

create table requests (
  id               uuid primary key default gen_random_uuid(),
  ref_number       text        unique not null,   -- ALC-{ปีพ.ศ.}-#### สร้างใน RPC
  full_name        text        not null,
  agency_name      text        not null,
  phone_number     text        not null,
  required_date    date        not null,
  shipping_address text        not null,
  purpose          text        not null,
  status           request_status not null default 'รอการอนุมัติ',
  tracking_token   uuid        not null default gen_random_uuid(), -- "คำขอของฉัน" แบบไม่ต้อง login
  submitted_at     timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
create index requests_status_idx on requests (status);
create index requests_token_idx  on requests (tracking_token);

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
create or replace function submit_request(payload jsonb)
returns table (id uuid, ref_number text, tracking_token uuid, submitted_at timestamptz)
language plpgsql security definer as $$
declare
  new_id uuid; new_ref text; item jsonb;
begin
  new_ref := 'ALC-' || (extract(year from now())::int + 543)
             || '-' || lpad(nextval('req_ref_seq')::text, 4, '0');

  insert into requests (ref_number, full_name, agency_name, phone_number,
                        required_date, shipping_address, purpose)
  values (new_ref, payload->>'fullName', payload->>'agencyName', payload->>'phoneNumber',
          (payload->>'requiredDate')::date, payload->>'shippingAddress', payload->>'purpose')
  returning requests.id, requests.tracking_token, requests.submitted_at
    into new_id, submit_request.tracking_token, submit_request.submitted_at;

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
returns void language plpgsql security invoker as $$
begin
  update requests set status = new_status where id = req_id;
end $$;

-- ---------------------------------------------------------------- RPC: ดึงคำขอตาม token (anon)
create or replace function get_requests_by_token(tokens uuid[])
returns setof requests language sql security definer stable as $$
  select * from requests where tracking_token = any(tokens) order by submitted_at desc;
$$;
