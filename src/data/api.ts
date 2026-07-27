import { MediaMaterial, SubmittedRequest, SystemItem, MediaRequestForm } from '../types';
import { formatThaiDateTime } from '../lib/ui';
import { supabase } from '../lib/supabase';

/* =========================================================================
   Data-access layer (จุดเชื่อม / seam) ของทั้งแอป — backing = Supabase
   ทุกการอ่าน/เขียน + auth ผ่านไฟล์นี้ไฟล์เดียว
   ========================================================================= */

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
}

// ---------------------------------------------------------------- mappers (snake_case → โดเมน)

function mapMaterial(r: Record<string, unknown>): MediaMaterial {
  return {
    id: r.id as string,
    title: r.title as string,
    category: r.category as string,
    description: r.description as string,
    maxAllowed: r.max_allowed as number,
    availableStock: r.available_stock as number,
    imageUrl: (r.image_url as string | null) ?? undefined,
  };
}

function mapSystem(r: Record<string, unknown>): SystemItem {
  return {
    name: r.name as string,
    url: r.url as string,
    desc: r.description as string,
    cat: r.category as string,
    icon: r.icon as string,
    imageUrl: (r.image_url as string | null) ?? undefined,
  };
}

function mapRequest(r: Record<string, unknown>): SubmittedRequest {
  const items = (r.request_items as Array<Record<string, unknown>> | null) ?? [];
  const submittedAtISO = r.submitted_at as string;
  return {
    id: r.id as string,
    refNumber: r.ref_number as string,
    submittedAt: formatThaiDateTime(new Date(submittedAtISO)),
    submittedAtISO,
    fullName: r.full_name as string,
    agencyName: r.agency_name as string,
    phoneNumber: r.phone_number as string,
    requiredDate: r.required_date as string,
    shippingAddress: r.shipping_address as string,
    purpose: r.purpose as string,
    status: r.status as SubmittedRequest['status'],
    selectedMaterials: items.map(it => ({
      materialId: it.material_id as string,
      quantity: it.quantity as number,
    })),
  };
}

function mapUser(u: { id: string; email?: string; user_metadata?: Record<string, unknown> } | null | undefined): AuthUser | null {
  if (!u) return null;
  const meta = u.user_metadata ?? {};
  const email = u.email ?? '';
  return {
    id: u.id,
    email,
    name: (meta.full_name as string) || (meta.name as string) || email,
    avatarUrl: (meta.avatar_url as string) || (meta.picture as string) || undefined,
  };
}

const REQ_SELECT = '*, request_items(*)';

// ---------------------------------------------------------------- reads

export async function fetchCatalog(): Promise<MediaMaterial[]> {
  const { data, error } = await supabase
    .from('media_materials')
    .select('*')
    .eq('is_archived', false)
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map(mapMaterial);
}

export async function fetchSystems(): Promise<SystemItem[]> {
  const { data, error } = await supabase.from('systems').select('*').order('sort_order');
  if (error) throw new Error(error.message);
  return (data ?? []).map(mapSystem);
}

/** คำขอทั้งหมด (เจ้าหน้าที่เท่านั้น — RLS จะคืน [] ให้คนที่ไม่ใช่ staff) */
export async function fetchRequests(): Promise<SubmittedRequest[]> {
  const { data, error } = await supabase
    .from('requests')
    .select(REQ_SELECT)
    .order('submitted_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map(mapRequest);
}

/** คำขอของผู้ใช้ที่ล็อกอินอยู่ (ผูกกับบัญชี ข้ามเครื่องได้) */
export async function getMyRequests(): Promise<SubmittedRequest[]> {
  const { data: sess } = await supabase.auth.getSession();
  const uid = sess.session?.user.id;
  if (!uid) return [];
  const { data, error } = await supabase
    .from('requests')
    .select(REQ_SELECT)
    .eq('user_id', uid)
    .order('submitted_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map(mapRequest);
}

// ---------------------------------------------------------------- writes

/** ส่งคำขอ + ตัด stock แบบ atomic (ผ่าน RPC); ต้องล็อกอินก่อน */
export async function submitRequest(form: MediaRequestForm): Promise<SubmittedRequest> {
  const { data, error } = await supabase.rpc('submit_request', { payload: form });
  if (error) {
    const msg = error.message || '';
    if (msg.includes('AUTH_REQUIRED')) throw new Error('กรุณาเข้าสู่ระบบก่อนส่งคำขอ');
    if (msg.includes('INSUFFICIENT_STOCK_OR_LIMIT')) throw new Error('มีสื่อบางรายการคงคลังไม่พอหรือเกินจำนวนที่ขอได้');
    throw new Error(msg || 'ส่งคำขอไม่สำเร็จ');
  }
  const row = Array.isArray(data) ? data[0] : data;
  const submittedAtISO = row.submitted_at as string;
  return {
    ...form,
    id: row.id as string,
    refNumber: row.ref_number as string,
    submittedAt: formatThaiDateTime(new Date(submittedAtISO)),
    submittedAtISO,
    status: 'รอการอนุมัติ',
  };
}

export async function setRequestStatus(id: string, status: SubmittedRequest['status']): Promise<void> {
  const { error } = await supabase.rpc('set_request_status', { req_id: id, new_status: status });
  if (error) throw new Error(error.message);
}

/** เพิ่ม (mode='add') หรือแก้ไข (mode='edit') สื่อในคลัง */
export async function saveMaterial(mat: MediaMaterial, mode: 'add' | 'edit'): Promise<MediaMaterial> {
  const row = {
    title: mat.title,
    category: mat.category,
    description: mat.description,
    max_allowed: mat.maxAllowed,
    available_stock: mat.availableStock ?? 0,
    image_url: mat.imageUrl ?? null,
  };
  if (mode === 'edit') {
    const { data, error } = await supabase.from('media_materials').update(row).eq('id', mat.id).select().single();
    if (error) throw new Error(error.message);
    return mapMaterial(data);
  }
  const { data, error } = await supabase.from('media_materials').insert(row).select().single();
  if (error) throw new Error(error.message);
  return mapMaterial(data);
}

export async function archiveMaterial(id: string): Promise<void> {
  const { error } = await supabase.from('media_materials').update({ is_archived: true }).eq('id', id);
  if (error) throw new Error(error.message);
}

/** อัปโหลดรูปพรีวิวขึ้น bucket 'media-previews' แล้วคืน public URL */
export async function uploadImage(file: File): Promise<string> {
  if (!file.type.startsWith('image/')) throw new Error('กรุณาเลือกไฟล์รูปภาพ (jpg/png/webp)');
  const MAX_BYTES = 5 * 1024 * 1024;
  if (file.size > MAX_BYTES) throw new Error('ไฟล์รูปต้องไม่เกิน 5 MB');
  const ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
  const path = `${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from('media-previews').upload(path, file, {
    contentType: file.type,
    upsert: false,
  });
  if (error) throw new Error(error.message);
  const { data } = supabase.storage.from('media-previews').getPublicUrl(path);
  return data.publicUrl;
}

// ---------------------------------------------------------------- auth

export async function signInWithGoogle(): Promise<void> {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: window.location.origin },
  });
  if (error) throw new Error(error.message);
}

export async function signOut(): Promise<void> {
  await supabase.auth.signOut();
}

/** ผู้ใช้ปัจจุบันจาก session (เร็ว ไม่ยิง network) */
export async function getCurrentUser(): Promise<AuthUser | null> {
  const { data } = await supabase.auth.getSession();
  return mapUser(data.session?.user);
}

/** subscribe การเปลี่ยนสถานะ auth; คืนฟังก์ชัน unsubscribe */
export function onAuthChange(cb: (user: AuthUser | null) => void): () => void {
  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    cb(mapUser(session?.user));
  });
  return () => data.subscription.unsubscribe();
}

/** ผู้ใช้ปัจจุบันเป็นเจ้าหน้าที่ (อยู่ใน allowlist) หรือไม่ */
export async function checkIsStaff(): Promise<boolean> {
  const { data, error } = await supabase.rpc('is_staff');
  if (error) return false;
  return data === true;
}
