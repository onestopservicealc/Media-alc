import React from 'react';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { SystemItem } from '../types';

interface SystemCardProps {
  system: SystemItem;
  index: number;
}

export const SystemCard: React.FC<SystemCardProps> = ({ system }) => {
  // Check if URL is internal anchor or external link
  const isInternal = system.url.startsWith('#');

  return (
    <a
      href={system.url}
      target={isInternal ? '_self' : '_blank'}
      rel={isInternal ? undefined : 'noopener noreferrer'}
      className="group relative bg-white rounded-3xl p-6 border border-gray-100 shadow-xs hover:shadow-xl hover:shadow-[#e8112d]/10 transition-all duration-300 transform hover:-translate-y-2 flex flex-col justify-between overflow-hidden cursor-pointer"
    >
      {/* Soft red glow expanding from top-right corner on hover */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#e8112d]/0 group-hover:bg-[#e8112d]/8 rounded-full blur-2xl transition-all duration-500 pointer-events-none group-hover:scale-150" />

      <div>
        {/* Large Media Image / Banner Header */}
        <div className="relative w-full h-44 sm:h-48 rounded-2xl overflow-hidden mb-4 bg-gray-100 border border-gray-100 shadow-xs group-hover:shadow-md transition-all duration-300">
          {system.imageUrl ? (
            <>
              <img
                src={system.imageUrl}
                alt={system.name}
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              {/* Gradient Overlay for contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 opacity-80 group-hover:opacity-60 transition-opacity" />

              {/* Category Badge overlay top right */}
              <span className="absolute top-3 right-3 inline-flex items-center text-xs font-semibold px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-gray-800 shadow-xs font-kanit border border-white/50">
                {system.cat}
              </span>

              {/* Emoji Icon Badge overlay bottom left */}
              <div className="absolute bottom-3 left-3 w-10 h-10 bg-white/95 backdrop-blur-md rounded-xl flex items-center justify-center text-xl shadow-sm border border-white/80 transform group-hover:scale-110 transition-transform">
                {system.icon}
              </div>
            </>
          ) : (
            <div className="w-full h-full bg-red-50 flex items-center justify-center relative">
              <span className="text-4xl">{system.icon}</span>
              <span className="absolute top-3 right-3 inline-flex items-center text-xs font-semibold px-3 py-1 rounded-full bg-white text-gray-800 shadow-xs font-kanit border border-gray-200">
                {system.cat}
              </span>
            </div>
          )}
        </div>

        {/* System Name */}
        <h3 className="text-lg font-bold font-kanit text-gray-900 group-hover:text-[#e8112d] transition-colors duration-200 line-clamp-2 mb-2 leading-snug">
          {system.name}
        </h3>

        {/* Short Description */}
        <p className="text-sm text-gray-600 font-thai line-clamp-3 leading-relaxed mb-6">
          {system.desc}
        </p>
      </div>

      {/* Bottom Footer Link Row */}
      <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-sm font-medium font-kanit text-gray-800 group-hover:text-[#e8112d] transition-colors duration-200">
        <span className="flex items-center gap-1.5">
          <span>เข้าระบบ</span>
          {!isInternal && (
            <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />
          )}
        </span>

        {/* Sliding Arrow */}
        <div className="w-8 h-8 rounded-full bg-gray-50 group-hover:bg-[#e8112d] text-gray-600 group-hover:text-white flex items-center justify-center transition-all duration-300 transform group-hover:translate-x-1 shadow-xs">
          <ArrowRight className="w-4 h-4 transition-transform group-hover:scale-110" />
        </div>
      </div>
    </a>
  );
};
