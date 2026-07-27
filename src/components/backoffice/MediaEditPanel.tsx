import { AppVM } from '../../vm';
import { css, fbBox, fbFor } from '../../lib/ui';
import { AlertIcon, UploadIcon, XIcon } from '../icons';

const S = css;

export function MediaEditPanel({ vm, categories }: { vm: AppVM; categories: string[] }) {
  const d = vm.draft;
  const fb = fbFor(d.category);

  return (
    <div className="edit-panel scr" style={S('overflow-y:auto')}>
      <div style={S('padding:18px 22px;border-bottom:1px solid #eceef1;display:flex;align-items:center;justify-content:space-between;gap:10px;position:sticky;top:0;background:#fff;z-index:2')}>
        <div style={S('min-width:0')}>
          <div style={S("font-size:11.5px;color:#9ca3af;font-family:'Kanit'")}>คลังสื่อ</div>
          <h3 style={S("margin:2px 0 0;font-family:'Kanit';font-weight:700;font-size:16px;color:#141821")}>{vm.editTitle}</h3>
        </div>
        <button onClick={vm.onCloseEdit} aria-label="ปิดแผงแก้ไข" style={S('width:34px;height:34px;border-radius:8px;background:#f6f7f9;border:1px solid #e5e7eb;color:#6b7280;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0')}>
          <XIcon size={16} />
        </button>
      </div>

      <div style={S('flex:1;padding:20px 22px;display:flex;flex-direction:column;gap:18px')}>

        {/* ข้อมูลสื่อ */}
        <section style={S('display:flex;flex-direction:column;gap:12px')}>
          <div style={S("font-family:'Kanit';font-weight:600;font-size:12px;color:#9ca3af;letter-spacing:.4px")}>ข้อมูลสื่อ</div>
          <div>
            <label htmlFor="ed-title" style={S('display:block;font-size:12.5px;font-weight:600;color:#374151;margin-bottom:6px')}>ชื่อสื่อ <span style={S('color:#e8112d')}>*</span></label>
            <input
              id="ed-title" type="text" value={d.title} onChange={e => vm.onDraftField('title', e.target.value)}
              placeholder="เช่น แผ่นพับงดเหล้าเข้าพรรษา 2569"
              style={S('width:100%;height:44px;padding:0 13px;background:#f6f7f9;border:1px solid #e5e7eb;border-radius:10px;font-size:13.5px;font-family:inherit;outline:none')}
            />
          </div>
          <div>
            <label htmlFor="ed-cat" style={S('display:block;font-size:12.5px;font-weight:600;color:#374151;margin-bottom:6px')}>ประเภท</label>
            <select
              id="ed-cat" value={d.category} onChange={e => vm.onDraftField('category', e.target.value)}
              style={S('width:100%;height:44px;padding:0 11px;background:#f6f7f9;border:1px solid #e5e7eb;border-radius:10px;font-size:13.5px;font-family:inherit;color:#374151;outline:none;cursor:pointer')}
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="ed-desc" style={S('display:block;font-size:12.5px;font-weight:600;color:#374151;margin-bottom:6px')}>คำอธิบาย <span style={S('color:#e8112d')}>*</span></label>
            <textarea
              id="ed-desc" rows={3} value={d.description} onChange={e => vm.onDraftField('description', e.target.value)}
              placeholder="รายละเอียดเนื้อหาและขนาดกระดาษ…"
              style={S('width:100%;padding:11px 13px;background:#f6f7f9;border:1px solid #e5e7eb;border-radius:10px;font-size:13.5px;font-family:inherit;outline:none;resize:none;line-height:1.6')}
            />
          </div>
        </section>

        {/* จำนวนและสต็อก */}
        <section style={S('display:flex;flex-direction:column;gap:12px;padding-top:16px;border-top:1px solid #eceef1')}>
          <div style={S("font-family:'Kanit';font-weight:600;font-size:12px;color:#9ca3af;letter-spacing:.4px")}>จำนวนและสต็อก</div>
          <div className="form-2col">
            <div>
              <label htmlFor="ed-max" style={S('display:block;font-size:12.5px;font-weight:600;color:#374151;margin-bottom:6px')}>จำกัด/ครั้ง</label>
              <input
                id="ed-max" type="number" min={1} max={50} value={d.maxAllowed} onChange={e => vm.onDraftField('maxAllowed', e.target.value)}
                style={S("width:100%;height:44px;padding:0 13px;background:#f6f7f9;border:1px solid #e5e7eb;border-radius:10px;font-size:13.5px;font-family:'Space Mono';outline:none")}
              />
            </div>
            <div>
              <label htmlFor="ed-stock" style={S('display:block;font-size:12.5px;font-weight:600;color:#374151;margin-bottom:6px')}>คงคลัง</label>
              <input
                id="ed-stock" type="number" min={0} value={d.availableStock} onChange={e => vm.onDraftField('availableStock', e.target.value)}
                style={S("width:100%;height:44px;padding:0 13px;background:#f6f7f9;border:1px solid #e5e7eb;border-radius:10px;font-size:13.5px;font-family:'Space Mono';outline:none")}
              />
            </div>
          </div>
          <div style={S('display:flex;gap:9px;background:#fffbeb;border:1px solid #fde68a;border-radius:10px;padding:10px 12px')}>
            <AlertIcon size={16} stroke="#b45309" style={S('flex-shrink:0;margin-top:1px')} />
            <p style={S('margin:0;font-size:12px;color:#92400e;line-height:1.55')}>ตารางจะขึ้นจุดเตือนเมื่อคงคลังต่ำกว่า 500 ชิ้น และหน้าประชาชนจะปิดปุ่มขอสื่อเมื่อคงคลังหมด</p>
          </div>
        </section>

        {/* รูปตัวอย่าง */}
        <section style={S('display:flex;flex-direction:column;gap:12px;padding-top:16px;border-top:1px solid #eceef1')}>
          <div style={S("font-family:'Kanit';font-weight:600;font-size:12px;color:#9ca3af;letter-spacing:.4px")}>รูปตัวอย่าง</div>
          <div style={S('display:flex;align-items:center;gap:12px')}>
            <div style={S('position:relative;width:76px;height:76px;border-radius:10px;overflow:hidden;background:#f1f2f4;border:1px solid #e5e7eb;flex-shrink:0')}>
              <div style={fbBox(d.category, 10)}>{fb.short}</div>
              {d.imageUrl && <img src={d.imageUrl} alt="" referrerPolicy="no-referrer" onError={vm.onImgErr} style={S('position:absolute;inset:0;width:100%;height:100%;object-fit:cover')} />}
            </div>
            <div style={S('flex:1;min-width:0;display:flex;flex-direction:column;gap:7px')}>
              <label style={S("height:40px;background:#fff;border:1px dashed #cbd0d6;border-radius:10px;font-family:'Kanit';font-weight:500;font-size:12.5px;color:#374151;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:7px")}>
                <UploadIcon size={15} />{d.imageUrl ? 'เปลี่ยนรูป' : 'อัปโหลดรูป'}
                <input
                  type="file" accept="image/*" style={S('display:none')}
                  onChange={e => { const f = e.target.files?.[0]; if (f) vm.onUploadDraftImage(f); e.target.value = ''; }}
                />
              </label>
              <span style={S('font-size:11px;color:#9ca3af;line-height:1.5')}>JPG หรือ PNG ขนาดไม่เกิน 5 MB · แนะนำ 800×800 px</span>
              {d.imageUrl && (
                <button onClick={() => vm.onDraftField('imageUrl', '')} style={S("height:32px;background:#fef2f2;color:#e8112d;border:none;border-radius:8px;font-family:'Kanit';font-weight:500;font-size:12px;cursor:pointer")}>ลบรูป</button>
              )}
            </div>
          </div>
        </section>
      </div>

      <div style={S('position:sticky;bottom:0;background:#fff;border-top:1px solid #eceef1;padding:14px 22px;display:flex;gap:10px')}>
        <button onClick={vm.onCloseEdit} style={S("flex:1;height:44px;background:#f1f2f4;border:none;border-radius:10px;font-family:'Kanit';font-weight:500;font-size:13.5px;color:#374151;cursor:pointer")}>ยกเลิก</button>
        <button onClick={vm.onSaveDraft} style={S("flex:1.5;height:44px;background:#e8112d;border:none;border-radius:10px;font-family:'Kanit';font-weight:600;font-size:13.5px;color:#fff;cursor:pointer")}>บันทึก</button>
      </div>
    </div>
  );
}
