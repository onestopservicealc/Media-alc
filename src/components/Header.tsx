import React, { useState, useEffect } from 'react';
import { ShieldAlert, Clock, Calendar, Layers, FileText, Settings, HeartHandshake } from 'lucide-react';

interface HeaderProps {
  systemCount: number;
  onRequestFormOpen: () => void;
  onBackofficeOpen: () => void;
  onRequestHistoryOpen: () => void;
  requestCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  systemCount,
  onRequestFormOpen,
  onBackofficeOpen,
  onRequestHistoryOpen,
  requestCount
}) => {
  const [timeStr, setTimeStr] = useState<string>('');
  const [dateBEStr, setDateBEStr] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      
      // Time string HH:mm:ss
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      setTimeStr(`${hours}:${minutes}:${seconds}`);

      // Thai BE date
      const months = [
        'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
        'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
      ];
      const day = now.getDate();
      const month = months[now.getMonth()];
      const yearBE = now.getFullYear() + 543;
      setDateBEStr(`${day} ${month} พ.ศ. ${yearBE}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="w-full bg-white border-b border-gray-100 shadow-xs sticky top-0 z-30 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4">
        
        {/* Main top row */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          
          {/* Logo & Agency Name */}
          <div className="flex items-center gap-3.5">
            <div className="relative group">
              {/* Soft red glow around emblem */}
              <div className="absolute -inset-1 bg-[#e8112d]/15 rounded-full blur-sm group-hover:blur-md transition-all animate-emblem"></div>
              
              {/* Emblem icon badge */}
              <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-[#e8112d] to-[#b90b21] flex items-center justify-center text-white shadow-md shadow-[#e8112d]/20 transition-transform duration-300 group-hover:scale-105">
                <ShieldAlert className="w-7 h-7 sm:w-8 sm:h-8" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-red-50 text-[#e8112d] border border-red-100 font-kanit">
                  กรมควบคุมโรค กระทรวงสาธารณสุข
                </span>
              </div>
              <h1 className="text-base sm:text-xl font-bold font-kanit text-gray-900 tracking-tight leading-snug mt-0.5">
                สำนักงานคณะกรรมการควบคุมเครื่องดื่มแอลกอฮอล์
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 font-thai">
                ระบบขอสนับสนุนสื่อประชาสัมพันธ์ และศูนย์รวมระบบสารสนเทศส่วนกลาง
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            {/* CTA Request Form Button */}
            <button
              id="cta-request-media-btn"
              onClick={onRequestFormOpen}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#e8112d] hover:bg-[#c70d24] active:bg-[#a60a1d] text-white font-kanit font-medium text-sm rounded-full shadow-md shadow-[#e8112d]/20 hover:shadow-lg hover:shadow-[#e8112d]/30 transition-all duration-200 group cursor-pointer"
            >
              <HeartHandshake className="w-4 h-4 transition-transform group-hover:scale-110" />
              <span>ขอสนับสนุนสื่อประชาสัมพันธ์</span>
            </button>

            {/* Request History */}
            <button
              id="view-requests-btn"
              onClick={onRequestHistoryOpen}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-800 font-kanit font-medium text-xs sm:text-sm rounded-full transition-all duration-200 cursor-pointer relative"
              title="ดูประวัติการขอสื่อ"
            >
              <FileText className="w-4 h-4 text-gray-600" />
              <span className="hidden md:inline">ประวัติการขอสื่อ</span>
              {requestCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 text-[10px] font-mono-num font-bold bg-[#e8112d] text-white rounded-full">
                  {requestCount}
                </span>
              )}
            </button>

            {/* Backoffice Media Management */}
            <button
              id="backoffice-manage-btn"
              onClick={onBackofficeOpen}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-700 font-kanit font-medium text-xs sm:text-sm rounded-full transition-all duration-200 cursor-pointer"
              title="จัดการสื่อประชาสัมพันธ์ (หลังบ้าน)"
            >
              <Settings className="w-4 h-4 text-gray-600" />
              <span className="hidden lg:inline">จัดการสื่อ (หลังบ้าน)</span>
            </button>
          </div>

        </div>

        {/* Status Bar Row - พับลงเต็มความกว้างบนจอเล็ก */}
        <div className="mt-3.5 pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm text-gray-600 font-thai">
          
          {/* Status info items */}
          <div className="flex items-center gap-3 sm:gap-5 flex-wrap w-full md:w-auto justify-between md:justify-start">
            
            {/* Total systems count */}
            <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
              <Layers className="w-3.5 h-3.5 text-[#e8112d]" />
              <span>จำนวนระบบในคลัง:</span>
              <span className="font-mono-num font-bold text-gray-900 bg-white px-2 py-0.5 rounded-full border border-gray-200 text-xs">
                {systemCount}
              </span>
            </div>

            {/* Date in B.E. */}
            <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
              <Calendar className="w-3.5 h-3.5 text-gray-500" />
              <span>วันที่:</span>
              <span className="font-kanit font-medium text-gray-900">
                {dateBEStr || 'กำลังโหลด...'}
              </span>
            </div>

          </div>

          {/* Live clock */}
          <div className="flex items-center justify-end gap-1.5 bg-red-50/70 text-[#e8112d] px-3.5 py-1 rounded-full border border-red-100 w-full md:w-auto">
            <Clock className="w-3.5 h-3.5 animate-pulse text-[#e8112d]" />
            <span className="text-xs font-semibold font-kanit">เวลาปัจจุบัน:</span>
            <span className="font-mono-num font-bold text-sm tracking-wider text-[#e8112d]">
              {timeStr ? `${timeStr} น.` : '--:--:--'}
            </span>
          </div>

        </div>

      </div>
    </header>
  );
};
