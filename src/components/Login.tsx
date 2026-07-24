import { AppVM } from '../vm';
import { css } from '../lib/ui';

const S = css;

/** โมดัลเข้าสู่ระบบด้วย Google — ใช้ทั้งตอนประชาชนจะส่งคำขอ และตอนเจ้าหน้าที่เข้า Backoffice */
export function Login({ vm }: { vm: AppVM }) {
  const forBackoffice = vm.loginReason === 'backoffice';
  const title = forBackoffice ? 'เข้าสู่ระบบเจ้าหน้าที่' : 'เข้าสู่ระบบเพื่อส่งคำขอ';
  const desc = forBackoffice
    ? 'สำหรับเจ้าหน้าที่ที่ได้รับสิทธิ์เท่านั้น — เข้าสู่ระบบด้วยบัญชี Google ของหน่วยงาน'
    : 'กรุณาเข้าสู่ระบบด้วย Google เพื่อยืนยันตัวตนและติดตามคำขอของคุณได้ทุกอุปกรณ์';

  return (
    <div onClick={vm.onCloseLogin} style={S('position:fixed;inset:0;z-index:70;background:rgba(17,20,27,.6);backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;padding:24px 16px;animation:fadeIn .2s ease')}>
      <div onClick={e => e.stopPropagation()} style={S('background:#fff;width:100%;max-width:420px;border-radius:24px;overflow:hidden;box-shadow:0 40px 90px -20px rgba(0,0,0,.5);animation:pop .28s ease')}>
        <div style={S('background:#141821;padding:22px 26px;display:flex;align-items:center;justify-content:space-between;color:#fff')}>
          <div style={S('display:flex;align-items:center;gap:12px')}>
            <div style={S('width:40px;height:40px;border-radius:12px;background:#e8112d;display:flex;align-items:center;justify-content:center')}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2Z" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
            </div>
            <h2 style={S("margin:0;font-family:'Kanit';font-weight:700;font-size:17px")}>{title}</h2>
          </div>
          <button onClick={vm.onCloseLogin} aria-label="ปิด" style={S('width:34px;height:34px;border-radius:999px;background:rgba(255,255,255,.1);border:none;color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center')}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>
        <div style={S('padding:24px 26px 28px')}>
          <p style={S('margin:0 0 20px;font-size:13.5px;color:#6b7280;line-height:1.6')}>{desc}</p>
          <button onClick={vm.onLogin} style={S("width:100%;display:inline-flex;align-items:center;justify-content:center;gap:11px;padding:13px;background:#fff;color:#3c4043;border:1.5px solid #dadce0;border-radius:12px;font-family:'Kanit';font-weight:600;font-size:14.5px;cursor:pointer")}>
            <svg width="19" height="19" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" /><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" /><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" /><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" /></svg>
            <span>เข้าสู่ระบบด้วย Google</span>
          </button>
        </div>
      </div>
    </div>
  );
}
