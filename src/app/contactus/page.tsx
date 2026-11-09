import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import { Phone, Mail, MapPin, MessageSquare, Clock, ShieldCheck } from 'lucide-react';
import { getAllPages, getSettings } from '@/lib/db';
import Header from '@/components/Header';
import ConsultationForm from '@/components/ConsultationForm';
import Footer from '@/components/Footer';
import FloatingButtons from '@/components/FloatingButtons';


export async function generateMetadata(): Promise<Metadata> {
  const settings = getSettings();
  return {
    title: `Contact Us | Contact Indian Best Astrologer in USA - ${settings.siteName}`,
    description:
      'Contact Psychic Arjun Krishna for 100% confidential and authentic Vedic astrology readings, love problem solutions, and spiritual healing. Call or WhatsApp now.',
    alternates: {
      canonical: '/contactus',
    },
  };
}

export default function ContactPage() {
  const settings = getSettings();
  const allPages = getAllPages();
  const services = allPages.filter((p) => p.category === 'service' && p.status === 'published');
  const locations = allPages.filter((p) => p.category === 'location' && p.status === 'published');

  return (
    <div className="min-h-screen flex flex-col cosmic-bg text-slate-100">
      <Header settings={settings} services={services} locations={locations} />

      {/* Banner */}
      <div className="py-16 md:py-20 bg-gradient-to-r from-purple-950 via-[#191240] to-slate-950 border-b border-purple-900/40 text-center px-4">
        <span className="text-xs font-bold uppercase tracking-widest text-amber-400 bg-amber-400/10 px-3.5 py-1 rounded-full border border-amber-400/20">
          GET IN TOUCH
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mt-3 mb-2">
          Contact <span className="gold-gradient-text">Psychic Arjun Krishna</span>
        </h1>
        <p className="text-sm md:text-base text-slate-300 max-w-xl mx-auto">
          Available 24/7 for Phone, Video & In-Person Spiritual Astrology Consultations
        </p>
      </div>

      <main className="flex-1 max-w-7xl mx-auto px-4 py-16 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Contact Cards */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900/80 border border-purple-900/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
              <h2 className="text-2xl font-black text-white">Reach Out Directly</h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                We treat every consultation with complete empathy and strict confidentiality. All religions and beliefs are warmly welcomed.
              </p>

              <div className="space-y-4 pt-2">
                {/* Phone */}
                <a
                  href={`tel:${settings.phone}`}
                  className="flex items-center space-x-3 p-4 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-amber-400/50 transition group"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 group-hover:bg-amber-500 group-hover:text-slate-950 transition">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 font-medium">Call 24/7</div>
                    <div className="text-sm sm:text-base font-bold text-white group-hover:text-amber-300 transition">
                      {settings.phoneDisplay}
                    </div>
                  </div>
                </a>

                {/* WhatsApp */}
                <a
                  href={`https://wa.me/${settings.whatsapp}?text=Hello%20Psychic%20Arjun%20Krishna,%20I%20would%20like%20to%20book%20a%20consultation.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 p-4 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-emerald-400/50 transition group"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 group-hover:bg-emerald-500 group-hover:text-white transition">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 font-medium">WhatsApp Chat</div>
                    <div className="text-sm sm:text-base font-bold text-white group-hover:text-emerald-300 transition">
                      Chat on WhatsApp Now
                    </div>
                  </div>
                </a>

                {/* Email */}
                <a
                  href={`mailto:${settings.email}`}
                  className="flex items-center space-x-3 p-4 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-purple-400/50 transition group"
                >
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0 group-hover:bg-purple-500 group-hover:text-white transition">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 font-medium">Email Us</div>
                    <div className="text-sm sm:text-base font-bold text-white truncate group-hover:text-purple-300 transition">
                      {settings.email}
                    </div>
                  </div>
                </a>

                {/* Location */}
                <div className="flex items-center space-x-3 p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 font-medium">Address</div>
                    <div className="text-sm font-semibold text-slate-200">
                      {settings.address}
                    </div>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-center space-x-3 p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 font-medium">Working Hours</div>
                    <div className="text-sm font-semibold text-emerald-400">
                      Open 24 Hours / 7 Days a Week
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Consultation Booking Form */}
          <div className="lg:col-span-7">
            <ConsultationForm
              settings={settings}
              services={services}
              pageSource="Contact Us Page"
            />
          </div>
        </div>
      </main>

      <Footer settings={settings} services={services} />
      <FloatingButtons settings={settings} />
    </div>
  );
}

