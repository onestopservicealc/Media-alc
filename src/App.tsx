import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { MediaMaterial, SubmittedRequest, SystemItem, MediaRequestForm } from './types';
import * as api from './data/api';
import type { AuthUser } from './data/api';
import {
  AppVM, CatalogItemVM, CategoryVM, SelectedVM, SystemVM, StepVM,
  ReqCardVM, ReqItemVM, BoStatVM, BoRequestVM, BoCatalogVM, MediaDraft, RequestFormState,
} from './vm';
import { css, fbFor, statusMeta, pill, STATUSES } from './lib/ui';
import { Portal } from './components/Portal';
import { Backoffice } from './components/Backoffice';
import { RequestWizard } from './components/RequestWizard';
import { HistoryModal } from './components/HistoryModal';
import { Toast } from './components/Toast';
import { Lightbox } from './components/Lightbox';
import { Login } from './components/Login';

// ตัวเลือกเริ่มต้น (เทียบเท่า data-props ของดีไซน์)
const DEFAULT_VIEW: 'portal' | 'backoffice' = 'portal';

function blankDraft(): MediaDraft {
  return { id: null, title: '', category: 'แผ่นพับ (Brochure)', description: '', maxAllowed: 50, availableStock: 1000, imageUrl: '' };
}

const EMPTY_FORM: RequestFormState = { fullName: '', agency: '', phone: '', date: '', address: '', purpose: '' };

interface State {
  view: 'portal' | 'backoffice';
  clock: string;
  search: string;
  cat: string;
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
  qtys: Record<string, number>;
  wizardOpen: boolean;
  step: number;
  success: SubmittedRequest | null;
  form: RequestFormState;
  err: string;
  toast: string;
  historyOpen: boolean;
  boTab: 'requests' | 'catalog';
  boAddOpen: boolean;
  boAddMode: 'add' | 'edit';
  draft: MediaDraft;
  lightbox: string | null;
}

export default function App() {
  const [st, setSt] = useState<State>({
    view: DEFAULT_VIEW,
    clock: '--:--:--',
    search: '',
    cat: 'ทั้งหมด',
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
    qtys: {},
    wizardOpen: false,
    step: 1,
    success: null,
    form: EMPTY_FORM,
    err: '',
    toast: '',
    historyOpen: false,
    boTab: 'requests',
    boAddOpen: false,
    boAddMode: 'add',
    draft: blankDraft(),
    lightbox: null,
  });

  // patch แบบเดียวกับ this.setState (รับ object หรือ updater function)
  const patch = useCallback((p: Partial<State> | ((s: State) => Partial<State>)) => {
    setSt(s => ({ ...s, ...(typeof p === 'function' ? p(s) : p) }));
  }, []);

  // โหลด/รีเฟรชข้อมูลจาก data layer (Supabase). RLS คุมสิทธิ์ให้เอง:
  // fetchRequests คืนทั้งหมดเฉพาะ staff, getMyRequests คืนของผู้ล็อกอิน
  const reload = useCallback(async () => {
    // แต่ละคิวรีกันพังกันเอง (เช่น non-staff เรียก fetchRequests แล้ว RLS คืน [])
    const [catalog, systems, requests, myRequests] = await Promise.all([
      api.fetchCatalog().catch(() => []),
      api.fetchSystems().catch(() => []),
      api.fetchRequests().catch(() => []),
      api.getMyRequests().catch(() => []),
    ]);
    patch({ catalog, systems, requests, myRequests, loading: false });
  }, [patch]);

  // นาฬิกา (clock)
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

  // ติดตามสถานะ auth (รวมถึง session ที่กลับมาจาก Google OAuth redirect)
  useEffect(() => {
    const unsub = api.onAuthChange(async (user) => {
      const isStaff = user ? await api.checkIsStaff() : false;
      // กู้คืนงานที่ค้างไว้ก่อน redirect ไป Google (เลือกสื่อ/กรอกฟอร์ม หรือจะเข้า Backoffice)
      let restore: Partial<State> = {};
      const raw = user ? sessionStorage.getItem('alc.pending') : null;
      if (raw) {
        sessionStorage.removeItem('alc.pending');
        try {
          const p = JSON.parse(raw) as { reason: string; qtys?: Record<string, number>; form?: RequestFormState };
          if (p.reason === 'submit') {
            restore = { qtys: p.qtys ?? {}, form: p.form ?? EMPTY_FORM, wizardOpen: true, step: 3, loginOpen: false };
          } else if (p.reason === 'backoffice') {
            if (isStaff) restore = { view: 'backoffice', loginOpen: false };
            else flash('บัญชีนี้ไม่มีสิทธิ์เข้าถึงระบบเจ้าหน้าที่');
          }
        } catch { /* ignore */ }
      }
      patch({ user, isStaff, authReady: true, ...restore });
      await reload();
    });
    return () => unsub();
  }, [patch, reload, flash]);

  const toggle = useCallback((id: string) => {
    patch(s => {
      const q = { ...s.qtys };
      if (q[id]) delete q[id]; else q[id] = 10;
      return { qtys: q };
    });
  }, [patch]);

  const setQty = useCallback((id: string, v: string) => {
    let q = parseInt(v) || 0;
    if (q > 50) q = 50;
    patch(s => {
      const m = { ...s.qtys };
      if (q <= 0) delete m[id]; else m[id] = q;
      return { qtys: m };
    });
  }, [patch]);

  const bump = useCallback((id: string, d: number) => {
    patch(s => {
      const cur = s.qtys[id] || 0;
      let v = cur + d;
      if (v > 50) v = 50;
      if (v < 1) v = 1;
      return { qtys: { ...s.qtys, [id]: v } };
    });
  }, [patch]);

  const startRequest = useCallback(() => patch({ wizardOpen: true, step: 1, err: '', success: null }), [patch]);
  const closeWizard = useCallback(() => patch({ wizardOpen: false, step: 1, success: null, err: '' }), [patch]);

  const openLightbox = useCallback((url: string) => patch({ lightbox: url }), [patch]);
  const closeLightbox = useCallback(() => patch({ lightbox: null }), [patch]);

  // ---- auth actions ----
  const openLogin = useCallback((reason: 'backoffice' | 'submit' | 'generic') => patch({ loginOpen: true, loginReason: reason }), [patch]);
  const closeLogin = useCallback(() => patch({ loginOpen: false, loginReason: null }), [patch]);
  const login = useCallback(async () => {
    // เก็บงานที่ค้างไว้ลง sessionStorage ก่อน redirect ไป Google แล้วกู้คืนตอนกลับมา
    const pending = st.loginReason === 'submit'
      ? { reason: 'submit', qtys: st.qtys, form: st.form }
      : { reason: st.loginReason ?? 'generic' };
    sessionStorage.setItem('alc.pending', JSON.stringify(pending));
    try {
      await api.signInWithGoogle();
    } catch (e) {
      flash(e instanceof Error ? e.message : 'เข้าสู่ระบบไม่สำเร็จ');
    }
  }, [st.loginReason, st.qtys, st.form, flash]);
  const logout = useCallback(async () => {
    await api.signOut();
    patch({ view: 'portal' });
  }, [patch]);

  // step 3 → ยืนยันส่งคำขอ (ผ่าน data layer: สร้างเลขอ้างอิง + ตัด stock)
  const doSubmit = useCallback(async () => {
    if (!st.user) { patch({ loginOpen: true, loginReason: 'submit' }); return; }
    const f = st.form;
    const payload: MediaRequestForm = {
      fullName: f.fullName.trim(), agencyName: f.agency.trim(), phoneNumber: f.phone.trim(),
      requiredDate: f.date, shippingAddress: f.address.trim(), purpose: f.purpose.trim(),
      selectedMaterials: Object.keys(st.qtys).map(id => ({ materialId: id, quantity: st.qtys[id] })),
    };
    try {
      const req = await api.submitRequest(payload);
      patch({ success: req, qtys: {}, form: EMPTY_FORM, err: '' });
      await reload();
    } catch (e) {
      patch({ err: e instanceof Error ? e.message : 'ส่งคำขอไม่สำเร็จ กรุณาลองใหม่' });
    }
  }, [st.user, st.form, st.qtys, patch, reload]);

  const next = useCallback(() => {
    if (st.step === 1) {
      if (Object.keys(st.qtys).length === 0) { patch({ err: 'กรุณาเลือกสื่ออย่างน้อย 1 รายการ' }); return; }
      patch({ step: 2, err: '' });
      return;
    }
    if (st.step === 2) {
      const f = st.form;
      if (!f.fullName.trim()) { patch({ err: 'กรุณากรอกชื่อ-สกุลผู้ขอ' }); return; }
      if (!f.agency.trim()) { patch({ err: 'กรุณากรอกชื่อหน่วยงาน' }); return; }
      if (!f.phone.trim()) { patch({ err: 'กรุณากรอกหมายเลขโทรศัพท์' }); return; }
      if (!f.date) { patch({ err: 'กรุณาเลือกวันที่ต้องการใช้สื่อ' }); return; }
      if (!f.address.trim()) { patch({ err: 'กรุณากรอกที่อยู่จัดส่ง' }); return; }
      if (!f.purpose.trim()) { patch({ err: 'กรุณาระบุวัตถุประสงค์' }); return; }
      patch({ step: 3, err: '' });
      return;
    }
    void doSubmit();
  }, [st.step, st.qtys, st.form, patch, doSubmit]);

  const back = useCallback(() => patch(s => ({ step: Math.max(1, s.step - 1), err: '' })), [patch]);
  const setForm = useCallback((k: keyof RequestFormState, v: string) => patch(s => ({ form: { ...s.form, [k]: v } })), [patch]);

  const setStatus = useCallback(async (id: string, status: string) => {
    // optimistic update แล้วค่อย persist ผ่าน data layer
    patch(s => ({ requests: s.requests.map(r => r.id === id ? { ...r, status: status as SubmittedRequest['status'] } : r) }));
    await api.setRequestStatus(id, status as SubmittedRequest['status']);
  }, [patch]);
  const deleteMedia = useCallback(async (id: string) => {
    await api.archiveMaterial(id);
    await reload();
  }, [reload]);
  const openAdd = useCallback(() => patch({ boAddOpen: true, boAddMode: 'add', draft: blankDraft() }), [patch]);
  const openEdit = useCallback((m: MediaMaterial) => patch({ boAddOpen: true, boAddMode: 'edit', draft: { ...blankDraft(), ...m, id: m.id } }), [patch]);
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
    if (!d.title.trim() || !d.description.trim()) {
      flash('กรุณากรอกชื่อสื่อและคำอธิบาย');
      return;
    }
    const mode = st.boAddMode;
    const mat: MediaMaterial = {
      id: d.id ?? '',
      title: d.title.trim(),
      category: d.category,
      description: d.description.trim(),
      maxAllowed: Number(d.maxAllowed) || 50,
      availableStock: Number(d.availableStock) || 1000,
      imageUrl: d.imageUrl.trim() || undefined,
    };
    await api.saveMaterial(mat, mode);
    patch({ boAddOpen: false });
    await reload();
    flash(mode === 'edit' ? 'บันทึกการแก้ไขเรียบร้อย' : 'เพิ่มสื่อใหม่เรียบร้อย');
  }, [st.draft, st.boAddMode, patch, reload, flash]);

  // ====== reqCard helper ======
  const reqCard = useCallback((r: SubmittedRequest, catalog: MediaMaterial[]): ReqCardVM => {
    const meta = statusMeta(r.status);
    const total = r.selectedMaterials.reduce((a, b) => a + b.quantity, 0);
    const items: ReqItemVM[] = r.selectedMaterials.map(it => {
      const m = catalog.find(x => x.id === it.materialId);
      const fb = fbFor(m?.category ?? '');
      return {
        materialId: it.materialId,
        title: m ? m.title : 'สื่อถูกลบออกจากคลัง',
        quantity: it.quantity,
        imageUrl: m?.imageUrl,
        catShort: fb.short || 'สื่อ',
        fbStyleSm: { position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: fb.bg, color: fb.accent, fontFamily: 'Kanit', fontWeight: 600, fontSize: '10px', textAlign: 'center', padding: '0 5px', lineHeight: 1.2 },
      };
    });
    return {
      ...r,
      statusStyle: { display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '5px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: 600, fontFamily: 'Kanit', color: meta.text, background: meta.bg, border: `1px solid ${meta.bd}` },
      statusDot: { width: '7px', height: '7px', borderRadius: '999px', background: meta.dot, display: 'inline-block' },
      itemsTotal: total,
      items,
    };
  }, []);

  // ====== คำนวณ view-models (เทียบเท่า renderVals) ======
  const vm = useMemo<AppVM>(() => {
    const allCats = st.catalog.map(m => m.category);
    const cats: string[] = ['ทั้งหมด', ...allCats.filter((c, i) => allCats.indexOf(c) === i)];
    const q = st.search.toLowerCase().trim();
    const filtered = st.catalog.filter(m => {
      const mc = st.cat === 'ทั้งหมด' || m.category === st.cat;
      const ms = !q || m.title.toLowerCase().includes(q) || m.description.toLowerCase().includes(q) || m.category.toLowerCase().includes(q);
      return mc && ms;
    });

    const catalogVM: CatalogItemVM[] = filtered.map(m => {
      const selected = !!st.qtys[m.id];
      const fb = fbFor(m.category);
      return {
        ...m, selected, notSelected: !selected, qty: st.qtys[m.id] || 0,
        catShort: fb.short,
        fbStyle: { position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '6px', background: fb.bg, color: fb.accent, textAlign: 'center', padding: '0 14px' },
        fbStyleSm: { position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: fb.bg, color: fb.accent },
        wrapStyle: { background: '#fff', border: selected ? '2px solid #e8112d' : '1px solid #eceef1', borderRadius: '20px', padding: selected ? '13px' : '14px', display: 'flex', flexDirection: 'column', transition: 'all .2s', boxShadow: selected ? '0 12px 30px -14px rgba(232,17,45,.35)' : 'none' },
        rowStyle: { display: 'flex', alignItems: 'center', gap: '12px', padding: '11px 13px', borderRadius: '14px', border: selected ? '1.5px solid #e8112d' : '1px solid #eceef1', background: selected ? '#fff5f6' : '#fff', transition: 'all .2s' },
        reqBtnStyle: selected
          ? { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '7px', padding: '11px 8px', background: '#e8112d', color: '#fff', border: 'none', borderRadius: '12px', fontFamily: 'Kanit', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }
          : { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '7px', padding: '11px 8px', background: '#fff5f6', color: '#e8112d', border: '1.5px solid #fbd5da', borderRadius: '12px', fontFamily: 'Kanit', fontWeight: 600, fontSize: '13px', cursor: 'pointer' },
        reqIcon: selected ? '✓' : '＋',
        reqIconWrap: { fontWeight: 700, fontSize: '14px', lineHeight: 1 },
        reqLabel: selected ? 'เลือกแล้ว' : 'ขอเล่มจริง',
        onToggle: () => toggle(m.id),
        onInc: () => bump(m.id, 5),
        onDec: () => bump(m.id, -5),
        onQty: (e) => setQty(m.id, e.target.value),
      };
    });

    const categories: CategoryVM[] = cats.map(c => ({ label: c, style: pill(st.cat === c), onPick: () => patch({ cat: c }) }));

    const selIds = Object.keys(st.qtys);
    const selTotal = selIds.reduce((a, id) => a + st.qtys[id], 0);
    const selMats = selIds.map(id => st.catalog.find(m => m.id === id)).filter(Boolean) as MediaMaterial[];
    const selectedVM: SelectedVM[] = selMats.map(m => {
      const fb = fbFor(m.category);
      return { ...m, qty: st.qtys[m.id], catShort: fb.short, fbStyleSm: { position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: fb.bg, color: fb.accent } };
    });
    const selNames = selMats.map(m => m.title.replace(/".*?"/g, '').trim() || m.category).join(' · ');

    const systemsVM: SystemVM[] = st.systems.map(x => ({ ...x, target: x.url.startsWith('#') ? '_self' : '_blank' }));

    const stepLabels = ['เลือกสื่อ', 'ข้อมูลจัดส่ง', 'ยืนยัน'];
    const steps: StepVM[] = stepLabels.map((label, i) => {
      const n = i + 1;
      const done = st.step > n, active = st.step === n;
      return {
        label,
        mark: done ? '✓' : String(n),
        circle: { width: '34px', height: '34px', borderRadius: '999px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Space Mono', fontWeight: 700, fontSize: '14px', flexShrink: 0, background: (done || active) ? '#e8112d' : '#f1f2f4', color: (done || active) ? '#fff' : '#9ca3af', transition: 'all .3s' },
        labelStyle: { fontFamily: 'Kanit', fontWeight: active ? 600 : 500, fontSize: '13px', color: active ? '#111827' : '#9ca3af', whiteSpace: 'nowrap' },
        showBar: n < 3,
        bar: { flex: 1, height: '2px', background: done ? '#e8112d' : '#e5e7eb', borderRadius: '2px', minWidth: '12px' },
      };
    });

    const isSuccess = !!st.success;
    const backLabels: Record<number, string> = { 1: 'ยกเลิก', 2: 'ย้อนกลับ', 3: 'ย้อนกลับ' };
    const nextLabels: Record<number, string> = { 1: 'ถัดไป', 2: 'ตรวจทาน', 3: 'ยืนยันส่งคำขอ' };

    const myRequestsVM = st.myRequests.map(r => reqCard(r, st.catalog));

    // backoffice
    const pending = st.requests.filter(r => r.status === 'รอการอนุมัติ').length;
    const shipping = st.requests.filter(r => r.status === 'กำลังจัดส่ง').length;
    const done = st.requests.filter(r => r.status === 'เสร็จสิ้น').length;
    const totalStock = st.catalog.reduce((a, m) => a + (m.availableStock || 0), 0);
    const rawStats = [
      { label: 'คำขอทั้งหมด', value: String(st.requests.length), sub: 'รายการ', accent: '#141821' },
      { label: 'รอดำเนินการ', value: String(pending), sub: 'รายการ', accent: '#e8112d' },
      { label: 'กำลังจัดส่ง', value: String(shipping), sub: 'รายการ', accent: '#2563eb' },
      { label: 'เสร็จสิ้น', value: String(done), sub: 'รายการ', accent: '#10b981' },
      { label: 'สื่อในคลัง', value: String(st.catalog.length), sub: 'รายการ', accent: '#141821' },
      { label: 'ยอดคงคลังรวม', value: totalStock.toLocaleString('en-US'), sub: 'ชิ้น', accent: '#141821' },
    ];
    const boStats: BoStatVM[] = rawStats.map(x => ({ ...x, valueStyle: { fontFamily: 'Space Mono', fontWeight: 700, fontSize: '26px', color: x.accent, lineHeight: 1 } }));

    const boRequestsVM: BoRequestVM[] = st.requests.map(r => ({
      ...reqCard(r, st.catalog),
      statuses: STATUSES.map(status => {
        const mm = statusMeta(status);
        const on = r.status === status;
        return {
          label: status,
          onPick: () => setStatus(r.id, status),
          style: { padding: '6px 12px', borderRadius: '999px', fontSize: '11.5px', fontWeight: 600, fontFamily: 'Kanit', cursor: 'pointer', border: on ? 'none' : '1px solid #e5e7eb', background: on ? mm.dot : '#fff', color: on ? '#fff' : '#9ca3af' } as React.CSSProperties,
        };
      }),
    }));

    const boCatalogVM: BoCatalogVM[] = st.catalog.map(m => {
      const fb = fbFor(m.category);
      return {
        ...m, stockText: (m.availableStock || 0).toLocaleString('en-US'),
        fbStyleSm: { position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: fb.bg, color: fb.accent },
        onEdit: () => openEdit(m), onDelete: () => deleteMedia(m.id),
      };
    });

    const onImgErr = (e: React.SyntheticEvent<HTMLImageElement>) => { (e.target as HTMLImageElement).style.display = 'none'; };

    return {
      isPortal: st.view === 'portal', isBackoffice: st.view === 'backoffice',
      clock: st.clock, search: st.search, cat: st.cat, categories,
      catalogVM, catalogEmpty: filtered.length === 0,
      systemsVM,
      selCount: selIds.length, selTotal, selNames, hasSelection: selIds.length > 0 && !st.wizardOpen,
      onSearch: (e: React.ChangeEvent<HTMLInputElement>) => patch({ search: e.target.value }),
      onClearFilters: () => patch({ search: '', cat: 'ทั้งหมด' }),
      onGotoBO: () => {
        if (!st.user) { patch({ loginOpen: true, loginReason: 'backoffice' }); return; }
        if (!st.isStaff) { flash('บัญชีนี้ไม่มีสิทธิ์เข้าถึงระบบเจ้าหน้าที่'); return; }
        patch({ view: 'backoffice' });
      },
      onGotoPortal: () => patch({ view: 'portal' }),
      onStartRequest: startRequest,
      onScrollCatalog: () => { const el = document.getElementById('catalog'); if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' }); },
      onOpenHistory: () => patch({ historyOpen: true }),
      onCloseHistory: () => patch({ historyOpen: false }),

      wizardOpen: st.wizardOpen, step: st.step,
      isStep1: !isSuccess && st.step === 1, isStep2: !isSuccess && st.step === 2, isStep3: !isSuccess && st.step === 3,
      isSuccess, showStepper: !isSuccess, showNav: !isSuccess,
      steps, err: st.err,
      selectedVM,
      form: st.form,
      onFullName: (e: React.ChangeEvent<HTMLInputElement>) => setForm('fullName', e.target.value),
      onAgency: (e: React.ChangeEvent<HTMLInputElement>) => setForm('agency', e.target.value),
      onPhone: (e: React.ChangeEvent<HTMLInputElement>) => setForm('phone', e.target.value),
      onDate: (e: React.ChangeEvent<HTMLInputElement>) => setForm('date', e.target.value),
      onAddress: (e: React.ChangeEvent<HTMLTextAreaElement>) => setForm('address', e.target.value),
      onPurpose: (e: React.ChangeEvent<HTMLTextAreaElement>) => setForm('purpose', e.target.value),
      onNext: next, onBack: () => (st.step === 1 ? closeWizard() : back()),
      onCloseWizard: closeWizard,
      backLabel: backLabels[st.step], nextLabel: nextLabels[st.step],
      backBtnStyle: { display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '13px 22px', background: '#f1f2f4', color: '#374151', border: 'none', borderRadius: '999px', fontFamily: 'Kanit', fontWeight: 500, fontSize: '14px', cursor: 'pointer' } as React.CSSProperties,
      successRef: st.success ? st.success.refNumber : '',

      historyOpen: st.historyOpen, historyEmpty: st.myRequests.length === 0, myRequestsVM,

      boStats, boTab: st.boTab, boRequestsVM, boCatalogVM,
      boAddOpen: st.boAddOpen, boAddMode: st.boAddMode, boDraft: st.draft,
      onBoTab: (t: 'requests' | 'catalog') => patch({ boTab: t }),
      onToggleAdd: () => (st.boAddOpen ? patch({ boAddOpen: false }) : openAdd()),
      onDraftField: (k: keyof MediaDraft, v: string) => setDraft(k, v),
      onUploadDraftImage: uploadDraftImage,
      onSaveDraft: saveDraft,

      onImgErr,
      toast: st.toast,

      lightbox: st.lightbox,
      onOpenLightbox: openLightbox,
      onCloseLightbox: closeLightbox,

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
  }, [st, patch, toggle, bump, setQty, startRequest, next, back, closeWizard, openLightbox, closeLightbox, login, logout, openLogin, closeLogin, flash, setForm, reqCard, setStatus, openEdit, deleteMedia, openAdd, setDraft, uploadDraftImage, saveDraft]);

  return (
    <>
      {vm.isPortal && <Portal vm={vm} />}
      {vm.isBackoffice && <Backoffice vm={vm} />}
      {vm.wizardOpen && <RequestWizard vm={vm} />}
      {vm.historyOpen && <HistoryModal vm={vm} />}
      {vm.lightbox && <Lightbox vm={vm} />}
      {vm.loginOpen && <Login vm={vm} />}
      {vm.toast && <Toast msg={vm.toast} />}
    </>
  );
}
