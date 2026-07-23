import React, { useState } from 'react';
import { X, HeartHandshake, PackageCheck, AlertCircle, Calendar, MapPin, Phone, Building2, User, FileText, CheckCircle2, Minus, Plus, Download, FileDown, ExternalLink, Sparkles } from 'lucide-react';
import { MediaMaterial, MediaRequestForm, SubmittedRequest } from '../types';

interface MediaRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  mediaCatalog: MediaMaterial[];
  onSubmitRequest: (newReq: SubmittedRequest) => void;
}

export const MediaRequestModal: React.FC<MediaRequestModalProps> = ({
  isOpen,
  onClose,
  mediaCatalog,
  onSubmitRequest
}) => {
  const [fullName, setFullName] = useState('');
  const [agencyName, setAgencyName] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [purpose, setPurpose] = useState('');
  const [requiredDate, setRequiredDate] = useState('');
  
  // Selected materials map: materialId -> quantity
  const [selectedQuantities, setSelectedQuantities] = useState<Record<string, number>>({});
  const [errorMsg, setErrorMsg] = useState('');
  const [downloadNotification, setDownloadNotification] = useState('');
  const [successData, setSuccessData] = useState<SubmittedRequest | null>(null);

  if (!isOpen) return null;

  const handleQuantityChange = (id: string, qty: number) => {
    // Ensure quantity is capped at 50 as specified
    if (qty > 50) {
      setErrorMsg('จำนวนการขอสนับสนุนสูงสุดไม่เกิน 50 แผ่น/ชิ้น ต่อรายการ');
      qty = 50;
    } else {
      setErrorMsg('');
    }

    if (qty <= 0) {
      const nextMap = { ...selectedQuantities };
      delete nextMap[id];
      setSelectedQuantities(nextMap);
    } else {
      setSelectedQuantities(prev => ({
        ...prev,
        [id]: qty
      }));
    }
  };

  const handleToggleSelect = (id: string) => {
    if (selectedQuantities[id]) {
      const nextMap = { ...selectedQuantities };
      delete nextMap[id];
      setSelectedQuantities(nextMap);
    } else {
      setSelectedQuantities(prev => ({
        ...prev,
        [id]: 10 // Default initial quantity
      }));
    }
  };

  // Direct download handler
  const handleDirectDownload = (mat: MediaMaterial, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    
    const targetUrl = mat.downloadUrl || mat.imageUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c';
    
    // Open in new tab or trigger download
    window.open(targetUrl, '_blank', 'noopener,noreferrer');

    setDownloadNotification(`กำลังดาวน์โหลดไฟล์ "${mat.title}" เรียบร้อยแล้ว`);
    setTimeout(() => {
      setDownloadNotification('');
    }, 4000);
  };

  // Calculate total items
  const totalItemsCount = Object.values(selectedQuantities).reduce((acc: number, curr: number) => acc + curr, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullName.trim()) {
      setErrorMsg('กรุณากรอก ชื่อ-นามสกุล ผู้ขอสนับสนุน');
      return;
    }
    if (!agencyName.trim()) {
      setErrorMsg('กรุณากรอก ชื่อหน่วยงาน');
      return;
    }
    if (!shippingAddress.trim()) {
      setErrorMsg('กรุณากรอก ที่อยู่สำหรับจัดส่งเอกสาร/สื่อประชาสัมพันธ์');
      return;
    }
    if (!phoneNumber.trim()) {
      setErrorMsg('กรุณากรอก หมายเลขโทรศัพท์ติดต่อ');
      return;
    }
    if (!purpose.trim()) {
      setErrorMsg('กรุณาระบุ วัตถุประสงค์ในการขอสนับสนุนสื่อ');
      return;
    }
    if (!requiredDate) {
      setErrorMsg('กรุณาเลือก วัน/เดือน/ปี ที่ต้องการใช้สื่อประชาสัมพันธ์');
      return;
    }

    const selectedKeys = Object.keys(selectedQuantities);
    if (selectedKeys.length === 0) {
      setErrorMsg('กรุณาเลือกสื่อประชาสัมพันธ์ที่ต้องการอย่างน้อย 1 รายการ');
      return;
    }

    // Check individual limits (<= 50)
    for (const id of selectedKeys) {
      if (selectedQuantities[id] > 50) {
        setErrorMsg('การขอสนับสนุนแต่ละสื่อจำกัดจำนวนไม่เกิน 50 แผ่น/ชิ้น');
        return;
      }
    }

    // Generate reference code
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const refNumber = `ALC-${new Date().getFullYear() + 543}-${randomNum}`;
    const nowStr = new Date().toLocaleString('th-TH');

    const materialsPayload = selectedKeys.map(id => ({
      materialId: id,
      quantity: selectedQuantities[id]
    }));

    const newRequest: SubmittedRequest = {
      id: `req-${Date.now()}`,
      refNumber,
      submittedAt: nowStr,
      fullName: fullName.trim(),
      agencyName: agencyName.trim(),
      shippingAddress: shippingAddress.trim(),
      phoneNumber: phoneNumber.trim(),
      purpose: purpose.trim(),
      requiredDate,
      selectedMaterials: materialsPayload,
      status: 'รอการอนุมัติ'
    };

    onSubmitRequest(newRequest);
    setSuccessData(newRequest);
  };

  const handleCloseAll = () => {
    setSuccessData(null);
    setFullName('');
    setAgencyName('');
    setShippingAddress('');
    setPhoneNumber('');
    setPurpose('');
    setRequiredDate('');
    setSelectedQuantities({});
    setErrorMsg('');
    setDownloadNotification('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      
      <div className="relative bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-gray-100 overflow-hidden my-auto">
        
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#e8112d] flex items-center justify-center text-white shadow-md">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold font-kanit">
                ระบบบริการสื่อและขอสนับสนุนสื่อประชาสัมพันธ์
              </h2>
              <p className="text-xs text-gray-300 font-thai">
                ดาวน์โหลดสื่อดิจิทัลฟรี หรือยื่นขอรับสื่อต้นฉบับจัดส่งทางพัสดุ
              </p>
            </div>
          </div>

          <button
            onClick={handleCloseAll}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="ปิดหน้าต่าง"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Download Toast Notification */}
        {downloadNotification && (
          <div className="bg-emerald-600 text-white text-xs px-4 py-2.5 flex items-center justify-between gap-2 shadow-md animate-fadeIn font-thai">
            <div className="flex items-center gap-2">
              <Download className="w-4 h-4 animate-bounce" />
              <span className="font-medium">{downloadNotification}</span>
            </div>
            <button onClick={() => setDownloadNotification('')} className="text-white/80 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Success Confirmation View */}
        {successData ? (
          <div className="p-6 sm:p-8 text-center font-thai">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold font-kanit text-gray-900 mb-1">
              ส่งคำขอสนับสนุนสื่อสำเร็จแล้ว!
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              เจ้าหน้าที่จะดำเนินการตรวจสอบและจัดส่งสื่อประชาสัมพันธ์ตามที่ท่านระบุ
            </p>

            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 text-left max-w-xl mx-auto mb-6 text-sm space-y-2">
              <div className="flex justify-between border-b border-gray-200 pb-2">
                <span className="text-gray-500">เลขที่อ้างอิงคำขอ:</span>
                <span className="font-mono-num font-bold text-[#e8112d]">{successData.refNumber}</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 pb-2">
                <span className="text-gray-500">ชื่อผู้ขอสนับสนุน:</span>
                <span className="font-medium text-gray-900">{successData.fullName}</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 pb-2">
                <span className="text-gray-500">หน่วยงาน:</span>
                <span className="font-medium text-gray-900">{successData.agencyName}</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 pb-2">
                <span className="text-gray-500">วันที่ต้องการใช้สื่อ:</span>
                <span className="font-medium text-gray-900">{successData.requiredDate}</span>
              </div>
              <div className="pt-2">
                <span className="text-gray-500 block mb-1">สื่อที่ขอรับสนับสนุน ({successData.selectedMaterials.length} รายการ):</span>
                <ul className="space-y-2 text-xs text-gray-700 bg-white p-3 rounded-xl border border-gray-200">
                  {successData.selectedMaterials.map(m => {
                    const matObj = mediaCatalog.find(item => item.id === m.materialId);
                    if (!matObj) return null;
                    return (
                      <li key={m.materialId} className="flex items-center justify-between gap-2 border-b border-gray-100 last:border-0 pb-1.5 last:pb-0">
                        <div className="truncate flex-1">
                          <span className="font-medium text-gray-900 block truncate">• {matObj.title}</span>
                          <span className="text-[10px] text-gray-500">({m.quantity} แผ่น/ชิ้น)</span>
                        </div>
                        <button
                          onClick={() => handleDirectDownload(matObj)}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#e8112d] bg-red-50 hover:bg-red-100 px-2.5 py-1 rounded-lg transition-colors cursor-pointer shrink-0"
                          title="ดาวน์โหลดไฟล์ดิจิทัลทันที"
                        >
                          <Download className="w-3 h-3" />
                          <span>ดาวน์โหลดไฟล์</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>

            <div className="flex justify-center gap-3">
              <button
                onClick={handleCloseAll}
                className="px-6 py-2.5 bg-[#e8112d] hover:bg-[#c70d24] text-white font-kanit font-medium rounded-full shadow-md transition-all cursor-pointer"
              >
                เสร็จสิ้น / กลับหน้าหลัก
              </button>
            </div>
          </div>
        ) : (
          /* Main Form Scrollable Container */
          <form onSubmit={handleSubmit} className="p-5 sm:p-7 max-h-[78vh] overflow-y-auto space-y-6 font-thai">
            
            {/* Error banner */}
            {errorMsg && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-[#e8112d] p-3.5 rounded-2xl text-sm font-medium animate-shake">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Requester Information Section */}
            <div className="bg-gray-50/80 p-4 sm:p-5 rounded-2xl border border-gray-100 space-y-4">
              <h3 className="text-sm font-bold font-kanit text-gray-900 uppercase tracking-wider flex items-center gap-2 border-b border-gray-200 pb-2">
                <User className="w-4 h-4 text-[#e8112d]" />
                <span>1. ข้อมูลผู้ขอและหน่วยงาน</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    ชื่อ - สกุล ผู้ขอสนับสนุน <span className="text-[#e8112d]">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="เช่น นายสมชาย ใจดี"
                      className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#e8112d]/30 focus:border-[#e8112d] transition-all"
                    />
                    <User className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                  </div>
                </div>

                {/* Agency Name */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    ชื่อหน่วยงาน / สถานที่ทำงาน <span className="text-[#e8112d]">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={agencyName}
                      onChange={(e) => setAgencyName(e.target.value)}
                      placeholder="เช่น สำนักงานสาธารณสุขอำเภอ / รพ.สต. บ้านค่าย"
                      className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#e8112d]/30 focus:border-[#e8112d] transition-all"
                    />
                    <Building2 className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                  </div>
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    หมายเลขโทรศัพท์ <span className="text-[#e8112d]">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="เช่น 081-234-5678"
                      className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#e8112d]/30 focus:border-[#e8112d] transition-all"
                    />
                    <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                  </div>
                </div>

                {/* Required Usage Date */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    วัน/เดือน/ปี ที่ต้องการใช้สื่อ <span className="text-[#e8112d]">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={requiredDate}
                      onChange={(e) => setRequiredDate(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#e8112d]/30 focus:border-[#e8112d] transition-all"
                    />
                    <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                  </div>
                </div>

              </div>

              {/* Shipping Address */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  ที่อยู่จัดส่งเอกสารและสื่อประชาสัมพันธ์ <span className="text-[#e8112d]">*</span>
                </label>
                <div className="relative">
                  <textarea
                    rows={2}
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    placeholder="ระบุที่อยู่ รหัสไปรษณีย์อย่างชัดเจนสำหรับการจัดส่งทางพัสดุ"
                    className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#e8112d]/30 focus:border-[#e8112d] transition-all resize-none"
                  />
                  <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                </div>
              </div>

              {/* Purpose */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  มีความประสงค์ ขอสนับสนุนสื่อประชาสัมพันธ์สำหรับ <span className="text-[#e8112d]">*</span>
                </label>
                <div className="relative">
                  <textarea
                    rows={2}
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    placeholder="เช่น นำไปจัดบูธนิทรรศการรณรงค์วันงดดื่มสุราแห่งชาติ ณ รพ.สต."
                    className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#e8112d]/30 focus:border-[#e8112d] transition-all resize-none"
                  />
                  <FileText className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                </div>
              </div>

            </div>

            {/* Media Materials Selection Section */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-200 pb-2">
                <h3 className="text-sm font-bold font-kanit text-gray-900 uppercase tracking-wider flex items-center gap-2">
                  <PackageCheck className="w-4 h-4 text-[#e8112d]" />
                  <span>2. รายการสื่อประชาสัมพันธ์ (ดาวน์โหลดไฟล์ได้ทันที หรือเลือกขอจัดส่ง)</span>
                </h3>

                <span className="text-[11px] text-[#e8112d] font-semibold bg-red-50 px-2.5 py-1 rounded-full border border-red-100 font-kanit self-start sm:self-auto">
                  จำกัดขอจัดส่งไม่เกิน 50 แผ่น/ชิ้น ต่อรายการ
                </span>
              </div>

              {/* Media Items Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 max-h-80 overflow-y-auto pr-1">
                {mediaCatalog.map((mat) => {
                  const isSelected = !!selectedQuantities[mat.id];
                  const currentQty = selectedQuantities[mat.id] || 0;

                  return (
                    <div
                      key={mat.id}
                      className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'border-[#e8112d] bg-red-50/20 shadow-xs ring-1 ring-[#e8112d]/30'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <div>
                        {/* Top Info Header */}
                        <div className="flex items-start gap-3">
                          
                          {/* Image preview thumbnail */}
                          {mat.imageUrl && (
                            <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 shrink-0 group">
                              <img
                                src={mat.imageUrl}
                                alt={mat.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                          )}

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap mb-1">
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 font-kanit">
                                {mat.category}
                              </span>
                              {mat.fileType && (
                                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100 font-mono-num">
                                  {mat.fileType} {mat.fileSize && `(${mat.fileSize})`}
                                </span>
                              )}
                            </div>

                            <h4 className="text-xs font-bold text-gray-900 font-kanit leading-snug line-clamp-2">
                              {mat.title}
                            </h4>
                          </div>

                        </div>

                        <p className="text-[11px] text-gray-500 line-clamp-2 mt-2">
                          {mat.description}
                        </p>
                      </div>

                      {/* Action Bar (Download Button + Physical Order Checkbox) */}
                      <div className="mt-3 pt-2.5 border-t border-gray-100 space-y-2">
                        
                        {/* Direct Download Button */}
                        <div className="flex items-center justify-between gap-2">
                          <button
                            type="button"
                            onClick={(e) => handleDirectDownload(mat, e)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 hover:bg-[#e8112d] text-white text-xs font-kanit font-medium rounded-xl transition-all cursor-pointer shadow-xs group"
                            title="ดาวน์โหลดไฟล์ดิจิทัล (Soft Copy) ไปใช้งานทันที"
                          >
                            <Download className="w-3.5 h-3.5 group-hover:animate-bounce" />
                            <span>ดาวน์โหลดสื่อ (Soft Copy)</span>
                          </button>

                          {/* Checkbox for Physical Request */}
                          <label className="inline-flex items-center gap-1.5 text-xs text-gray-700 font-medium cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleToggleSelect(mat.id)}
                              className="w-4 h-4 text-[#e8112d] rounded-sm border-gray-300 focus:ring-[#e8112d] cursor-pointer"
                            />
                            <span>ขอจัดส่งเล่มจริง</span>
                          </label>
                        </div>

                        {/* Quantity selector when physical request selected */}
                        {isSelected && (
                          <div className="pt-2 border-t border-red-100 flex items-center justify-between bg-red-50/50 p-2 rounded-xl animate-fadeIn">
                            <span className="text-[11px] font-semibold text-gray-700">
                              ระบุจำนวน (แผ่น/ชิ้น):
                            </span>

                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleQuantityChange(mat.id, currentQty - 5)}
                                className="w-6 h-6 rounded-lg bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 flex items-center justify-center cursor-pointer shadow-2xs"
                              >
                                <Minus className="w-3 h-3" />
                              </button>

                              <input
                                type="number"
                                min={1}
                                max={50}
                                value={currentQty}
                                onChange={(e) => handleQuantityChange(mat.id, parseInt(e.target.value) || 0)}
                                className="w-12 text-center text-xs font-mono-num font-bold py-0.5 bg-white border border-gray-300 rounded-md focus:outline-none focus:border-[#e8112d]"
                              />

                              <button
                                type="button"
                                onClick={() => handleQuantityChange(mat.id, currentQty + 5)}
                                className="w-6 h-6 rounded-lg bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 flex items-center justify-center cursor-pointer shadow-2xs"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        )}

                      </div>

                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer Summary & Action */}
            <div className="pt-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-gray-600">
                รวมจำนวนสื่อที่ต้องการขอจัดส่ง:{' '}
                <span className="font-mono-num font-bold text-[#e8112d] text-sm">
                  {totalItemsCount}
                </span>{' '}
                แผ่น/ชิ้น
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 sm:flex-initial px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-kanit text-sm rounded-full transition-all cursor-pointer"
                >
                  ยกเลิก
                </button>

                <button
                  type="submit"
                  className="flex-1 sm:flex-initial px-6 py-2.5 bg-[#e8112d] hover:bg-[#c70d24] text-white font-kanit font-medium text-sm rounded-full shadow-md shadow-[#e8112d]/20 transition-all cursor-pointer"
                >
                  ส่งแบบฟอร์มขอสนับสนุน
                </button>
              </div>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};

