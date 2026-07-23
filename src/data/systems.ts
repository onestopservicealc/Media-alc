import { SystemItem } from '../types';

/* =========================================================================
   รายการระบบทั้งหมด (SYSTEMS)
   สำนักงานคณะกรรมการควบคุมเครื่องดื่มแอลกอฮอล์ กรมควบคุมโรค กระทรวงสาธารณสุข
   -------------------------------------------------------------------------
   [คำแนะนำวิธีเพิ่ม/แก้ไข/ลบ รายการระบบ]
   
   1. วิธีการเพิ่มระบบใหม่:
      คัดลอกรูปแบบวัตถุแล้วนำมาต่อท้ายในอาร์เรย์ SYSTEMS เช่น:
      {
        name: "ชื่อระบบของคุณ",
        url: "https://example.moph.go.th",
        desc: "คำอธิบายระบบโดยสรุปสั้นๆ อ่านง่าย",
        cat: "หมวดหมู่ของระบบ",
        icon: "อีโมจิประจำระบบ (เช่น 📌 📢 📜 🎓)"
      },

   2. วิธีการแก้ไขระบบที่มีอยู่:
      ค้นหารายการที่ต้องการแก้ แล้วแก้ไขข้อความใน name, url, desc, cat หรือ icon ได้ทันที

   3. วิธีการลบระบบ:
      ลบวัตถุ { ... } ของระบบนั้นๆ ออกจากอาร์เรย์ SYSTEMS

   * หมายเหตุ: หมวดหมู่ (cat) ในแถบปุ่มกรองหน้าเว็บจะถูกสร้างขึ้นโดยอัตโนมัติจากค่า cat
   ========================================================================= */

export const SYSTEMS: SystemItem[] = [
  {
    name: "ระบบขอสนับสนุนสื่อประชาสัมพันธ์ (PR Request)",
    url: "#request-form",
    desc: "ยื่นคำขอรับการสนับสนุนสื่อ แผ่นพับ โปสเตอร์ สติ๊กเกอร์ นำไปใช้ในกิจกรรมรณรงค์",
    cat: "สื่อและความรู้",
    icon: "🎁",
    imageUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=500&auto=format&fit=crop&q=80"
  },
  {
    name: "ระบบรับเรื่องร้องเรียนและแจ้งเบาะแสกระทำผิด พ.ร.บ. (TAS)",
    url: "https://alcoholcontrol.ddc.moph.go.th/tas",
    desc: "แจ้งเบาะแสการโฆษณา การจำหน่าย และการทำโปรโมชั่นลด แลก แจก แถม ผิดกฎหมาย",
    cat: "ร้องเรียนและรับแจ้ง",
    icon: "📢",
    imageUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=500&auto=format&fit=crop&q=80"
  },
  {
    name: "ระบบการขอใบอนุญาตและตรวจสอบสถานที่จำหน่าย (E-License)",
    url: "https://alcoholcontrol.ddc.moph.go.th/elicense",
    desc: "ยื่นคำขออนุมัติ ตรวจสอบพื้นที่เขตสถานที่จำหน่าย และวันเวลาเปิด-ปิดบริการ",
    cat: "งานอนุมัติและอนุญาต",
    icon: "📜",
    imageUrl: "https://images.unsplash.com/photo-1450133064473-71024230f91b?w=500&auto=format&fit=crop&q=80"
  },
  {
    name: "คลังสารสนเทศและสื่อวิชาการแอลกอฮอล์ (Alcohol Knowledge Hub)",
    url: "https://alcoholcontrol.ddc.moph.go.th/knowledge",
    desc: "ดาวน์โหลดเอกสารวิชาการ งานวิจัย รายงานสถิติ อินโฟกราฟิก และอินโฟวิดีโอฟรี",
    cat: "สื่อและความรู้",
    icon: "📚",
    imageUrl: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=500&auto=format&fit=crop&q=80"
  },
  {
    name: "ระบบปฏิญาณตนงดดื่มสุราเข้าพรรษาและวันสำคัญ (No Alcohol Campaign)",
    url: "https://alcoholcontrol.ddc.moph.go.th/noalcohol",
    desc: "ลงทะเบียนงดเหล้าเข้าพรรษา บันทึกผลปฏิญาณตน และรับวุฒิบัตรอิเล็กทรอนิกส์",
    cat: "รณรงค์และสุขภาพ",
    icon: "💛",
    imageUrl: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=500&auto=format&fit=crop&q=80"
  },
  {
    name: "ระบบคัดกรองและประเมินพฤติกรรมการดื่มสุรา AUDIT",
    url: "https://alcoholcontrol.ddc.moph.go.th/screening",
    desc: "แบบประเมินความเสี่ยงสุขภาพจากการดื่ม พร้อมค้นหาศูนย์บำบัดรักษาใกล้บ้าน",
    cat: "รณรงค์และสุขภาพ",
    icon: "🩺",
    imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=500&auto=format&fit=crop&q=80"
  },
  {
    name: "ระบบงานกวดขันและบังคับใช้กฎหมายของพนักงานเจ้าหน้าที่",
    url: "https://alcoholcontrol.ddc.moph.go.th/enforcement",
    desc: "บันทึกข้อมูลการออกตรวจเตือน บันทึกการจับกุม และสรุปสถิติการดำเนินคดี",
    cat: "งานอนุมัติและอนุญาต",
    icon: "⚖️",
    imageUrl: "https://images.unsplash.com/photo-1453728013993-6d66e9c9123a?w=500&auto=format&fit=crop&q=80"
  },
  {
    name: "ระบบติดตามและประเมินผลนโยบายแอลกอฮอล์ระดับจังหวัด (APM)",
    url: "https://alcoholcontrol.ddc.moph.go.th/monitoring",
    desc: "ระบบรายงานผลการดำเนินงานของคณะกรรมการควบคุมเครื่องดื่มแอลกอฮอล์จังหวัด",
    cat: "บริหารและรายงาน",
    icon: "📊",
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&auto=format&fit=crop&q=80"
  },
  {
    name: "ศูนย์จดหมายข่าวและข่าวสารประชาสัมพันธ์ สคอ.",
    url: "https://alcoholcontrol.ddc.moph.go.th/news",
    desc: "ติดตามข่าวสาร การจัดงานแถลงข่าว กิจกรรมรณรงค์ และประกาศสำคัญจากสำนักงาน",
    cat: "สื่อและความรู้",
    icon: "📰",
    imageUrl: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=500&auto=format&fit=crop&q=80"
  }
];
