import { Address, SubmittedRequest } from '../types';

/* =========================================================================
   สมุดที่อยู่จัดส่ง — เก็บใน localStorage ผูกกับ user id ที่ล็อกอิน
   (ฐานข้อมูลยังไม่มีตาราง addresses; เก็บฝั่งเครื่องไปก่อนเพื่อลดช่องกรอก
   จาก 6 ช่อง เหลือ "เลือกที่อยู่ + วัตถุประสงค์" ตามดีไซน์ใหม่)
   ========================================================================= */

const KEY = (uid: string) => `alc.addresses.${uid}`;

function newId(): string {
  return typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `a${Date.now()}`;
}

export function loadAddresses(uid: string | null): Address[] {
  if (!uid) return [];
  try {
    const raw = localStorage.getItem(KEY(uid));
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Address[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveAddresses(uid: string | null, list: Address[]): void {
  if (!uid) return;
  try {
    localStorage.setItem(KEY(uid), JSON.stringify(list));
  } catch {
    /* โควตาเต็ม / โหมดส่วนตัว — ข้ามไป ผู้ใช้ยังกรอกที่อยู่ใหม่ได้ */
  }
}

/** ทำให้มีที่อยู่ค่าเริ่มต้นเพียงรายการเดียวเสมอ */
export function normalize(list: Address[]): Address[] {
  if (list.length === 0) return list;
  const iDefault = list.findIndex(a => a.isDefault);
  const pick = iDefault === -1 ? 0 : iDefault;
  return list.map((a, i) => ({ ...a, isDefault: i === pick }));
}

export function makeAddress(input: Omit<Address, 'id' | 'isDefault'> & { isDefault?: boolean }): Address {
  return { id: newId(), isDefault: false, ...input };
}

/**
 * ครั้งแรกที่ผู้ใช้เข้ามาและยังไม่มีสมุดที่อยู่ ให้ดึงที่อยู่จากคำขอล่าสุด
 * ที่เคยส่งไว้มาเป็นรายการตั้งต้น ผู้ใช้จึงไม่ต้องพิมพ์ซ้ำ
 */
export function seedFromRequests(requests: SubmittedRequest[]): Address[] {
  const seen = new Set<string>();
  const out: Address[] = [];
  for (const r of requests) {
    const key = `${r.agencyName}|${r.shippingAddress}`;
    if (!r.shippingAddress || seen.has(key)) continue;
    seen.add(key);
    out.push({
      id: newId(),
      label: r.agencyName || 'ที่อยู่จัดส่ง',
      contactName: r.fullName,
      detail: r.shippingAddress,
      phone: r.phoneNumber,
      isDefault: out.length === 0,
    });
    if (out.length >= 5) break;
  }
  return out;
}
