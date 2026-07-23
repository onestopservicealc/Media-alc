import React, { useState, useMemo } from 'react';
import { Search, HeartHandshake, Layers, Sparkles, Filter, X, ArrowUpRight, CheckCircle } from 'lucide-react';
import { SYSTEMS } from './data/systems';
import { INITIAL_MEDIA_MATERIALS } from './data/mediaCatalog';
import { SystemItem, MediaMaterial, SubmittedRequest } from './types';
import { Header } from './components/Header';
import { SystemCard } from './components/SystemCard';
import { MediaRequestModal } from './components/MediaRequestModal';
import { BackofficeMediaModal } from './components/BackofficeMediaModal';
import { RequestHistoryModal } from './components/RequestHistoryModal';
import { Footer } from './components/Footer';

export default function App() {
  // Search query state
  const [searchQuery, setSearchQuery] = useState('');
  
  // Selected category filter state ("ทั้งหมด" by default)
  const [selectedCategory, setSelectedCategory] = useState('ทั้งหมด');

  // Modals visibility states
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isBackofficeOpen, setIsBackofficeOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Dynamic media materials catalog state (managed in backoffice)
  const [mediaCatalog, setMediaCatalog] = useState<MediaMaterial[]>(INITIAL_MEDIA_MATERIALS);

  // Submitted requests state
  const [submittedRequests, setSubmittedRequests] = useState<SubmittedRequest[]>([]);

  // Automatically extract unique categories from `cat` property of `SYSTEMS`
  const categories = useMemo(() => {
    const set = new Set<string>();
    SYSTEMS.forEach(sys => {
      if (sys.cat) set.add(sys.cat);
    });
    return ['ทั้งหมด', ...Array.from(set)];
  }, []);

  // Filter systems by search query (name, desc, cat) and category
  const filteredSystems = useMemo(() => {
    return SYSTEMS.filter(sys => {
      // Category filter match
      const matchCat = selectedCategory === 'ทั้งหมด' || sys.cat === selectedCategory;

      // Search match (XSS safe text matching)
      const q = searchQuery.toLowerCase().trim();
      const matchSearch = !q || 
        sys.name.toLowerCase().includes(q) ||
        sys.desc.toLowerCase().includes(q) ||
        sys.cat.toLowerCase().includes(q);

      return matchCat && matchSearch;
    });
  }, [searchQuery, selectedCategory]);

  // Backoffice actions
  const handleAddMediaMaterial = (newItem: MediaMaterial) => {
    setMediaCatalog(prev => [newItem, ...prev]);
  };

  const handleDeleteMediaMaterial = (id: string) => {
    setMediaCatalog(prev => prev.filter(item => item.id !== id));
  };

  // Submit request action
  const handleNewRequest = (req: SubmittedRequest) => {
    setSubmittedRequests(prev => [req, ...prev]);
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-thai relative selection:bg-[#e8112d]/20 selection:text-[#e8112d] flex flex-col">
      
      {/* Background Floating Ambient Light Spheres */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-red-100/30 rounded-full blur-3xl animate-float-1" />
        <div className="absolute top-1/3 right-10 w-80 h-80 bg-rose-100/30 rounded-full blur-3xl animate-float-2" />
        <div className="absolute bottom-10 left-10 w-72 h-72 bg-gray-100/40 rounded-full blur-3xl animate-float-1" />
      </div>

      <div className="relative z-10 flex-1 flex flex-col">
        
        {/* 1. แถบบน (Header with Logo, Agency Name, Live Clock, Status Bar) */}
        <Header
          systemCount={SYSTEMS.length}
          onRequestFormOpen={() => setIsRequestModalOpen(true)}
          onBackofficeOpen={() => setIsBackofficeOpen(true)}
          onRequestHistoryOpen={() => setIsHistoryOpen(true)}
          requestCount={submittedRequests.length}
        />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 flex-1 w-full space-y-8">
          
          {/* Hero Banner for PR Media Support Request Form */}
          <section className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-gray-800">
            {/* Subtle background glow */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#e8112d]/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="space-y-2.5 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e8112d]/20 text-[#e8112d] border border-[#e8112d]/30 text-xs font-semibold font-kanit">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>บริการออนไลน์เพื่อหน่วยงานและประชาชน</span>
                </div>
                <h2 className="text-xl sm:text-3xl font-bold font-kanit tracking-tight text-white leading-tight">
                  ยื่นขอสนับสนุนสื่อประชาสัมพันธ์รณรงค์
                </h2>
                <p className="text-sm sm:text-base text-gray-300 font-thai leading-relaxed">
                  สำนักงานฯ สนับสนุนแผ่นพับ โปสเตอร์ สติ๊กเกอร์ และคู่มือป้องกันภัยแอลกอฮอล์ สำหรับสถานบริการ โรงเรียน โรงพยาบาล และหน่วยงานภาครัฐ/เอกชน ฟรี (ไม่เกิน 50 แผ่น/ชิ้น)
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  id="hero-request-form-btn"
                  onClick={() => setIsRequestModalOpen(true)}
                  className="px-6 py-3.5 bg-[#e8112d] hover:bg-[#c70d24] text-white font-kanit font-semibold text-sm rounded-full shadow-lg shadow-[#e8112d]/30 hover:shadow-xl hover:shadow-[#e8112d]/40 transition-all flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <HeartHandshake className="w-5 h-5 transition-transform group-hover:scale-110" />
                  <span>กรอกแบบฟอร์มขอสื่อออนไลน์</span>
                </button>

                {submittedRequests.length > 0 && (
                  <button
                    onClick={() => setIsHistoryOpen(true)}
                    className="px-5 py-3.5 bg-white/10 hover:bg-white/20 text-white font-kanit font-medium text-sm rounded-full transition-all flex items-center justify-center gap-2 cursor-pointer border border-white/10"
                  >
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span>ประวัติคำขอ ({submittedRequests.length})</span>
                  </button>
                )}
              </div>
            </div>
          </section>

          {/* Controls Bar: Search + Category Filters */}
          <div className="space-y-5 bg-white p-5 sm:p-6 rounded-3xl border border-gray-100 shadow-xs">
            
            {/* 2. ช่องค้นหาระบบ (ค้นจากชื่อ คำอธิบาย และหมวดหมู่) - Capsule Shape */}
            <div className="relative max-w-2xl mx-auto">
              <div className="relative flex items-center">
                <Search className="w-5 h-5 text-gray-400 absolute left-4 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ค้นหาระบบสารสนเทศ (พิมพ์ชื่อระบบ คำอธิบาย หรือหมวดหมู่)..."
                  className="w-full pl-12 pr-11 py-3.5 bg-gray-50 border border-gray-200 rounded-full text-sm font-thai text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#e8112d]/30 focus:border-[#e8112d] focus:bg-white transition-all shadow-inner"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="w-7 h-7 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-600 flex items-center justify-center absolute right-3 transition-colors cursor-pointer"
                    aria-label="ล้างคำค้นหา"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* 3. ปุ่มกรองตามหมวดหมู่ (สร้างอัตโนมัติจากข้อมูล มีตัวเลือก "ทั้งหมด") - Capsule Shape */}
            <div className="flex items-center justify-center gap-2 flex-wrap pt-2">
              <span className="text-xs font-semibold text-gray-400 font-kanit flex items-center gap-1 mr-1">
                <Filter className="w-3.5 h-3.5" />
                <span>หมวดหมู่:</span>
              </span>

              {categories.map((category) => {
                const isActive = selectedCategory === category;
                return (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-xs font-medium font-kanit transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-gray-900 text-white shadow-md shadow-gray-900/10'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900'
                    }`}
                  >
                    {category}
                    {category === 'ทั้งหมด' && (
                      <span className="ml-1.5 px-1.5 py-0.2 rounded-full bg-white/20 text-[10px] font-mono-num">
                        {SYSTEMS.length}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

          </div>

          {/* Filter Status summary row */}
          <div className="flex items-center justify-between text-xs text-gray-500 font-thai px-1">
            <div>
              พบทั้งหมด{' '}
              <span className="font-mono-num font-bold text-[#e8112d] text-sm">
                {filteredSystems.length}
              </span>{' '}
              รายการระบบ {selectedCategory !== 'ทั้งหมด' && `(ในหมวดหมู่ "${selectedCategory}")`}
            </div>

            {(searchQuery || selectedCategory !== 'ทั้งหมด') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('ทั้งหมด');
                }}
                className="text-[#e8112d] hover:underline font-kanit font-semibold cursor-pointer"
              >
                ล้างตัวกรองทั้งหมด
              </button>
            )}
          </div>

          {/* 4. กริดการ์ดระบบ (ปรับจำนวนคอลัมน์อัตโนมัติตามความกว้างจอ) */}
          {filteredSystems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredSystems.map((system, idx) => (
                <SystemCard
                  key={system.name}
                  system={system}
                  index={idx}
                />
              ))}
            </div>
          ) : (
            /* No search results state */
            <div className="bg-gray-50 border border-dashed border-gray-200 rounded-3xl p-12 text-center my-8">
              <Layers className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-bold font-kanit text-gray-800">
                ไม่พบระบบที่ตรงกับคำค้นหา
              </h3>
              <p className="text-xs text-gray-500 font-thai mt-1 max-w-md mx-auto">
                ลองตรวจสอบตัวสะกด หรือเลือกเปลี่ยนหมวดหมู่ตัวกรองเพื่อค้นหาอีกครั้ง
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('ทั้งหมด');
                }}
                className="mt-4 px-5 py-2 bg-gray-900 text-white font-kanit text-xs rounded-full shadow-xs hover:bg-gray-800 transition-colors cursor-pointer"
              >
                แสดงระบบทั้งหมด
              </button>
            </div>
          )}

        </main>

        {/* 5. Footer */}
        <Footer />

      </div>

      {/* Modals */}
      <MediaRequestModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        mediaCatalog={mediaCatalog}
        onSubmitRequest={handleNewRequest}
      />

      <BackofficeMediaModal
        isOpen={isBackofficeOpen}
        onClose={() => setIsBackofficeOpen(false)}
        mediaCatalog={mediaCatalog}
        onAddMedia={handleAddMediaMaterial}
        onDeleteMedia={handleDeleteMediaMaterial}
      />

      <RequestHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        requests={submittedRequests}
        mediaCatalog={mediaCatalog}
      />

    </div>
  );
}
