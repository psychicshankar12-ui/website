'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { SiteSettings } from '@/lib/db';

interface HeroSliderProps {
  settings: SiteSettings;
}

const slides = [
  {
    desktop: '/images/herobanner/banner_01.png',
    mobile: '/images/herobanner/mobile_01.png',
    title: 'No.1 Indian Best Astrologer & Psychic Spiritual Healer | Psychic Shankar',
    ctaText: 'Consult Master Astrologer'
  },
  {
    desktop: '/images/herobanner/banner_02.png',
    mobile: '/images/herobanner/mobile_02.png',
    title: 'Specialist in Love Psychic Reading & Relationships | Psychic Shankar',
    ctaText: 'Get Ex Love Back'
  },
  {
    desktop: '/images/herobanner/banner_03.png',
    mobile: '/images/herobanner/mobile_03.png',
    title: 'Black Magic & Evil Spirit Removal Specialist | Psychic Shankar',
    ctaText: 'Break Generational Curses'
  },
  {
    desktop: '/images/herobanner/banner_04.png',
    mobile: '/images/herobanner/mobile_04.png',
    title: 'Husband & Wife Relationship Dispute Specialist | Psychic Shankar',
    ctaText: 'Stop Separation & Divorce'
  },
  {
    desktop: '/images/herobanner/banner_05.png',
    mobile: '/images/herobanner/mobile_05.png',
    title: 'Spiritual Healing & Negative Energy Removal | Psychic Shankar',
    ctaText: 'Cleanse Negative Aura'
  },
  {
    desktop: '/images/herobanner/banner_06.png',
    mobile: '/images/herobanner/mobile_06.png',
    title: 'World Famous Love Psychic Reader & Spiritual Healer | Psychic Shankar',
    ctaText: 'Divine Spiritual Blessings'
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
    <section className="relative w-full overflow-hidden bg-slate-950" aria-label="Hero Carousel">
      {/* Hidden SEO headings for Search Engine & Screen Reader indexing */}
      <div className="sr-only">
        <h1>{slides[current].title}</h1>
        <p>
          Master Indian Astrologer Psychic Shankar in USA. Specialist in Love Psychic Readings,
          Black Magic Removal, Ex Love Back, Relationship Dispute Solution, and Spiritual Healing.
          Call Now: {settings.phoneDisplay}.
        </p>
      </div>

      {/* Responsive Aspect-Ratio Carousel Container */}
      <div className="relative w-full aspect-[480/516] sm:aspect-[1900/714] max-h-[714px]">
        {slides.map((slide, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === current ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            {/* Desktop Slide (>= 640px) */}
            <a
              href={`tel:${settings.phone}`}
              className="hidden sm:block relative w-full h-full cursor-pointer focus:outline-none"
              title={`Call ${settings.siteName} - ${slide.title}`}
            >
              <Image
                src={slide.desktop}
                alt={slide.title}
                fill
                priority={idx === 0}
                sizes="100vw"
                className="object-cover object-center"
              />
            </a>

            {/* Mobile Slide (< 640px) */}
            <a
              href={`tel:${settings.phone}`}
              className="block sm:hidden relative w-full h-full cursor-pointer focus:outline-none"
              title={`Call ${settings.siteName} - ${slide.title}`}
            >
              <Image
                src={slide.mobile}
                alt={slide.title}
                fill
                priority={idx === 0}
                sizes="100vw"
                className="object-cover object-top"
              />
            </a>
          </div>
        ))}

        {/* Carousel Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-black/50 hover:bg-black/80 text-white border border-white/30 backdrop-blur-sm transition-all transform hover:scale-105 cursor-pointer shadow-lg"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-black/50 hover:bg-black/80 text-white border border-white/30 backdrop-blur-sm transition-all transform hover:scale-105 cursor-pointer shadow-lg"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Indicators */}
        <div className="absolute bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`h-2 sm:h-2.5 rounded-full transition-all cursor-pointer ${
                idx === current
                  ? 'w-7 sm:w-8 bg-amber-400 shadow-md shadow-amber-400/50'
                  : 'w-2 sm:w-2.5 bg-white/40 hover:bg-white/80'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
