import React, { useState } from 'react';
import { X, Plus, Trash2, Edit3, Settings, Save, Sparkles, FolderPlus, Download, ExternalLink, Image, Link } from 'lucide-react';
import { MediaMaterial } from '../types';

interface BackofficeMediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  mediaCatalog: MediaMaterial[];
  onAddMedia: (newItem: MediaMaterial) => void;
  onDeleteMedia: (id: string) => void;
}

export const BackofficeMediaModal: React.FC<BackofficeMediaModalProps> = ({
  isOpen,
  onClose,
  mediaCatalog,
  onAddMedia,
  onDeleteMedia
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('แผ่นพับ (Brochure)');
  const [description, setDescription] = useState('');
  const [maxAllowed, setMaxAllowed] = useState(50);
  const [stock, setStock] = useState(1000);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [fileType, setFileType] = useState('PDF (Print Ready)');
  const [fileSize, setFileSize] = useState('12.5 MB');
  const [msg, setMsg] = useState('');

  if (!isOpen) return null;

  const handleAddNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setMsg('กรุณากรอกชื่อสื่อและคำอธิบายให้ครบถ้วน');
      return;
    }

    const defaultImg = imageUrl.trim() || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80';
    const defaultDownload = downloadUrl.trim() || defaultImg;

    const newItem: MediaMaterial = {
      id: `mat-${Date.now()}`,
      title: title.trim(),
      category,
      description: description.trim(),
      maxAllowed: Number(maxAllowed) || 50,
      availableStock: Number(stock) || 1000,
      imageUrl: defaultImg,
      downloadUrl: defaultDownload,
      fileType: fileType.trim() || 'PDF',
      fileSize: fileSize.trim() || '10 MB'
    };

    onAddMedia(newItem);
    setTitle('');
    setDescription('');
    setDownloadUrl('');
    setImageUrl('');
    setShowAddForm(false);
    setMsg('เพิ่มสื่อประชาสัมพันธ์ใหม่เรียบร้อยแล้ว');
    setTimeout(() => setMsg(''), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-gray-100 overflow-hidden my-auto font-thai">
        
        {/* Header */}
        <div className="bg-gray-900 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#e8112d] flex items-center justify-center text-white">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-kanit">
                จัดการคลังสื่อประชาสัมพันธ์ (หลังบ้าน)
              </h2>
              <p className="text-xs text-gray-300">
                เพิ่ม/ลบ สื่อประชาสัมพันธ์สำหรับให้หน่วยงานภายนอกยื่นขอสนับสนุนหรือดาวน์โหลด
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

        {/* Content Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-5">
          
          {msg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-medium">
              {msg}
            </div>
          )}

          {/* Add Form Toggle */}
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold font-kanit text-gray-900">
              รายการสื่อที่มีในระบบปัจจุบัน ({mediaCatalog.length} รายการ)
            </h3>

            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#e8112d] hover:bg-[#c70d24] text-white text-xs font-kanit font-medium rounded-full shadow-xs transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{showAddForm ? 'ซ่อนแบบฟอร์ม' : 'เพิ่มสื่อประชาสัมพันธ์ใหม่'}</span>
            </button>
          </div>

          {/* Add Form Panel */}
          {showAddForm && (
            <form onSubmit={handleAddNew} className="bg-red-50/40 border border-red-100 p-4 rounded-2xl space-y-3 animate-fadeIn">
              <div className="flex items-center gap-2 text-xs font-bold font-kanit text-[#e8112d]">
                <FolderPlus className="w-4 h-4" />
                <span>เพิ่มสื่อใหม่ลงหลังบ้าน</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-700 font-semibold mb-1">
                    ชื่อสื่อประชาสัมพันธ์ *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="เช่น แผ่นพับงดเหล้าเข้าพรรษา 2569"
                    className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#e8112d]"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-700 font-semibold mb-1">
                    ประเภท/หมวดหมู่สื่อ
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#e8112d]"
                  >
                    <option value="แผ่นพับ (Brochure)">แผ่นพับ (Brochure)</option>
                    <option value="โปสเตอร์ (Poster)">โปสเตอร์ (Poster)</option>
                    <option value="สติ๊กเกอร์ (Sticker)">สติ๊กเกอร์ (Sticker)</option>
                    <option value="คู่มือ/หนังสือ (Handbook)">คู่มือ/หนังสือ (Handbook)</option>
                    <option value="ป้ายแบนเนอร์ (Banner)">ป้ายแบนเนอร์ (Banner)</option>
                    <option value="ของที่ระลึกรณรงค์ (Souvenir)">ของที่ระลึกรณรงค์ (Souvenir)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-700 font-semibold mb-1">
                  คำอธิบายรายละเอียดสื่อ *
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="รายละเอียดเนื้อหา และขนาดกระดาษ..."
                  className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#e8112d] resize-none"
                />
              </div>

              {/* Download & File URL section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white p-3 rounded-xl border border-red-100">
                <div>
                  <label className="block text-xs text-gray-700 font-semibold mb-1 flex items-center gap-1">
                    <Link className="w-3 h-3 text-[#e8112d]" />
                    <span>ลิงก์ดาวน์โหลดสื่อดิจิทัล (URL/PDF)</span>
                  </label>
                  <input
                    type="url"
                    value={downloadUrl}
                    onChange={(e) => setDownloadUrl(e.target.value)}
                    placeholder="https://.../brochure.pdf"
                    className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#e8112d]"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-700 font-semibold mb-1 flex items-center gap-1">
                    <Image className="w-3 h-3 text-blue-600" />
                    <span>ลิงก์รูปภาพตัวอย่าง (Thumbnail URL)</span>
                  </label>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://.../preview.jpg"
                    className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#e8112d]"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-700 font-semibold mb-1">
                    ฟอร์แมตไฟล์ (เช่น PDF, PNG)
                  </label>
                  <input
                    type="text"
                    value={fileType}
                    onChange={(e) => setFileType(e.target.value)}
                    className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#e8112d]"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-700 font-semibold mb-1">
                    ขนาดไฟล์ (เช่น 15 MB)
                  </label>
                  <input
                    type="text"
                    value={fileSize}
                    onChange={(e) => setFileSize(e.target.value)}
                    className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#e8112d]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-700 font-semibold mb-1">
                    จำกัดการขอต่อครั้ง (สูงสุดไม่เกิน 50)
                  </label>
                  <input
                    type="number"
                    max={50}
                    value={maxAllowed}
                    onChange={(e) => setMaxAllowed(Number(e.target.value))}
                    className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#e8112d]"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-700 font-semibold mb-1">
                    จำนวนคงเหลือในคลัง (สำหรับจัดส่ง)
                  </label>
                  <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#e8112d]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-1.5 bg-gray-200 text-gray-700 text-xs font-kanit rounded-full cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 bg-[#e8112d] text-white text-xs font-kanit rounded-full shadow-xs cursor-pointer"
                >
                  บันทึกสื่อใหม่
                </button>
              </div>
            </form>
          )}

          {/* List of existing catalog materials */}
          <div className="space-y-2.5">
            {mediaCatalog.map((mat) => (
              <div
                key={mat.id}
                className="p-3.5 bg-gray-50 border border-gray-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-gray-300 transition-all"
              >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  {mat.imageUrl && (
                    <img
                      src={mat.imageUrl}
                      alt={mat.title}
                      className="w-12 h-12 rounded-xl object-cover border border-gray-200 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white text-gray-600 border border-gray-200 font-kanit">
                        {mat.category}
                      </span>
                      {mat.fileType && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100 font-mono-num">
                          {mat.fileType} {mat.fileSize && `(${mat.fileSize})`}
                        </span>
                      )}
                      <span className="text-[10px] text-[#e8112d] font-semibold font-mono-num">
                        ขอจัดส่งสูงสุด {mat.maxAllowed} แผ่น
                      </span>
                    </div>

                    <h4 className="text-xs font-bold font-kanit text-gray-900 truncate">
                      {mat.title}
                    </h4>
                    <p className="text-[11px] text-gray-500 truncate">
                      {mat.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-200">
                  
                  {/* Test Download Link */}
                  {mat.downloadUrl && (
                    <a
                      href={mat.downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-gray-700 bg-white hover:bg-gray-100 px-2.5 py-1 rounded-xl border border-gray-200 transition-colors"
                      title="ทดสอบดาวน์โหลดสื่อดิจิทัล"
                    >
                      <Download className="w-3.5 h-3.5 text-[#e8112d]" />
                      <span>ดาวน์โหลด</span>
                    </a>
                  )}

                  <div className="text-right">
                    <span className="text-[10px] text-gray-400 block">คลังเล่มจริง</span>
                    <span className="font-mono-num text-xs font-bold text-gray-700">
                      {mat.availableStock?.toLocaleString() || '1,000'}
                    </span>
                  </div>

                  <button
                    onClick={() => onDeleteMedia(mat.id)}
                    className="w-8 h-8 rounded-full bg-red-100/70 hover:bg-red-200 text-[#e8112d] flex items-center justify-center transition-colors cursor-pointer"
                    title="ลบสื่อนี้ออกจากระบบ"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
};

