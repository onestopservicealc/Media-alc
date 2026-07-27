import { AppVM } from '../../vm';
import { css } from '../../lib/ui';
import { CheckIcon, ExternalIcon, LockIcon, LogInIcon, LogOutIcon, TrashIcon } from '../icons';

const S = css;

export function AccountScreen({ vm }: { vm: AppVM }) {
  return (
    <div style={S('display:flex;flex-direction:column;gap:16px')}>
      <h2 style={S("margin:0;font-family:'Kanit';font-weight:700;font-size:20px;color:#141821")}>บัญชี</h2>

      {/* โปรไฟล์ */}
      {vm.user ? (
        <div style={S('background:#fff;border:1px solid #dfe2e7;border-radius:14px;padding:14px 16px;display:flex;align-items:center;gap:12px')}>
          {vm.user.avatarUrl
            ? <img src={vm.user.avatarUrl} alt="" referrerPolicy="no-referrer" style={S('width:44px;height:44px;border-radius:999px;object-fit:cover;flex-shrink:0')} />
            : <div style={S("width:44px;height:44px;border-radius:999px;background:#141821;color:#fff;display:flex;align-items:center;justify-content:center;font-family:'Kanit';font-weight:700;font-size:17px;flex-shrink:0")}>{vm.user.name.charAt(0).toUpperCase()}</div>}
          <div style={S('flex:1;min-width:0')}>
            <div style={S("font-family:'Kanit';font-weight:600;font-size:14px;color:#141821")}>{vm.user.name}</div>
            <div style={S('font-size:11.5px;color:#9ca3af;overflow:hidden;text-overflow:ellipsis;white-space:nowrap')}>{vm.user.email} · ยืนยันตัวตนแล้ว</div>
          </div>
          <CheckIcon size={18} stroke="#10b981" />
        </div>
      ) : (
        <div style={S('background:#fff;border:1px solid #dfe2e7;border-radius:14px;padding:20px 18px;text-align:center')}>
          <div style={S("font-family:'Kanit';font-weight:600;font-size:15px;color:#141821")}>ยังไม่ได้เข้าสู่ระบบ</div>
          <p style={S('margin:6px 0 14px;font-size:12.5px;color:#6b7280;line-height:1.6')}>เข้าสู่ระบบด้วยบัญชี Google เพื่อบันทึกสมุดที่อยู่และติดตามคำขอ</p>
          <button onClick={() => vm.onOpenLogin('generic')} style={S("height:46px;padding:0 22px;background:#e8112d;color:#fff;border:none;border-radius:10px;font-family:'Kanit';font-weight:600;font-size:14px;cursor:pointer;display:inline-flex;align-items:center;gap:8px")}>
            <LogInIcon size={17} />เข้าสู่ระบบ
          </button>
        </div>
      )}

      {/* สมุดที่อยู่ */}
      {vm.user && (
        <div>
          <div style={S('display:flex;align-items:baseline;justify-content:space-between;margin-bottom:9px')}>
            <h3 style={S("margin:0;font-family:'Kanit';font-weight:600;font-size:15px;color:#141821")}>สมุดที่อยู่จัดส่ง</h3>
            <span style={S('font-size:11.5px;color:#9ca3af')}>{vm.addrCountLabel}</span>
          </div>
          <div style={S('display:flex;flex-direction:column;gap:9px')}>
            {vm.addressesVM.map(a => (
              <div key={a.id} style={S('background:#fff;border:1px solid #dfe2e7;border-radius:12px;padding:13px 14px;display:flex;align-items:flex-start;gap:11px')}>
                <div style={S('flex:1;min-width:0')}>
                  <div style={S('display:flex;align-items:center;gap:7px;flex-wrap:wrap')}>
                    <span style={S("font-family:'Kanit';font-weight:600;font-size:13.5px;color:#141821")}>{a.label}</span>
                    {a.isDefault && <span style={S("font-size:10px;font-weight:600;padding:2px 7px;border-radius:4px;background:#f6f7f9;color:#6b7280;font-family:'Kanit'")}>ค่าเริ่มต้น</span>}
                  </div>
                  <div style={S('font-size:12.5px;color:#374151;line-height:1.5;margin-top:3px')}>{a.detail}</div>
                  <div style={S("font-size:11.5px;color:#9ca3af;font-family:'Space Mono';margin-top:3px")}>{a.contactName} · {a.phone}</div>
                </div>
                <button onClick={a.onDelete} aria-label={`ลบที่อยู่ ${a.label}`} style={S('width:34px;height:34px;border-radius:8px;background:#fef2f2;border:none;color:#e8112d;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0')}>
                  <TrashIcon size={15} />
                </button>
              </div>
            ))}
            {!vm.hasAddress && (
              <div style={S('background:#fff;border:1px dashed #d7dade;border-radius:12px;padding:20px;text-align:center;font-size:12.5px;color:#6b7280;line-height:1.6')}>
                ยังไม่มีที่อยู่บันทึกไว้ — เพิ่มได้ตอนส่งคำขอ ระบบจะจำไว้ให้ครั้งถัดไป
              </div>
            )}
          </div>
        </div>
      )}

      {/* ระบบสารสนเทศอื่น ๆ */}
      {vm.systemsVM.length > 0 && (
        <div>
          <h3 style={S("margin:0 0 9px;font-family:'Kanit';font-weight:600;font-size:15px;color:#141821")}>ระบบสารสนเทศอื่นๆ ของสำนักงาน</h3>
          <div className="media-grid">
            {vm.systemsVM.map(s => (
              <a key={s.name} href={s.url} target={s.target} rel="noreferrer" style={S('background:#fff;border:1px solid #dfe2e7;border-radius:12px;padding:13px 14px;display:flex;align-items:flex-start;gap:12px')}>
                <div style={S('width:40px;height:40px;border-radius:10px;background:#f6f7f9;display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0')}>{s.icon}</div>
                <div style={S('flex:1;min-width:0')}>
                  <div style={S("font-size:10.5px;font-weight:600;color:#9ca3af;font-family:'Kanit'")}>{s.cat}</div>
                  <div style={S("font-family:'Kanit';font-weight:600;font-size:13.5px;color:#141821;line-height:1.35")}>{s.name}</div>
                  <div style={S('font-size:11.5px;color:#6b7280;line-height:1.5;margin-top:2px')}>{s.desc}</div>
                </div>
                <ExternalIcon size={15} stroke="#cbd0d6" style={S('flex-shrink:0;margin-top:2px')} />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* การจัดการ */}
      <div style={S('display:flex;flex-direction:column;gap:9px')}>
        {vm.isStaff && (
          <button onClick={vm.onGotoBO} style={S("height:48px;background:#141821;color:#fff;border:none;border-radius:12px;font-family:'Kanit';font-weight:600;font-size:14px;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:9px")}>
            <LockIcon size={17} />เข้าระบบเจ้าหน้าที่
          </button>
        )}
        {vm.user && (
          <button onClick={vm.onLogout} style={S("height:48px;background:#fff;color:#6b7280;border:1px solid #e5e7eb;border-radius:12px;font-family:'Kanit';font-weight:500;font-size:14px;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:9px")}>
            <LogOutIcon size={17} />ออกจากระบบ
          </button>
        )}
      </div>

      <div style={S('padding:14px 0 4px;text-align:center;font-size:11px;color:#9ca3af;line-height:1.7')}>
        สำนักงานคณะกรรมการควบคุมเครื่องดื่มแอลกอฮอล์<br />
        กรมควบคุมโรค กระทรวงสาธารณสุข · สายด่วน 1422
      </div>
    </div>
  );
}
