import { MediaMaterial, SubmittedRequest, SystemItem, MediaRequestForm } from '../types';
import { formatThaiDateTime } from '../lib/ui';

/* =========================================================================
   Data-access layer (จุดเชื่อม / seam) ของทั้งแอป
   -------------------------------------------------------------------------
   ตอนนี้ backing = localStorage (ข้อมูลเก็บถาวรจริง refresh ไม่หาย)

   เมื่อจะต่อ Supabase ทีหลัง: แก้ไขเฉพาะ implementation ในไฟล์นี้
   (สร้าง supabase client, เรียก .from()/.rpc()/Storage) โดย "คง signature
   ของทุกฟังก์ชันไว้เหมือนเดิม" → App.tsx และ component ทั้งหมดไม่ต้องแก้เลย

   mapping ที่วางไว้สำหรับ Supabase:
     fetchCatalog        → select media_materials where is_archived = false
     fetchSystems        → select systems
     fetchRequests       → select requests (staff, ต้อง auth)
     submitRequest       → rpc('submit_request', ...) (ตัด stock แบบ atomic)
     setRequestStatus    → rpc('set_request_status', ...)
     saveMaterial        → insert/update media_materials (+ upload Storage)
     archiveMaterial     → update media_materials set is_archived = true
     getMyRequests       → rpc('get_requests_by_token', tokens[])
     uploadImage         → Storage.upload('media-previews') → getPublicUrl
   ========================================================================= */

// ระบบเริ่มต้นแบบว่าง (ไม่มีการ seed ข้อมูลตัวอย่าง)
// เปลี่ยน version key เป็น v2 → localStorage ชุดเดิม (v1) ถูกละทิ้งทุกเครื่อง
const KEYS = {
  catalog: 'alc.catalog.v2',
  requests: 'alc.requests.v2',
  systems: 'alc.systems.v2',
  myTokens: 'alc.myTokens.v2', // id ของคำขอที่ยื่นจากเครื่องนี้ (แทน tracking token)
  refSeq: 'alc.refSeq.v2',
};

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

/** จำลอง latency เล็กน้อยให้ flow แบบ async เหมือนเรียก network จริง */
function delay<T>(value: T): Promise<T> {
  return new Promise(resolve => setTimeout(() => resolve(value), 40));
}

// ---------------------------------------------------------------- reads

export async function fetchCatalog(): Promise<MediaMaterial[]> {
  return delay(read<MediaMaterial[]>(KEYS.catalog, []));
}

export async function fetchSystems(): Promise<SystemItem[]> {
  return delay(read<SystemItem[]>(KEYS.systems, []));
}

export async function fetchRequests(): Promise<SubmittedRequest[]> {
  return delay(read<SubmittedRequest[]>(KEYS.requests, []));
}

/** คำขอที่ยื่นจากเครื่องนี้ (ติดตามผ่าน token ที่เก็บใน localStorage) */
export async function getMyRequests(): Promise<SubmittedRequest[]> {
  const tokens = read<string[]>(KEYS.myTokens, []);
  const all = read<SubmittedRequest[]>(KEYS.requests, []);
  return delay(all.filter(r => tokens.includes(r.id)));
}

/** id ของคำขอที่ยื่นจากเครื่องนี้ (ใช้เซ็ต state.myIds เพื่อคง vm เดิม) */
export function getMyTokens(): string[] {
  return read<string[]>(KEYS.myTokens, []);
}

// ---------------------------------------------------------------- writes

/** สร้างเลขอ้างอิงไม่ซ้ำ ALC-{ปีพ.ศ.}-#### (แทน Math.random เดิมที่ชนกันได้) */
function nextRefNumber(): string {
  const seq = read<number>(KEYS.refSeq, 4821) + 1;
  write(KEYS.refSeq, seq);
  const beYear = new Date().getFullYear() + 543;
  return `ALC-${beYear}-${String(seq).padStart(4, '0')}`;
}

/**
 * ส่งคำขอ + ตัด stock. ถ้าสื่อชิ้นใดคงคลังไม่พอจะ throw และไม่บันทึกอะไรเลย
 * (บน Supabase = rpc('submit_request') ที่ทำในทรานแซกชันเดียว)
 */
export async function submitRequest(form: MediaRequestForm): Promise<SubmittedRequest> {
  const catalog = read<MediaMaterial[]>(KEYS.catalog, []);

  // ตรวจ stock ก่อนตัด — ถ้าไม่พอ ยกเลิกทั้งคำขอ
  for (const it of form.selectedMaterials) {
    const m = catalog.find(x => x.id === it.materialId);
    if (!m) throw new Error(`ไม่พบสื่อรหัส ${it.materialId}`);
    if (it.quantity > m.maxAllowed) throw new Error(`"${m.title}" ขอได้ไม่เกิน ${m.maxAllowed} ต่อครั้ง`);
    if ((m.availableStock ?? 0) < it.quantity) throw new Error(`"${m.title}" คงคลังไม่พอ (เหลือ ${m.availableStock ?? 0})`);
  }

  const nextCatalog = catalog.map(m => {
    const it = form.selectedMaterials.find(s => s.materialId === m.id);
    return it ? { ...m, availableStock: (m.availableStock ?? 0) - it.quantity } : m;
  });

  const req: SubmittedRequest = {
    ...form,
    id: crypto.randomUUID(),
    refNumber: nextRefNumber(),
    submittedAt: formatThaiDateTime(new Date()),
    status: 'รอการอนุมัติ',
  };

  const requests = read<SubmittedRequest[]>(KEYS.requests, []);
  write(KEYS.requests, [req, ...requests]);
  write(KEYS.catalog, nextCatalog);
  write(KEYS.myTokens, [req.id, ...read<string[]>(KEYS.myTokens, [])]);

  return delay(req);
}

export async function setRequestStatus(id: string, status: SubmittedRequest['status']): Promise<void> {
  const requests = read<SubmittedRequest[]>(KEYS.requests, []);
  write(KEYS.requests, requests.map(r => (r.id === id ? { ...r, status } : r)));
  return delay(undefined);
}

/** เพิ่ม (mode='add') หรือแก้ไข (mode='edit') สื่อในคลัง แล้วคืนรายการที่บันทึก */
export async function saveMaterial(mat: MediaMaterial, mode: 'add' | 'edit'): Promise<MediaMaterial> {
  const catalog = read<MediaMaterial[]>(KEYS.catalog, []);
  if (mode === 'edit') {
    write(KEYS.catalog, catalog.map(m => (m.id === mat.id ? { ...m, ...mat } : m)));
    return delay(mat);
  }
  const created: MediaMaterial = { ...mat, id: mat.id || crypto.randomUUID() };
  write(KEYS.catalog, [created, ...catalog]);
  return delay(created);
}

export async function archiveMaterial(id: string): Promise<void> {
  const catalog = read<MediaMaterial[]>(KEYS.catalog, []);
  // localStorage เฟสนี้ลบออกจากรายการ; บน Supabase จะเป็น soft-delete (is_archived=true)
  write(KEYS.catalog, catalog.filter(m => m.id !== id));
  return delay(undefined);
}

/**
 * อัปโหลดรูปพรีวิว แล้วคืน URL ของรูป
 * -----------------------------------------------------------------------------
 * เฟสนี้: แปลงไฟล์เป็น data URL (base64) เก็บฝังใน localStorage ได้เลย
 * ตอนต่อ Supabase: เปลี่ยนเป็น upload เข้า bucket 'media-previews'
 *   แล้ว return getPublicUrl(path) — โดย signature เดิมไม่เปลี่ยน
 */
export async function uploadImage(file: File): Promise<string> {
  if (!file.type.startsWith('image/')) throw new Error('กรุณาเลือกไฟล์รูปภาพ (jpg/png/webp)');
  const MAX_BYTES = 2 * 1024 * 1024;
  if (file.size > MAX_BYTES) throw new Error('ไฟล์รูปต้องไม่เกิน 2 MB');
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('อ่านไฟล์รูปไม่สำเร็จ'));
    reader.readAsDataURL(file);
  });
}
