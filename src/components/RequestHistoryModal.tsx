import React from 'react';
import { X, FileText, CheckCircle2, Clock, MapPin, Building2, User, Phone, Download } from 'lucide-react';
import { SubmittedRequest, MediaMaterial } from '../types';

interface RequestHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  requests: SubmittedRequest[];
  mediaCatalog: MediaMaterial[];
}

export const RequestHistoryModal: React.FC<RequestHistoryModalProps> = ({
  isOpen,
  onClose,
  requests,
  mediaCatalog
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-gray-100 overflow-hidden my-auto font-thai">
        
        {/* Header */}
        <div className="bg-gray-900 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#e8112d] flex items-center justify-center text-white">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-kanit">
                ประวัติการขอสนับสนุนสื่อประชาสัมพันธ์
              </h2>
              <p className="text-xs text-gray-300">
                รายการคำขอสนับสนุนสื่อประชาสัมพันธ์ทั้งหมด พร้อมลิงก์ดาวน์โหลดสื่อดิจิทัล
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* List Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-4">
          {requests.length === 0 ? (
            <div className="text-center py-12 text-gray-500 font-thai">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-base font-bold font-kanit text-gray-700">ยังไม่มีประวัติการยื่นขอสนับสนุนสื่อ</p>
              <p className="text-xs text-gray-500 mt-1">กดปุ่ม "ขอสนับสนุนสื่อประชาสัมพันธ์" เพื่อยื่นคำขอใหม่</p>
            </div>
          ) : (
            requests.map((req) => (
              <div
                key={req.id}
                className="bg-gray-50/80 border border-gray-200 rounded-2xl p-4 space-y-3 hover:border-gray-300 transition-all"
              >
                {/* Header row */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-200 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono-num font-bold text-sm text-[#e8112d] bg-red-50 px-2.5 py-0.5 rounded-full border border-red-100">
                      {req.refNumber}
                    </span>
                    <span className="text-xs text-gray-500 font-mono-num">
                      ยื่นเมื่อ: {req.submittedAt}
                    </span>
                  </div>

                  <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-kanit">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{req.status}</span>
                  </span>
                </div>

                {/* Requester details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-700">
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-gray-400" />
                    <span>ผู้ยื่นขอ: <strong className="text-gray-900">{req.fullName}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-gray-400" />
                    <span>หน่วยงาน: <strong className="text-gray-900">{req.agencyName}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-gray-400" />
                    <span>เบอร์โทร: <strong className="text-gray-900">{req.phoneNumber}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-gray-400" />
                    <span>วันที่ต้องใช้สื่อ: <strong className="text-gray-900">{req.requiredDate}</strong></span>
                  </div>
                  <div className="sm:col-span-2 flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <span className="line-clamp-1">ที่อยู่จัดส่ง: {req.shippingAddress}</span>
                  </div>
                </div>

                {/* Requested items summary */}
                <div className="bg-white p-3 rounded-xl border border-gray-200 text-xs space-y-1.5">
                  <span className="font-semibold text-gray-800 block mb-1">
                    รายการสื่อที่ขอรับ ({req.selectedMaterials.reduce((a, b) => a + b.quantity, 0)} แผ่น/ชิ้น):
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {req.selectedMaterials.map((item) => {
                      const matObj = mediaCatalog.find((m) => m.id === item.materialId);
                      const downloadTarget = matObj?.downloadUrl || matObj?.imageUrl;
                      return (
                        <div key={item.materialId} className="flex items-center justify-between bg-gray-50 p-2 rounded-xl text-[11px] border border-gray-100">
                          <div className="truncate flex-1 pr-1">
                            <span className="truncate block font-medium text-gray-900">• {matObj ? matObj.title : item.materialId}</span>
                            <span className="text-[10px] text-gray-500 font-mono-num">{item.quantity} แผ่น/ชิ้น</span>
                          </div>
                          {downloadTarget && (
                            <a
                              href={downloadTarget}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#e8112d] bg-red-50 hover:bg-red-100 px-2 py-1 rounded-lg transition-colors shrink-0"
                              title="ดาวน์โหลดสื่อดิจิทัล"
                            >
                              <Download className="w-3 h-3" />
                              <span>โหลดไฟล์</span>
                            </a>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};

