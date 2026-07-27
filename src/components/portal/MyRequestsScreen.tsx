import { AppVM } from '../../vm';
import { css } from '../../lib/ui';
import { CalendarIcon, LogInIcon, MapPinIcon } from '../icons';

const S = css;

export function MyRequestsScreen({ vm }: { vm: AppVM }) {
  if (!vm.user) {
    return (
      <div style={S('background:#fff;border:1px dashed #d7dade;border-radius:14px;padding:40px 22px;text-align:center')}>
        <div style={S("font-family:'Kanit';font-weight:600;font-size:16px;color:#141821")}>เข้าสู่ระบบเพื่อดูคำขอของคุณ</div>
        <p style={S('margin:8px 0 16px;font-size:13px;color:#6b7280;line-height:1.6')}>คำขอจะผูกกับบัญชีของคุณ ติดตามได้จากทุกเครื่อง</p>
        <button onClick={() => vm.onOpenLogin('generic')} style={S("height:46px;padding:0 22px;background:#e8112d;color:#fff;border:none;border-radius:10px;font-family:'Kanit';font-weight:600;font-size:14px;cursor:pointer;display:inline-flex;align-items:center;gap:8px")}>
          <LogInIcon size={17} />เข้าสู่ระบบ
        </button>
      </div>
    );
  }

  if (vm.myRequestsEmpty) {
    return (
      <div style={S('background:#fff;border:1px dashed #d7dade;border-radius:14px;padding:40px 22px;text-align:center')}>
        <div style={S("font-family:'Kanit';font-weight:600;font-size:16px;color:#141821")}>ยังไม่มีคำขอ</div>
        <p style={S('margin:8px 0 16px;font-size:13px;color:#6b7280;line-height:1.6')}>เลือกสื่อจากคลังแล้วส่งคำขอ จะเห็นสถานะการจัดส่งที่นี่</p>
        <button onClick={() => vm.onScreen('catalog')} style={S("height:46px;padding:0 22px;background:#141821;color:#fff;border:none;border-radius:10px;font-family:'Kanit';font-weight:600;font-size:14px;cursor:pointer")}>เลือกสื่อจากคลัง</button>
      </div>
    );
  }

  return (
    <div style={S('display:flex;flex-direction:column;gap:12px')}>
      <h2 style={S("margin:0;font-family:'Kanit';font-weight:700;font-size:20px;color:#141821")}>คำขอของฉัน</h2>

      {vm.myRequestsVM.map(r => (
        <div key={r.id} style={S('background:#fff;border:1px solid #dfe2e7;border-radius:14px;padding:14px 16px')}>
          <div style={S('display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;margin-bottom:12px')}>
            <div style={S('display:flex;align-items:center;gap:9px;flex-wrap:wrap')}>
              <span style={S("font-family:'Space Mono';font-weight:700;font-size:13px;color:#e8112d")}>{r.refNumber}</span>
              <span style={r.statusStyle}><span style={r.statusDot} />{r.status}</span>
            </div>
            <span style={S("font-size:11px;color:#9ca3af;font-family:'Space Mono'")}>{r.submittedAt}</span>
          </div>

          <div style={S('display:flex;align-items:center;gap:6px;margin-bottom:8px')}>
            {r.bars.map((b, i) => <span key={i} style={b} />)}
          </div>
          <div style={S('display:flex;justify-content:space-between;font-size:10.5px;color:#9ca3af;margin-bottom:12px')}>
            <span>รับคำขอ</span><span>กำลังจัดส่ง</span><span>เสร็จสิ้น</span>
          </div>

          <div style={S('display:flex;flex-direction:column;gap:8px;margin-bottom:12px')}>
            {r.items.map(it => (
              <div key={it.materialId} style={S('display:flex;align-items:center;gap:11px;background:#fbfbfc;border:1px solid #f1f2f4;border-radius:10px;padding:8px 10px')}>
                <div
                  onClick={() => it.imageUrl && vm.onOpenLightbox(it.imageUrl)}
                  style={{ ...S('position:relative;width:42px;height:42px;border-radius:8px;overflow:hidden;background:#f1f2f4;flex-shrink:0'), cursor: it.imageUrl ? 'zoom-in' : 'default' }}
                >
                  <div style={it.fbStyle}>{it.catShort}</div>
                  {it.imageUrl && <img src={it.imageUrl} alt={it.title} referrerPolicy="no-referrer" onError={vm.onImgErr} style={S('position:absolute;inset:0;width:100%;height:100%;object-fit:cover')} />}
                </div>
                <span style={S("flex:1;min-width:0;font-family:'Kanit';font-weight:500;font-size:12.5px;color:#374151;line-height:1.4;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden")}>{it.title}</span>
                <span style={S("font-family:'Space Mono';font-weight:700;font-size:12.5px;color:#e8112d;flex-shrink:0")}>×{it.quantity}</span>
              </div>
            ))}
          </div>

          <div style={S('display:flex;flex-direction:column;gap:6px;padding-top:12px;border-top:1px solid #f1f2f4;font-size:12px;color:#6b7280')}>
            <div style={S('display:flex;align-items:flex-start;gap:7px')}>
              <MapPinIcon size={14} stroke="#9ca3af" style={S('flex-shrink:0;margin-top:2px')} />
              <span style={S('line-height:1.55')}>{r.agencyName} · {r.shippingAddress}</span>
            </div>
            <div style={S('display:flex;align-items:center;gap:7px')}>
              <CalendarIcon size={14} stroke="#9ca3af" />
              <span>ต้องการใช้ {r.requiredDate} · รวม {r.itemsTotal} ชิ้น</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
