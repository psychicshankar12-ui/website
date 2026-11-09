'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Star, ChevronLeft, ChevronRight, Quote, CheckCircle2 } from 'lucide-react';
import type { Testimonial } from '@/lib/db';

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export default function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((prev) => (prev + 1) % testimonials.length);
  const prev = () => setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  if (!testimonials || testimonials.length === 0) return null;

  const currentItem = testimonials[current];

  return (
    <section className="py-16 md:py-24 relative overflow-hidden bg-[#0a0c24]">
      {/* Background Star Overlay */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffd700_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 relative z-10 text-center">
        <span className="text-xs font-bold uppercase tracking-widest text-amber-400 bg-amber-400/10 px-3.5 py-1 rounded-full border border-amber-400/20">
          Verified Client Experiences
        </span>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mt-3 mb-10">
          Customer <span className="gold-gradient-text">Testimonials</span>
        </h2>

        {/* Testimonial Card */}
        <div className="relative bg-gradient-to-br from-slate-900/90 via-[#181238]/90 to-slate-900/95 border border-amber-400/30 rounded-3xl p-6 sm:p-10 md:p-12 shadow-2xl backdrop-blur-xl">
          <Quote className="w-12 h-12 text-amber-400/20 mx-auto mb-4" />

          {/* Stars */}
          <div className="flex justify-center space-x-1.5 mb-6">
            {Array.from({ length: currentItem.rating || 5 }).map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
            ))}
          </div>

          {/* Review text */}
          <p className="text-base sm:text-lg md:text-xl text-slate-200 italic leading-relaxed max-w-3xl mx-auto mb-6">
            &ldquo;{currentItem.review}&rdquo;
          </p>

          {/* Reviewer Details */}
          <div className="flex flex-col items-center justify-center space-y-1">
            <div className="font-bold text-lg text-white flex items-center space-x-2">
              <span>{currentItem.name}</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-xs text-amber-300 font-medium">
              {currentItem.location}
            </div>
          </div>

          {/* Google Review Badge */}
          <div className="mt-8 pt-6 border-t border-purple-900/40 flex justify-center items-center space-x-3">
            <div className="relative w-48 h-14 transition-transform duration-300 hover:scale-105">
              <Image
                src="/images/seo/google_cus_review_btn.webp"
                alt="Google Customer Reviews"
                fill
                sizes="192px"
                className="object-contain"
              />
            </div>
          </div>

          {/* Controls */}
          {testimonials.length > 1 && (
            <div className="flex justify-center items-center space-x-4 mt-8">
              <button
                onClick={prev}
                className="p-2.5 rounded-full bg-slate-800/80 hover:bg-amber-400 hover:text-slate-950 text-slate-200 border border-slate-700 transition cursor-pointer"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-xs font-semibold text-slate-400">
                {current + 1} / {testimonials.length}
              </span>
              <button
                onClick={next}
                className="p-2.5 rounded-full bg-slate-800/80 hover:bg-amber-400 hover:text-slate-950 text-slate-200 border border-slate-700 transition cursor-pointer"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

