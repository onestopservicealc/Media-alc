import { AppVM } from '../../vm';
import { css } from '../../lib/ui';
import { ArrowRightIcon, HistoryIcon, SearchIcon } from '../icons';

const S = css;

export function HomeScreen({ vm }: { vm: AppVM }) {
  const latest = vm.latestRequest;

  return (
    <div style={S('display:flex;flex-direction:column;gap:16px')}>

      {/* ค้นหา — พาไปหน้าคลังสื่อ */}
      <button
        onClick={() => vm.onScreen('catalog')}
        style={S('display:flex;align-items:center;gap:10px;width:100%;height:48px;padding:0 14px;background:#fff;border:1px solid #dfe2e7;border-radius:12px;cursor:pointer;text-align:left')}
      >
        <SearchIcon size={18} stroke="#9ca3af" />
        <span style={S('font-size:14px;color:#9ca3af')}>ค้นหาสื่อ เช่น “ห้ามขาย” “เข้าพรรษา”</span>
      </button>

      {/* ฮีโร่ */}
      <div style={S('background:#141821;border-radius:14px;padding:20px 18px;color:#fff')}>
        <div style={S("display:inline-flex;align-items:center;gap:6px;padding:4px 10px;border-radius:5px;background:rgba(232,17,45,.22);color:#ff98a4;font-family:'Kanit';font-weight:600;font-size:11px")}>ฟรี ไม่มีค่าใช้จ่าย</div>
        <h2 style={S("margin:11px 0 6px;font-family:'Kanit';font-weight:700;font-size:22px;line-height:1.3")}>ขอสื่อรณรงค์<br />ส่งถึงหน่วยงานของคุณ</h2>
        <p style={S('margin:0 0 16px;font-size:12.5px;color:#a8aeb9;line-height:1.6')}>แผ่นพับ · โปสเตอร์ · สติ๊กเกอร์ · คู่มือ — ไม่เกิน 50 ชิ้นต่อรายการ</p>
        <div style={S('display:flex;gap:9px')}>
          <button onClick={() => vm.onScreen('catalog')} style={S("flex:1;max-width:280px;height:46px;background:#e8112d;color:#fff;border:none;border-radius:10px;font-family:'Kanit';font-weight:600;font-size:14.5px;cursor:pointer")}>เลือกสื่อจากคลัง</button>
          <button onClick={() => vm.onScreen('mine')} aria-label="ติดตามคำขอของฉัน" style={S('width:46px;height:46px;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.18);border-radius:10px;color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center')}>
            <HistoryIcon size={19} />
          </button>
        </div>
      </div>

      {/* คำขอล่าสุด */}
      {latest && (
        <div style={S('background:#fff;border:1px solid #dfe2e7;border-radius:14px;padding:14px 16px')}>
          <div style={S('display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:12px;flex-wrap:wrap')}>
            <div style={S('display:flex;align-items:center;gap:9px')}>
              <span style={S("font-family:'Space Mono';font-weight:700;font-size:13px;color:#e8112d")}>{latest.refNumber}</span>
              <span style={latest.statusStyle}><span style={latest.statusDot} />{latest.status}</span>
            </div>
            <span style={S("font-size:11px;color:#9ca3af;font-family:'Space Mono'")}>{latest.submittedAt}</span>
          </div>
          <div style={S('display:flex;align-items:center;gap:6px;margin-bottom:10px')}>
            {latest.bars.map((b, i) => <span key={i} style={b} />)}
          </div>
          <div style={S('display:flex;align-items:center;justify-content:space-between;gap:10px')}>
            <span style={S('font-size:12.5px;color:#6b7280')}>{latest.items.length} รายการ · รวม {latest.itemsTotal} ชิ้น</span>
            <button onClick={() => vm.onScreen('mine')} style={S("background:none;border:none;padding:0;color:#e8112d;font-family:'Kanit';font-weight:600;font-size:12.5px;cursor:pointer")}>ติดตาม →</button>
          </div>
        </div>
      )}

      {/* เลือกตามประเภท */}
      {vm.catTiles.length > 0 && (
        <div>
          <div style={S('display:flex;align-items:baseline;justify-content:space-between;margin-bottom:10px')}>
            <h3 style={S("margin:0;font-family:'Kanit';font-weight:600;font-size:15px;color:#141821")}>เลือกตามประเภท</h3>
            <button onClick={() => vm.onScreen('catalog')} style={S('background:none;border:none;padding:0;color:#6b7280;font-size:12.5px;cursor:pointer')}>ดูทั้งหมด</button>
          </div>
          <div className="tile-grid">
            {vm.catTiles.map(c => (
              <button key={c.key} onClick={c.onPick} style={c.tileStyle}>
                <span style={c.dotStyle} />
                <span style={S("font-family:'Kanit';font-weight:600;font-size:13.5px;color:#141821;text-align:left;line-height:1.3")}>{c.short}</span>
                <span style={S("font-family:'Space Mono';font-size:11.5px;color:#9ca3af")}>{c.countLabel}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* สื่อแนะนำ */}
      {vm.popular.length > 0 && (
        <div>
          <h3 style={S("margin:0 0 10px;font-family:'Kanit';font-weight:600;font-size:15px;color:#141821")}>สื่อแนะนำ</h3>
          <div className="media-grid">
            {vm.popular.map(m => (
              <div key={m.id} style={S('display:flex;flex-direction:column;height:100%;background:#fff;border:1px solid #dfe2e7;border-radius:12px;overflow:hidden')}>
                <div style={S('position:relative;width:100%;height:150px;background:#f1f2f4;flex-shrink:0')}>
                  <div style={m.fbStyle}>{m.catShort}</div>
                  {m.imageUrl && <img src={m.imageUrl} alt="" referrerPolicy="no-referrer" onError={vm.onImgErr} style={S('position:absolute;inset:0;width:100%;height:100%;object-fit:cover')} />}
                </div>
                <div style={S('padding:12px;display:flex;flex-direction:column;flex:1')}>
                  <div style={S("font-family:'Kanit';font-weight:600;font-size:13px;color:#141821;line-height:1.35;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden")}>{m.title}</div>
                  <div style={S('font-size:11px;color:#9ca3af;margin-top:2px;margin-bottom:10px')}>คงคลัง {m.stockText} ชิ้น</div>
                  <button onClick={m.onAdd} aria-label={`เพิ่ม ${m.title} ลงคำขอ`} style={m.addBtn}>{m.addLabel}</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* วิธีขอสื่อ */}
      <div style={S('background:#fff;border:1px solid #dfe2e7;border-radius:14px;padding:16px')}>
        <h3 style={S("margin:0 0 12px;font-family:'Kanit';font-weight:600;font-size:15px;color:#141821")}>ขอสื่อใน 2 ขั้นตอน</h3>
        <div style={S('display:flex;flex-direction:column;gap:12px')}>
          {[
            { n: '1', t: 'เลือกสื่อและระบุจำนวน', d: 'เลือกจากคลังสื่อ ปรับจำนวนได้ไม่เกิน 50 ชิ้นต่อรายการ' },
            { n: '2', t: 'เลือกที่อยู่จัดส่ง', d: 'ใช้ที่อยู่ที่บันทึกไว้ในสมุดที่อยู่ ไม่ต้องกรอกซ้ำทุกครั้ง' },
          ].map(s => (
            <div key={s.n} style={S('display:flex;gap:12px;align-items:flex-start')}>
              <div style={S("width:28px;height:28px;border-radius:8px;background:#fff5f6;color:#e8112d;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-family:'Space Mono';font-weight:700;font-size:13px")}>{s.n}</div>
              <div>
                <div style={S("font-family:'Kanit';font-weight:600;font-size:13.5px;color:#141821")}>{s.t}</div>
                <div style={S('font-size:12px;color:#6b7280;line-height:1.55;margin-top:2px')}>{s.d}</div>
              </div>
            </div>
          ))}
        </div>
        <button onClick={() => vm.onScreen('catalog')} style={S("margin-top:14px;width:100%;height:44px;background:#f6f7f9;border:1px solid #e5e7eb;border-radius:10px;font-family:'Kanit';font-weight:600;font-size:13.5px;color:#374151;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:8px")}>
          เริ่มเลือกสื่อ <ArrowRightIcon size={16} />
        </button>
      </div>

    </div>
  );
}
