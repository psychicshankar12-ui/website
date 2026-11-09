'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Phone, MessageSquare, ChevronLeft, ChevronRight, Star, ShieldCheck, Clock } from 'lucide-react';
import type { SiteSettings } from '@/lib/db';

interface HeroSliderProps {
  settings: SiteSettings;
}

const slides = [
  {
    desktop: '/images/herobanner/banner_01.png',
    mobile: '/images/herobanner/mobile_01.png',
    title: 'No.1 Indian Best Astrologer & Psychic Spiritual Healer',
    subtitle: 'Healing, Family Problems, Psychic Readings, Work Success, Business Growth',
    tag: '100% Guaranteed & Confidential',
    ctaText: 'Reunite With Loved Ones'
  },
  {
    desktop: '/images/herobanner/banner_02.png',
    mobile: '/images/herobanner/mobile_02.png',
    title: 'Specialist in Love Psychic Reading & Relationships',
    subtitle: 'Privacy & Confidentiality Throughout the Reading, Solve All Your Problems',
    tag: '25+ Years Lineage of Vedic Mastery',
    ctaText: 'Get Your Ex Love Back'
  },
  {
    desktop: '/images/herobanner/banner_03.png',
    mobile: '/images/herobanner/mobile_03.png',
    title: 'Black Magic & Evil Spirit Removal Specialist',
    subtitle: 'Break Generational Curses, Hexes, Negative Energy & Harmful Influences',
    tag: 'Instant Spiritual Protection',
    ctaText: 'Protect Your Family Now'
  },
  {
    desktop: '/images/herobanner/banner_04.png',
    mobile: '/images/herobanner/mobile_04.png',
    title: 'Husband & Wife Relationship Dispute Specialist',
    subtitle: 'Restore Sacred Love, Deep Passion, Loyalty & Lifelong Understanding',
    tag: 'Stop Separation & Divorce',
    ctaText: 'Save Your Marriage'
  },
  {
    desktop: '/images/herobanner/banner_05.png',
    mobile: '/images/herobanner/mobile_05.png',
    title: 'Spiritual Healing & Negative Energy Removal',
    subtitle: 'Cleanse Negative Aura, Restore Harmony, Peace & Divine Blessings',
    tag: 'Urgent Crisis Support',
    ctaText: 'Cleanse Negative Aura'
  },
  {
    desktop: '/images/herobanner/banner_06.png',
    mobile: '/images/herobanner/mobile_06.png',
    title: 'World Famous Astrologer & Psychic Reader',
    subtitle: 'Accurate Palm, Face & Horoscope Readings with Immediate Authentic Remedies',
    tag: 'Over 15,000+ Satisfied Clients',
    ctaText: 'Discover Your Destiny'
  }
];

export default function HeroSlider({ settings }: HeroSliderProps) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <section className="relative w-full overflow-hidden bg-slate-950 min-h-[520px] md:min-h-[580px] lg:min-h-[640px] flex items-center" aria-label="Hero Carousel">
      {/* Background Slides */}
      {slides.map((slide, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            idx === current ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
          }`}
        >
          {/* Desktop Slide Background */}
          <div className="hidden sm:block relative w-full h-full">
            <Image
              src={slide.desktop}
              alt={slide.title}
              fill
              priority={idx === 0}
              sizes="100vw"
              className="object-cover object-center"
            />
          </div>

          {/* Mobile Slide Background */}
          <div className="block sm:hidden relative w-full h-full">
            <Image
              src={slide.mobile}
              alt={slide.title}
              fill
              priority={idx === 0}
              sizes="100vw"
              className="object-cover object-top"
            />
          </div>
        </div>
      ))}

      {/* Slide Content Overlay */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 py-16 md:py-20 w-full">
        <div className="max-w-2xl text-left space-y-4 md:space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-900/90 to-amber-900/70 border border-amber-400/50 rounded-full px-4 py-1 text-xs md:text-sm font-bold text-amber-300 backdrop-blur-md shadow-lg">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{slides[current].tag}</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight drop-shadow-lg">
            {slides[current].title} <span className="gold-gradient-text">| {settings.siteName}</span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base md:text-xl text-slate-200 font-medium leading-relaxed drop-shadow">
            {slides[current].subtitle}
          </p>

          {/* Trust Highlights */}
          <div className="flex flex-wrap gap-4 pt-1 text-xs md:text-sm text-amber-200/90 font-bold">
            <span className="flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Confidential</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Available 24/7 On Call</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span>Rapid Results</span>
            </span>
          </div>

          {/* Interactive CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-3">
            <a
              href={`tel:${settings.phone}`}
              className="px-6 py-3.5 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 hover:brightness-110 text-slate-950 font-black text-sm md:text-base rounded-xl flex items-center space-x-2 shadow-xl shadow-amber-500/25 transition transform hover:-translate-y-0.5 cursor-pointer"
            >
              <Phone className="w-5 h-5 fill-slate-950" />
              <span>CALL NOW: {settings.phoneDisplay}</span>
            </a>

            <a
              href={`https://wa.me/${settings.whatsapp}?text=Hello%20Psychic%20Shankar,%20I%20need%20urgent%20astrological%20help.`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm md:text-base rounded-xl flex items-center space-x-2 shadow-xl shadow-emerald-900/30 transition transform hover:-translate-y-0.5 cursor-pointer"
            >
              <MessageSquare className="w-5 h-5" />
              <span>WhatsApp Chat</span>
            </a>

            <Link
              href="/contactus"
              className="px-5 py-3.5 bg-purple-900/80 hover:bg-purple-800 text-amber-200 border border-amber-400/50 font-bold text-sm md:text-base rounded-xl backdrop-blur-md transition hover:-translate-y-0.5 cursor-pointer"
            >
              Book Consultation
            </Link>
          </div>
        </div>
      </div>

      {/* Carousel Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-30 p-2.5 sm:p-3 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/30 backdrop-blur-md transition transform hover:scale-110 cursor-pointer shadow-xl"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-30 p-2.5 sm:p-3 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/30 backdrop-blur-md transition transform hover:scale-110 cursor-pointer shadow-xl"
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex space-x-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`h-2 sm:h-2.5 rounded-full transition-all cursor-pointer ${
              idx === current ? 'w-8 bg-amber-400 shadow-lg shadow-amber-400/50' : 'w-2.5 bg-white/40 hover:bg-white/80'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
