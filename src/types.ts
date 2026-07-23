export interface SystemItem {
  name: string;
  url: string;
  desc: string;
  cat: string;
  icon: string;
  imageUrl?: string;
}

export interface MediaMaterial {
  id: string;
  title: string;
  category: string;
  description: string;
  maxAllowed: number;
  imageUrl?: string;
  availableStock?: number;
  downloadUrl?: string;
  fileSize?: string;
  fileType?: string;
}

export interface MediaRequestForm {
  fullName: string;
  agencyName: string;
  shippingAddress: string;
  phoneNumber: string;
  purpose: string;
  requiredDate: string;
  selectedMaterials: {
    materialId: string;
    quantity: number;
  }[];
}

export interface SubmittedRequest extends MediaRequestForm {
  id: string;
  refNumber: string;
  submittedAt: string;
  status: 'รอการอนุมัติ' | 'กำลังจัดส่ง' | 'เสร็จสิ้น';
}
