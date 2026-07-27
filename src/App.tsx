import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Address, MediaMaterial, SubmittedRequest, SystemItem, MediaRequestForm } from './types';
import * as api from './data/api';
import type { AuthUser } from './data/api';
import {
  AppVM, AddressVM, BoCatRowVM, BoKpiVM, BoNavVM, BoRowVM, CartItemVM, CatTileVM, ChipVM,
  MediaCardVM, MediaDraft, NewAddressForm, PopularVM, ReqCardVM, ReqItemVM, Screen, SystemVM, TabVM,
} from './vm';
import {
  chip, fbBox, fbFor, formatThaiDate, isMultiLang, provinceOf, statusMeta, statusStep,
  MEDIA_CATEGORIES, PURPOSES, STATUSES,
} from './lib/ui';
import * as book from './lib/addressBook';
import { Portal } from './components/Portal';
import { Backoffice } from './components/Backoffice';
import { RequestWizard } from './components/RequestWizard';
import { Toast } from './components/Toast';
import { Lightbox } from './components/Lightbox';
import { Login } from './components/Login';

const ALL = 'ทั้งหมด';
const ANY_LANG = 'ทุกภาษา';
const ANY_PROV = 'ทุกจังหวัด';
const SORTS = ['แนะนำ', 'คงคลังมากสุด', 'ชื่อ ก-ฮ'] as const;
const LANGS = [ANY_LANG, 'ไทย', 'หลายภาษา'];

function blankDraft(): MediaDraft {
  return { id: null, title: '', category: MEDIA_CATEGORIES[0], description: '', maxAllowed: 50, availableStock: 1000, imageUrl: '' };
}

const EMPTY_ADDR: NewAddressForm = { label: '', contactName: '', detail: '', phone: '' };

interface State {
  view: 'portal' | 'backoffice';
  screen: Screen;
  clock: string;

  catalog: MediaMaterial[];
  requests: SubmittedRequest[];
  systems: SystemItem[];
  myRequests: SubmittedRequest[];
  loading: boolean;

  user: AuthUser | null;
  isStaff: boolean;
  authReady: boolean;
  loginOpen: boolean;
  loginReason: 'backoffice' | 'submit' | 'generic' | null;

  search: string;
  cat: string;
  lang: string;
  sort: typeof SORTS[number];

  qtys: Record<string, number>;

  wizardOpen: boolean;
  step: 1 | 2;
  submitting: boolean;
  success: SubmittedRequest | null;
  err: string;

  addresses: Address[];
  addrSel: string;
  addrFormOpen: boolean;
  newAddr: NewAddressForm;
  purpose: string;
  requiredDate: string;

  boView: 'requests' | 'catalog';
  boQ: string;
  boProv: string;
  boStatus: string;
  boFrom: string;
  boTo: string;
  boSel: string[];
  boDetailId: string | null;
  boCatQ: string;
  boCat: string;
  editOpen: boolean;
  editMode: 'add' | 'edit';
  draft: MediaDraft;

  toast: string;
  lightbox: string | null;
}

export default function App() {
  const [st, setSt] = useState<State>({
    view: 'portal',
    screen: 'home',
    clock: '--:--:--',
    catalog: [],
    requests: [],
    systems: [],
    myRequests: [],
    loading: true,
    user: null,
    isStaff: false,
    authReady: false,
    loginOpen: false,
    loginReason: null,
    search: '',
    cat: ALL,
    lang: ANY_LANG,
    sort: 'แนะนำ',
    qtys: {},
    wizardOpen: false,
    step: 1,
    submitting: false,
    success: null,
    err: '',
    addresses: [],
    addrSel: '',
    addrFormOpen: false,
    newAddr: EMPTY_ADDR,
    purpose: '',
    requiredDate: '',
    boView: 'requests',
    boQ: '',
    boProv: ANY_PROV,
    boStatus: ALL,
    boFrom: '',
    boTo: '',
    boSel: [],
    boDetailId: null,
    boCatQ: '',
    boCat: ALL,
    editOpen: false,
    editMode: 'add',
    draft: blankDraft(),
    toast: '',
    lightbox: null,
  });

  const patch = useCallback((p: Partial<State> | ((s: State) => Partial<State>)) => {
    setSt(s => ({ ...s, ...(typeof p === 'function' ? p(s) : p) }));
  }, []);

  // โหลด/รีเฟรชข้อมูลจาก data layer (Supabase). RLS คุมสิทธิ์ให้เอง
  const reload = useCallback(async () => {
    const [catalog, systems, requests, myRequests] = await Promise.all([
      api.fetchCatalog().catch(() => []),
      api.fetchSystems().catch(() => []),
      api.fetchRequests().catch(() => []),
      api.getMyRequests().catch(() => []),
    ]);
    patch({ catalog, systems, requests, myRequests, loading: false });
  }, [patch]);

  // นาฬิกา
  useEffect(() => {
    const tick = () => {
      const n = new Date();
      const p = (x: number) => String(x).padStart(2, '0');
      setSt(s => ({ ...s, clock: `${p(n.getHours())}:${p(n.getMinutes())}:${p(n.getSeconds())}` }));
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);

  // toast
  const toastTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const flash = useCallback((msg: string) => {
    setSt(s => ({ ...s, toast: msg }));
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setSt(s => ({ ...s, toast: '' })), 3200);
  }, []);
  useEffect(() => () => clearTimeout(toastTimer.current), []);

  // ติดตามสถานะ auth (รวม session ที่กลับมาจาก Google OAuth redirect)
  useEffect(() => {
    const unsub = api.onAuthChange(async (user) => {
      const isStaff = user ? await api.checkIsStaff() : false;
      const addresses = book.normalize(book.loadAddresses(user?.id ?? null));
      const fallbackSel = addresses.find(a => a.isDefault)?.id ?? addresses[0]?.id ?? '';

      // กู้คืนงานที่ค้างไว้ก่อน redirect ไป Google
      let restore: Partial<State> = {};
      const raw = user ? sessionStorage.getItem('alc.pending') : null;
      if (raw) {
        sessionStorage.removeItem('alc.pending');
        try {
          const p = JSON.parse(raw) as {
            reason: string; qtys?: Record<string, number>;
            addrSel?: string; purpose?: string; requiredDate?: string;
          };
          if (p.reason === 'submit') {
            restore = {
              qtys: p.qtys ?? {},
              purpose: p.purpose ?? '',
              requiredDate: p.requiredDate ?? '',
              addrSel: p.addrSel && addresses.some(a => a.id === p.addrSel) ? p.addrSel : fallbackSel,
              wizardOpen: true, step: 2, loginOpen: false,
            };
          } else if (p.reason === 'backoffice') {
            if (isStaff) restore = { view: 'backoffice', loginOpen: false };
            else flash('บัญชีนี้ไม่มีสิทธิ์เข้าถึงระบบเจ้าหน้าที่');
          }
        } catch { /* ignore */ }
      }
      patch({ user, isStaff, authReady: true, addresses, addrSel: fallbackSel, ...restore });
      await reload();
    });
    return () => unsub();
  }, [patch, reload, flash]);

  // ตั้งต้นสมุดที่อยู่จากคำขอเดิมของผู้ใช้ (ครั้งแรกที่ยังไม่มีที่อยู่บันทึกไว้)
  // seededFor กันไม่ให้ที่อยู่ที่ผู้ใช้เพิ่งลบทิ้งกลับมาใหม่
  const seededFor = useRef<string | null>(null);
  useEffect(() => {
    if (!st.user || st.loading || st.myRequests.length === 0) return;
    if (seededFor.current === st.user.id || st.addresses.length > 0) {
      seededFor.current = st.user.id;
      return;
    }
    const seeded = book.seedFromRequests(st.myRequests);
    seededFor.current = st.user.id;
    if (seeded.length === 0) return;
    patch({ addresses: seeded, addrSel: seeded[0].id });
  }, [st.user, st.loading, st.addresses.length, st.myRequests, patch]);

  // บันทึกสมุดที่อยู่ลงเครื่องทุกครั้งที่เปลี่ยน
  useEffect(() => {
    if (!st.user) return;
    book.saveAddresses(st.user.id, st.addresses);
  }, [st.user, st.addresses]);

  /* ----------------------------------------------------------- ตะกร้า */

  const add = useCallback((id: string, qty = 10) => patch(s => ({ qtys: { ...s.qtys, [id]: qty } })), [patch]);
  const remove = useCallback((id: string) => patch(s => {
    const m = { ...s.qtys }; delete m[id]; return { qtys: m };
  }), [patch]);
  const setQty = useCallback((id: string, v: string, max: number) => {
    let q = parseInt(v, 10) || 0;
    if (q > max) q = max;
    patch(s => {
      const m = { ...s.qtys };
      if (q <= 0) delete m[id]; else m[id] = q;
      return { qtys: m };
    });
  }, [patch]);
  const bump = useCallback((id: string, d: number, max: number) => {
    patch(s => {
      let v = (s.qtys[id] || 0) + d;
      if (v > max) v = max;
      if (v < 1) v = 1;
      return { qtys: { ...s.qtys, [id]: v } };
    });
  }, [patch]);

  /* ----------------------------------------------------------- auth */

  const openLogin = useCallback((reason: 'backoffice' | 'submit' | 'generic') => patch({ loginOpen: true, loginReason: reason }), [patch]);
  const closeLogin = useCallback(() => patch({ loginOpen: false, loginReason: null }), [patch]);
  const login = useCallback(async () => {
    const pending = st.loginReason === 'submit'
      ? { reason: 'submit', qtys: st.qtys, addrSel: st.addrSel, purpose: st.purpose, requiredDate: st.requiredDate }
      : { reason: st.loginReason ?? 'generic' };
    sessionStorage.setItem('alc.pending', JSON.stringify(pending));
    try {
      await api.signInWithGoogle();
    } catch (e) {
      flash(e instanceof Error ? e.message : 'เข้าสู่ระบบไม่สำเร็จ');
    }
  }, [st.loginReason, st.qtys, st.addrSel, st.purpose, st.requiredDate, flash]);
  const logout = useCallback(async () => {
    await api.signOut();
    patch({ view: 'portal', screen: 'home', addresses: [], addrSel: '' });
  }, [patch]);

  /* ----------------------------------------------------------- สมุดที่อยู่ */

  const saveAddr = useCallback(() => {
    const f = st.newAddr;
    if (!f.label.trim()) { flash('กรุณากรอกชื่อเรียกที่อยู่ (เช่น ชื่อหน่วยงาน)'); return; }
    if (!f.detail.trim()) { flash('กรุณากรอกที่อยู่พร้อมรหัสไปรษณีย์'); return; }
    if (!f.phone.trim()) { flash('กรุณากรอกเบอร์ติดต่อ'); return; }
    const a = book.makeAddress({
      label: f.label.trim(),
      contactName: f.contactName.trim() || st.user?.name || '',
      detail: f.detail.trim(),
      phone: f.phone.trim(),
      isDefault: st.addresses.length === 0,
    });
    patch(s => ({ addresses: [...s.addresses, a], addrSel: a.id, addrFormOpen: false, newAddr: EMPTY_ADDR, err: '' }));
  }, [st.newAddr, st.addresses.length, st.user, patch, flash]);

  const deleteAddr = useCallback((id: string) => {
    patch(s => {
      const left = book.normalize(s.addresses.filter(a => a.id !== id));
      return { addresses: left, addrSel: s.addrSel === id ? (left[0]?.id ?? '') : s.addrSel };
    });
  }, [patch]);

  /* ----------------------------------------------------------- ส่งคำขอ */

  const closeWizard = useCallback(() => patch({ wizardOpen: false, step: 1, success: null, err: '' }), [patch]);

  const startRequest = useCallback(() => {
    if (Object.keys(st.qtys).length === 0) { flash('กรุณาเลือกสื่ออย่างน้อย 1 รายการ'); return; }
    patch({ wizardOpen: true, step: 1, err: '', success: null });
  }, [st.qtys, patch, flash]);

  const doSubmit = useCallback(async () => {
    // ต้องล็อกอินก่อน — สมุดที่อยู่ผูกกับบัญชี จึงเช็คเป็นอย่างแรก
    if (!st.user) { patch({ loginOpen: true, loginReason: 'submit' }); return; }
    const addr = st.addresses.find(a => a.id === st.addrSel);
    if (!addr) { patch({ err: 'กรุณาเลือกที่อยู่จัดส่ง' }); return; }
    if (!st.purpose) { patch({ err: 'กรุณาเลือกวัตถุประสงค์การใช้สื่อ' }); return; }
    if (!st.requiredDate) { patch({ err: 'กรุณาเลือกวันที่ต้องการใช้สื่อ' }); return; }

    const payload: MediaRequestForm = {
      fullName: addr.contactName.trim() || st.user.name,
      agencyName: addr.label,
      phoneNumber: addr.phone,
      requiredDate: st.requiredDate,
      shippingAddress: addr.detail,
      purpose: st.purpose,
      selectedMaterials: Object.keys(st.qtys).map(id => ({ materialId: id, quantity: st.qtys[id] })),
    };
    patch({ submitting: true, err: '' });
    try {
      const req = await api.submitRequest(payload);
      patch({ success: req, qtys: {}, purpose: '', requiredDate: '', err: '', submitting: false });
      await reload();
    } catch (e) {
      patch({ err: e instanceof Error ? e.message : 'ส่งคำขอไม่สำเร็จ กรุณาลองใหม่', submitting: false });
    }
  }, [st.addresses, st.addrSel, st.purpose, st.requiredDate, st.user, st.qtys, patch, reload]);

  const next = useCallback(() => {
    if (st.step === 1) {
      if (Object.keys(st.qtys).length === 0) { patch({ err: 'กรุณาเลือกสื่ออย่างน้อย 1 รายการ' }); return; }
      patch({ step: 2, err: '' });
      return;
    }
    void doSubmit();
  }, [st.step, st.qtys, patch, doSubmit]);

  const back = useCallback(() => {
    if (st.success || st.step === 1) { closeWizard(); return; }
    patch({ step: 1, err: '' });
  }, [st.success, st.step, closeWizard, patch]);

  /* ----------------------------------------------------------- หลังบ้าน */

  const setStatus = useCallback(async (id: string, status: string) => {
    patch(s => ({ requests: s.requests.map(r => r.id === id ? { ...r, status: status as SubmittedRequest['status'] } : r) }));
    try {
      await api.setRequestStatus(id, status as SubmittedRequest['status']);
    } catch (e) {
      flash(e instanceof Error ? e.message : 'อัปเดตสถานะไม่สำเร็จ');
      await reload();
    }
  }, [patch, flash, reload]);

  const bulkStatus = useCallback(async (status: string) => {
    const ids = st.boSel;
    if (ids.length === 0) return;
    patch(s => ({
      requests: s.requests.map(r => ids.includes(r.id) ? { ...r, status: status as SubmittedRequest['status'] } : r),
      boSel: [],
    }));
    const results = await Promise.allSettled(ids.map(id => api.setRequestStatus(id, status as SubmittedRequest['status'])));
    const failed = results.filter(r => r.status === 'rejected').length;
    if (failed > 0) { flash(`อัปเดตไม่สำเร็จ ${failed} รายการ`); await reload(); }
    else flash(`อัปเดตสถานะ ${ids.length} คำขอเป็น "${status}" แล้ว`);
  }, [st.boSel, patch, flash, reload]);

  const deleteMedia = useCallback(async (m: MediaMaterial) => {
    if (!window.confirm(`ยืนยันนำ "${m.title}" ออกจากคลังสื่อ?`)) return;
    try {
      await api.archiveMaterial(m.id);
      await reload();
      flash('นำสื่อออกจากคลังแล้ว');
    } catch (e) {
      flash(e instanceof Error ? e.message : 'ลบสื่อไม่สำเร็จ');
    }
  }, [reload, flash]);

  const openAdd = useCallback(() => patch({ boView: 'catalog', editOpen: true, editMode: 'add', draft: blankDraft() }), [patch]);
  const openEdit = useCallback((m: MediaMaterial) => patch({
    editOpen: true, editMode: 'edit',
    draft: { ...blankDraft(), ...m, imageUrl: m.imageUrl ?? '', availableStock: m.availableStock ?? 0, id: m.id },
  }), [patch]);
  const setDraft = useCallback((k: keyof MediaDraft, v: string) => patch(s => ({ draft: { ...s.draft, [k]: v } })), [patch]);

  const uploadDraftImage = useCallback(async (file: File) => {
    try {
      const url = await api.uploadImage(file);
      patch(s => ({ draft: { ...s.draft, imageUrl: url } }));
    } catch (e) {
      flash(e instanceof Error ? e.message : 'อัปโหลดรูปไม่สำเร็จ');
    }
  }, [patch, flash]);

  const saveDraft = useCallback(async () => {
    const d = st.draft;
    if (!d.title.trim() || !d.description.trim()) { flash('กรุณากรอกชื่อสื่อและคำอธิบาย'); return; }
    const mode = st.editMode;
    const mat: MediaMaterial = {
      id: d.id ?? '',
      title: d.title.trim(),
      category: d.category,
      description: d.description.trim(),
      maxAllowed: Number(d.maxAllowed) || 50,
      availableStock: Number(d.availableStock) || 0,
      imageUrl: d.imageUrl.trim() || undefined,
    };
    try {
      await api.saveMaterial(mat, mode);
      patch({ editOpen: false });
      await reload();
      flash(mode === 'edit' ? 'บันทึกการแก้ไขเรียบร้อย' : 'เพิ่มสื่อใหม่เรียบร้อย');
    } catch (e) {
      flash(e instanceof Error ? e.message : 'บันทึกไม่สำเร็จ');
    }
  }, [st.draft, st.editMode, patch, reload, flash]);

  /* ----------------------------------------------------------- view-models */

  const reqCard = useCallback((r: SubmittedRequest, catalog: MediaMaterial[]): ReqCardVM => {
    const meta = statusMeta(r.status);
    const step = statusStep(r.status);
    const items: ReqItemVM[] = r.selectedMaterials.map(it => {
      const m = catalog.find(x => x.id === it.materialId);
      const fb = fbFor(m?.category ?? '');
      return {
        materialId: it.materialId,
        title: m ? m.title : 'สื่อถูกนำออกจากคลังแล้ว',
        quantity: it.quantity,
        imageUrl: m?.imageUrl,
        catShort: fb.short || 'สื่อ',
        fbStyle: fbBox(m?.category ?? '', 10),
      };
    });
    return {
      ...r,
      statusStyle: {
        display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '3px 9px', borderRadius: '5px',
        fontSize: '11px', fontWeight: 600, fontFamily: 'Kanit', color: meta.text, background: meta.bg,
        border: `1px solid ${meta.bd}`,
      },
      statusDot: { width: '6px', height: '6px', borderRadius: '999px', background: meta.dot, display: 'inline-block' },
      itemsTotal: r.selectedMaterials.reduce((a, b) => a + b.quantity, 0),
      items,
      step,
      bars: [1, 2, 3].map(n => ({
        flex: 1, height: '4px', borderRadius: '999px',
        background: n <= step ? '#e8112d' : '#e5e7eb',
      })),
    };
  }, []);

  const vm = useMemo<AppVM>(() => {
    /* ---- หมวดหมู่ ---- */
    const cats: string[] = [];
    st.catalog.forEach(m => { if (!cats.includes(m.category)) cats.push(m.category); });

    const catTiles: CatTileVM[] = cats.map(c => {
      const f = fbFor(c);
      const n = st.catalog.filter(m => m.category === c).length;
      return {
        key: c, short: f.short, countLabel: `${n} รายการ`,
        tileStyle: {
          display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '6px',
          padding: '13px 14px', minHeight: '82px', background: '#fff', border: '1px solid #dfe2e7',
          borderRadius: '12px', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
        },
        dotStyle: { width: '26px', height: '26px', borderRadius: '7px', background: f.bg, border: '1px solid rgba(0,0,0,.04)', display: 'block' },
        onPick: () => patch({ screen: 'catalog', cat: c, search: '' }),
      };
    });

    /* ---- ตัวกรองคลังสื่อ ---- */
    const q = st.search.toLowerCase().trim();
    let list = st.catalog.filter(m => {
      const okCat = st.cat === ALL || m.category === st.cat;
      const multi = isMultiLang(m.title);
      const okLang = st.lang === ANY_LANG || (st.lang === 'หลายภาษา' ? multi : !multi);
      const okQ = !q || m.title.toLowerCase().includes(q) || m.description.toLowerCase().includes(q) || m.category.toLowerCase().includes(q);
      return okCat && okLang && okQ;
    });
    if (st.sort === 'คงคลังมากสุด') list = list.slice().sort((a, b) => (b.availableStock || 0) - (a.availableStock || 0));
    if (st.sort === 'ชื่อ ก-ฮ') list = list.slice().sort((a, b) => a.title.localeCompare(b.title, 'th'));

    const cardOf = (m: MediaMaterial): MediaCardVM => {
      const selected = !!st.qtys[m.id];
      const f = fbFor(m.category);
      const stock = m.availableStock ?? 0;
      const max = Math.max(1, Math.min(m.maxAllowed || 50, stock || m.maxAllowed || 50));
      return {
        ...m,
        selected, notSelected: !selected,
        qty: st.qtys[m.id] || 0,
        catShort: f.short,
        multiLang: isMultiLang(m.title),
        stockText: stock.toLocaleString('en-US'),
        outOfStock: stock <= 0,
        fbStyle: fbBox(m.category, 10),
        tagStyle: { fontSize: '10px', fontWeight: 600, padding: '2px 7px', borderRadius: '4px', background: f.bg, color: f.accent, fontFamily: 'Kanit' },
        cardStyle: {
          background: '#fff',
          border: selected ? '1.5px solid #e8112d' : '1px solid #dfe2e7',
          borderRadius: '12px', padding: selected ? '11.5px' : '12px',
        },
        onAdd: () => (selected ? remove(m.id) : add(m.id, Math.min(10, max))),
        onInc: () => bump(m.id, 5, max),
        onDec: () => bump(m.id, -5, max),
        onQty: e => setQty(m.id, e.target.value, max),
        onOpenImage: () => { if (m.imageUrl) patch({ lightbox: m.imageUrl }); },
      };
    };

    const mediaVM = list.map(cardOf);

    // สื่อแนะนำบนหน้าแรก — ใช้รายการล่าสุดในคลัง
    // (ยังไม่มี aggregate ยอดขอในฐานข้อมูล จึงยังทำ "ขอบ่อยที่สุด" จริง ๆ ไม่ได้)
    const popular: PopularVM[] = st.catalog.slice(0, 4).map(m => {
      const selected = !!st.qtys[m.id];
      const stock = m.availableStock ?? 0;
      const max = Math.max(1, Math.min(m.maxAllowed || 50, stock || m.maxAllowed || 50));
      return {
        ...m,
        catShort: fbFor(m.category).short,
        stockText: stock.toLocaleString('en-US'),
        fbStyle: fbBox(m.category, 10),
        addLabel: selected ? '✓' : '＋',
        addBtn: {
          width: '44px', height: '44px', flexShrink: 0, borderRadius: '10px', cursor: 'pointer',
          fontFamily: 'Kanit', fontWeight: 700, fontSize: '16px',
          border: selected ? 'none' : '1px solid #fbd5da',
          background: selected ? '#e8112d' : '#fff5f6',
          color: selected ? '#fff' : '#e8112d',
        },
        onAdd: () => (selected ? remove(m.id) : add(m.id, Math.min(10, max))),
      };
    });

    const catChips: ChipVM[] = [ALL, ...cats].map(c => ({
      key: c, label: c === ALL ? ALL : fbFor(c).short,
      style: chip(st.cat === c), onPick: () => patch({ cat: c }),
    }));
    const langChips: ChipVM[] = LANGS.map(l => ({
      key: l, label: l, style: chip(st.lang === l, 12), onPick: () => patch({ lang: l }),
    }));

    /* ---- ตะกร้า ---- */
    const cartIds = Object.keys(st.qtys);
    const cartTotal = cartIds.reduce((a, id) => a + st.qtys[id], 0);
    const cartVM: CartItemVM[] = cartIds
      .map(id => st.catalog.find(m => m.id === id))
      .filter((m): m is MediaMaterial => !!m)
      .map(m => {
        const stock = m.availableStock ?? 0;
        const max = Math.max(1, Math.min(m.maxAllowed || 50, stock || m.maxAllowed || 50));
        return {
          ...m,
          qty: st.qtys[m.id],
          catShort: fbFor(m.category).short,
          fbStyle: fbBox(m.category, 10),
          onInc: () => bump(m.id, 5, max),
          onDec: () => bump(m.id, -5, max),
          onRemove: () => remove(m.id),
        };
      });

    /* ---- สมุดที่อยู่ ---- */
    const addressesVM: AddressVM[] = st.addresses.map(a => {
      const on = st.addrSel === a.id;
      return {
        ...a,
        selected: on,
        cardStyle: {
          display: 'flex', alignItems: 'flex-start', gap: '11px', width: '100%', padding: '13px 14px',
          background: '#fff', border: on ? '1.5px solid #e8112d' : '1px solid #dfe2e7',
          borderRadius: '12px', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
        },
        radioStyle: {
          width: '20px', height: '20px', borderRadius: '999px',
          border: on ? '6px solid #e8112d' : '1.5px solid #cbd0d6',
          background: '#fff', flexShrink: 0, marginTop: '2px', display: 'block',
        },
        onPick: () => patch({ addrSel: a.id, err: '' }),
        onDelete: () => deleteAddr(a.id),
      };
    });

    const purposeChips: ChipVM[] = PURPOSES.map(p => ({
      key: p, label: p,
      onPick: () => patch({ purpose: p, err: '' }),
      style: {
        height: '38px', padding: '0 14px', borderRadius: '8px', fontFamily: 'Kanit',
        fontWeight: st.purpose === p ? 600 : 500, fontSize: '12.5px', cursor: 'pointer',
        border: st.purpose === p ? '1px solid #e8112d' : '1px solid #e5e7eb',
        background: st.purpose === p ? '#fff5f6' : '#fff',
        color: st.purpose === p ? '#e8112d' : '#374151',
      },
    }));

    /* ---- คำขอของฉัน ---- */
    const myRequestsVM = st.myRequests.map(r => reqCard(r, st.catalog));

    /* ---- หลังบ้าน: คำขอ ---- */
    const boReqs = st.requests.map(r => ({ ...r, province: provinceOf(r.shippingAddress) }));
    const provinces = [ANY_PROV, ...Array.from(new Set<string>(boReqs.map(r => r.province))).sort((a, b) => a.localeCompare(b, 'th'))];
    const bq = st.boQ.toLowerCase().trim();
    const fromMs = st.boFrom ? new Date(`${st.boFrom}T00:00:00`).getTime() : null;
    const toMs = st.boTo ? new Date(`${st.boTo}T23:59:59.999`).getTime() : null;

    const boFiltered = boReqs.filter(r => {
      if (st.boStatus !== ALL && r.status !== st.boStatus) return false;
      if (st.boProv !== ANY_PROV && r.province !== st.boProv) return false;
      if (bq && !(
        r.refNumber.toLowerCase().includes(bq) ||
        r.fullName.toLowerCase().includes(bq) ||
        r.agencyName.toLowerCase().includes(bq)
      )) return false;
      if (fromMs !== null || toMs !== null) {
        const t = new Date(r.submittedAtISO).getTime();
        if (Number.isNaN(t)) return false;
        if (fromMs !== null && t < fromMs) return false;
        if (toMs !== null && t > toMs) return false;
      }
      return true;
    });

    const countBy = (s: string) => s === ALL ? boReqs.length : boReqs.filter(r => r.status === s).length;

    const boRows: BoRowVM[] = boFiltered.map((r, i) => {
      const c = statusMeta(r.status);
      const checked = st.boSel.includes(r.id);
      return {
        ...r,
        itemsLabel: `${r.selectedMaterials.length} · ${r.selectedMaterials.reduce((a, b) => a + b.quantity, 0)} ชิ้น`,
        requiredDateLabel: formatThaiDate(r.requiredDate),
        checked,
        rowStyle: {
          borderBottom: i === boFiltered.length - 1 ? 'none' : '1px solid #f1f2f4',
          background: checked ? '#fff9fa' : '#fff',
        },
        checkStyle: {
          width: '20px', height: '20px', borderRadius: '5px',
          border: checked ? 'none' : '1.5px solid #cbd0d6',
          background: checked ? '#e8112d' : '#fff', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, flexShrink: 0,
        },
        statusSelect: {
          flex: 1, minWidth: 0, height: '32px', padding: '0 8px', borderRadius: '7px',
          fontFamily: 'Kanit', fontWeight: 600, fontSize: '12px', cursor: 'pointer', outline: 'none',
          background: c.bg, border: `1px solid ${c.bd}`, color: c.text,
        },
        onToggle: () => patch(s => ({
          boSel: s.boSel.includes(r.id) ? s.boSel.filter(x => x !== r.id) : [...s.boSel, r.id],
        })),
        onStatus: e => { void setStatus(r.id, e.target.value); },
        onOpen: () => patch({ boDetailId: r.id }),
      };
    });

    const boKpis: BoKpiVM[] = [
      { key: ALL, label: 'คำขอทั้งหมด', color: '#141821' },
      { key: 'รอการอนุมัติ', label: 'รอดำเนินการ', color: '#e8112d' },
      { key: 'กำลังจัดส่ง', label: 'กำลังจัดส่ง', color: '#2563eb' },
      { key: 'เสร็จสิ้น', label: 'เสร็จสิ้น', color: '#10b981' },
    ].map(k => ({
      key: k.key, label: k.label, value: String(countBy(k.key)),
      onPick: () => patch({ boStatus: k.key, boSel: [] }),
      style: {
        display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '14px 16px',
        background: '#fff', border: st.boStatus === k.key ? '1.5px solid #141821' : '1px solid #e5e7eb',
        borderRadius: '12px', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit',
      },
      valueStyle: { fontFamily: 'Space Mono', fontWeight: 700, fontSize: '24px', color: k.color, lineHeight: 1 },
    }));

    const boStatusChips: ChipVM[] = [ALL, ...STATUSES].map(s => {
      const on = st.boStatus === s;
      return {
        key: s, label: s, count: String(countBy(s)),
        onPick: () => patch({ boStatus: s, boSel: [] }),
        style: { ...chip(on), display: 'inline-flex', alignItems: 'center', gap: '8px' },
        countStyle: {
          fontFamily: 'Space Mono', fontWeight: 700, fontSize: '11px', padding: '1px 7px',
          borderRadius: '999px', background: on ? 'rgba(255,255,255,.2)' : '#f1f2f4', color: on ? '#fff' : '#9ca3af',
        },
      };
    });

    const boBulk = STATUSES.map(s => ({
      label: s,
      onPick: () => { void bulkStatus(s); },
      style: {
        height: '30px', padding: '0 12px', borderRadius: '7px',
        border: '1px solid rgba(255,255,255,.22)', background: 'rgba(255,255,255,.1)',
        color: '#fff', fontFamily: 'Kanit', fontWeight: 500, fontSize: '12px', cursor: 'pointer',
      } as React.CSSProperties,
    }));

    const boNav: BoNavVM[] = ([
      { key: 'requests' as const, label: 'คำขอที่เข้ามา', count: countBy('รอการอนุมัติ') },
      { key: 'catalog' as const, label: 'คลังสื่อ', count: 0 },
    ]).map(n => {
      const on = st.boView === n.key;
      return {
        key: n.key, label: n.label, hasCount: n.count > 0, count: String(n.count),
        onPick: () => patch({ boView: n.key }),
        style: {
          display: 'flex', alignItems: 'center', gap: '10px', width: '100%', height: '42px',
          padding: '0 12px', borderRadius: '9px', border: 'none', cursor: 'pointer',
          fontFamily: 'Kanit', fontWeight: on ? 600 : 500, fontSize: '13.5px', textAlign: 'left',
          background: on ? '#e8112d' : 'transparent', color: on ? '#fff' : '#a8aeb9',
        },
        markStyle: { width: '5px', height: '5px', borderRadius: '999px', background: on ? '#fff' : '#4b515e', flexShrink: 0, display: 'block' },
        countStyle: {
          marginLeft: 'auto', fontFamily: 'Space Mono', fontWeight: 700, fontSize: '11px',
          padding: '1px 7px', borderRadius: '999px', background: on ? 'rgba(255,255,255,.22)' : '#262b36', color: '#fff',
        },
      };
    });

    /* ---- หลังบ้าน: คลังสื่อ ---- */
    const cq = st.boCatQ.toLowerCase().trim();
    const boCatList = st.catalog.filter(m =>
      (st.boCat === ALL || m.category === st.boCat) &&
      (!cq || m.title.toLowerCase().includes(cq) || m.description.toLowerCase().includes(cq)));

    const boCatRows: BoCatRowVM[] = boCatList.map((m, i) => {
      const stock = m.availableStock ?? 0;
      return {
        ...m,
        catShort: fbFor(m.category).short,
        stockText: stock.toLocaleString('en-US'),
        fbStyle: fbBox(m.category, 9),
        rowStyle: {
          borderBottom: i === boCatList.length - 1 ? 'none' : '1px solid #f1f2f4',
          background: st.editOpen && st.draft.id === m.id ? '#fff9fa' : '#fff',
        },
        stockDot: {
          width: '7px', height: '7px', borderRadius: '999px', flexShrink: 0, display: 'block',
          background: stock <= 0 ? '#e8112d' : stock < 500 ? '#f59e0b' : '#10b981',
        },
        onEdit: () => openEdit(m),
        onDelete: () => { void deleteMedia(m); },
      };
    });

    const boCatChips: ChipVM[] = [ALL, ...cats].map(c => ({
      key: c, label: c === ALL ? ALL : fbFor(c).short,
      style: chip(st.boCat === c), onPick: () => patch({ boCat: c }),
    }));

    /* ---- ส่งออก CSV (เปิดใน Excel ได้ตรง ๆ) ---- */
    const onBoExport = () => {
      const head = ['เลขที่คำขอ', 'ยื่นเมื่อ', 'ผู้ขอ', 'หน่วยงาน', 'โทรศัพท์', 'จังหวัด', 'ที่อยู่จัดส่ง', 'วัตถุประสงค์', 'วันที่ต้องใช้', 'จำนวนรายการ', 'รวมชิ้น', 'สถานะ'];
      const esc = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;
      const body = boFiltered.map(r => [
        r.refNumber, r.submittedAt, r.fullName, r.agencyName, r.phoneNumber, r.province,
        r.shippingAddress, r.purpose, r.requiredDate,
        r.selectedMaterials.length, r.selectedMaterials.reduce((a, b) => a + b.quantity, 0), r.status,
      ].map(esc).join(','));
      // ﻿ = BOM ให้ Excel อ่านภาษาไทยถูก
      const blob = new Blob([`﻿${[head.map(esc).join(','), ...body].join('\r\n')}`], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `คำขอสื่อ-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      flash(`ส่งออก ${boFiltered.length} คำขอเรียบร้อย`);
    };

    /* ---- แท็บล่างฝั่งผู้ใช้ ---- */
    const tabs: TabVM[] = ([
      { key: 'home' as const, label: 'หน้าแรก', badge: 0 },
      { key: 'catalog' as const, label: 'คลังสื่อ', badge: cartIds.length },
      { key: 'mine' as const, label: 'คำขอของฉัน', badge: st.myRequests.filter(r => r.status !== 'เสร็จสิ้น').length },
      { key: 'account' as const, label: 'บัญชี', badge: 0 },
    ]).map(t => ({ ...t, active: st.screen === t.key, onPick: () => patch({ screen: t.key }) }));

    const systemsVM: SystemVM[] = st.systems.map(x => ({ ...x, target: x.url.startsWith('#') ? '_self' : '_blank' }));

    const detail = st.boDetailId ? st.requests.find(r => r.id === st.boDetailId) : undefined;

    return {
      isPortal: st.view === 'portal',
      isBackoffice: st.view === 'backoffice',
      clock: st.clock,
      loading: st.loading,

      screen: st.screen,
      tabs,
      onScreen: (s: Screen) => patch({ screen: s }),
      onGotoBO: () => {
        if (!st.user) { patch({ loginOpen: true, loginReason: 'backoffice' }); return; }
        if (!st.isStaff) { flash('บัญชีนี้ไม่มีสิทธิ์เข้าถึงระบบเจ้าหน้าที่'); return; }
        patch({ view: 'backoffice' });
      },
      onGotoPortal: () => patch({ view: 'portal' }),

      catTiles,
      popular,
      latestRequest: st.myRequests.length > 0 ? reqCard(st.myRequests[0], st.catalog) : null,

      search: st.search,
      onSearch: e => patch({ search: e.target.value }),
      catChips,
      langChips,
      sortLabel: st.sort,
      onToggleSort: () => patch(s => ({ sort: SORTS[(SORTS.indexOf(s.sort) + 1) % SORTS.length] })),
      resultCount: list.length,
      mediaVM,
      mediaEmpty: list.length === 0,
      filtersDirty: !!q || st.cat !== ALL || st.lang !== ANY_LANG || st.sort !== 'แนะนำ',
      onClearFilters: () => patch({ search: '', cat: ALL, lang: ANY_LANG, sort: 'แนะนำ' }),

      cartCount: cartIds.length,
      cartTotal,
      cartLabel: `${cartIds.length} รายการ · ${cartTotal} ชิ้น`,
      hasCart: cartIds.length > 0,
      cartVM,
      onStartRequest: startRequest,

      wizardOpen: st.wizardOpen,
      step: st.step,
      isStep1: !st.success && st.step === 1,
      isStep2: !st.success && st.step === 2,
      isSuccess: !!st.success,
      submitting: st.submitting,
      err: st.err,
      onNext: next,
      onBack: back,
      onCloseWizard: closeWizard,
      successRef: st.success ? st.success.refNumber : '',

      addressesVM,
      addrCountLabel: `${st.addresses.length} ที่อยู่ที่บันทึกไว้`,
      hasAddress: st.addresses.length > 0,
      addrFormOpen: st.addrFormOpen,
      newAddr: st.newAddr,
      onOpenAddrForm: () => patch({ addrFormOpen: true }),
      onCancelAddr: () => patch({ addrFormOpen: false, newAddr: EMPTY_ADDR }),
      onNewAddrField: (k, v) => patch(s => ({ newAddr: { ...s.newAddr, [k]: v } })),
      onSaveAddr: saveAddr,
      purposeChips,
      purpose: st.purpose,
      requiredDate: st.requiredDate,
      onRequiredDate: e => patch({ requiredDate: e.target.value, err: '' }),

      myRequestsVM,
      myRequestsEmpty: st.myRequests.length === 0,

      systemsVM,

      boNav,
      boView: st.boView,
      boCrumb: st.boView === 'catalog' ? 'คลังสื่อ' : 'คำขอที่เข้ามา',
      boTitle: st.boView === 'catalog' ? 'จัดการคลังสื่อประชาสัมพันธ์' : 'คำขอที่เข้ามา',
      boKpis,
      boStatusChips,
      boRows,
      boEmpty: boFiltered.length === 0,
      boCount: boFiltered.length,
      boTotal: boReqs.length,
      boQ: st.boQ,
      onBoQ: e => patch({ boQ: e.target.value }),
      boProv: st.boProv,
      onBoProv: e => patch({ boProv: e.target.value }),
      provinces,
      boFrom: st.boFrom,
      boTo: st.boTo,
      onBoFrom: e => patch({ boFrom: e.target.value }),
      onBoTo: e => patch({ boTo: e.target.value }),
      onBoClear: () => patch({ boQ: '', boProv: ANY_PROV, boStatus: ALL, boFrom: '', boTo: '', boSel: [] }),
      onBoExport,
      boSelCount: st.boSel.length,
      boSelLabel: `เลือกไว้ ${st.boSel.length} คำขอ`,
      boBulk,
      onBoClearSel: () => patch({ boSel: [] }),
      boDetail: detail ? reqCard(detail, st.catalog) : null,
      onBoCloseDetail: () => patch({ boDetailId: null }),

      boCatQ: st.boCatQ,
      onBoCatQ: e => patch({ boCatQ: e.target.value }),
      boCatChips,
      boCatRows,
      boCatEmpty: boCatList.length === 0,

      editOpen: st.editOpen,
      editMode: st.editMode,
      editTitle: st.editMode === 'edit' ? 'แก้ไขสื่อ' : 'เพิ่มสื่อใหม่',
      draft: st.draft,
      onOpenAdd: openAdd,
      onCloseEdit: () => patch({ editOpen: false }),
      onDraftField: setDraft,
      onUploadDraftImage: uploadDraftImage,
      onSaveDraft: saveDraft,

      onImgErr: (e: React.SyntheticEvent<HTMLImageElement>) => { (e.target as HTMLImageElement).style.visibility = 'hidden'; },
      toast: st.toast,
      lightbox: st.lightbox,
      onOpenLightbox: (url: string) => patch({ lightbox: url }),
      onCloseLightbox: () => patch({ lightbox: null }),

      authReady: st.authReady,
      user: st.user ? { email: st.user.email, name: st.user.name, avatarUrl: st.user.avatarUrl } : null,
      isStaff: st.isStaff,
      loginOpen: st.loginOpen,
      loginReason: st.loginReason,
      onLogin: login,
      onLogout: logout,
      onOpenLogin: openLogin,
      onCloseLogin: closeLogin,
    };
  }, [
    st, patch, add, remove, bump, setQty, reqCard, startRequest, next, back, closeWizard,
    saveAddr, deleteAddr, setStatus, bulkStatus, openEdit, openAdd, deleteMedia, setDraft,
    uploadDraftImage, saveDraft, login, logout, openLogin, closeLogin, flash,
  ]);

  return (
    <>
      {vm.isPortal && <Portal vm={vm} />}
      {vm.isBackoffice && <Backoffice vm={vm} />}
      {vm.wizardOpen && <RequestWizard vm={vm} />}
      {vm.lightbox && <Lightbox vm={vm} />}
      {vm.loginOpen && <Login vm={vm} />}
      {vm.toast && <Toast msg={vm.toast} />}
    </>
  );
}
