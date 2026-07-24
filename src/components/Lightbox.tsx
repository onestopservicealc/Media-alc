import { AppVM } from '../vm';
import { css } from '../lib/ui';

const S = css;

/** ดูภาพสื่อแบบเต็มจอ — คลิกพื้นหลังหรือปุ่มกากบาทเพื่อปิด */
export function Lightbox({ vm }: { vm: AppVM }) {
  if (!vm.lightbox) return null;
  return (
    <div
      onClick={vm.onCloseLightbox}
      style={S('position:fixed;inset:0;z-index:80;background:rgba(0,0,0,.85);backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;padding:32px 24px;animation:fadeIn .2s ease;cursor:zoom-out')}
    >
      <button
        onClick={vm.onCloseLightbox}
        aria-label="ปิด"
        style={S('position:absolute;top:20px;right:20px;width:44px;height:44px;border-radius:999px;background:rgba(255,255,255,.14);border:none;color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center')}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
      </button>
      <img
        src={vm.lightbox}
        alt="ภาพสื่อขนาดเต็ม"
        onClick={e => e.stopPropagation()}
        style={S('max-width:92vw;max-height:88vh;object-fit:contain;border-radius:14px;box-shadow:0 30px 80px -20px rgba(0,0,0,.7);cursor:default;animation:pop .25s ease')}
      />
    </div>
  );
}
