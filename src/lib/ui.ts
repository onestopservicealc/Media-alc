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

/** สีสถานะคำขอ */
export function statusMeta(st: string): { text: string; bg: string; bd: string; dot: string } {
  if (st === 'กำลังจัดส่ง') return { text: '#1d4ed8', bg: '#eff6ff', bd: '#bfdbfe', dot: '#2563eb' };
  if (st === 'เสร็จสิ้น') return { text: '#047857', bg: '#ecfdf5', bd: '#a7f3d0', dot: '#10b981' };
  return { text: '#b45309', bg: '#fffbeb', bd: '#fde68a', dot: '#f59e0b' };
}

/** สไตล์ปุ่มกรองหมวดหมู่ (pill) */
export function pill(active: boolean): React.CSSProperties {
  const base: React.CSSProperties = {
    padding: '8px 16px', borderRadius: '999px', fontSize: '12.5px', fontWeight: 500,
    fontFamily: 'Kanit', border: 'none', cursor: 'pointer'
  };
  return active
    ? { ...base, background: '#141821', color: '#fff' }
    : { ...base, border: '1px solid #e5e7eb', background: '#fff', color: '#374151' };
}

export const THAI_MONTHS = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];

export const STATUSES = ['รอการอนุมัติ', 'กำลังจัดส่ง', 'เสร็จสิ้น'] as const;
