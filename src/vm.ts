import React from 'react';
import { MediaMaterial, SubmittedRequest, SystemItem } from './types';

/* View-models ที่ App คำนวณและส่งให้คอมโพเนนต์ย่อยเรนเดอร์ (พอร์ตจาก renderVals ของดีไซน์) */

export interface CatalogItemVM extends MediaMaterial {
  selected: boolean;
  notSelected: boolean;
  qty: number;
  catShort: string;
  fbStyle: React.CSSProperties;
  fbStyleSm: React.CSSProperties;
  wrapStyle: React.CSSProperties;
  rowStyle: React.CSSProperties;
  reqBtnStyle: React.CSSProperties;
  reqIcon: string;
  reqIconWrap: React.CSSProperties;
  reqLabel: string;
  onToggle: () => void;
  onInc: () => void;
  onDec: () => void;
  onQty: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface CategoryVM {
  label: string;
  style: React.CSSProperties;
  onPick: () => void;
}

export interface SelectedVM extends MediaMaterial {
  qty: number;
  catShort: string;
  fbStyleSm: React.CSSProperties;
}

export interface SystemVM extends SystemItem {
  target: string;
}

export interface StepVM {
  label: string;
  mark: string;
  circle: React.CSSProperties;
  labelStyle: React.CSSProperties;
  showBar: boolean;
  bar: React.CSSProperties;
}

export interface ReqItemVM {
  materialId: string;
  title: string;
  quantity: number;
  imageUrl?: string;
  catShort: string;
  fbStyleSm: React.CSSProperties;
}

export interface ReqCardVM extends SubmittedRequest {
  statusStyle: React.CSSProperties;
  statusDot: React.CSSProperties;
  itemsTotal: number;
  items: ReqItemVM[];
}

export interface BoStatVM {
  label: string;
  value: string;
  sub: string;
  accent: string;
  valueStyle: React.CSSProperties;
}

export interface BoStatusBtnVM {
  label: string;
  onPick: () => void;
  style: React.CSSProperties;
}

export interface BoRequestVM extends ReqCardVM {
  statuses: BoStatusBtnVM[];
}

export interface BoCatalogVM extends MediaMaterial {
  stockText: string;
  fbStyleSm: React.CSSProperties;
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

export interface RequestFormState {
  fullName: string;
  agency: string;
  phone: string;
  date: string;
  address: string;
  purpose: string;
}

type InputHandler = (e: React.ChangeEvent<HTMLInputElement>) => void;
type TextareaHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => void;

/** view-model รวมที่ App ส่งต่อให้คอมโพเนนต์ย่อยทั้งหมด */
export interface AppVM {
  isPortal: boolean;
  isBackoffice: boolean;
  clock: string;
  search: string;
  cat: string;
  categories: CategoryVM[];
  catalogVM: CatalogItemVM[];
  catalogEmpty: boolean;
  systemsVM: SystemVM[];
  selCount: number;
  selTotal: number;
  selNames: string;
  hasSelection: boolean;
  onSearch: InputHandler;
  onClearFilters: () => void;
  onGotoBO: () => void;
  onGotoPortal: () => void;
  onStartRequest: () => void;
  onScrollCatalog: () => void;
  onOpenHistory: () => void;
  onCloseHistory: () => void;

  wizardOpen: boolean;
  step: number;
  isStep1: boolean;
  isStep2: boolean;
  isStep3: boolean;
  isSuccess: boolean;
  showStepper: boolean;
  showNav: boolean;
  steps: StepVM[];
  err: string;
  selectedVM: SelectedVM[];
  form: RequestFormState;
  onFullName: InputHandler;
  onAgency: InputHandler;
  onPhone: InputHandler;
  onDate: InputHandler;
  onAddress: TextareaHandler;
  onPurpose: TextareaHandler;
  onNext: () => void;
  onBack: () => void;
  onCloseWizard: () => void;
  backLabel: string;
  nextLabel: string;
  backBtnStyle: React.CSSProperties;
  successRef: string;

  historyOpen: boolean;
  historyEmpty: boolean;
  myRequestsVM: ReqCardVM[];

  boStats: BoStatVM[];
  boTab: 'requests' | 'catalog';
  boRequestsVM: BoRequestVM[];
  boCatalogVM: BoCatalogVM[];
  boAddOpen: boolean;
  boAddMode: 'add' | 'edit';
  boDraft: MediaDraft;
  onBoTab: (t: 'requests' | 'catalog') => void;
  onToggleAdd: () => void;
  onDraftField: (k: keyof MediaDraft, v: string) => void;
  onUploadDraftImage: (file: File) => void;
  onSaveDraft: () => void;

  onImgErr: (e: React.SyntheticEvent<HTMLImageElement>) => void;
  toast: string;

  lightbox: string | null;
  onOpenLightbox: (url: string) => void;
  onCloseLightbox: () => void;
}
