import { MediaMaterial } from '../types';

export const INITIAL_MEDIA_MATERIALS: MediaMaterial[] = [
  {
    id: 'mat-001',
    title: 'แผ่นพับ "รู้ทันโทษ และความเสี่ยงจากการดื่มแอลกอฮอล์"',
    category: 'แผ่นพับ (Brochure)',
    description: 'แผ่นพับ 3 พับ พิมพ์ 4 สี ให้ความรู้ผลกระทบต่อร่างกาย สมอง และโรคที่เกิดจากแอลกอฮอล์',
    maxAllowed: 50,
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
    availableStock: 5000,
    downloadUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1600&q=80',
    fileSize: '12.8 MB',
    fileType: 'PDF (Print Ready 300 DPI)'
  },
  {
    id: 'mat-002',
    title: 'โปสเตอร์ "ข้อกฎหมาย พ.ร.บ. ควบคุมเครื่องดื่มแอลกอฮอล์ สำหรับร้านค้า"',
    category: 'โปสเตอร์ (Poster)',
    description: 'ขนาด A3 พิมพ์กระดาษอาร์ตการ์ด แสดงข้อกำหนดช่วงเวลาขาย และห้ามขายให้ผู้มีอายุต่ำกว่า 20 ปี',
    maxAllowed: 50,
    imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80',
    availableStock: 3200,
    downloadUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1600&q=80',
    fileSize: '18.4 MB',
    fileType: 'PDF (CMYK for Print)'
  },
  {
    id: 'mat-003',
    title: 'สติ๊กเกอร์รณรงค์ "ห้ามขายเครื่องดื่มแอลกอฮอล์แก่บุคคลอายุต่ำกว่า 20 ปี"',
    category: 'สติ๊กเกอร์ (Sticker)',
    description: 'สติ๊กเกอร์ PVC กันน้ำ ขนาด 20x30 ซม. สำหรับติดกระจกหน้าร้านค้า/สถานบริการ',
    maxAllowed: 50,
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
    availableStock: 8000,
    downloadUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80',
    fileSize: '8.2 MB',
    fileType: 'PNG (Vector Artwork)'
  },
  {
    id: 'mat-004',
    title: 'คู่มือแนวปฏิบัติ "การจัดงานบุญประเพณีปลอดเครื่องดื่มแอลกอฮอล์"',
    category: 'คู่มือ/หนังสือ (Handbook)',
    description: 'หนังสือเล่มเล็ก A5 รวมข้อกฎหมายและแนวทางจัดงานบุญ งานวัด งานศพ ปลอดเหล้า',
    maxAllowed: 50,
    imageUrl: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=600&q=80',
    availableStock: 1500,
    downloadUrl: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=1600&q=80',
    fileSize: '24.1 MB',
    fileType: 'PDF (Full Handbook)'
  },
  {
    id: 'mat-005',
    title: 'โปสเตอร์อินโฟกราฟิก "สมองกับแอลกอฮอล์ ดื่มเท่าไหร่ถึงอันตราย"',
    category: 'โปสเตอร์ (Poster)',
    description: 'โปสเตอร์กราฟิกเข้าใจง่ายสำหรับติดบอร์ดประชาสัมพันธ์ในโรงเรียน และโรงพยาบาล',
    maxAllowed: 50,
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80',
    availableStock: 2400,
    downloadUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=80',
    fileSize: '15.0 MB',
    fileType: 'PNG (High Resolution)'
  },
  {
    id: 'mat-006',
    title: 'สติ๊กเกอร์สัญลักษณ์ "ขับไม่ดื่ม ดื่มไม่ขับ ปลอดภัยทุกเส้นทาง"',
    category: 'สติ๊กเกอร์ (Sticker)',
    description: 'สติ๊กเกอร์สำหรับติดรถยนต์และรถจักรยานยนต์ สะท้อนแสงในเวลากลางคืน',
    maxAllowed: 50,
    imageUrl: 'https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&w=600&q=80',
    availableStock: 6500,
    downloadUrl: 'https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&w=1600&q=80',
    fileSize: '6.5 MB',
    fileType: 'JPG (HD 300DPI)'
  }
];
