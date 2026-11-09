'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import type { FaqItem } from '@/lib/db';

interface FaqAccordionProps {
  faqs: FaqItem[];
}

export default function FaqAccordion({ faqs }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="py-16 md:py-24 bg-[#0c0e2a] border-t border-purple-900/30">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400 bg-amber-400/10 px-3.5 py-1 rounded-full border border-amber-400/20">
            GOT QUESTIONS?
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mt-3 mb-4">
            Frequently Asked <span className="gold-gradient-text">Questions</span>
          </h2>
          <p className="text-sm md:text-base text-slate-300">
            Clear answers about our astrology consultations, accuracy, remedies, and confidentiality.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-purple-900/40 bg-slate-900/70 overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full p-4 sm:p-5 text-left flex justify-between items-center space-x-3 cursor-pointer hover:bg-white/5 transition"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-xs font-extrabold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/30 shrink-0">
                      0{idx + 1}
                    </span>
                    <span className="text-sm sm:text-base font-bold text-white">
                      {faq.question}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-amber-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/60">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

