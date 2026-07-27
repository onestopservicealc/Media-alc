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
  /** วันเวลาที่ยื่น รูปแบบไทยแบบย่อ (สำหรับแสดงผล) */
  submittedAt: string;
  /** วันเวลาที่ยื่นแบบ ISO (สำหรับกรองช่วงวันที่ในหลังบ้าน) */
  submittedAtISO: string;
  status: 'รอการอนุมัติ' | 'กำลังจัดส่ง' | 'เสร็จสิ้น';
}

/**
 * สมุดที่อยู่จัดส่งของผู้ใช้ — เก็บฝั่งเบราว์เซอร์ (ผูกกับบัญชีที่ล็อกอิน)
 * ทำให้ขั้นตอนขอสื่อเหลือแค่ "เลือกที่อยู่ + วัตถุประสงค์" แทนการกรอก 6 ช่องทุกครั้ง
 */
export interface Address {
  id: string;
  /** ชื่อเรียก = ชื่อหน่วยงาน/สถานที่ */
  label: string;
  /** ชื่อ-สกุลผู้รับ */
  contactName: string;
  /** ที่อยู่เต็มพร้อมรหัสไปรษณีย์ */
  detail: string;
  phone: string;
  isDefault: boolean;
}
