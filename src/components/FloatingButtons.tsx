'use client';

import React from 'react';
import { Phone, MessageSquare, Calendar } from 'lucide-react';
import type { SiteSettings } from '@/lib/db';

interface FloatingButtonsProps {
  settings: SiteSettings;
}

export default function FloatingButtons({ settings }: FloatingButtonsProps) {
  return (
    <>
      {/* Desktop & Tablet Floating Quick Connect */}
      <div className="fixed right-5 bottom-20 z-40 hidden sm:flex flex-col space-y-3">
        {/* WhatsApp Button */}
        <a
          href={`https://wa.me/${settings.whatsapp}?text=Hello%20Psychic%20Shankar,%20I%20would%20like%20to%20book%20a%20consultation.`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-13 h-13 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white flex items-center justify-center shadow-2xl shadow-emerald-500/40 hover:scale-110 transition-transform group relative cursor-pointer"
          aria-label="Chat on WhatsApp"
        >
          <MessageSquare className="w-6 h-6 fill-white text-white" />
          <span className="absolute right-full mr-3 bg-slate-900 text-white text-xs font-semibold px-2.5 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-slate-700 shadow-md">
            Chat on WhatsApp
          </span>
        </a>

        {/* Direct Phone Call Button */}
        <a
          href={`tel:${settings.phone}`}
          className="w-13 h-13 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:brightness-110 text-slate-950 flex items-center justify-center shadow-2xl shadow-amber-500/40 hover:scale-110 transition-transform group relative cursor-pointer"
          aria-label="Call Astrologer"
        >
          <Phone className="w-6 h-6 fill-slate-950" />
          <span className="absolute right-full mr-3 bg-slate-900 text-white text-xs font-semibold px-2.5 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-slate-700 shadow-md">
            Call: {settings.phoneDisplay}
          </span>
        </a>
      </div>

      {/* Mobile Bottom Fixed Action Bar */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-950/98 border-t border-purple-900/60 p-2 grid grid-cols-3 gap-2 backdrop-blur-lg shadow-2xl">
        <a
          href={`tel:${settings.phone}`}
          className="py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black text-xs rounded-xl flex items-center justify-center space-x-1 shadow"
        >
          <Phone className="w-3.5 h-3.5 fill-slate-950" />
          <span>CALL NOW</span>
        </a>

        <a
          href={`https://wa.me/${settings.whatsapp}?text=Hello%20Psychic%20Shankar`}
          target="_blank"
          rel="noopener noreferrer"
          className="py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-1 shadow"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>WHATSAPP</span>
        </a>

        <a
          href="/contactus"
          className="py-2.5 bg-purple-900 hover:bg-purple-800 text-amber-300 border border-amber-400/40 font-bold text-xs rounded-xl flex items-center justify-center space-x-1 shadow"
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>CONSULT</span>
        </a>
      </div>
    </>
  );
}

