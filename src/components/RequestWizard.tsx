import { AppVM } from '../vm';
import { css } from '../lib/ui';
import { AlertIcon, ArrowLeftIcon, CheckCircleIcon, CheckIcon, InfoIcon, MinusIcon, PlusIcon, XIcon } from './icons';

const S = css;

function StepBar({ vm }: { vm: AppVM }) {
  const steps: [string, boolean][] = [['ตรวจรายการ', true], ['ที่อยู่จัดส่ง', vm.step === 2]];
  return (
    <div style={S('display:flex;gap:6px;padding:0 8px')}>
      {steps.map(([label, on], i) => (
        <div key={label} style={S('flex:1;display:flex;flex-direction:column;gap:5px')}>
          <span style={{ height: '4px', borderRadius: '999px', background: on ? '#e8112d' : '#e5e7eb' }} />
          <span style={{
            fontFamily: 'Kanit',
            fontWeight: vm.step === i + 1 ? 600 : 500,
            fontSize: '11.5px',
            color: vm.step === i + 1 ? '#141821' : '#9ca3af',
          }}>{label}</span>
        </div>
      ))}
    </div>
  );
}

export function RequestWizard({ vm }: { vm: AppVM }) {
  return (
    <div className="sheet-backdrop" role="dialog" aria-modal="true" aria-label="ขอสนับสนุนสื่อ">
      <div className="sheet">

        {/* หัวเรื่อง */}
        <div style={S('background:#fff;border-bottom:1px solid #eceef1;flex-shrink:0;padding:10px 12px 12px 8px')}>
          <div style={S('display:flex;align-items:center;gap:6px;margin-bottom:12px')}>
            <button onClick={vm.onBack} aria-label="ย้อนกลับ" style={S('width:40px;height:40px;border:none;background:none;color:#141821;cursor:pointer;display:flex;align-items:center;justify-content:center')}>
              {vm.isSuccess ? <XIcon size={20} /> : <ArrowLeftIcon size={20} />}
            </button>
            <h2 style={S("margin:0;flex:1;font-family:'Kanit';font-weight:600;font-size:16px;color:#141821")}>
              {vm.isSuccess ? 'ส่งคำขอสำเร็จ' : vm.isStep1 ? 'คำขอของคุณ' : 'ที่อยู่จัดส่ง'}
            </h2>
            {!vm.isSuccess && <span style={S("font-family:'Space Mono';font-weight:700;font-size:12px;color:#9ca3af;padding-right:8px")}>{vm.step} / 2</span>}
          </div>
          {!vm.isSuccess && <StepBar vm={vm} />}
        </div>

        {/* เนื้อหา */}
        <div className="scr" style={S('flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:14px;background:#f4f5f7')}>

          {vm.err && (
            <div style={S('display:flex;align-items:flex-start;gap:9px;background:#fef2f2;border:1px solid #fbd5da;color:#e8112d;padding:12px 14px;border-radius:12px;font-size:13px;font-weight:500')}>
              <AlertIcon size={17} style={S('flex-shrink:0;margin-top:1px')} />
              <span style={S('line-height:1.55')}>{vm.err}</span>
            </div>
          )}

          {/* ---------- ขั้นที่ 1: ตรวจรายการ ---------- */}
          {vm.isStep1 && (
            <>
              <div style={S('display:flex;flex-direction:column;gap:9px')}>
                {vm.cartVM.map(m => (
                  <div key={m.id} style={S('background:#fff;border:1px solid #dfe2e7;border-radius:12px;padding:12px')}>
                    <div style={S('display:flex;align-items:flex-start;gap:11px')}>
                      <div style={S('position:relative;width:56px;height:56px;border-radius:8px;overflow:hidden;background:#f1f2f4;flex-shrink:0')}>
                        <div style={m.fbStyle}>{m.catShort}</div>
                        {m.imageUrl && <img src={m.imageUrl} alt="" referrerPolicy="no-referrer" onError={vm.onImgErr} style={S('position:absolute;inset:0;width:100%;height:100%;object-fit:cover')} />}
                      </div>
                      <div style={S('flex:1;min-width:0')}>
                        <div style={S("font-family:'Kanit';font-weight:600;font-size:13px;color:#141821;line-height:1.4;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden")}>{m.title}</div>
                        <button onClick={m.onRemove} style={S('margin-top:5px;background:none;border:none;padding:0;color:#9ca3af;font-size:12px;cursor:pointer;font-family:inherit')}>นำออก</button>
                      </div>
                      <div style={S('display:flex;align-items:center;gap:7px;flex-shrink:0')}>
                        <button onClick={m.onDec} aria-label="ลดจำนวน" style={S('width:36px;height:36px;border-radius:8px;background:#fff;border:1px solid #e5e7eb;color:#374151;cursor:pointer;display:flex;align-items:center;justify-content:center')}><MinusIcon size={15} /></button>
                        <span style={S("min-width:30px;text-align:center;font-family:'Space Mono';font-weight:700;font-size:14px;color:#141821")}>{m.qty}</span>
                        <button onClick={m.onInc} aria-label="เพิ่มจำนวน" style={S('width:36px;height:36px;border-radius:8px;background:#e8112d;border:none;color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center')}><PlusIcon size={15} /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button onClick={() => { vm.onCloseWizard(); vm.onScreen('catalog'); }} style={S("height:46px;background:#fff;border:1px dashed #cbd0d6;border-radius:12px;font-family:'Kanit';font-weight:600;font-size:13.5px;color:#374151;cursor:pointer")}>＋ เพิ่มสื่ออื่นอีก</button>

              <div style={S('background:#fff;border:1px solid #dfe2e7;border-radius:12px;padding:14px 16px')}>
                <div style={S('display:flex;align-items:center;justify-content:space-between;padding-bottom:10px;border-bottom:1px solid #f1f2f4')}>
                  <span style={S('font-size:13px;color:#6b7280')}>จำนวนรายการ</span>
                  <span style={S("font-family:'Space Mono';font-weight:700;font-size:14px;color:#141821")}>{vm.cartCount}</span>
                </div>
                <div style={S('display:flex;align-items:center;justify-content:space-between;padding-top:10px')}>
                  <span style={S("font-family:'Kanit';font-weight:600;font-size:14px;color:#141821")}>รวมทั้งหมด</span>
                  <span style={S("font-family:'Space Mono';font-weight:700;font-size:17px;color:#e8112d")}>{vm.cartTotal} ชิ้น</span>
                </div>
              </div>

              <div style={S('display:flex;gap:10px;background:#eff6ff;border:1px solid #cfe0fb;border-radius:12px;padding:12px 14px')}>
                <InfoIcon size={17} stroke="#2563eb" style={S('flex-shrink:0;margin-top:1px')} />
                <p style={S('margin:0;font-size:12.5px;color:#1e40af;line-height:1.6')}>ขอได้ไม่เกิน 50 ชิ้นต่อรายการ · จัดส่งฟรีทางไปรษณีย์ ใช้เวลา 7–14 วันทำการ</p>
              </div>
            </>
          )}

          {/* ---------- ขั้นที่ 2: ที่อยู่จัดส่ง ---------- */}
          {vm.isStep2 && !vm.user && (
            <div style={S('background:#fff;border:1px solid #dfe2e7;border-radius:12px;padding:24px 18px;text-align:center')}>
              <div style={S("font-family:'Kanit';font-weight:600;font-size:15px;color:#141821")}>เข้าสู่ระบบเพื่อส่งคำขอ</div>
              <p style={S('margin:8px 0 16px;font-size:12.5px;color:#6b7280;line-height:1.6')}>
                ระบบจะบันทึกที่อยู่จัดส่งไว้ในบัญชีของคุณ ครั้งต่อไปเลือกได้เลยโดยไม่ต้องกรอกใหม่<br />
                สื่อที่เลือกไว้จะยังอยู่ครบหลังเข้าสู่ระบบ
              </p>
              <button onClick={() => vm.onOpenLogin('submit')} style={S("height:48px;padding:0 24px;background:#e8112d;color:#fff;border:none;border-radius:10px;font-family:'Kanit';font-weight:600;font-size:14px;cursor:pointer")}>
                เข้าสู่ระบบด้วย Google
              </button>
            </div>
          )}

          {vm.isStep2 && vm.user && (
            <>
              {(

                <div style={S('background:#fff;border:1px solid #dfe2e7;border-radius:12px;padding:12px 14px;display:flex;align-items:center;gap:11px')}>
                  {vm.user.avatarUrl
                    ? <img src={vm.user.avatarUrl} alt="" referrerPolicy="no-referrer" style={S('width:34px;height:34px;border-radius:999px;object-fit:cover;flex-shrink:0')} />
                    : <div style={S("width:34px;height:34px;border-radius:999px;background:#141821;color:#fff;display:flex;align-items:center;justify-content:center;font-family:'Kanit';font-weight:700;font-size:14px;flex-shrink:0")}>{vm.user.name.charAt(0).toUpperCase()}</div>}
                  <div style={S('flex:1;min-width:0')}>
                    <div style={S("font-family:'Kanit';font-weight:600;font-size:13.5px;color:#141821")}>{vm.user.name}</div>
                    <div style={S('font-size:11.5px;color:#9ca3af;overflow:hidden;text-overflow:ellipsis;white-space:nowrap')}>{vm.user.email} · ยืนยันตัวตนแล้ว</div>
                  </div>
                  <CheckIcon size={18} stroke="#10b981" style={S('flex-shrink:0')} />
                </div>
              )}

              {/* สมุดที่อยู่ */}
              <div>
                <div style={S('display:flex;align-items:baseline;justify-content:space-between;margin-bottom:9px')}>
                  <h3 style={S("margin:0;font-family:'Kanit';font-weight:600;font-size:14.5px;color:#141821")}>เลือกที่อยู่จัดส่ง</h3>
                  <span style={S('font-size:11.5px;color:#9ca3af')}>{vm.addrCountLabel}</span>
                </div>
                <div style={S('display:flex;flex-direction:column;gap:9px')}>
                  {vm.addressesVM.map(a => (
                    <button key={a.id} onClick={a.onPick} style={a.cardStyle}>
                      <span style={a.radioStyle} />
                      <span style={S('flex:1;min-width:0;display:flex;flex-direction:column;gap:3px;text-align:left')}>
                        <span style={S('display:flex;align-items:center;gap:7px;flex-wrap:wrap')}>
                          <span style={S("font-family:'Kanit';font-weight:600;font-size:13.5px;color:#141821")}>{a.label}</span>
                          {a.isDefault && <span style={S("font-size:10px;font-weight:600;padding:2px 7px;border-radius:4px;background:#f6f7f9;color:#6b7280;font-family:'Kanit'")}>ค่าเริ่มต้น</span>}
                        </span>
                        <span style={S('font-size:12.5px;color:#374151;line-height:1.5')}>{a.detail}</span>
                        <span style={S("font-size:11.5px;color:#9ca3af;font-family:'Space Mono'")}>{a.contactName} · {a.phone}</span>
                      </span>
                    </button>
                  ))}

                  {!vm.addrFormOpen ? (
                    <button onClick={vm.onOpenAddrForm} style={S("height:48px;background:#fff;border:1px dashed #cbd0d6;border-radius:12px;font-family:'Kanit';font-weight:600;font-size:13.5px;color:#e8112d;cursor:pointer")}>＋ เพิ่มที่อยู่ใหม่</button>
                  ) : (
                    <div style={S('background:#fff;border:1px solid #fbd5da;border-radius:12px;padding:14px;display:flex;flex-direction:column;gap:10px')}>
                      <div style={S("font-family:'Kanit';font-weight:600;font-size:13.5px;color:#e8112d")}>เพิ่มที่อยู่ใหม่</div>
                      <input
                        type="text" value={vm.newAddr.label} onChange={e => vm.onNewAddrField('label', e.target.value)}
                        placeholder="ชื่อหน่วยงาน เช่น รพ.สต. บ้านหนองไผ่" aria-label="ชื่อหน่วยงาน"
                        style={S('width:100%;height:44px;padding:0 13px;background:#f6f7f9;border:1px solid #e5e7eb;border-radius:10px;font-size:13.5px;font-family:inherit;outline:none')}
                      />
                      <input
                        type="text" value={vm.newAddr.contactName} onChange={e => vm.onNewAddrField('contactName', e.target.value)}
                        placeholder={`ชื่อ-สกุลผู้รับ (ว่างไว้ = ${vm.user?.name ?? 'ชื่อบัญชี'})`} aria-label="ชื่อ-สกุลผู้รับ"
                        style={S('width:100%;height:44px;padding:0 13px;background:#f6f7f9;border:1px solid #e5e7eb;border-radius:10px;font-size:13.5px;font-family:inherit;outline:none')}
                      />
                      <textarea
                        rows={2} value={vm.newAddr.detail} onChange={e => vm.onNewAddrField('detail', e.target.value)}
                        placeholder="ที่อยู่พร้อมรหัสไปรษณีย์" aria-label="ที่อยู่จัดส่ง"
                        style={S('width:100%;padding:11px 13px;background:#f6f7f9;border:1px solid #e5e7eb;border-radius:10px;font-size:13.5px;font-family:inherit;outline:none;resize:none')}
                      />
                      <input
                        type="tel" value={vm.newAddr.phone} onChange={e => vm.onNewAddrField('phone', e.target.value)}
                        placeholder="เบอร์ติดต่อ" aria-label="เบอร์ติดต่อ"
                        style={S("width:100%;height:44px;padding:0 13px;background:#f6f7f9;border:1px solid #e5e7eb;border-radius:10px;font-size:13.5px;font-family:'Space Mono';outline:none")}
                      />
                      <div style={S('display:flex;gap:9px')}>
                        <button onClick={vm.onCancelAddr} style={S("flex:1;height:44px;background:#f1f2f4;border:none;border-radius:10px;font-family:'Kanit';font-weight:500;font-size:13.5px;color:#374151;cursor:pointer")}>ยกเลิก</button>
                        <button onClick={vm.onSaveAddr} style={S("flex:1.4;height:44px;background:#e8112d;border:none;border-radius:10px;font-family:'Kanit';font-weight:600;font-size:13.5px;color:#fff;cursor:pointer")}>บันทึกและใช้ที่อยู่นี้</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* วัตถุประสงค์ */}
              <div>
                <h3 style={S("margin:0 0 9px;font-family:'Kanit';font-weight:600;font-size:14.5px;color:#141821")}>วัตถุประสงค์การใช้สื่อ</h3>
                <div style={S('display:flex;flex-wrap:wrap;gap:7px')}>
                  {vm.purposeChips.map(p => <button key={p.key} onClick={p.onPick} style={p.style}>{p.label}</button>)}
                </div>
              </div>

              {/* วันที่ต้องการใช้ */}
              <div>
                <h3 style={S("margin:0 0 9px;font-family:'Kanit';font-weight:600;font-size:14.5px;color:#141821")}>วันที่ต้องการใช้สื่อ</h3>
                <input
                  type="date" value={vm.requiredDate} onChange={vm.onRequiredDate} aria-label="วันที่ต้องการใช้สื่อ"
                  style={S('width:100%;height:48px;padding:0 13px;background:#fff;border:1px solid #dfe2e7;border-radius:12px;font-size:13.5px;font-family:inherit;color:#141821;outline:none')}
                />
                <p style={S('margin:8px 0 0;font-size:11.5px;color:#9ca3af;line-height:1.5')}>แนะนำให้ระบุล่วงหน้าอย่างน้อย 14 วัน เพื่อให้จัดส่งได้ทัน</p>
              </div>
            </>
          )}

          {/* ---------- สำเร็จ ---------- */}
          {vm.isSuccess && (
            <div style={S('text-align:center;padding:20px 4px')}>
              <div style={S('width:72px;height:72px;border-radius:999px;background:#ecfdf5;color:#047857;display:flex;align-items:center;justify-content:center;margin:0 auto 16px;animation:bounceIn .5s ease')}>
                <CheckCircleIcon size={40} strokeWidth={2.2} />
              </div>
              <h3 style={S("margin:0 0 6px;font-family:'Kanit';font-weight:700;font-size:21px;color:#141821")}>ส่งคำขอสำเร็จแล้ว</h3>
              <p style={S('margin:0 0 18px;font-size:13px;color:#6b7280;line-height:1.6')}>เจ้าหน้าที่จะตรวจสอบและจัดส่งสื่อตามที่อยู่ที่เลือกไว้</p>
              <div style={S('background:#fff;border:1px solid #dfe2e7;border-radius:12px;padding:14px 16px;text-align:left;margin-bottom:18px')}>
                <div style={S('display:flex;justify-content:space-between;align-items:center;padding-bottom:10px;border-bottom:1px solid #f1f2f4')}>
                  <span style={S('font-size:12.5px;color:#9ca3af')}>เลขที่อ้างอิงคำขอ</span>
                  <span style={S("font-family:'Space Mono';font-weight:700;font-size:16px;color:#e8112d")}>{vm.successRef}</span>
                </div>
                <div style={S('display:flex;justify-content:space-between;padding-top:10px;font-size:13px')}>
                  <span style={S('color:#9ca3af')}>สถานะ</span>
                  <span style={S('display:inline-flex;align-items:center;gap:6px;color:#b45309;font-weight:600')}>
                    <span style={S('width:7px;height:7px;border-radius:999px;background:#f59e0b')} />รอการอนุมัติ
                  </span>
                </div>
              </div>
              <div style={S('display:flex;flex-direction:column;gap:9px')}>
                <button onClick={() => { vm.onCloseWizard(); vm.onScreen('mine'); }} style={S("height:50px;background:#e8112d;color:#fff;border:none;border-radius:12px;font-family:'Kanit';font-weight:600;font-size:14.5px;cursor:pointer")}>ติดตามคำขอของฉัน</button>
                <button onClick={() => { vm.onCloseWizard(); vm.onScreen('home'); }} style={S("height:48px;background:#fff;color:#374151;border:1px solid #e5e7eb;border-radius:12px;font-family:'Kanit';font-weight:500;font-size:14px;cursor:pointer")}>กลับหน้าแรก</button>
              </div>
            </div>
          )}
        </div>

        {/* ปุ่มดำเนินการ */}
        {!vm.isSuccess && (
          <div style={S('flex-shrink:0;padding:12px 14px calc(14px + env(safe-area-inset-bottom));background:#fff;border-top:1px solid #eceef1')}>
            {vm.isStep2 && (
              <div style={S('display:flex;align-items:center;justify-content:space-between;margin-bottom:9px;gap:10px')}>
                <span style={S('font-size:12.5px;color:#6b7280')}>{vm.cartLabel}</span>
                <span style={S('font-size:11.5px;color:#9ca3af')}>{vm.user ? 'ลงชื่อเข้าใช้แล้ว · ส่งได้ทันที' : 'ต้องเข้าสู่ระบบก่อนส่ง'}</span>
              </div>
            )}
            <button
              onClick={vm.onNext}
              disabled={vm.submitting}
              style={{
                width: '100%', height: '52px', border: 'none', borderRadius: '12px',
                fontFamily: 'Kanit', fontWeight: 600, fontSize: '15px', color: '#fff',
                background: vm.submitting ? '#f19aa7' : '#e8112d',
                cursor: vm.submitting ? 'progress' : 'pointer',
                boxShadow: vm.submitting ? 'none' : '0 12px 28px -10px rgba(232,17,45,.55)',
              }}
            >
              {vm.submitting ? 'กำลังส่งคำขอ…' : vm.isStep1 ? 'ถัดไป — ที่อยู่จัดส่ง' : 'ยืนยันส่งคำขอ'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
