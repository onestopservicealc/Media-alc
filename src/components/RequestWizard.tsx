import React from 'react';
import { AppVM } from '../vm';
import { css } from '../lib/ui';

const S = css;

export function RequestWizard({ vm }: { vm: AppVM }) {
  return (
    <div style={S('position:fixed;inset:0;z-index:60;background:rgba(17,20,27,.6);backdrop-filter:blur(4px);display:flex;align-items:flex-start;justify-content:center;padding:24px 16px;overflow-y:auto;animation:fadeIn .2s ease')}>
      <div style={S('background:#fff;width:100%;max-width:780px;border-radius:26px;overflow:hidden;box-shadow:0 40px 90px -20px rgba(0,0,0,.5);margin:auto;animation:pop .28s ease')}>

        {/* Header */}
        <div style={S('background:linear-gradient(120deg,#141821,#1f2430);padding:20px 26px;display:flex;align-items:center;justify-content:space-between;color:#fff')}>
          <div style={S('display:flex;align-items:center;gap:13px')}>
            <div style={S('width:42px;height:42px;border-radius:13px;background:#e8112d;display:flex;align-items:center;justify-content:center')}><svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z" /></svg></div>
            <div>
              <h2 style={S("margin:0;font-family:'Kanit';font-weight:700;font-size:18px")}>ขอจัดส่งสื่อประชาสัมพันธ์</h2>
              <p style={S('margin:1px 0 0;font-size:12px;color:#9ca3af')}>กรอกทีละขั้นตอน ใช้เวลาไม่เกิน 2 นาที</p>
            </div>
          </div>
          <button onClick={vm.onCloseWizard} style={S('width:36px;height:36px;border-radius:999px;background:rgba(255,255,255,.1);border:none;color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center')}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg></button>
        </div>

        {/* Stepper */}
        {vm.showStepper && (
          <div style={S('padding:20px 26px 4px;display:flex;align-items:center;gap:6px')}>
            {vm.steps.map(st => (
              <div key={st.label} style={S('display:flex;align-items:center;gap:10px;flex:1')}>
                <div style={st.circle}>{st.mark}</div>
                <div style={S('flex:1;min-width:0')}><div style={st.labelStyle}>{st.label}</div></div>
                {st.showBar && <div style={st.bar} />}
              </div>
            ))}
          </div>
        )}

        <div style={S('padding:20px 26px 26px')}>

          {vm.err && (
            <div style={S('display:flex;align-items:center;gap:9px;background:#fef2f2;border:1px solid #fbd5da;color:#e8112d;padding:12px 14px;border-radius:14px;font-size:13.5px;font-weight:500;margin-bottom:16px')}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
              <span>{vm.err}</span>
            </div>
          )}

          {/* Step 1: choose media */}
          {vm.isStep1 && (
            <div style={S('animation:fadeIn .25s ease')}>
              <h3 style={S("margin:0 0 4px;font-family:'Kanit';font-weight:600;font-size:16px")}>เลือกสื่อที่ต้องการจัดส่ง</h3>
              <p style={S('margin:0 0 14px;font-size:13px;color:#6b7280')}>ติ๊กเลือกและระบุจำนวน — จำกัดไม่เกิน 50 ชิ้นต่อรายการ</p>
              <div style={S('max-height:380px;overflow-y:auto;display:flex;flex-direction:column;gap:10px;padding-right:4px')}>
                {vm.catalogVM.map(m => (
                  <div key={m.id} style={m.rowStyle}>
                    <div style={S('position:relative;width:56px;height:56px;border-radius:12px;overflow:hidden;flex-shrink:0;background:#f1f2f4')}>
                      <div style={m.fbStyleSm}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21" /></svg></div>
                      <img src={m.imageUrl} alt={m.title} referrerPolicy="no-referrer" onError={vm.onImgErr} style={S('position:absolute;inset:0;width:100%;height:100%;object-fit:cover')} />
                    </div>
                    <div style={S('flex:1;min-width:0')}>
                      <div style={S("font-size:10.5px;font-weight:600;color:#9ca3af;font-family:'Kanit'")}>{m.category}</div>
                      <h4 style={S("margin:1px 0 0;font-family:'Kanit';font-weight:600;font-size:13.5px;line-height:1.35")}>{m.title}</h4>
                    </div>
                    {m.selected ? (
                      <div style={S('display:flex;align-items:center;gap:7px;flex-shrink:0')}>
                        <button onClick={m.onDec} style={S('width:28px;height:28px;border-radius:8px;background:#fff;border:1px solid #e5e7eb;color:#374151;cursor:pointer;display:flex;align-items:center;justify-content:center')}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12" /></svg></button>
                        <input type="number" value={m.qty} onChange={m.onQty} style={S("width:46px;text-align:center;font-family:'Space Mono';font-weight:700;font-size:13px;padding:5px 2px;background:#fff;border:1px solid #e5e7eb;border-radius:8px;outline:none")} />
                        <button onClick={m.onInc} style={S('width:28px;height:28px;border-radius:8px;background:#e8112d;border:none;color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center')}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg></button>
                        <button onClick={m.onToggle} style={S('width:28px;height:28px;border-radius:8px;background:#fff5f6;border:1px solid #fbd5da;color:#e8112d;cursor:pointer;display:flex;align-items:center;justify-content:center')}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg></button>
                      </div>
                    ) : (
                      <button onClick={m.onToggle} style={S("display:inline-flex;align-items:center;gap:6px;padding:8px 14px;background:#fff;border:1.5px solid #d5d7dd;border-radius:999px;font-family:'Kanit';font-weight:500;font-size:12.5px;color:#111827;cursor:pointer;flex-shrink:0")}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg><span>เลือก</span></button>
                    )}
                  </div>
                ))}
              </div>
              <div style={S('margin-top:14px;padding:13px 16px;background:#f6f7f9;border-radius:14px;display:flex;align-items:center;justify-content:space-between')}>
                <span style={S('font-size:13px;color:#6b7280')}>เลือกแล้ว <strong style={S("color:#e8112d;font-family:'Space Mono'")}>{vm.selCount}</strong> รายการ</span>
                <span style={S('font-size:13px;color:#6b7280')}>รวม <strong style={S("color:#e8112d;font-family:'Space Mono'")}>{vm.selTotal}</strong> ชิ้น</span>
              </div>
            </div>
          )}

          {/* Step 2: shipping info */}
          {vm.isStep2 && (
            <div style={S('animation:fadeIn .25s ease')}>
              <h3 style={S("margin:0 0 14px;font-family:'Kanit';font-weight:600;font-size:16px")}>ข้อมูลผู้ขอและที่อยู่จัดส่ง</h3>
              <div style={S('display:grid;grid-template-columns:1fr 1fr;gap:14px')}>
                <div>
                  <label style={S('display:block;font-size:12.5px;font-weight:600;color:#374151;margin-bottom:5px')}>ชื่อ - สกุล ผู้ขอ <span style={S('color:#e8112d')}>*</span></label>
                  <input type="text" value={vm.form.fullName} onChange={vm.onFullName} placeholder="เช่น นายสมชาย ใจดี" style={S('width:100%;padding:11px 14px;background:#f6f7f9;border:1px solid #e5e7eb;border-radius:12px;font-size:13.5px;outline:none')} />
                </div>
                <div>
                  <label style={S('display:block;font-size:12.5px;font-weight:600;color:#374151;margin-bottom:5px')}>หน่วยงาน / สถานที่ <span style={S('color:#e8112d')}>*</span></label>
                  <input type="text" value={vm.form.agency} onChange={vm.onAgency} placeholder="เช่น รพ.สต. บ้านค่าย" style={S('width:100%;padding:11px 14px;background:#f6f7f9;border:1px solid #e5e7eb;border-radius:12px;font-size:13.5px;outline:none')} />
                </div>
                <div>
                  <label style={S('display:block;font-size:12.5px;font-weight:600;color:#374151;margin-bottom:5px')}>หมายเลขโทรศัพท์ <span style={S('color:#e8112d')}>*</span></label>
                  <input type="tel" value={vm.form.phone} onChange={vm.onPhone} placeholder="เช่น 081-234-5678" style={S('width:100%;padding:11px 14px;background:#f6f7f9;border:1px solid #e5e7eb;border-radius:12px;font-size:13.5px;outline:none')} />
                </div>
                <div>
                  <label style={S('display:block;font-size:12.5px;font-weight:600;color:#374151;margin-bottom:5px')}>วันที่ต้องการใช้สื่อ <span style={S('color:#e8112d')}>*</span></label>
                  <input type="date" value={vm.form.date} onChange={vm.onDate} style={S('width:100%;padding:11px 14px;background:#f6f7f9;border:1px solid #e5e7eb;border-radius:12px;font-size:13.5px;outline:none')} />
                </div>
              </div>
              <div style={S('margin-top:14px')}>
                <label style={S('display:block;font-size:12.5px;font-weight:600;color:#374151;margin-bottom:5px')}>ที่อยู่จัดส่ง (พร้อมรหัสไปรษณีย์) <span style={S('color:#e8112d')}>*</span></label>
                <textarea rows={2} value={vm.form.address} onChange={vm.onAddress} placeholder="ระบุที่อยู่ให้ชัดเจนสำหรับการจัดส่งทางพัสดุ" style={S('width:100%;padding:11px 14px;background:#f6f7f9;border:1px solid #e5e7eb;border-radius:12px;font-size:13.5px;outline:none;resize:none;font-family:inherit')} />
              </div>
              <div style={S('margin-top:14px')}>
                <label style={S('display:block;font-size:12.5px;font-weight:600;color:#374151;margin-bottom:5px')}>วัตถุประสงค์การใช้สื่อ <span style={S('color:#e8112d')}>*</span></label>
                <textarea rows={2} value={vm.form.purpose} onChange={vm.onPurpose} placeholder="เช่น จัดบูธนิทรรศการรณรงค์วันงดดื่มสุราแห่งชาติ" style={S('width:100%;padding:11px 14px;background:#f6f7f9;border:1px solid #e5e7eb;border-radius:12px;font-size:13.5px;outline:none;resize:none;font-family:inherit')} />
              </div>
            </div>
          )}

          {/* Step 3: review */}
          {vm.isStep3 && (
            <div style={S('animation:fadeIn .25s ease')}>
              <h3 style={S("margin:0 0 14px;font-family:'Kanit';font-weight:600;font-size:16px")}>ตรวจทานคำขอก่อนส่ง</h3>
              <div style={S('background:#f6f7f9;border-radius:16px;padding:16px 18px;margin-bottom:14px')}>
                <div style={S("font-size:11px;font-weight:600;color:#9ca3af;font-family:'Kanit';text-transform:uppercase;letter-spacing:.5px;margin-bottom:10px")}>ข้อมูลผู้ขอ</div>
                <div style={S('display:grid;grid-template-columns:1fr 1fr;gap:10px 20px;font-size:13px')}>
                  <div><span style={S('color:#9ca3af')}>ผู้ขอ:</span> <strong>{vm.form.fullName}</strong></div>
                  <div><span style={S('color:#9ca3af')}>หน่วยงาน:</span> <strong>{vm.form.agency}</strong></div>
                  <div><span style={S('color:#9ca3af')}>โทร:</span> <strong>{vm.form.phone}</strong></div>
                  <div><span style={S('color:#9ca3af')}>วันที่ใช้:</span> <strong>{vm.form.date}</strong></div>
                  <div style={S('grid-column:1/3')}><span style={S('color:#9ca3af')}>จัดส่งที่:</span> <strong>{vm.form.address}</strong></div>
                  <div style={S('grid-column:1/3')}><span style={S('color:#9ca3af')}>วัตถุประสงค์:</span> <strong>{vm.form.purpose}</strong></div>
                </div>
              </div>
              <div style={S('border:1px solid #eceef1;border-radius:16px;overflow:hidden')}>
                <div style={S("padding:11px 16px;background:#fbfbfc;border-bottom:1px solid #eceef1;font-size:11px;font-weight:600;color:#9ca3af;font-family:'Kanit';text-transform:uppercase;letter-spacing:.5px")}>รายการสื่อที่ขอ ({vm.selCount})</div>
                {vm.selectedVM.map(i => (
                  <div key={i.id} style={S('display:flex;align-items:center;gap:12px;padding:11px 16px;border-bottom:1px solid #f1f2f4')}>
                    <div style={S('position:relative;width:40px;height:40px;border-radius:9px;overflow:hidden;flex-shrink:0;background:#f1f2f4')}>
                      <div style={i.fbStyleSm}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21" /></svg></div>
                      <img src={i.imageUrl} alt={i.title} referrerPolicy="no-referrer" onError={vm.onImgErr} style={S('position:absolute;inset:0;width:100%;height:100%;object-fit:cover')} />
                    </div>
                    <span style={S("flex:1;font-size:13px;font-family:'Kanit'")}>{i.title}</span>
                    <span style={S("font-family:'Space Mono';font-weight:700;font-size:13px;color:#e8112d")}>{i.qty} ชิ้น</span>
                  </div>
                ))}
                <div style={S('display:flex;align-items:center;justify-content:space-between;padding:12px 16px;background:#fff5f6')}><span style={S("font-family:'Kanit';font-weight:600;font-size:13.5px")}>รวมทั้งหมด</span><span style={S("font-family:'Space Mono';font-weight:700;font-size:15px;color:#e8112d")}>{vm.selTotal} ชิ้น</span></div>
              </div>
            </div>
          )}

          {/* Success */}
          {vm.isSuccess && (
            <div style={S('text-align:center;padding:8px 0 4px;animation:fadeIn .3s ease')}>
              <div style={S('width:72px;height:72px;border-radius:999px;background:#eef7f0;color:#047857;display:flex;align-items:center;justify-content:center;margin:0 auto 16px;animation:bounceIn .5s ease')}><svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg></div>
              <h3 style={S("margin:0 0 6px;font-family:'Kanit';font-weight:700;font-size:22px")}>ส่งคำขอสำเร็จแล้ว!</h3>
              <p style={S('margin:0 0 18px;font-size:13.5px;color:#6b7280')}>เจ้าหน้าที่จะตรวจสอบและจัดส่งสื่อตามที่ท่านระบุ</p>
              <div style={S('background:#f6f7f9;border-radius:16px;padding:16px 18px;max-width:420px;margin:0 auto 20px;text-align:left')}>
                <div style={S('display:flex;justify-content:space-between;align-items:center;padding-bottom:10px;border-bottom:1px solid #e5e7eb')}><span style={S('font-size:12.5px;color:#9ca3af')}>เลขที่อ้างอิงคำขอ</span><span style={S("font-family:'Space Mono';font-weight:700;font-size:16px;color:#e8112d")}>{vm.successRef}</span></div>
                <div style={S('display:flex;justify-content:space-between;padding-top:10px;font-size:13px')}><span style={S('color:#9ca3af')}>สถานะ</span><span style={S('display:inline-flex;align-items:center;gap:6px;color:#b45309;font-weight:600')}><span style={S('width:7px;height:7px;border-radius:999px;background:#f59e0b')} />รอการอนุมัติ</span></div>
              </div>
              <button onClick={vm.onCloseWizard} style={S("padding:13px 30px;background:#e8112d;color:#fff;border:none;border-radius:999px;font-family:'Kanit';font-weight:600;font-size:14.5px;cursor:pointer")}>เสร็จสิ้น / กลับหน้าหลัก</button>
            </div>
          )}

          {/* Nav */}
          {vm.showNav && (
            <div style={S('display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:22px;padding-top:18px;border-top:1px solid #eceef1')}>
              <button onClick={vm.onBack} style={vm.backBtnStyle}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg><span>{vm.backLabel}</span></button>
              <button onClick={vm.onNext} style={S("display:inline-flex;align-items:center;gap:8px;padding:13px 26px;background:#e8112d;color:#fff;border:none;border-radius:999px;font-family:'Kanit';font-weight:600;font-size:14.5px;cursor:pointer;box-shadow:0 10px 24px -8px rgba(232,17,45,.5)")}><span>{vm.nextLabel}</span><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg></button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
