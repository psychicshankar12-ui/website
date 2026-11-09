'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MapPin, Search } from 'lucide-react';
import type { DynamicPage } from '@/lib/db';

interface StateLocationsSectionProps {
  locations: DynamicPage[];
}

export default function StateLocationsSection({ locations }: StateLocationsSectionProps) {
  const [search, setSearch] = useState('');

  const filtered = locations.filter((loc) =>
    loc.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section id="usa-locations" className="py-16 md:py-24 bg-[#0a0c24] border-t border-purple-900/30">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400 bg-amber-400/10 px-3.5 py-1 rounded-full border border-amber-400/20">
            SERVICE LOCATIONS IN USA
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mt-3 mb-4">
            Astrology Services <span className="gold-gradient-text">Across All 50 US States</span>
          </h2>
          <p className="text-sm md:text-base text-slate-300">
            Psychic Arjun Krishna provides trusted astrology, psychic readings, and spiritual remedies to clients in every state across the United States.
          </p>

          {/* Search bar */}
          <div className="mt-6 max-w-md mx-auto relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search your state (e.g. California, New York, Texas)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border border-slate-700 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 rounded-xl text-sm text-white placeholder-slate-500 outline-none transition"
            />
          </div>
        </div>

        {/* States Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 sm:gap-3">
          {filtered.map((loc) => (
            <Link
              key={loc.id}
              href={`/${loc.slug}`}
              className="p-3 rounded-xl bg-slate-900/60 hover:bg-purple-950/70 border border-purple-900/30 hover:border-amber-400/50 flex items-center space-x-2 transition group text-slate-200 hover:text-amber-300 shadow-sm"
            >
              <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-semibold truncate">
                {loc.title.replace('Astrologer in ', '')}
              </span>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-slate-400 text-sm mt-6">
            No states found matching &ldquo;{search}&rdquo;. All 50 states are serviced via live phone and video.
          </p>
        )}
      </div>
    </section>
  );
}

