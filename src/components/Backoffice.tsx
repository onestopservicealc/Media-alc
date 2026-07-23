import React from 'react';
import { AppVM } from '../vm';
import { css } from '../lib/ui';

const S = css;

export function Backoffice({ vm }: { vm: AppVM }) {
  const isRequests = vm.boTab === 'requests';
  const isCatalog = !isRequests;

  const tabBase: React.CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '11px 20px', borderRadius: '999px', fontFamily: 'Kanit', fontWeight: 600, fontSize: '14px', cursor: 'pointer', transition: 'all .2s' };
  const on: React.CSSProperties = { ...tabBase, background: '#141821', color: '#fff', border: 'none' };
  const off: React.CSSProperties = { ...tabBase, background: '#fff', color: '#6b7280', border: '1px solid #e5e7eb' };
  const badge = (active: boolean): React.CSSProperties => ({ fontFamily: 'Space Mono', fontWeight: 700, fontSize: '11.5px', padding: '1px 8px', borderRadius: '999px', background: active ? 'rgba(255,255,255,.2)' : '#f1f2f4', color: active ? '#fff' : '#9ca3af' });

  const addOpen = vm.boAddOpen;
  const mode = vm.boAddMode;
  const formTitle = mode === 'edit' ? 'แก้ไขสื่อประชาสัมพันธ์' : 'เพิ่มสื่อใหม่ลงคลัง';
  const saveLabel = mode === 'edit' ? 'บันทึกการแก้ไข' : 'บันทึกสื่อใหม่';
  const addToggleLabel = addOpen ? 'ซ่อนแบบฟอร์ม' : 'เพิ่มสื่อใหม่';
  const addToggleIcon: React.CSSProperties = { fontWeight: 700, fontSize: '15px', lineHeight: 1, display: addOpen ? 'none' : 'inline' };
  const addToggleStyle: React.CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '10px 18px', background: addOpen ? '#f1f2f4' : '#e8112d', color: addOpen ? '#374151' : '#fff', border: 'none', borderRadius: '999px', fontFamily: 'Kanit', fontWeight: 600, fontSize: '13.5px', cursor: 'pointer' };
  const d = vm.boDraft;

  return (
    <div style={S('min-height:100vh;background:#f4f5f7;display:flex;flex-direction:column')}>

      <header style={S('background:linear-gradient(120deg,#141821,#1f2430);color:#fff;position:sticky;top:0;z-index:20')}>
        <div style={S('max-width:1200px;margin:0 auto;padding:15px 24px;display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap')}>
          <div style={S('display:flex;align-items:center;gap:13px')}>
            <div style={S('width:44px;height:44px;border-radius:13px;background:#e8112d;display:flex;align-items:center;justify-content:center')}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></svg></div>
            <div>
              <div style={S("font-size:11px;font-weight:600;color:#ff8a97;font-family:'Kanit';letter-spacing:.5px")}>โหมดเจ้าหน้าที่ · หลังบ้าน</div>
              <h1 style={S("margin:1px 0 0;font-family:'Kanit';font-weight:700;font-size:19px")}>แดชบอร์ดจัดการคำขอและคลังสื่อ</h1>
            </div>
          </div>
          <div style={S('display:flex;align-items:center;gap:10px')}>
            <div style={S('display:flex;align-items:center;gap:8px;background:rgba(255,255,255,.08);padding:7px 13px;border-radius:999px;border:1px solid rgba(255,255,255,.12)')}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ff8a97" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
              <span style={S("font-family:'Space Mono';font-weight:700;font-size:13.5px;color:#e6e8ec")}>{vm.clock}</span>
            </div>
            <button onClick={vm.onGotoPortal} style={S("display:inline-flex;align-items:center;gap:8px;padding:9px 16px;background:#fff;color:#141821;border:none;border-radius:999px;font-family:'Kanit';font-weight:500;font-size:13.5px;cursor:pointer")}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
              <span>กลับหน้าประชาชน</span>
            </button>
          </div>
        </div>
      </header>

      <main style={S('max-width:1200px;margin:0 auto;padding:26px 24px 44px;width:100%;flex:1')}>

        {/* Stats */}
        <div style={S('display:grid;grid-template-columns:repeat(6,1fr);gap:14px;margin-bottom:26px')}>
          {vm.boStats.map(st => (
            <div key={st.label} style={S('background:#fff;border:1px solid #eceef1;border-radius:18px;padding:18px 18px 16px')}>
              <div style={S("font-size:12px;color:#9ca3af;font-family:'Kanit';font-weight:500;margin-bottom:8px")}>{st.label}</div>
              <div style={S('display:flex;align-items:baseline;gap:6px')}>
                <span style={st.valueStyle}>{st.value}</span>
                <span style={S('font-size:11.5px;color:#9ca3af')}>{st.sub}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={S('display:flex;gap:8px;margin-bottom:22px')}>
          <button onClick={() => vm.onBoTab('requests')} style={isRequests ? on : off}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5Z" /><polyline points="14 2 14 8 20 8" /></svg>
            <span>คำขอที่เข้ามา</span>
            <span style={badge(isRequests)}>{vm.boRequestsVM.length}</span>
          </button>
          <button onClick={() => vm.onBoTab('catalog')} style={isCatalog ? on : off}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7.5 4.27 9 5.15" /><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /><path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" /></svg>
            <span>คลังสื่อ</span>
            <span style={badge(isCatalog)}>{vm.boCatalogVM.length}</span>
          </button>
        </div>

        {/* Requests tab */}
        {isRequests && (
          <div style={S('display:flex;flex-direction:column;gap:14px')}>
            {vm.boRequestsVM.map(r => (
              <div key={r.id} style={S('background:#fff;border:1px solid #eceef1;border-radius:20px;padding:18px 20px')}>
                <div style={S('display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;padding-bottom:14px;border-bottom:1px solid #f1f2f4')}>
                  <div style={S('display:flex;align-items:center;gap:12px;flex-wrap:wrap')}>
                    <span style={S("font-family:'Space Mono';font-weight:700;font-size:14px;color:#e8112d;background:#fef2f2;padding:4px 12px;border-radius:999px")}>{r.refNumber}</span>
                    <span style={S("font-size:12px;color:#9ca3af;font-family:'Space Mono'")}>ยื่นเมื่อ {r.submittedAt}</span>
                  </div>
                  <span style={r.statusStyle}><span style={r.statusDot} />{r.status}</span>
                </div>
                <div style={S('display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:9px 22px;margin:14px 0;font-size:13px;color:#374151')}>
                  <div style={S('display:flex;align-items:center;gap:7px')}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg><span>{r.fullName}</span></div>
                  <div style={S('display:flex;align-items:center;gap:7px')}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" /><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" /><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" /></svg><span>{r.agencyName}</span></div>
                  <div style={S('display:flex;align-items:center;gap:7px')}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg><span style={S("font-family:'Space Mono'")}>{r.phoneNumber}</span></div>
                  <div style={S('display:flex;align-items:center;gap:7px')}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg><span>ใช้ {r.requiredDate}</span></div>
                  <div style={S('display:flex;align-items:flex-start;gap:7px;grid-column:1/-1')}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={S('flex-shrink:0;margin-top:2px')}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg><span style={S('color:#6b7280')}>{r.shippingAddress}</span></div>
                </div>
                <div style={S('background:#f6f7f9;border-radius:12px;padding:11px 14px;font-size:12.5px;color:#374151;margin-bottom:14px')}>
                  <strong style={S("font-family:'Kanit'")}>รายการสื่อ:</strong> {r.itemsSummary}
                </div>
                <div style={S('display:flex;align-items:center;gap:8px;flex-wrap:wrap')}>
                  <span style={S("font-size:12px;color:#9ca3af;font-family:'Kanit';margin-right:4px")}>อัปเดตสถานะ:</span>
                  {r.statuses.map(st => (
                    <button key={st.label} onClick={st.onPick} style={st.style}>{st.label}</button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Catalog tab */}
        {isCatalog && (
          <div>
            <div style={S('display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:16px')}>
              <h2 style={S("margin:0;font-family:'Kanit';font-weight:700;font-size:18px")}>คลังสื่อทั้งหมด ({vm.boCatalogVM.length} รายการ)</h2>
              <button onClick={vm.onToggleAdd} style={addToggleStyle}>
                <span style={addToggleIcon}>＋</span><span>{addToggleLabel}</span>
              </button>
            </div>

            {addOpen && (
              <div style={S('background:#fff;border:1px solid #fbd5da;border-radius:20px;padding:20px;margin-bottom:18px;animation:fadeIn .25s ease')}>
                <div style={S("display:flex;align-items:center;gap:8px;font-family:'Kanit';font-weight:700;font-size:14px;color:#e8112d;margin-bottom:16px")}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" /><line x1="12" y1="10" x2="12" y2="16" /><line x1="9" y1="13" x2="15" y2="13" /></svg>
                  <span>{formTitle}</span>
                </div>
                <div style={S('display:grid;grid-template-columns:1fr 1fr;gap:14px')}>
                  <div>
                    <label style={S('display:block;font-size:12px;font-weight:600;color:#374151;margin-bottom:5px')}>ชื่อสื่อประชาสัมพันธ์ <span style={S('color:#e8112d')}>*</span></label>
                    <input type="text" value={d.title} onChange={e => vm.onDraftField('title', e.target.value)} placeholder="เช่น แผ่นพับงดเหล้าเข้าพรรษา 2569" style={S('width:100%;padding:10px 13px;background:#f6f7f9;border:1px solid #e5e7eb;border-radius:11px;font-size:13px;outline:none')} />
                  </div>
                  <div>
                    <label style={S('display:block;font-size:12px;font-weight:600;color:#374151;margin-bottom:5px')}>ประเภท/หมวดหมู่</label>
                    <select value={d.category} onChange={e => vm.onDraftField('category', e.target.value)} style={S('width:100%;padding:10px 13px;background:#f6f7f9;border:1px solid #e5e7eb;border-radius:11px;font-size:13px;outline:none')}>
                      <option value="แผ่นพับ (Brochure)">แผ่นพับ (Brochure)</option>
                      <option value="โปสเตอร์ (Poster)">โปสเตอร์ (Poster)</option>
                      <option value="สติ๊กเกอร์ (Sticker)">สติ๊กเกอร์ (Sticker)</option>
                      <option value="คู่มือ/หนังสือ (Handbook)">คู่มือ/หนังสือ (Handbook)</option>
                      <option value="ป้ายแบนเนอร์ (Banner)">ป้ายแบนเนอร์ (Banner)</option>
                      <option value="ของที่ระลึกรณรงค์ (Souvenir)">ของที่ระลึกรณรงค์ (Souvenir)</option>
                    </select>
                  </div>
                </div>
                <div style={S('margin-top:14px')}>
                  <label style={S('display:block;font-size:12px;font-weight:600;color:#374151;margin-bottom:5px')}>คำอธิบายรายละเอียด <span style={S('color:#e8112d')}>*</span></label>
                  <textarea rows={2} value={d.description} onChange={e => vm.onDraftField('description', e.target.value)} placeholder="รายละเอียดเนื้อหาและขนาดกระดาษ..." style={S('width:100%;padding:10px 13px;background:#f6f7f9;border:1px solid #e5e7eb;border-radius:11px;font-size:13px;outline:none;resize:none;font-family:inherit')} />
                </div>
                <div style={S('display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-top:14px')}>
                  <div>
                    <label style={S('display:block;font-size:12px;font-weight:600;color:#374151;margin-bottom:5px')}>ฟอร์แมตไฟล์</label>
                    <input type="text" value={d.fileType} onChange={e => vm.onDraftField('fileType', e.target.value)} style={S('width:100%;padding:10px 13px;background:#f6f7f9;border:1px solid #e5e7eb;border-radius:11px;font-size:13px;outline:none')} />
                  </div>
                  <div>
                    <label style={S('display:block;font-size:12px;font-weight:600;color:#374151;margin-bottom:5px')}>ขนาดไฟล์</label>
                    <input type="text" value={d.fileSize} onChange={e => vm.onDraftField('fileSize', e.target.value)} style={S('width:100%;padding:10px 13px;background:#f6f7f9;border:1px solid #e5e7eb;border-radius:11px;font-size:13px;outline:none')} />
                  </div>
                  <div>
                    <label style={S('display:block;font-size:12px;font-weight:600;color:#374151;margin-bottom:5px')}>จำกัด/ครั้ง (≤50)</label>
                    <input type="number" value={d.maxAllowed} onChange={e => vm.onDraftField('maxAllowed', e.target.value)} style={S("width:100%;padding:10px 13px;background:#f6f7f9;border:1px solid #e5e7eb;border-radius:11px;font-size:13px;outline:none;font-family:'Space Mono'")} />
                  </div>
                  <div>
                    <label style={S('display:block;font-size:12px;font-weight:600;color:#374151;margin-bottom:5px')}>คงคลัง</label>
                    <input type="number" value={d.availableStock} onChange={e => vm.onDraftField('availableStock', e.target.value)} style={S("width:100%;padding:10px 13px;background:#f6f7f9;border:1px solid #e5e7eb;border-radius:11px;font-size:13px;outline:none;font-family:'Space Mono'")} />
                  </div>
                </div>
                <div style={S('margin-top:14px')}>
                  <label style={S('display:block;font-size:12px;font-weight:600;color:#374151;margin-bottom:5px')}>ลิงก์รูปตัวอย่าง (ไม่บังคับ)</label>
                  <input type="url" value={d.imageUrl} onChange={e => vm.onDraftField('imageUrl', e.target.value)} placeholder="https://.../preview.jpg" style={S('width:100%;padding:10px 13px;background:#f6f7f9;border:1px solid #e5e7eb;border-radius:11px;font-size:13px;outline:none')} />
                </div>
                <div style={S('display:flex;justify-content:flex-end;gap:10px;margin-top:18px')}>
                  <button onClick={vm.onToggleAdd} style={S("padding:10px 20px;background:#f1f2f4;color:#374151;border:none;border-radius:999px;font-family:'Kanit';font-size:13.5px;cursor:pointer")}>ยกเลิก</button>
                  <button onClick={vm.onSaveDraft} style={S("padding:10px 24px;background:#e8112d;color:#fff;border:none;border-radius:999px;font-family:'Kanit';font-weight:600;font-size:13.5px;cursor:pointer")}>{saveLabel}</button>
                </div>
              </div>
            )}

            <div style={S('display:flex;flex-direction:column;gap:12px')}>
              {vm.boCatalogVM.map(m => (
                <div key={m.id} style={S('background:#fff;border:1px solid #eceef1;border-radius:18px;padding:14px 16px;display:flex;align-items:center;gap:16px;flex-wrap:wrap')}>
                  <div style={S('position:relative;width:56px;height:56px;border-radius:12px;overflow:hidden;background:#f1f2f4;flex-shrink:0')}>
                    <div style={m.fbStyleSm}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21" /></svg></div>
                    <img src={m.imageUrl} alt={m.title} referrerPolicy="no-referrer" onError={vm.onImgErr} style={S('position:absolute;inset:0;width:100%;height:100%;object-fit:cover')} />
                  </div>
                  <div style={S('flex:1;min-width:200px')}>
                    <div style={S('display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:3px')}>
                      <span style={S("font-size:10.5px;font-weight:600;padding:2px 9px;border-radius:999px;background:#f6f7f9;color:#6b7280;font-family:'Kanit'")}>{m.category}</span>
                      <span style={S("font-size:10.5px;font-weight:600;padding:2px 9px;border-radius:999px;background:#eff6ff;color:#2563eb;font-family:'Space Mono'")}>{m.fileType} · {m.fileSize}</span>
                    </div>
                    <h4 style={S("margin:0;font-family:'Kanit';font-weight:600;font-size:13.5px;line-height:1.35")}>{m.title}</h4>
                    <p style={S('margin:2px 0 0;font-size:12px;color:#9ca3af;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:520px')}>{m.description}</p>
                  </div>
                  <div style={S('text-align:right;margin-right:4px')}>
                    <div style={S('font-size:10.5px;color:#9ca3af')}>คงคลัง</div>
                    <div style={S("font-family:'Space Mono';font-weight:700;font-size:14px;color:#374151")}>{m.stockText}</div>
                  </div>
                  <div style={S('display:flex;align-items:center;gap:8px')}>
                    <button onClick={m.onEdit} style={S("display:inline-flex;align-items:center;gap:6px;padding:8px 14px;background:#fff;color:#374151;border:1px solid #e5e7eb;border-radius:999px;font-family:'Kanit';font-weight:500;font-size:12.5px;cursor:pointer")}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg>
                      <span>แก้ไข</span>
                    </button>
                    <button onClick={m.onDelete} style={S('width:36px;height:36px;border-radius:999px;background:#fef2f2;color:#e8112d;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center')}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
