import React from 'react';
import { Address, MediaMaterial, SubmittedRequest, SystemItem } from './types';

/* View-models ที่ App คำนวณและส่งให้คอมโพเนนต์ย่อยเรนเดอร์
   (พอร์ตจาก renderVals ของดีไซน์ "ระบบขอสื่อ สคอ. (ออกแบบใหม่)") */

/** หน้าจอฝั่งผู้ใช้ (ตรงกับแท็บล่างในดีไซน์มือถือ) */
export type Screen = 'home' | 'catalog' | 'mine' | 'account';

type InputHandler = (e: React.ChangeEvent<HTMLInputElement>) => void;
type TextareaHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
type SelectHandler = (e: React.ChangeEvent<HTMLSelectElement>) => void;

export interface ChipVM {
  key: string;
  label: string;
  style: React.CSSProperties;
  onPick: () => void;
  count?: string;
  countStyle?: React.CSSProperties;
}

export interface TabVM {
  key: Screen;
  label: string;
  active: boolean;
  badge: number;
  onPick: () => void;
}

/** การ์ดสื่อในคลัง (หน้าคลังสื่อ) */
export interface MediaCardVM extends MediaMaterial {
  selected: boolean;
  notSelected: boolean;
  qty: number;
  catShort: string;
  multiLang: boolean;
  stockText: string;
  outOfStock: boolean;
  fbStyle: React.CSSProperties;
  tagStyle: React.CSSProperties;
  cardStyle: React.CSSProperties;
  onAdd: () => void;
  onInc: () => void;
  onDec: () => void;
  onQty: InputHandler;
  onOpenImage: () => void;
}

/** ไทล์ "เลือกตามประเภท" บนหน้าแรก */
export interface CatTileVM {
  key: string;
  short: string;
  countLabel: string;
  tileStyle: React.CSSProperties;
  dotStyle: React.CSSProperties;
  onPick: () => void;
}

/** สื่อ "ขอบ่อยที่สุด" บนหน้าแรก */
export interface PopularVM extends MediaMaterial {
  catShort: string;
  stockText: string;
  fbStyle: React.CSSProperties;
  addLabel: string;
  addBtn: React.CSSProperties;
  onAdd: () => void;
}

/** รายการในตะกร้า (ขั้นที่ 1 ของคำขอ) */
export interface CartItemVM extends MediaMaterial {
  qty: number;
  catShort: string;
  fbStyle: React.CSSProperties;
  onInc: () => void;
  onDec: () => void;
  onRemove: () => void;
}

/** ที่อยู่ในสมุดที่อยู่ (ขั้นที่ 2 ของคำขอ) */
export interface AddressVM extends Address {
  selected: boolean;
  cardStyle: React.CSSProperties;
  radioStyle: React.CSSProperties;
  onPick: () => void;
  onDelete: () => void;
}

export interface NewAddressForm {
  label: string;
  contactName: string;
  detail: string;
  phone: string;
}

export interface SystemVM extends SystemItem {
  target: string;
}

export interface ReqItemVM {
  materialId: string;
  title: string;
  quantity: number;
  imageUrl?: string;
  catShort: string;
  fbStyle: React.CSSProperties;
}

/** การ์ดคำขอ (ใช้ทั้งหน้า "คำขอของฉัน" และรายละเอียดในหลังบ้าน) */
export interface ReqCardVM extends SubmittedRequest {
  statusStyle: React.CSSProperties;
  statusDot: React.CSSProperties;
  itemsTotal: number;
  items: ReqItemVM[];
  /** 1..3 — ใช้กับแถบความคืบหน้า 3 ช่วง */
  step: number;
  bars: React.CSSProperties[];
}

/* ------------------------------------------------------------------ หลังบ้าน */

export interface BoNavVM {
  key: 'requests' | 'catalog';
  label: string;
  style: React.CSSProperties;
  markStyle: React.CSSProperties;
  hasCount: boolean;
  count: string;
  countStyle: React.CSSProperties;
  onPick: () => void;
}

export interface BoKpiVM {
  key: string;
  label: string;
  value: string;
  style: React.CSSProperties;
  valueStyle: React.CSSProperties;
  onPick: () => void;
}

export interface BoRowVM extends SubmittedRequest {
  province: string;
  itemsLabel: string;
  requiredDateLabel: string;
  checked: boolean;
  rowStyle: React.CSSProperties;
  checkStyle: React.CSSProperties;
  statusSelect: React.CSSProperties;
  onToggle: () => void;
  onStatus: SelectHandler;
  onOpen: () => void;
}

export interface BoBulkVM {
  label: string;
  style: React.CSSProperties;
  onPick: () => void;
}

export interface BoCatRowVM extends MediaMaterial {
  catShort: string;
  stockText: string;
  fbStyle: React.CSSProperties;
  rowStyle: React.CSSProperties;
  stockDot: React.CSSProperties;
  onEdit: () => void;
  onDelete: () => void;
}

export interface MediaDraft {
  id: string | null;
  title: string;
  category: string;
  description: string;
  maxAllowed: number | string;
  availableStock: number | string;
  imageUrl: string;
}

/** view-model รวมที่ App ส่งต่อให้คอมโพเนนต์ย่อยทั้งหมด */
export interface AppVM {
  isPortal: boolean;
  isBackoffice: boolean;
  clock: string;
  loading: boolean;

  /* ---- เปลือกแอปฝั่งผู้ใช้ ---- */
  screen: Screen;
  tabs: TabVM[];
  onScreen: (s: Screen) => void;
  onGotoBO: () => void;
  onGotoPortal: () => void;

  /* ---- หน้าแรก ---- */
  catTiles: CatTileVM[];
  popular: PopularVM[];
  latestRequest: ReqCardVM | null;

  /* ---- คลังสื่อ ---- */
  search: string;
  onSearch: InputHandler;
  catChips: ChipVM[];
  langChips: ChipVM[];
  sortLabel: string;
  onToggleSort: () => void;
  resultCount: number;
  mediaVM: MediaCardVM[];
  mediaEmpty: boolean;
  filtersDirty: boolean;
  onClearFilters: () => void;

  /* ---- ตะกร้า / คำขอ ---- */
  cartCount: number;
  cartTotal: number;
  cartLabel: string;
  hasCart: boolean;
  cartVM: CartItemVM[];
  onStartRequest: () => void;

  wizardOpen: boolean;
  step: 1 | 2;
  isStep1: boolean;
  isStep2: boolean;
  isSuccess: boolean;
  submitting: boolean;
  err: string;
  onNext: () => void;
  onBack: () => void;
  onCloseWizard: () => void;
  successRef: string;

  /* ---- สมุดที่อยู่ + วัตถุประสงค์ + วันที่ ---- */
  addressesVM: AddressVM[];
  addrCountLabel: string;
  hasAddress: boolean;
  addrFormOpen: boolean;
  newAddr: NewAddressForm;
  onOpenAddrForm: () => void;
  onCancelAddr: () => void;
  onNewAddrField: (k: keyof NewAddressForm, v: string) => void;
  onSaveAddr: () => void;
  purposeChips: ChipVM[];
  purpose: string;
  requiredDate: string;
  onRequiredDate: InputHandler;

  /* ---- คำขอของฉัน ---- */
  myRequestsVM: ReqCardVM[];
  myRequestsEmpty: boolean;

  /* ---- ระบบอื่น ๆ (หน้าบัญชี) ---- */
  systemsVM: SystemVM[];

  /* ---- หลังบ้าน ---- */
  boNav: BoNavVM[];
  boView: 'requests' | 'catalog';
  boCrumb: string;
  boTitle: string;
  boKpis: BoKpiVM[];
  boStatusChips: ChipVM[];
  boRows: BoRowVM[];
  boEmpty: boolean;
  boCount: number;
  boTotal: number;
  boQ: string;
  onBoQ: InputHandler;
  boProv: string;
  onBoProv: SelectHandler;
  provinces: string[];
  boFrom: string;
  boTo: string;
  onBoFrom: InputHandler;
  onBoTo: InputHandler;
  onBoClear: () => void;
  onBoExport: () => void;
  boSelCount: number;
  boSelLabel: string;
  boBulk: BoBulkVM[];
  onBoClearSel: () => void;
  boDetail: ReqCardVM | null;
  onBoCloseDetail: () => void;

  boCatQ: string;
  onBoCatQ: InputHandler;
  boCatChips: ChipVM[];
  boCatRows: BoCatRowVM[];
  boCatEmpty: boolean;

  editOpen: boolean;
  editMode: 'add' | 'edit';
  editTitle: string;
  draft: MediaDraft;
  onOpenAdd: () => void;
  onCloseEdit: () => void;
  onDraftField: (k: keyof MediaDraft, v: string) => void;
  onUploadDraftImage: (file: File) => void;
  onSaveDraft: () => void;

  /* ---- ทั่วไป ---- */
  onImgErr: (e: React.SyntheticEvent<HTMLImageElement>) => void;
  toast: string;
  lightbox: string | null;
  onOpenLightbox: (url: string) => void;
  onCloseLightbox: () => void;

  /* ---- auth ---- */
  authReady: boolean;
  user: { email: string; name: string; avatarUrl?: string } | null;
  isStaff: boolean;
  loginOpen: boolean;
  loginReason: 'backoffice' | 'submit' | 'generic' | null;
  onLogin: () => void;
  onLogout: () => void;
  onOpenLogin: (reason: 'backoffice' | 'submit' | 'generic') => void;
  onCloseLogin: () => void;
}

export type { TextareaHandler };
