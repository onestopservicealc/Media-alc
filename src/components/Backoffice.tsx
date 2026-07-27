import { AppVM } from '../vm';
import { css, MEDIA_CATEGORIES, STATUSES } from '../lib/ui';
import { MediaEditPanel } from './backoffice/MediaEditPanel';
import { RequestDetail } from './backoffice/RequestDetail';
import {
  AlertIcon, ArrowLeftIcon, CheckIcon, DownloadIcon, EyeIcon, LogOutIcon, SearchIcon, TrashIcon,
} from './icons';

const S = css;

export function Backoffice({ vm }: { vm: AppVM }) {
  return (
    <div className="bo-shell">

      {/* เมนูข้าง */}
      <aside className="bo-side">
        <div style={S('padding:18px;display:flex;align-items:center;gap:11px;border-bottom:1px solid #262b36')}>
          <img src="/logo.png" alt="โลโก้ สำนักงานคณะกรรมการควบคุมเครื่องดื่มแอลกอฮอล์" width={34} height={34} style={S('width:34px;height:34px;border-radius:8px;object-fit:contain;flex-shrink:0;background:#fff')} />
          <div style={S('flex:1;min-width:0')}>
            <div style={S("font-family:'Kanit';font-weight:600;font-size:13.5px;line-height:1.2")}>ระบบจัดการสื่อ</div>
            <div style={S('font-size:10.5px;color:#8b909b')}>สคอ. · หลังบ้าน</div>
          </div>
          <button onClick={vm.onGotoPortal} aria-label="กลับหน้าประชาชน" style={S('width:34px;height:34px;border-radius:8px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.12);color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0')}>
            <ArrowLeftIcon size={16} />
          </button>
        </div>

        <nav className="bo-side-nav scr" style={S('padding:12px 10px;display:flex;flex-direction:column;gap:3px')}>
          {vm.boNav.map(n => (
            <button key={n.key} onClick={n.onPick} style={n.style}>
              <span style={n.markStyle} />
              {n.label}
              {n.hasCount && <span style={n.countStyle}>{n.count}</span>}
            </button>
          ))}
        </nav>

        <div className="bo-side-user" style={S('margin-top:auto;padding:14px;border-top:1px solid #262b36;display:flex;align-items:center;gap:10px')}>
          {vm.user?.avatarUrl
            ? <img src={vm.user.avatarUrl} alt="" referrerPolicy="no-referrer" style={S('width:32px;height:32px;border-radius:999px;object-fit:cover;flex-shrink:0')} />
            : <div style={S("width:32px;height:32px;border-radius:999px;background:#e8112d;display:flex;align-items:center;justify-content:center;font-family:'Kanit';font-weight:700;font-size:13px;flex-shrink:0")}>{(vm.user?.name ?? 'จ').charAt(0).toUpperCase()}</div>}
          <div style={S('flex:1;min-width:0')}>
            <div style={S("font-family:'Kanit';font-weight:500;font-size:12.5px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap")}>{vm.user?.name ?? 'เจ้าหน้าที่'}</div>
            <div style={S('font-size:10.5px;color:#8b909b')}>ผู้ดูแลระบบ · {vm.clock}</div>
          </div>
          <button onClick={vm.onLogout} aria-label="ออกจากระบบ" style={S('width:32px;height:32px;border-radius:8px;background:rgba(255,255,255,.08);border:none;color:#a8aeb9;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0')}>
            <LogOutIcon size={15} />
          </button>
        </div>
      </aside>

      {/* เนื้อหา */}
      <div className="bo-main">
        <div style={S('background:#fff;border-bottom:1px solid #e5e7eb;padding:14px 16px;display:flex;align-items:center;justify-content:space-between;gap:16px;flex-shrink:0;flex-wrap:wrap')}>
          <div>
            <div style={S("font-size:11.5px;color:#9ca3af;font-family:'Kanit'")}>หลังบ้าน / {vm.boCrumb}</div>
            <h2 style={S("margin:2px 0 0;font-family:'Kanit';font-weight:700;font-size:19px;color:#141821")}>{vm.boTitle}</h2>
          </div>
          <div style={S('display:flex;align-items:center;gap:10px;flex-wrap:wrap')}>
            {vm.boView === 'requests' && (
              <button onClick={vm.onBoExport} style={S("height:40px;padding:0 15px;background:#fff;border:1px solid #e5e7eb;border-radius:9px;font-family:'Kanit';font-weight:500;font-size:13px;color:#374151;cursor:pointer;display:inline-flex;align-items:center;gap:7px")}>
                <DownloadIcon size={15} />ส่งออก Excel
              </button>
            )}
            <button onClick={vm.onOpenAdd} style={S("height:40px;padding:0 16px;background:#e8112d;border:none;border-radius:9px;font-family:'Kanit';font-weight:600;font-size:13px;color:#fff;cursor:pointer")}>＋ เพิ่มสื่อใหม่</button>
          </div>
        </div>

        {/* ---------------- คำขอที่เข้ามา ---------------- */}
        {vm.boView === 'requests' && (
          <div className="bo-body">

            <div className="bo-kpis">
              {vm.boKpis.map(k => (
                <button key={k.key} onClick={k.onPick} style={k.style}>
                  <span style={S("font-size:12px;color:#6b7280;font-family:'Kanit';font-weight:500")}>{k.label}</span>
                  <span style={S('display:flex;align-items:baseline;gap:6px;margin-top:6px')}>
                    <span style={k.valueStyle}>{k.value}</span>
                    <span style={S('font-size:11.5px;color:#9ca3af')}>รายการ</span>
                  </span>
                </button>
              ))}
            </div>

            {/* ตัวกรอง */}
            <div style={S('background:#fff;border:1px solid #e5e7eb;border-radius:12px;padding:14px 16px;margin-bottom:14px;display:flex;align-items:center;gap:10px;flex-wrap:wrap')}>
              <div style={S('flex:1;min-width:240px;position:relative;display:flex;align-items:center')}>
                <SearchIcon size={17} stroke="#9ca3af" style={S('position:absolute;left:12px;pointer-events:none')} />
                <input
                  type="text" value={vm.boQ} onChange={vm.onBoQ}
                  placeholder="ค้นหาเลขที่คำขอ ชื่อผู้ขอ หรือหน่วยงาน" aria-label="ค้นหาคำขอ"
                  style={S('width:100%;height:40px;padding:0 12px 0 36px;background:#f6f7f9;border:1px solid #e5e7eb;border-radius:9px;font-size:13px;font-family:inherit;outline:none')}
                />
              </div>
              <div style={S('display:flex;align-items:center;gap:7px')}>
                <span style={S("font-size:12px;color:#9ca3af;font-family:'Kanit'")}>จังหวัด</span>
                <select value={vm.boProv} onChange={vm.onBoProv} aria-label="กรองตามจังหวัด" style={S('height:40px;padding:0 10px;background:#fff;border:1px solid #e5e7eb;border-radius:9px;font-size:13px;font-family:inherit;color:#374151;outline:none;cursor:pointer')}>
                  {vm.provinces.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div style={S('display:flex;align-items:center;gap:7px')}>
                <span style={S("font-size:12px;color:#9ca3af;font-family:'Kanit'")}>ยื่นระหว่าง</span>
                <input type="date" value={vm.boFrom} onChange={vm.onBoFrom} aria-label="ตั้งแต่วันที่" style={S('height:40px;padding:0 10px;background:#fff;border:1px solid #e5e7eb;border-radius:9px;font-size:12.5px;font-family:inherit;color:#374151;outline:none')} />
                <span style={S('color:#9ca3af')}>–</span>
                <input type="date" value={vm.boTo} onChange={vm.onBoTo} aria-label="ถึงวันที่" style={S('height:40px;padding:0 10px;background:#fff;border:1px solid #e5e7eb;border-radius:9px;font-size:12.5px;font-family:inherit;color:#374151;outline:none')} />
              </div>
              <button onClick={vm.onBoClear} style={S("height:40px;padding:0 14px;background:#f1f2f4;border:none;border-radius:9px;font-family:'Kanit';font-weight:500;font-size:12.5px;color:#374151;cursor:pointer")}>ล้าง</button>
            </div>

            {/* ชิปสถานะ */}
            <div style={S('display:flex;align-items:center;gap:8px;margin-bottom:14px;flex-wrap:wrap')}>
              {vm.boStatusChips.map(c => (
                <button key={c.key} onClick={c.onPick} style={c.style}>
                  {c.label}<span style={c.countStyle}>{c.count}</span>
                </button>
              ))}
              <span style={S('flex:1')} />
              <span style={S('font-size:12.5px;color:#6b7280')}>แสดง <strong style={S("font-family:'Space Mono';color:#141821")}>{vm.boCount}</strong> จาก {vm.boTotal} คำขอ</span>
            </div>

            {/* แถบเลือกหลายรายการ */}
            {vm.boSelCount > 0 && (
              <div style={S('background:#141821;border-radius:10px;padding:10px 14px;margin-bottom:12px;display:flex;align-items:center;gap:14px;color:#fff;flex-wrap:wrap')}>
                <span style={S("font-family:'Kanit';font-weight:600;font-size:13px")}>{vm.boSelLabel}</span>
                <span style={S('flex:1')} />
                <span style={S('font-size:12px;color:#a8aeb9')}>เปลี่ยนสถานะพร้อมกัน:</span>
                {vm.boBulk.map(b => <button key={b.label} onClick={b.onPick} style={b.style}>{b.label}</button>)}
                <button onClick={vm.onBoClearSel} style={S('background:none;border:none;color:#a8aeb9;font-size:12.5px;cursor:pointer;font-family:inherit;padding:0 2px')}>ยกเลิก</button>
              </div>
            )}

            {/* ตารางคำขอ */}
            <div style={S('background:#fff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden')}>
              <div className="table-scroll">
                <div className="bo-req-row" style={S("background:#fbfbfc;border-bottom:1px solid #e5e7eb;font-family:'Kanit';font-weight:600;font-size:11.5px;color:#9ca3af")}>
                  <span /><span>เลขที่คำขอ</span><span>ผู้ขอ / หน่วยงาน</span><span>จังหวัด</span><span>รายการ</span><span>วันที่ต้องใช้</span><span>สถานะ</span>
                </div>

                {vm.boRows.map(r => (
                  <div key={r.id} className="bo-req-row" style={r.rowStyle}>
                    <button onClick={r.onToggle} aria-label={`เลือกคำขอ ${r.refNumber}`} style={r.checkStyle}>
                      {r.checked && <CheckIcon size={13} stroke="#fff" strokeWidth={3.2} />}
                    </button>
                    <div>
                      <div style={S("font-family:'Space Mono';font-weight:700;font-size:12.5px;color:#e8112d")}>{r.refNumber}</div>
                      <div style={S("font-size:11px;color:#9ca3af;font-family:'Space Mono';margin-top:2px")}>{r.submittedAt}</div>
                    </div>
                    <div style={S('min-width:0')}>
                      <div style={S("font-family:'Kanit';font-weight:600;font-size:13px;color:#141821;overflow:hidden;text-overflow:ellipsis;white-space:nowrap")}>{r.fullName}</div>
                      <div style={S('font-size:11.5px;color:#6b7280;overflow:hidden;text-overflow:ellipsis;white-space:nowrap')}>{r.agencyName} · {r.phoneNumber}</div>
                    </div>
                    <div style={S('font-size:12.5px;color:#374151;overflow:hidden;text-overflow:ellipsis;white-space:nowrap')}>{r.province}</div>
                    <div style={S("font-family:'Space Mono';font-size:12.5px;color:#374151")}>{r.itemsLabel}</div>
                    <div style={S("font-size:12.5px;color:#374151;font-family:'Space Mono'")}>{r.requiredDateLabel}</div>
                    <div style={S('display:flex;align-items:center;gap:8px')}>
                      <select value={r.status} onChange={r.onStatus} aria-label={`สถานะของ ${r.refNumber}`} style={r.statusSelect}>
                        {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                      <button onClick={r.onOpen} aria-label={`ดูรายละเอียด ${r.refNumber}`} style={S('width:30px;height:30px;border-radius:8px;background:#f6f7f9;border:1px solid #e5e7eb;color:#6b7280;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0')}>
                        <EyeIcon size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {vm.boEmpty && (
                <div style={S('padding:52px 20px;text-align:center')}>
                  <div style={S("font-family:'Kanit';font-weight:600;font-size:15px;color:#374151")}>ไม่พบคำขอที่ตรงกับตัวกรอง</div>
                  <button onClick={vm.onBoClear} style={S("margin-top:12px;height:40px;padding:0 18px;background:#141821;color:#fff;border:none;border-radius:9px;font-family:'Kanit';font-weight:600;font-size:13px;cursor:pointer")}>ล้างตัวกรอง</button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ---------------- คลังสื่อ ---------------- */}
        {vm.boView === 'catalog' && (
          <div style={S('flex:1;min-height:0;display:flex')}>
            <div className="bo-body" style={S('flex:1;min-width:0')}>

              <div style={S('background:#fff;border:1px solid #e5e7eb;border-radius:12px;padding:14px 16px;margin-bottom:14px;display:flex;align-items:center;gap:10px;flex-wrap:wrap')}>
                <div style={S('flex:1;min-width:240px;position:relative;display:flex;align-items:center')}>
                  <SearchIcon size={17} stroke="#9ca3af" style={S('position:absolute;left:12px;pointer-events:none')} />
                  <input
                    type="text" value={vm.boCatQ} onChange={vm.onBoCatQ}
                    placeholder="ค้นหาชื่อสื่อในคลัง" aria-label="ค้นหาสื่อในคลัง"
                    style={S('width:100%;height:40px;padding:0 12px 0 36px;background:#f6f7f9;border:1px solid #e5e7eb;border-radius:9px;font-size:13px;font-family:inherit;outline:none')}
                  />
                </div>
                {vm.boCatChips.map(c => <button key={c.key} onClick={c.onPick} style={c.style}>{c.label}</button>)}
              </div>

              <div style={S('background:#fff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden')}>
                <div className="table-scroll">
                  <div className="bo-cat-row" style={S("background:#fbfbfc;border-bottom:1px solid #e5e7eb;font-family:'Kanit';font-weight:600;font-size:11.5px;color:#9ca3af")}>
                    <span>รูป</span><span>ชื่อสื่อ</span><span>ประเภท</span><span>จำกัด/ครั้ง</span><span>คงคลัง</span><span>จัดการ</span>
                  </div>

                  {vm.boCatRows.map(m => (
                    <div key={m.id} className="bo-cat-row" style={m.rowStyle}>
                      <div
                        onClick={() => m.imageUrl && vm.onOpenLightbox(m.imageUrl)}
                        style={{ ...S('position:relative;width:44px;height:44px;border-radius:8px;overflow:hidden;background:#f1f2f4'), cursor: m.imageUrl ? 'zoom-in' : 'default' }}
                      >
                        <div style={m.fbStyle}>{m.catShort}</div>
                        {m.imageUrl && <img src={m.imageUrl} alt="" referrerPolicy="no-referrer" onError={vm.onImgErr} style={S('position:absolute;inset:0;width:100%;height:100%;object-fit:cover')} />}
                      </div>
                      <div style={S('min-width:0')}>
                        <div style={S("font-family:'Kanit';font-weight:600;font-size:13px;color:#141821;overflow:hidden;text-overflow:ellipsis;white-space:nowrap")}>{m.title}</div>
                        <div style={S('font-size:11.5px;color:#9ca3af;overflow:hidden;text-overflow:ellipsis;white-space:nowrap')}>{m.description}</div>
                      </div>
                      <div><span style={S("font-size:11px;font-weight:600;padding:3px 9px;border-radius:5px;background:#f6f7f9;color:#6b7280;font-family:'Kanit'")}>{m.catShort}</span></div>
                      <div style={S("font-family:'Space Mono';font-size:12.5px;color:#374151")}>{m.maxAllowed}</div>
                      <div style={S('display:flex;align-items:center;gap:7px')}>
                        <span style={m.stockDot} />
                        <span style={S("font-family:'Space Mono';font-weight:700;font-size:12.5px;color:#141821")}>{m.stockText}</span>
                      </div>
                      <div style={S('display:flex;align-items:center;gap:6px')}>
                        <button onClick={m.onEdit} style={S("height:32px;padding:0 12px;background:#fff;border:1px solid #e5e7eb;border-radius:8px;font-family:'Kanit';font-weight:500;font-size:12px;color:#374151;cursor:pointer")}>แก้ไข</button>
                        <button onClick={m.onDelete} aria-label={`ลบ ${m.title}`} style={S('width:32px;height:32px;border-radius:8px;background:#fef2f2;border:none;color:#e8112d;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0')}>
                          <TrashIcon size={15} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {vm.boCatEmpty && (
                  <div style={S('padding:52px 20px;text-align:center')}>
                    <div style={S("font-family:'Kanit';font-weight:600;font-size:15px;color:#374151")}>ไม่พบสื่อที่ตรงกับคำค้น</div>
                  </div>
                )}
              </div>

              <div style={S('display:flex;gap:9px;background:#fffbeb;border:1px solid #fde68a;border-radius:10px;padding:10px 12px;margin-top:14px')}>
                <AlertIcon size={16} stroke="#b45309" style={S('flex-shrink:0;margin-top:1px')} />
                <p style={S('margin:0;font-size:12px;color:#92400e;line-height:1.55')}>จุดสีส้มคือคงคลังต่ำกว่า 500 ชิ้น · สีแดงคือหมดคลัง ระบบจะปิดปุ่มขอสื่อในหน้าประชาชนอัตโนมัติ</p>
              </div>
            </div>

            {vm.editOpen && <MediaEditPanel vm={vm} categories={[...MEDIA_CATEGORIES]} />}
          </div>
        )}
      </div>

      {vm.boDetail && <RequestDetail vm={vm} />}
    </div>
  );
}
