import React from 'react';
import { AppVM } from '../vm';
import { css } from '../lib/ui';

const S = css;

function ImgFallbackIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21" />
    </svg>
  );
}

export function Portal({ vm }: { vm: AppVM }) {
  return (
    <div style={S('min-height:100vh;display:flex;flex-direction:column')}>
      <div style={S('position:relative;flex:1;display:flex;flex-direction:column')}>

        {/* Ambient background spheres */}
        <div style={S('position:fixed;inset:0;pointer-events:none;overflow:hidden;z-index:0')}>
          <div style={S('position:absolute;top:40px;left:22%;width:380px;height:380px;background:rgba(254,226,226,.5);border-radius:50%;filter:blur(70px);animation:floatSlow 13s ease-in-out infinite')} />
          <div style={S('position:absolute;top:34%;right:5%;width:320px;height:320px;background:rgba(255,228,230,.45);border-radius:50%;filter:blur(70px);animation:floatRev 16s ease-in-out infinite')} />
        </div>

        <div style={S('position:relative;z-index:10;flex:1;display:flex;flex-direction:column')}>

          {/* Header */}
          <header style={S('position:sticky;top:0;z-index:30;background:rgba(255,255,255,.9);backdrop-filter:blur(12px);border-bottom:1px solid #eceef1')}>
            <div style={S('max-width:1200px;margin:0 auto;padding:14px 24px;display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap')}>
              <div style={S('display:flex;align-items:center;gap:14px')}>
                <div style={S('position:relative;width:52px;height:52px;border-radius:16px;background:linear-gradient(135deg,#e8112d,#b90b21);display:flex;align-items:center;justify-content:center;color:#fff;box-shadow:0 8px 20px rgba(232,17,45,.28)')}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                </div>
                <div>
                  <span style={S("display:inline-block;font-size:11px;font-weight:600;padding:2px 10px;border-radius:999px;background:#fef2f2;color:#e8112d;border:1px solid #fde2e4;font-family:'Kanit'")}>กรมควบคุมโรค กระทรวงสาธารณสุข</span>
                  <h1 style={S("margin:3px 0 0;font-family:'Kanit';font-weight:700;font-size:19px;color:#111827;line-height:1.25")}>สำนักงานคณะกรรมการควบคุมเครื่องดื่มแอลกอฮอล์</h1>
                  <p style={S('margin:1px 0 0;font-size:12.5px;color:#6b7280')}>ระบบขอสนับสนุนสื่อประชาสัมพันธ์ และศูนย์รวมระบบสารสนเทศ</p>
                </div>
              </div>
              <div style={S('display:flex;align-items:center;gap:10px;flex-wrap:wrap')}>
                <div style={S('display:flex;align-items:center;gap:8px;background:#fef2f2;color:#e8112d;padding:6px 12px;border-radius:999px;border:1px solid #fde2e4')}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={S('animation:pulse 2s infinite')}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                  <span style={S("font-family:'Space Mono';font-weight:700;font-size:14px;letter-spacing:.5px")}>{vm.clock}</span>
                </div>
                <button onClick={vm.onGotoBO} style={S("display:inline-flex;align-items:center;gap:7px;padding:9px 15px;background:#111827;color:#fff;font-family:'Kanit';font-weight:500;font-size:13.5px;border:none;border-radius:999px;cursor:pointer")}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                  <span>สำหรับเจ้าหน้าที่</span>
                </button>
              </div>
            </div>
          </header>

          <main style={S('max-width:1200px;margin:0 auto;padding:28px 24px 40px;width:100%;flex:1')}>

            {/* Hero */}
            <section style={S('background:linear-gradient(120deg,#141821,#1f2430 55%,#141821);border-radius:28px;padding:36px;color:#fff;position:relative;overflow:hidden;box-shadow:0 24px 60px -24px rgba(20,24,33,.5)')}>
              <div style={S('position:absolute;top:-60px;right:-30px;width:340px;height:340px;background:rgba(232,17,45,.28);border-radius:50%;filter:blur(80px);pointer-events:none')} />
              <div style={S('position:relative;z-index:2;display:flex;flex-direction:column;gap:22px')}>
                <div style={S('max-width:640px')}>
                  <div style={S("display:inline-flex;align-items:center;gap:8px;padding:6px 14px;border-radius:999px;background:rgba(232,17,45,.2);color:#ff8a97;border:1px solid rgba(232,17,45,.35);font-size:12.5px;font-weight:600;font-family:'Kanit'")}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z" /></svg>
                    <span>บริการฟรีสำหรับหน่วยงานและประชาชน</span>
                  </div>
                  <h2 style={S("margin:16px 0 10px;font-family:'Kanit';font-weight:700;font-size:34px;line-height:1.2;letter-spacing:-.5px")}>ขอสื่อรณรงค์ป้องกันภัยแอลกอฮอล์<br />ง่าย ครบ จบในที่เดียว</h2>
                  <p style={S('margin:0;font-size:15px;color:#c7ccd6;line-height:1.65')}>ขอรับสื่อต้นฉบับ (แผ่นพับ โปสเตอร์ สติ๊กเกอร์ คู่มือ) จัดส่งฟรีถึงหน่วยงาน — ไม่เกิน 50 ชิ้นต่อรายการ</p>
                </div>
                <div style={S('display:flex;gap:12px;flex-wrap:wrap')}>
                  <button onClick={vm.onStartRequest} style={S("display:inline-flex;align-items:center;gap:10px;padding:15px 26px;background:#e8112d;color:#fff;font-family:'Kanit';font-weight:600;font-size:15.5px;border:none;border-radius:999px;cursor:pointer;box-shadow:0 12px 30px -8px rgba(232,17,45,.6)")}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z" /></svg>
                    <span>เริ่มขอจัดส่งสื่อ (เล่มจริง)</span>
                  </button>
                  <button onClick={vm.onScrollCatalog} style={S("display:inline-flex;align-items:center;gap:9px;padding:15px 24px;background:rgba(255,255,255,.1);color:#fff;font-family:'Kanit';font-weight:500;font-size:15px;border:1px solid rgba(255,255,255,.18);border-radius:999px;cursor:pointer")}>
                    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
                    <span>ดูคลังสื่อทั้งหมด</span>
                  </button>
                  <button onClick={vm.onOpenHistory} style={S("display:inline-flex;align-items:center;gap:9px;padding:15px 22px;background:transparent;color:#c7ccd6;font-family:'Kanit';font-weight:500;font-size:14.5px;border:1px solid rgba(255,255,255,.14);border-radius:999px;cursor:pointer")}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /><path d="M12 7v5l4 2" /></svg>
                    <span>ติดตามคำขอของฉัน</span>
                  </button>
                </div>
              </div>
            </section>

            {/* How-to steps */}
            <section style={S('margin-top:26px')}>
              <div style={S('display:grid;grid-template-columns:repeat(3,1fr);gap:16px')}>
                {[
                  { n: '1', t: 'เลือกสื่อที่ต้องการ', d: 'เลือกจากคลังสื่อด้านล่าง ระบุจำนวนที่ต้องการ (ไม่เกิน 50 ชิ้น)' },
                  { n: '2', t: 'กรอกข้อมูลจัดส่ง', d: 'บอกชื่อ หน่วยงาน และที่อยู่จัดส่ง พร้อมวันที่ต้องการใช้' },
                  { n: '3', t: 'ยืนยัน & รอรับสื่อ', d: 'ตรวจทานแล้วส่งคำขอ รับเลขอ้างอิงเพื่อติดตามสถานะได้' },
                ].map(step => (
                  <div key={step.n} style={S('background:#fff;border:1px solid #eceef1;border-radius:20px;padding:20px 22px;display:flex;gap:14px;align-items:flex-start')}>
                    <div style={S("width:40px;height:40px;border-radius:12px;background:#fef2f2;color:#e8112d;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-family:'Space Mono';font-weight:700;font-size:16px")}>{step.n}</div>
                    <div>
                      <h3 style={S("margin:0 0 3px;font-family:'Kanit';font-weight:600;font-size:15.5px")}>{step.t}</h3>
                      <p style={S('margin:0;font-size:13px;color:#6b7280;line-height:1.55')}>{step.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Catalog */}
            <section id="catalog" style={S('margin-top:30px;scroll-margin-top:90px')}>
              <div style={S('display:flex;align-items:flex-end;justify-content:space-between;gap:16px;flex-wrap:wrap;margin-bottom:16px')}>
                <div>
                  <h2 style={S("margin:0;font-family:'Kanit';font-weight:700;font-size:24px")}>คลังสื่อประชาสัมพันธ์</h2>
                  <p style={S('margin:4px 0 0;font-size:13.5px;color:#6b7280')}>เลือกสื่อที่ต้องการแล้ว <strong style={S('color:#e8112d')}>ขอจัดส่งเล่มจริง</strong> ถึงหน่วยงานฟรี — ไม่เกิน 50 ชิ้นต่อรายการ</p>
                </div>
                <div style={S("display:flex;align-items:center;gap:8px;background:#eef7f0;color:#047857;padding:8px 14px;border-radius:999px;border:1px solid #c9ecd5;font-size:12.5px;font-weight:600;font-family:'Kanit'")}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                  <span>ทุกรายการฟรี — ไม่มีค่าใช้จ่าย</span>
                </div>
              </div>

              {/* Search + category filter */}
              <div style={S('background:#fff;border:1px solid #eceef1;border-radius:22px;padding:18px 20px;margin-bottom:22px')}>
                <div style={S('position:relative;display:flex;align-items:center')}>
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={S('position:absolute;left:16px;pointer-events:none')}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                  <input type="text" value={vm.search} onChange={vm.onSearch} placeholder="ค้นหาสื่อ (ชื่อ คำอธิบาย หรือประเภท)..." style={S('width:100%;padding:13px 16px 13px 44px;background:#f6f7f9;border:1px solid #e5e7eb;border-radius:999px;font-size:14px;color:#111827;outline:none')} />
                </div>
                <div style={S('display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-top:14px')}>
                  <span style={S("font-size:12px;font-weight:600;color:#9ca3af;font-family:'Kanit';margin-right:2px")}>ประเภท:</span>
                  {vm.categories.map(c => (
                    <button key={c.label} onClick={c.onPick} style={c.style}>{c.label}</button>
                  ))}
                </div>
              </div>

              {/* Catalog grid */}
              <div style={S('display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:20px')}>
                {vm.catalogVM.map(m => (
                  <div key={m.id} style={m.wrapStyle}>
                    <div onClick={() => m.imageUrl && vm.onOpenLightbox(m.imageUrl)} style={{ ...S('position:relative;height:200px;border-radius:16px;overflow:hidden;background:#f1f2f4;margin-bottom:14px'), cursor: m.imageUrl ? 'zoom-in' : 'default' }}>
                      <div style={m.fbStyle}>
                        <ImgFallbackIcon size={30} />
                        <span style={S("font-family:'Kanit';font-weight:600;font-size:12.5px;line-height:1.35")}>{m.catShort}</span>
                      </div>
                      <img src={m.imageUrl} alt={m.title} referrerPolicy="no-referrer" onError={vm.onImgErr} style={S('position:absolute;inset:0;width:100%;height:100%;object-fit:cover')} />
                      <span style={S("position:absolute;top:12px;left:12px;font-size:11px;font-weight:600;padding:4px 11px;border-radius:999px;background:rgba(255,255,255,.94);color:#374151;font-family:'Kanit';z-index:2")}>{m.category}</span>
                      {m.imageUrl && (
                        <span style={S("position:absolute;bottom:12px;right:12px;display:inline-flex;align-items:center;gap:5px;font-size:11px;font-weight:600;padding:4px 10px;border-radius:999px;background:rgba(17,20,27,.72);color:#fff;font-family:'Kanit';z-index:2")}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /><line x1="11" y1="8" x2="11" y2="14" /><line x1="8" y1="11" x2="14" y2="11" /></svg>
                          <span>ดูภาพเต็ม</span>
                        </span>
                      )}
                    </div>
                    <h3 style={S("margin:0 0 6px;font-family:'Kanit';font-weight:600;font-size:15.5px;line-height:1.4;min-height:44px")}>{m.title}</h3>
                    <p style={S('margin:0 0 14px;font-size:12.5px;color:#6b7280;line-height:1.55;min-height:39px')}>{m.description}</p>
                    <div style={S('display:grid;grid-template-columns:1fr;gap:10px')}>
                      <button onClick={m.onToggle} style={m.reqBtnStyle}>
                        <span style={m.reqIconWrap}>{m.reqIcon}</span>
                        <span>{m.reqLabel}</span>
                      </button>
                    </div>
                    {m.selected && (
                      <div style={S('margin-top:12px;padding:11px 13px;background:#fff5f6;border:1px solid #fbd5da;border-radius:14px;display:flex;align-items:center;justify-content:space-between;animation:fadeIn .25s ease')}>
                        <span style={S("font-size:12.5px;font-weight:600;color:#374151;font-family:'Kanit'")}>จำนวนจัดส่ง (ชิ้น)</span>
                        <div style={S('display:flex;align-items:center;gap:8px')}>
                          <button onClick={m.onDec} style={S('width:30px;height:30px;border-radius:9px;background:#fff;border:1px solid #e5e7eb;color:#374151;cursor:pointer;display:flex;align-items:center;justify-content:center')}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12" /></svg></button>
                          <input type="number" value={m.qty} onChange={m.onQty} style={S("width:52px;text-align:center;font-family:'Space Mono';font-weight:700;font-size:14px;padding:5px 2px;background:#fff;border:1px solid #e5e7eb;border-radius:9px;outline:none")} />
                          <button onClick={m.onInc} style={S('width:30px;height:30px;border-radius:9px;background:#e8112d;border:none;color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center')}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg></button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {vm.catalogEmpty && (
                <div style={S('background:#fbfbfc;border:1.5px dashed #e0e2e6;border-radius:22px;padding:48px;text-align:center;margin-top:8px')}>
                  <p style={S("margin:0;font-family:'Kanit';font-weight:600;font-size:17px;color:#374151")}>ไม่พบสื่อที่ตรงกับคำค้นหา</p>
                  <p style={S('margin:6px 0 16px;font-size:13px;color:#9ca3af')}>ลองเปลี่ยนคำค้นหรือเลือกประเภทอื่น</p>
                  <button onClick={vm.onClearFilters} style={S("padding:10px 22px;background:#111827;color:#fff;border:none;border-radius:999px;font-family:'Kanit';font-size:13.5px;cursor:pointer")}>แสดงสื่อทั้งหมด</button>
                </div>
              )}
            </section>

            {/* Other systems */}
            <section style={S('margin-top:38px')}>
              <h2 style={S("margin:0 0 4px;font-family:'Kanit';font-weight:700;font-size:22px")}>ระบบสารสนเทศอื่นๆ ของสำนักงาน</h2>
              <p style={S('margin:0 0 18px;font-size:13.5px;color:#6b7280')}>เข้าถึงบริการออนไลน์ที่เกี่ยวข้องกับการควบคุมเครื่องดื่มแอลกอฮอล์</p>
              <div style={S('display:grid;grid-template-columns:repeat(auto-fill,minmax(270px,1fr));gap:16px')}>
                {vm.systemsVM.map(s => (
                  <a key={s.name} href={s.url} target={s.target} rel="noreferrer" style={S('background:#fff;border:1px solid #eceef1;border-radius:18px;padding:18px;display:flex;align-items:flex-start;gap:14px;transition:all .2s')}>
                    <div style={S('width:46px;height:46px;border-radius:13px;background:#f6f7f9;display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0')}>{s.icon}</div>
                    <div style={S('flex:1;min-width:0')}>
                      <div style={S("font-size:10.5px;font-weight:600;color:#9ca3af;font-family:'Kanit';margin-bottom:2px")}>{s.cat}</div>
                      <h3 style={S("margin:0 0 4px;font-family:'Kanit';font-weight:600;font-size:14px;line-height:1.35;color:#111827")}>{s.name}</h3>
                      <p style={S('margin:0;font-size:12px;color:#6b7280;line-height:1.5')}>{s.desc}</p>
                    </div>
                  </a>
                ))}
              </div>
            </section>

          </main>

          {/* Footer */}
          <footer style={S('background:#141821;color:#c7ccd6;margin-top:20px')}>
            <div style={S('max-width:1200px;margin:0 auto;padding:40px 24px;display:grid;grid-template-columns:1.4fr 1fr 1fr;gap:32px')}>
              <div>
                <div style={S('display:flex;align-items:center;gap:12px;margin-bottom:12px')}>
                  <div style={S('width:40px;height:40px;border-radius:12px;background:#e8112d;display:flex;align-items:center;justify-content:center;color:#fff')}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg></div>
                  <div>
                    <h3 style={S("margin:0;font-family:'Kanit';font-weight:700;font-size:14.5px;color:#fff;line-height:1.3")}>สำนักงานคณะกรรมการควบคุมเครื่องดื่มแอลกอฮอล์</h3>
                    <p style={S('margin:2px 0 0;font-size:11.5px;color:#8b909b')}>กรมควบคุมโรค กระทรวงสาธารณสุข</p>
                  </div>
                </div>
                <p style={S('margin:0;font-size:12px;line-height:1.7;color:#8b909b')}>ขับเคลื่อน พ.ร.บ. ควบคุมเครื่องดื่มแอลกอฮอล์ พ.ศ. 2551 บังคับใช้กฎหมาย รณรงค์ป้องกัน และให้ความรู้พิษภัยจากเครื่องดื่มแอลกอฮอล์แก่ประชาชน</p>
              </div>
              <div>
                <h4 style={S("margin:0 0 12px;font-family:'Kanit';font-weight:700;font-size:13px;color:#fff;text-transform:uppercase;letter-spacing:.5px")}>ติดต่อและสายด่วน</h4>
                <p style={S('margin:0 0 9px;font-size:12px;line-height:1.6;color:#8b909b')}>อาคาร 3 ชั้น 5 กรมควบคุมโรค ถ.ติวานนท์ ต.ตลาดขวัญ อ.เมือง จ.นนทบุรี 11000</p>
                <p style={S('margin:0 0 9px;font-size:12px;color:#8b909b')}>สายด่วน: <strong style={S("color:#fff;font-family:'Space Mono'")}>1422</strong> (24 ชม.)</p>
                <a href="https://alcoholcontrol.ddc.moph.go.th" target="_blank" rel="noreferrer" style={S('font-size:12px;color:#ff8a97')}>alcoholcontrol.ddc.moph.go.th</a>
              </div>
              <div>
                <h4 style={S("margin:0 0 12px;font-family:'Kanit';font-weight:700;font-size:13px;color:#fff;text-transform:uppercase;letter-spacing:.5px")}>ลิงก์ที่เกี่ยวข้อง</h4>
                <div style={S('display:flex;flex-direction:column;gap:9px')}>
                  <a href="https://ddc.moph.go.th" target="_blank" rel="noreferrer" style={S('font-size:12px;color:#8b909b')}>กรมควบคุมโรค (DDC)</a>
                  <a href="https://www.moph.go.th" target="_blank" rel="noreferrer" style={S('font-size:12px;color:#8b909b')}>กระทรวงสาธารณสุข</a>
                  <a href="https://thaihealth.or.th" target="_blank" rel="noreferrer" style={S('font-size:12px;color:#8b909b')}>สสส.</a>
                </div>
              </div>
            </div>
            <div style={S('border-top:1px solid #262b36;padding:16px 24px;text-align:center')}><p style={S('margin:0;font-size:11px;color:#6b7078')}>© 2569 สำนักงานคณะกรรมการควบคุมเครื่องดื่มแอลกอฮอล์ · ระบบรุ่น v3.0</p></div>
          </footer>

        </div>

        {/* Sticky selection bar */}
        {vm.hasSelection && (
          <div style={S('position:fixed;left:0;right:0;bottom:0;z-index:40;display:flex;justify-content:center;padding:0 16px 18px;pointer-events:none')}>
            <div style={S('pointer-events:auto;background:#141821;color:#fff;border-radius:18px;padding:14px 16px 14px 22px;display:flex;align-items:center;gap:20px;box-shadow:0 20px 50px -12px rgba(0,0,0,.5);animation:slideUp .3s ease;max-width:720px;width:100%')}>
              <div style={S('display:flex;align-items:center;gap:14px;flex:1;min-width:0')}>
                <div style={S('width:44px;height:44px;border-radius:12px;background:rgba(232,17,45,.2);color:#ff8a97;display:flex;align-items:center;justify-content:center;flex-shrink:0')}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7.5 4.27 9 5.15" /><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /><path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" /></svg>
                </div>
                <div style={S('min-width:0')}>
                  <div style={S("font-family:'Kanit';font-weight:600;font-size:14.5px")}>เลือกขอจัดส่ง {vm.selCount} รายการ · รวม {vm.selTotal} ชิ้น</div>
                  <div style={S('font-size:12px;color:#9ca3af;white-space:nowrap;overflow:hidden;text-overflow:ellipsis')}>{vm.selNames}</div>
                </div>
              </div>
              <button onClick={vm.onStartRequest} style={S("display:inline-flex;align-items:center;gap:8px;padding:12px 22px;background:#e8112d;color:#fff;border:none;border-radius:999px;font-family:'Kanit';font-weight:600;font-size:14px;cursor:pointer;flex-shrink:0")}>
                <span>ดำเนินการขอ</span>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
