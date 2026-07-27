import React from 'react';

/**
 * แปลงสตริง CSS แบบ inline (เช่น "padding:10px;color:#fff") ให้เป็น React.CSSProperties
 * ช่วยให้พอร์ตมาร์กอัปจากดีไซน์ต้นฉบับ (ซึ่งใช้ inline style ล้วน) ได้ตรงเป๊ะ
 */
export function css(s: string): React.CSSProperties {
  const o: Record<string, string> = {};
  s.split(';').forEach(rule => {
    const i = rule.indexOf(':');
    if (i === -1) return;
    const k = rule.slice(0, i).trim();
    const v = rule.slice(i + 1).trim();
    if (!k) return;
    const key = k.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
    o[key] = v;
  });
  return o as React.CSSProperties;
}

/** สีและป้ายกำกับตามหมวดหมู่สื่อ (ใช้เป็น fallback เมื่อรูปไม่โหลด) */
export function fbFor(cat: string): { short: string; bg: string; accent: string } {
  const c = cat.replace(/\s*\(.*?\)/, '').trim();
  let bg = 'linear-gradient(135deg,#f3f4f6,#e5e7eb)', ac = '#6b7280';
  if (cat.includes('สติ๊กเกอร์')) { bg = 'linear-gradient(135deg,#fef2f2,#fde2e4)'; ac = '#e8112d'; }
  else if (cat.includes('แผ่นพับ')) { bg = 'linear-gradient(135deg,#eff6ff,#dbeafe)'; ac = '#2563eb'; }
  else if (cat.includes('โปสเตอร์')) { bg = 'linear-gradient(135deg,#ecfdf5,#d1fae5)'; ac = '#059669'; }
  else if (cat.includes('หนังสือ') || cat.includes('คู่มือ')) { bg = 'linear-gradient(135deg,#fffbeb,#fef3c7)'; ac = '#b45309'; }
  return { short: c, bg, accent: ac };
}

/** กล่อง fallback ทับตำแหน่งรูป (แสดงชื่อหมวดเมื่อรูปไม่โหลด) */
export function fbBox(cat: string, size = 10): React.CSSProperties {
  const f = fbFor(cat);
  return {
    position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: f.bg, color: f.accent, fontFamily: 'Kanit', fontWeight: 600,
    fontSize: `${size}px`, textAlign: 'center', padding: '0 4px', lineHeight: 1.2,
  };
}

/** สีสถานะคำขอ */
export function statusMeta(st: string): { text: string; bg: string; bd: string; dot: string } {
  if (st === 'กำลังจัดส่ง') return { text: '#1d4ed8', bg: '#eff6ff', bd: '#bfdbfe', dot: '#2563eb' };
  if (st === 'เสร็จสิ้น') return { text: '#047857', bg: '#ecfdf5', bd: '#a7f3d0', dot: '#10b981' };
  return { text: '#b45309', bg: '#fffbeb', bd: '#fde68a', dot: '#f59e0b' };
}

/** ชิปตัวกรองทรงสี่เหลี่ยมมุมมน (แบบเดียวกับดีไซน์ใหม่) */
export function chip(active: boolean, size = 12.5): React.CSSProperties {
  return {
    height: '34px', padding: '0 14px', borderRadius: '8px', fontSize: `${size}px`,
    fontWeight: active ? 600 : 500, fontFamily: 'Kanit', cursor: 'pointer',
    whiteSpace: 'nowrap', flexShrink: 0,
    border: active ? '1px solid #141821' : '1px solid #e5e7eb',
    background: active ? '#141821' : '#fff',
    color: active ? '#fff' : '#374151',
  };
}

/** สไตล์ปุ่มกรองหมวดหมู่แบบเดิม (pill) — ยังใช้ในบางจุด */
export function pill(active: boolean): React.CSSProperties {
  const base: React.CSSProperties = {
    padding: '8px 16px', borderRadius: '999px', fontSize: '12.5px', fontWeight: 500,
    fontFamily: 'Kanit', border: 'none', cursor: 'pointer'
  };
  return active
    ? { ...base, background: '#141821', color: '#fff' }
    : { ...base, border: '1px solid #e5e7eb', background: '#fff', color: '#374151' };
}

/** ดึงชื่อจังหวัดจากที่อยู่จัดส่ง (ใช้เป็นตัวกรองในหลังบ้าน) */
export function provinceOf(address: string): string {
  const a = String(address || '');
  const m = a.match(/จ\.\s*([^\s,]+)/) || a.match(/จังหวัด\s*([^\s,]+)/);
  if (m) return m[1];
  if (a.includes('กรุงเทพ')) return 'กรุงเทพมหานคร';
  return '—';
}

/** สื่อที่มีหลายภาษาในเล่มเดียว (ชื่อเรื่องคั่นด้วย "/" ตั้งแต่ 2 ครั้งขึ้นไป) */
export function isMultiLang(title: string): boolean {
  return (title.match(/\//g) || []).length >= 2;
}

export const THAI_MONTHS = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];

/** จัดรูปแบบวันเวลาไทยแบบย่อ เช่น "22 ก.ค. 09:14" (ใช้แสดงเวลายื่นคำขอ) */
export function formatThaiDateTime(d: Date): string {
  const p = (x: number) => String(x).padStart(2, '0');
  return `${d.getDate()} ${THAI_MONTHS[d.getMonth()]} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

/** จัดรูปแบบวันที่แบบย่อ เช่น "5 ส.ค." (ใช้ในตารางหลังบ้าน) */
export function formatThaiDate(iso: string): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return `${d.getDate()} ${THAI_MONTHS[d.getMonth()]}`;
}

export const STATUSES = ['รอการอนุมัติ', 'กำลังจัดส่ง', 'เสร็จสิ้น'] as const;

/** ความคืบหน้าของคำขอ (ใช้กับแถบ 3 ช่วงในหน้าติดตาม) */
export function statusStep(status: string): number {
  if (status === 'เสร็จสิ้น') return 3;
  if (status === 'กำลังจัดส่ง') return 2;
  return 1;
}

export const MEDIA_CATEGORIES = [
  'แผ่นพับ (Brochure)',
  'โปสเตอร์ (Poster)',
  'สติ๊กเกอร์ (Sticker)',
  'คู่มือ/หนังสือ (Handbook)',
  'ป้ายแบนเนอร์ (Banner)',
  'ของที่ระลึกรณรงค์ (Souvenir)',
] as const;

export const PURPOSES = [
  'จัดบูธนิทรรศการ',
  'อบรมผู้ประกอบการ',
  'ติดบอร์ดให้ความรู้',
  'รณรงค์เข้าพรรษา',
  'ตรวจเตือนร้านค้า',
  'อื่นๆ',
] as const;
