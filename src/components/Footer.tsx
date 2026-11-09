import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Phone, Mail, MapPin, ShieldCheck } from 'lucide-react';
import type { SiteSettings, DynamicPage } from '@/lib/db';

interface FooterProps {
  settings: SiteSettings;
  services: DynamicPage[];
}

const worldwideCountries = [
  'USA', 'Canada', 'UK', 'Australia', 'New Zealand', 'India', 'South Africa',
  'Singapore', 'Fiji', 'Mauritius', 'Malaysia', 'Trinidad & Tobago', 'Guyana',
  'Suriname', 'Jamaica', 'Bahamas', 'Barbados', 'France', 'Germany', 'Switzerland',
  'Netherlands', 'Sweden', 'Norway', 'Spain', 'Italy', 'Denmark', 'Ireland',
  'UAE', 'Qatar', 'Kenya', 'Tanzania', 'Ghana', 'Nigeria', 'Sri Lanka', 'Nepal'
];

export default function Footer({ settings, services }: FooterProps) {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-purple-900/50 pt-16 pb-12 relative overflow-hidden">
      {/* Decorative cosmic gradient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-gradient-to-b from-purple-900/20 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Column 1: Brand & Bio */}
          <div className="space-y-4">
            <div className="relative w-48 h-14">
              <Image
                src="/images/footer_logo.png"
                alt="Psychic Arjun Krishna"
                fill
                className="object-contain object-left"
              />
            </div>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Psychic Arjun Krishna is globally celebrated for his genuine Vedic astrology mastery, love relationship reconciliations, black magic cleansing, and accurate intuitive clairvoyance.
            </p>
            <div className="flex items-center space-x-2 text-xs text-amber-400 font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Guaranteed & Confidential</span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-slate-800 pb-2 flex items-center space-x-1.5">
              <span className="text-amber-400">✦</span>
              <span>Quick Links</span>
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link href="/" className="hover:text-amber-400 transition">Home</Link>
              </li>
              <li>
                <Link href="/aboutus" className="hover:text-amber-400 transition">About Astrologer</Link>
              </li>
              <li>
                <Link href="/#services" className="hover:text-amber-400 transition">All Astrological Services</Link>
              </li>
              <li>
                <Link href="/#usa-locations" className="hover:text-amber-400 transition">US Service Locations</Link>
              </li>
              <li>
                <Link href="/contactus" className="hover:text-amber-400 transition">Contact & Appointments</Link>
              </li>
              <li>
                <Link href="/admin" className="text-slate-500 hover:text-amber-400 transition text-xs">Admin Portal</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Popular Services */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-slate-800 pb-2 flex items-center space-x-1.5">
              <span className="text-amber-400">✦</span>
              <span>Top Services</span>
            </h4>
            <ul className="space-y-1.5 text-xs sm:text-sm">
              {services.slice(0, 6).map((srv) => (
                <li key={srv.id}>
                  <Link href={`/${srv.slug}`} className="hover:text-amber-400 transition truncate block">
                    • {srv.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact & Consultations */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-slate-800 pb-2 flex items-center space-x-1.5">
              <span className="text-amber-400">✦</span>
              <span>Direct Contact</span>
            </h4>
            <div className="space-y-3 text-xs sm:text-sm">
              <a
                href={`tel:${settings.phone}`}
                className="flex items-center space-x-2 text-amber-400 hover:text-amber-300 font-bold transition"
              >
                <Phone className="w-4 h-4 text-amber-400" />
                <span>{settings.phoneDisplay}</span>
              </a>
              <a
                href={`mailto:${settings.email}`}
                className="flex items-center space-x-2 hover:text-white transition"
              >
                <Mail className="w-4 h-4 text-slate-400" />
                <span className="truncate">{settings.email}</span>
              </a>
              <div className="flex items-start space-x-2 text-slate-400">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{settings.address}</span>
              </div>
              <div className="pt-2">
                <a
                  href={`tel:${settings.phone}`}
                  className="inline-block px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black rounded-lg text-xs hover:brightness-110 shadow-lg"
                >
                  CALL NOW FOR LIVE READING
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Worldwide Locations List */}
        <div className="border-t border-slate-800/80 pt-6 pb-6">
          <h5 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2.5 text-center">
            Our Astrological Services All Over The World
          </h5>
          <div className="flex flex-wrap justify-center gap-x-2 gap-y-1 text-[11px] text-slate-400 text-center max-w-5xl mx-auto">
            {worldwideCountries.map((c, i) => (
              <span key={i} className="hover:text-amber-300 transition cursor-default">
                {c} {i !== worldwideCountries.length - 1 && '•'}
              </span>
            ))}
          </div>
        </div>

        {/* Legal Disclaimer & Copyright */}
        <div className="border-t border-slate-800/80 pt-6 text-center space-y-2 text-[11px] text-slate-500">
          <p>
            Disclaimer: Astrology, psychic readings, and spiritual healing are traditional disciplines. Interpretations and results may vary per individual circumstances and karma. All consultations are intended for guidance and personal insight.
          </p>
          <p>
            &copy; 2026 {settings.siteName}. All Rights Reserved. Designed with SEO-centric architecture.
          </p>
        </div>
      </div>
    </footer>
  );
}

