import React from 'react';
import { AppVM } from '../vm';
import { css } from '../lib/ui';

const S = css;

export function HistoryModal({ vm }: { vm: AppVM }) {
  return (
    <div style={S('position:fixed;inset:0;z-index:60;background:rgba(17,20,27,.6);backdrop-filter:blur(4px);display:flex;align-items:flex-start;justify-content:center;padding:24px 16px;overflow-y:auto;animation:fadeIn .2s ease')}>
      <div style={S('background:#fff;width:100%;max-width:720px;border-radius:26px;overflow:hidden;box-shadow:0 40px 90px -20px rgba(0,0,0,.5);margin:auto;animation:pop .28s ease')}>
        <div style={S('background:#141821;padding:20px 26px;display:flex;align-items:center;justify-content:space-between;color:#fff')}>
          <div style={S('display:flex;align-items:center;gap:13px')}>
            <div style={S('width:40px;height:40px;border-radius:12px;background:#e8112d;display:flex;align-items:center;justify-content:center')}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5Z" /><polyline points="14 2 14 8 20 8" /></svg></div>
            <div>
              <h2 style={S("margin:0;font-family:'Kanit';font-weight:700;font-size:18px")}>ติดตามคำขอของฉัน</h2>
              <p style={S('margin:1px 0 0;font-size:12px;color:#9ca3af')}>คำขอทั้งหมดที่ยื่นในเครื่องนี้</p>
            </div>
          </div>
          <button onClick={vm.onCloseHistory} style={S('width:36px;height:36px;border-radius:999px;background:rgba(255,255,255,.1);border:none;color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center')}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg></button>
        </div>
        <div style={S('padding:22px 26px;max-height:70vh;overflow-y:auto')}>
          {vm.historyEmpty && (
            <div style={S('text-align:center;padding:40px 0')}>
              <p style={S("margin:0;font-family:'Kanit';font-weight:600;font-size:16px;color:#374151")}>ยังไม่มีคำขอ</p>
              <p style={S('margin:6px 0 0;font-size:13px;color:#9ca3af')}>กด "เริ่มขอจัดส่งสื่อ" เพื่อยื่นคำขอใหม่</p>
            </div>
          )}
          <div style={S('display:flex;flex-direction:column;gap:14px')}>
            {vm.myRequestsVM.map(r => (
              <div key={r.id} style={S('border:1px solid #eceef1;border-radius:18px;padding:16px')}>
                <div style={S('display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;padding-bottom:12px;border-bottom:1px solid #f1f2f4')}>
                  <div style={S('display:flex;align-items:center;gap:10px')}>
                    <span style={S("font-family:'Space Mono';font-weight:700;font-size:13px;color:#e8112d;background:#fef2f2;padding:3px 10px;border-radius:999px")}>{r.refNumber}</span>
                    <span style={S("font-size:12px;color:#9ca3af;font-family:'Space Mono'")}>{r.submittedAt}</span>
                  </div>
                  <span style={r.statusStyle}><span style={r.statusDot} />{r.status}</span>
                </div>
                <div style={S('display:grid;grid-template-columns:1fr 1fr;gap:7px 16px;font-size:12.5px;color:#374151;margin-top:12px')}>
                  <div><span style={S('color:#9ca3af')}>หน่วยงาน:</span> <strong>{r.agencyName}</strong></div>
                  <div><span style={S('color:#9ca3af')}>วันที่ใช้:</span> <strong>{r.requiredDate}</strong></div>
                </div>
                <div style={S('margin-top:12px;font-size:12.5px;color:#6b7280')}>{r.itemsSummary}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
