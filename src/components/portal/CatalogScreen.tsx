import { AppVM } from '../../vm';
import { css } from '../../lib/ui';
import { MinusIcon, PlusIcon, SearchIcon, SortIcon } from '../icons';

const S = css;

export function CatalogScreen({ vm }: { vm: AppVM }) {
  return (
    <div style={S('display:flex;flex-direction:column;gap:12px')}>

      {/* หัวข้อ + เรียงลำดับ */}
      <div style={S('display:flex;align-items:center;gap:10px')}>
        <h2 style={S("margin:0;flex:1;font-family:'Kanit';font-weight:700;font-size:20px;color:#141821")}>คลังสื่อ</h2>
        <button onClick={vm.onToggleSort} style={S("height:40px;padding:0 12px;border:1px solid #e5e7eb;background:#fff;border-radius:9px;font-family:'Kanit';font-weight:500;font-size:12.5px;color:#374151;cursor:pointer;display:inline-flex;align-items:center;gap:6px;flex-shrink:0")}>
          <SortIcon size={15} />{vm.sortLabel}
        </button>
      </div>

      {/* ตัวกรอง */}
      <div style={S('background:#fff;border:1px solid #dfe2e7;border-radius:12px;overflow:hidden')}>
        <div style={S('padding:10px 12px 0')}>
          <div style={S('position:relative;display:flex;align-items:center')}>
            <SearchIcon size={17} stroke="#9ca3af" style={S('position:absolute;left:12px;pointer-events:none')} />
            <input
              type="text" value={vm.search} onChange={vm.onSearch}
              placeholder="ค้นหาชื่อสื่อ หรือคำในเนื้อหา"
              aria-label="ค้นหาสื่อ"
              style={S('width:100%;height:44px;padding:0 12px 0 36px;background:#f6f7f9;border:1px solid #e5e7eb;border-radius:10px;font-size:13.5px;font-family:inherit;color:#111827;outline:none')}
            />
          </div>
        </div>

        <div className="scr" style={S('padding:10px 12px 0;display:flex;gap:7px;overflow-x:auto')}>
          {vm.catChips.map(c => <button key={c.key} onClick={c.onPick} style={c.style}>{c.label}</button>)}
        </div>

        <div style={S('padding:10px 12px;display:flex;align-items:center;gap:7px;flex-wrap:wrap')}>
          {vm.langChips.map(c => <button key={c.key} onClick={c.onPick} style={c.style}>{c.label}</button>)}
        </div>

        <div style={S('padding:8px 14px;background:#fbfbfc;border-top:1px solid #eceef1;display:flex;align-items:center;justify-content:space-between;gap:10px')}>
          <span style={S('font-size:12.5px;color:#6b7280')}>พบ <strong style={S("font-family:'Space Mono';color:#141821")}>{vm.resultCount}</strong> รายการ</span>
          {vm.filtersDirty && (
            <button onClick={vm.onClearFilters} style={S("background:none;border:none;padding:0;color:#e8112d;font-family:'Kanit';font-weight:600;font-size:12.5px;cursor:pointer")}>ล้างตัวกรอง</button>
          )}
        </div>
      </div>

      {/* รายการสื่อ */}
      <div className="media-grid">
        {vm.mediaVM.map(m => (
          <div key={m.id} style={m.cardStyle}>
            <div
              onClick={m.onOpenImage}
              style={{ ...S('position:relative;width:100%;height:150px;background:#f1f2f4;flex-shrink:0'), cursor: m.imageUrl ? 'zoom-in' : 'default' }}
            >
              <div style={m.fbStyle}>{m.catShort}</div>
              {m.imageUrl && <img src={m.imageUrl} alt={m.title} referrerPolicy="no-referrer" onError={vm.onImgErr} style={S('position:absolute;inset:0;width:100%;height:100%;object-fit:cover')} />}
            </div>

            <div style={S('padding:12px;display:flex;flex-direction:column;flex:1')}>
              <div style={S('display:flex;align-items:center;gap:6px;margin-bottom:3px;flex-wrap:wrap')}>
                <span style={m.tagStyle}>{m.catShort}</span>
                {m.multiLang && <span style={S("font-size:10px;font-weight:600;padding:2px 7px;border-radius:4px;background:#eff6ff;color:#1d4ed8;font-family:'Kanit'")}>หลายภาษา</span>}
              </div>
              <div style={S("font-family:'Kanit';font-weight:600;font-size:13.5px;color:#141821;line-height:1.4;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden")}>{m.title}</div>
              <div style={S("font-size:11.5px;color:#9ca3af;margin-top:3px;font-family:'Space Mono'")}>คงคลัง {m.stockText} ชิ้น</div>

              {m.outOfStock ? (
                <div style={S("margin-top:auto;height:44px;display:flex;align-items:center;justify-content:center;background:#f6f7f9;border:1px solid #e5e7eb;border-radius:10px;font-family:'Kanit';font-weight:600;font-size:13px;color:#9ca3af")}>หมดชั่วคราว</div>
              ) : m.notSelected ? (
                <button onClick={m.onAdd} style={S("margin-top:auto;width:100%;height:44px;background:#fff5f6;color:#e8112d;border:1px solid #fbd5da;border-radius:10px;font-family:'Kanit';font-weight:600;font-size:13.5px;cursor:pointer")}>＋ เพิ่มลงคำขอ</button>
              ) : (
                <div style={S('margin-top:auto;display:flex;align-items:center;gap:8px;background:#fff5f6;border:1px solid #fbd5da;border-radius:10px;padding:6px 8px')}>
                <span style={S("flex:1;font-family:'Kanit';font-weight:600;font-size:12.5px;color:#374151;padding-left:4px")}>จำนวน (ชิ้น)</span>
                <button onClick={m.onDec} aria-label="ลดจำนวน" style={S('width:38px;height:38px;border-radius:8px;background:#fff;border:1px solid #e5e7eb;color:#374151;cursor:pointer;display:flex;align-items:center;justify-content:center')}><MinusIcon size={16} /></button>
                <input type="number" value={m.qty} onChange={m.onQty} aria-label={`จำนวนของ ${m.title}`} style={S("width:56px;height:38px;text-align:center;font-family:'Space Mono';font-weight:700;font-size:14px;background:#fff;border:1px solid #e5e7eb;border-radius:8px;outline:none;color:#141821")} />
                <button onClick={m.onInc} aria-label="เพิ่มจำนวน" style={S('width:38px;height:38px;border-radius:8px;background:#e8112d;border:none;color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center')}><PlusIcon size={16} /></button>
                <button onClick={m.onAdd} aria-label="นำออกจากคำขอ" style={S('width:38px;height:38px;border-radius:8px;background:#fff;border:1px solid #fbd5da;color:#e8112d;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0')}>×</button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {vm.mediaEmpty && !vm.loading && (
        <div style={S('background:#fff;border:1px dashed #d7dade;border-radius:12px;padding:36px 20px;text-align:center')}>
          <div style={S("font-family:'Kanit';font-weight:600;font-size:15px;color:#374151")}>ไม่พบสื่อที่ตรงกับตัวกรอง</div>
          <button onClick={vm.onClearFilters} style={S("margin-top:12px;height:44px;padding:0 20px;background:#141821;color:#fff;border:none;border-radius:10px;font-family:'Kanit';font-weight:600;font-size:13.5px;cursor:pointer")}>ล้างตัวกรองทั้งหมด</button>
        </div>
      )}

    </div>
  );
}
