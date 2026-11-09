'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Phone, ArrowRight } from 'lucide-react';
import type { DynamicPage, SiteSettings } from '@/lib/db';

interface ServiceCardProps {
  service: DynamicPage;
  settings: SiteSettings;
}

export default function ServiceCard({ service, settings }: ServiceCardProps) {
  return (
    <div className="service-card-bg rounded-2xl overflow-hidden flex flex-col group">
      {/* Image Container */}
      <div className="relative w-full h-48 sm:h-52 overflow-hidden bg-slate-900">
        <Image
          src={service.featuredImage || '/images/our_service_img/pro_im_1.png'}
          alt={service.title}
          fill
          className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
        <span className="absolute top-3 right-3 bg-amber-500/90 text-slate-950 font-black text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full shadow">
          Verified Solution
        </span>
      </div>

      {/* Body Content */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-amber-300 transition line-clamp-1 mb-2">
            {service.title}
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-3 mb-4">
            {service.shortExcerpt || 'Overcome this difficulty with the guidance of master Indian Astrologer Psychic Shankar.'}
          </p>
        </div>

        {/* Buttons */}
        <div className="pt-3 border-t border-purple-900/40 flex items-center justify-between gap-2">
          <Link
            href={`/${service.slug}`}
            className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center space-x-1 transition group-hover:translate-x-1"
          >
            <span>Read More</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <a
            href={`tel:${settings.phone}`}
            className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:brightness-110 text-slate-950 font-extrabold text-xs rounded-lg flex items-center space-x-1.5 shadow transition"
          >
            <Phone className="w-3 h-3 fill-slate-950" />
            <span>Call Now</span>
          </a>
        </div>
      </div>
    </div>
  );
}

