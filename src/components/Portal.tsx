import React from 'react';
import { AppVM, Screen, TabVM } from '../vm';
import { css } from '../lib/ui';
import { HomeScreen } from './portal/HomeScreen';
import { CatalogScreen } from './portal/CatalogScreen';
import { MyRequestsScreen } from './portal/MyRequestsScreen';
import { AccountScreen } from './portal/AccountScreen';
import { ArrowRightIcon, BoxIcon, FileIcon, HomeIcon, LockIcon, UserIcon } from './icons';

const S = css;

const TAB_ICON: Record<Screen, (p: { size?: number }) => React.ReactElement> = {
  home: HomeIcon,
  catalog: BoxIcon,
  mine: FileIcon,
  account: UserIcon,
};

// หมายเหตุ: โปรเจกต์ยังไม่ได้ติดตั้ง @types/react ทำให้ TS ไม่รู้จัก `key` ว่าเป็น prop พิเศษ
// จึงต้องประกาศไว้ใน props ของคอมโพเนนต์เอง
function Tab({ tab }: { key?: string; tab: TabVM }) {
  const Icon = TAB_ICON[tab.key];
  return (
    <button
      onClick={tab.onPick}
      aria-current={tab.active ? 'page' : undefined}
      style={{
        position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px',
        padding: '7px 0', minHeight: '44px', background: 'none', border: 'none', cursor: 'pointer',
        color: tab.active ? '#e8112d' : '#9ca3af',
      }}
    >
      <Icon size={21} />
      <span style={{ fontFamily: 'Kanit', fontWeight: tab.active ? 600 : 500, fontSize: '10.5px' }}>{tab.label}</span>
      {tab.badge > 0 && (
        <span style={S("position:absolute;top:2px;right:calc(50% - 22px);min-width:17px;height:17px;padding:0 4px;border-radius:999px;background:#e8112d;color:#fff;font-family:'Space Mono';font-weight:700;font-size:10px;display:flex;align-items:center;justify-content:center")}>
          {tab.badge}
        </span>
      )}
    </button>
  );
}

export function Portal({ vm }: { vm: AppVM }) {
  return (
    <div style={S('min-height:100vh;background:#eceef1;display:flex;flex-direction:column')}>

      {/* หัวเรื่อง */}
      <header style={S('position:sticky;top:0;z-index:30;background:#fff;border-bottom:1px solid #eceef1')}>
        <div style={S('width:100%;max-width:1120px;margin:0 auto;padding:12px 16px;display:flex;align-items:center;gap:11px')}>
          <img src="/logo.png" alt="โลโก้ สำนักงานคณะกรรมการควบคุมเครื่องดื่มแอลกอฮอล์" width={38} height={38} style={S('width:38px;height:38px;border-radius:10px;object-fit:contain;flex-shrink:0')} />
          <div style={S('flex:1;min-width:0')}>
            <div style={S("font-family:'Kanit';font-weight:600;font-size:15px;color:#141821;line-height:1.2")}>ขอสนับสนุนสื่อ</div>
            <div style={S('font-size:10.5px;color:#9ca3af;line-height:1.3;overflow:hidden;text-overflow:ellipsis;white-space:nowrap')}>สำนักงานคณะกรรมการควบคุมเครื่องดื่มแอลกอฮอล์</div>
          </div>

          {/* เมนูบนจอใหญ่ */}
          <nav className="desknav" style={S('align-items:center;gap:6px')}>
            {vm.tabs.map(t => (
              <button
                key={t.key}
                onClick={t.onPick}
                style={{
                  height: '40px', padding: '0 14px', borderRadius: '9px', border: 'none', cursor: 'pointer',
                  fontFamily: 'Kanit', fontWeight: t.active ? 600 : 500, fontSize: '13.5px',
                  background: t.active ? '#fff5f6' : 'transparent',
                  color: t.active ? '#e8112d' : '#6b7280',
                }}
              >
                {t.label}{t.badge > 0 ? ` (${t.badge})` : ''}
              </button>
            ))}
            {vm.isStaff && (
              <button onClick={vm.onGotoBO} style={S("height:40px;padding:0 14px;margin-left:6px;background:#141821;color:#fff;border:none;border-radius:9px;font-family:'Kanit';font-weight:500;font-size:13px;cursor:pointer;display:inline-flex;align-items:center;gap:7px")}>
                <LockIcon size={15} />เจ้าหน้าที่
              </button>
            )}
          </nav>

          {/* ปุ่มบัญชีบนมือถือ */}
          <button
            onClick={() => vm.onScreen('account')}
            aria-label="บัญชีของฉัน"
            className="mobile-only-account"
            style={S('width:44px;height:44px;border-radius:10px;background:#f6f7f9;border:1px solid #e5e7eb;color:#374151;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;overflow:hidden')}
          >
            {vm.user?.avatarUrl
              ? <img src={vm.user.avatarUrl} alt="" referrerPolicy="no-referrer" style={S('width:100%;height:100%;object-fit:cover')} />
              : <UserIcon size={19} />}
          </button>
        </div>
      </header>

      {/* เนื้อหา */}
      <main className={`app-col ${vm.hasCart && !vm.wizardOpen ? 'pad-cart' : 'pad-tabbar'}`} style={{ flex: 1 }}>
        {vm.loading ? (
          <div style={S('padding:60px 0;text-align:center;color:#9ca3af;font-size:13.5px')}>กำลังโหลดข้อมูล…</div>
        ) : (
          <>
            {vm.screen === 'home' && <HomeScreen vm={vm} />}
            {vm.screen === 'catalog' && <CatalogScreen vm={vm} />}
            {vm.screen === 'mine' && <MyRequestsScreen vm={vm} />}
            {vm.screen === 'account' && <AccountScreen vm={vm} />}
          </>
        )}
      </main>

      {/* แถบตะกร้าลอย */}
      {vm.hasCart && !vm.wizardOpen && (
        <div className="cart-bar">
          <div style={S('max-width:560px;margin:0 auto;pointer-events:auto')}>
            <button
              onClick={vm.onStartRequest}
              style={S("width:100%;height:54px;background:#e8112d;color:#fff;border:none;border-radius:12px;font-family:'Kanit';font-weight:600;font-size:15px;cursor:pointer;display:flex;align-items:center;justify-content:space-between;padding:0 18px;box-shadow:0 12px 28px -10px rgba(232,17,45,.6)")}
            >
              <span>{vm.cartLabel}</span>
              <span style={S('display:inline-flex;align-items:center;gap:7px')}>ดำเนินการขอ <ArrowRightIcon size={17} /></span>
            </button>
          </div>
        </div>
      )}

      {/* แถบแท็บล่าง (จอเล็ก) */}
      <nav className="tabbar">
        {vm.tabs.map(t => <Tab key={t.key} tab={t} />)}
      </nav>
    </div>
  );
}
