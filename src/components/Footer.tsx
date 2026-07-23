import React from 'react';
import { ShieldAlert, Phone, MapPin, ExternalLink, Globe } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-gray-900 text-gray-300 font-thai border-t border-gray-800 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-10 border-b border-gray-800">
          
          {/* Column 1: Organization info */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#e8112d] flex items-center justify-center text-white shadow-md">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold font-kanit text-white leading-snug">
                  สำนักงานคณะกรรมการควบคุมเครื่องดื่มแอลกอฮอล์
                </h3>
                <p className="text-xs text-gray-400">กรมควบคุมโรค กระทรวงสาธารณสุข</p>
              </div>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed pt-1">
              ทำหน้าที่ขับเคลื่อน พ.ร.บ. ควบคุมเครื่องดื่มแอลกอฮอล์ พ.ศ. 2551 บังคับใช้กฎหมาย รณรงค์ป้องกัน และให้ความรู้พิษภัยจากเครื่องดื่มแอลกอฮอล์แก่ประชาชน
            </p>
          </div>

          {/* Column 2: Contact info */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold font-kanit text-white uppercase tracking-wider">
              สถานที่ติดต่อและสายด่วน
            </h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#e8112d] flex-shrink-0 mt-0.5" />
                <span>อาคาร 3 ชั้น 5 กรมควบคุมโรค กระทรวงสาธารณสุข ถ.ติวานนท์ ต.ตลาดขวัญ อ.เมือง จ.นนทบุรี 11000</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#e8112d] flex-shrink-0" />
                <span>สายด่วนกรมควบคุมโรค: <strong className="text-white font-mono-num">1422</strong> (ตลอด 24 ชั่วโมง)</span>
              </li>
              <li className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#e8112d] flex-shrink-0" />
                <a
                  href="https://alcoholcontrol.ddc.moph.go.th"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white hover:underline transition-colors"
                >
                  alcoholcontrol.ddc.moph.go.th
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Important links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold font-kanit text-white uppercase tracking-wider">
              ลิงก์หน่วยงานที่เกี่ยวข้อง
            </h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li>
                <a
                  href="https://ddc.moph.go.th"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 hover:text-white transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-gray-500" />
                  <span>กรมควบคุมโรค (Department of Disease Control)</span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.moph.go.th"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 hover:text-white transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-gray-500" />
                  <span>กระทรวงสาธารณสุข (Ministry of Public Health)</span>
                </a>
              </li>
              <li>
                <a
                  href="https://thaihealth.or.th"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 hover:text-white transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-gray-500" />
                  <span>สำนักงานกองทุนสนับสนุนการสร้างเสริมสุขภาพ (สสส.)</span>
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <p>© {new Date().getFullYear() + 543} สำนักงานคณะกรรมการควบคุมเครื่องดื่มแอลกอฮอล์. สงวนลิขสิทธิ์ทั้งหมด.</p>
          <p className="font-mono-num text-[11px]">ระบบรุ่น v2.4 (OACC Central Portal)</p>
        </div>

      </div>
    </footer>
  );
};
