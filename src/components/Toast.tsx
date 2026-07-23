import React from 'react';
import { css } from '../lib/ui';

const S = css;

export function Toast({ msg }: { msg: string }) {
  return (
    <div style={S('position:fixed;top:20px;left:50%;transform:translateX(-50%);z-index:80;background:#047857;color:#fff;padding:12px 20px;border-radius:14px;display:flex;align-items:center;gap:10px;box-shadow:0 16px 40px -12px rgba(0,0,0,.4);animation:slideUp .3s ease;font-size:13.5px;font-weight:500')}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
      <span>{msg}</span>
    </div>
  );
}
