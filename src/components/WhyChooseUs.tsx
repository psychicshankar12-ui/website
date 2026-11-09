'use client';

import React from 'react';
import Image from 'next/image';
import { Award, Users, Shield, HeartHandshake, Sparkles, CheckCircle2 } from 'lucide-react';
import type { SiteSettings } from '@/lib/db';

interface WhyChooseUsProps {
  settings: SiteSettings;
}

const features = [
  { img: '/images/sp_fea_01.png', title: '25+ Years Experience', desc: 'Distinguished Vedic lineage and decades of proven spiritual mastery.' },
  { img: '/images/sp_fea_02.png', title: '15,000+ Happy Clients', desc: 'Over fifteen thousand lives transformed across the USA and worldwide.' },
  { img: '/images/sp_fea_03.png', title: '100% Confidential', desc: 'Absolute privacy guaranteed. Your discussions remain strictly confidential.' },
  { img: '/images/sp_fea_04.png', title: 'Accurate Predictions', desc: 'Precise planetary calculations and intuitive clairvoyant readings.' },
  { img: '/images/sp_fea_05.png', title: 'Rapid Astrological Remedies', desc: 'Sacred Sanskrit mantras, protective amulets, and effective pujas.' },
  { img: '/images/sp_fea_06.png', title: '24/7 Available On Call', desc: 'Urgent crisis support via direct telephone and video call.' },
  { img: '/images/sp_fea_07.png', title: 'All Religions Welcome', desc: 'Compassionate, open-hearted guidance for all backgrounds and beliefs.' },
  { img: '/images/sp_fea_08.png', title: 'Guaranteed Results', desc: 'Dedicated spiritual rituals until harmony and success are restored.' },
];

export default function WhyChooseUs({ settings }: WhyChooseUsProps) {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-[#0c0e2a] via-[#151138] to-[#0c0e2a] border-y border-purple-900/30">
      <div className="max-w-7xl mx-auto px-4">
        {/* Achievements Counter Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-16">
          <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-900/40 to-slate-900/80 border border-amber-400/20 text-center shadow-lg">
            <Award className="w-8 h-8 text-amber-400 mx-auto mb-2" />
            <div className="text-3xl md:text-4xl font-black text-amber-400">25+</div>
            <div className="text-xs md:text-sm text-slate-300 font-medium mt-1">Years Experience</div>
          </div>
          <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-900/40 to-slate-900/80 border border-amber-400/20 text-center shadow-lg">
            <Users className="w-8 h-8 text-amber-400 mx-auto mb-2" />
            <div className="text-3xl md:text-4xl font-black text-amber-400">15,000+</div>
            <div className="text-xs md:text-sm text-slate-300 font-medium mt-1">Satisfied Clients</div>
          </div>
          <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-900/40 to-slate-900/80 border border-amber-400/20 text-center shadow-lg">
            <Shield className="w-8 h-8 text-amber-400 mx-auto mb-2" />
            <div className="text-3xl md:text-4xl font-black text-amber-400">100%</div>
            <div className="text-xs md:text-sm text-slate-300 font-medium mt-1">Privacy Guaranteed</div>
          </div>
          <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-900/40 to-slate-900/80 border border-amber-400/20 text-center shadow-lg">
            <HeartHandshake className="w-8 h-8 text-amber-400 mx-auto mb-2" />
            <div className="text-3xl md:text-4xl font-black text-amber-400">24/7</div>
            <div className="text-xs md:text-sm text-slate-300 font-medium mt-1">Support & Call Readings</div>
          </div>
        </div>

        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
            ACHIEVEMENTS IN ASTROLOGY
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mt-3 mb-4">
            Why Choose <span className="gold-gradient-text">Psychic Arjun Krishna</span>?
          </h2>
          <p className="text-sm md:text-base text-slate-300">
            Renowned worldwide for genuine psychic abilities, accurate horoscope analysis, and life-changing spiritual solutions.
          </p>
        </div>

        {/* Feature Icons Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {features.map((feat, idx) => (
            <div
              key={idx}
              className="bg-slate-900/70 border border-purple-900/40 hover:border-amber-400/40 rounded-2xl p-5 text-center flex flex-col items-center justify-start transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-950/50"
            >
              <div className="relative w-16 h-16 mb-4">
                <Image
                  src={feat.img}
                  alt={feat.title}
                  fill
                  className="object-contain"
                />
              </div>
              <h3 className="text-sm md:text-base font-bold text-white mb-1.5">
                {feat.title}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {feat.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

