import React from 'react';
import { AppVM } from '../../vm';
import { css } from '../../lib/ui';
import { BuildingIcon, CalendarIcon, MapPinIcon, PhoneIcon, UserIcon, XIcon } from '../icons';

const S = css;

/** รายละเอียดคำขอ (เปิดจากปุ่มรูปตาในตารางหลังบ้าน) */
export function RequestDetail({ vm }: { vm: AppVM }) {
  const r = vm.boDetail;
  if (!r) return null;

  const line = (icon: React.ReactNode, label: string, value: string) => (
    <div style={S('display:flex;align-items:flex-start;gap:9px')}>
      <span style={S('flex-shrink:0;margin-top:2px;color:#9ca3af')}>{icon}</span>
      <span style={S('flex:1;min-width:0;font-size:13px;color:#374151;line-height:1.55')}>
        <span style={S('color:#9ca3af')}>{label} </span>{value}
      </span>
    </div>
  );

  return (
    <div
      className="sheet-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label={`รายละเอียดคำขอ ${r.refNumber}`}
      onClick={vm.onBoCloseDetail}
    >
      <div className="sheet" onClick={e => e.stopPropagation()}>
        <div style={S('background:#fff;border-bottom:1px solid #eceef1;padding:14px 16px;display:flex;align-items:center;gap:10px;flex-shrink:0')}>
          <div style={S('flex:1;min-width:0')}>
            <div style={S("font-family:'Space Mono';font-weight:700;font-size:14px;color:#e8112d")}>{r.refNumber}</div>
            <div style={S("font-size:11.5px;color:#9ca3af;font-family:'Space Mono'")}>ยื่นเมื่อ {r.submittedAt}</div>
          </div>
          <span style={r.statusStyle}><span style={r.statusDot} />{r.status}</span>
          <button onClick={vm.onBoCloseDetail} aria-label="ปิด" style={S('width:34px;height:34px;border-radius:8px;background:#f6f7f9;border:1px solid #e5e7eb;color:#6b7280;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0')}>
            <XIcon size={16} />
          </button>
        </div>

        <div className="scr" style={S('flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:14px;background:#f4f5f7')}>
          <div style={S('background:#fff;border:1px solid #dfe2e7;border-radius:12px;padding:14px 16px;display:flex;flex-direction:column;gap:9px')}>
            {line(<UserIcon size={15} />, 'ผู้ขอ', r.fullName)}
            {line(<BuildingIcon size={15} />, 'หน่วยงาน', r.agencyName)}
            {line(<PhoneIcon size={15} />, 'โทร', r.phoneNumber)}
            {line(<MapPinIcon size={15} />, 'จัดส่งที่', r.shippingAddress)}
            {line(<CalendarIcon size={15} />, 'ต้องการใช้', r.requiredDate)}
            {line(<span style={S('display:block;width:15px;height:15px;border-radius:4px;background:#eceef1')} />, 'วัตถุประสงค์', r.purpose)}
          </div>

          <div style={S('background:#fff;border:1px solid #dfe2e7;border-radius:12px;overflow:hidden')}>
            <div style={S("padding:11px 16px;background:#fbfbfc;border-bottom:1px solid #eceef1;font-family:'Kanit';font-weight:600;font-size:12px;color:#6b7280")}>
              รายการสื่อที่ขอ ({r.items.length} รายการ · รวม {r.itemsTotal} ชิ้น)
            </div>
            {r.items.map(it => (
              <div key={it.materialId} style={S('display:flex;align-items:center;gap:12px;padding:10px 16px;border-bottom:1px solid #f1f2f4')}>
                <div
                  onClick={() => it.imageUrl && vm.onOpenLightbox(it.imageUrl)}
                  style={{ ...S('position:relative;width:44px;height:44px;border-radius:8px;overflow:hidden;background:#f1f2f4;flex-shrink:0'), cursor: it.imageUrl ? 'zoom-in' : 'default' }}
                >
                  <div style={it.fbStyle}>{it.catShort}</div>
                  {it.imageUrl && <img src={it.imageUrl} alt={it.title} referrerPolicy="no-referrer" onError={vm.onImgErr} style={S('position:absolute;inset:0;width:100%;height:100%;object-fit:cover')} />}
                </div>
                <span style={S("flex:1;min-width:0;font-family:'Kanit';font-weight:500;font-size:13px;color:#374151;line-height:1.4")}>{it.title}</span>
                <span style={S("font-family:'Space Mono';font-weight:700;font-size:13px;color:#e8112d;flex-shrink:0")}>×{it.quantity}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={S('flex-shrink:0;padding:12px 16px calc(14px + env(safe-area-inset-bottom));background:#fff;border-top:1px solid #eceef1')}>
          <button onClick={vm.onBoCloseDetail} style={S("width:100%;height:46px;background:#141821;color:#fff;border:none;border-radius:10px;font-family:'Kanit';font-weight:600;font-size:14px;cursor:pointer")}>ปิด</button>
        </div>
      </div>
    </div>
  );
}
