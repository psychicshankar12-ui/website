'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Phone, Mail, Menu, X, ChevronDown, Star, Lock } from 'lucide-react';
import type { DynamicPage, SiteSettings } from '@/lib/db';

interface HeaderProps {
  settings: SiteSettings;
  services: DynamicPage[];
  locations: DynamicPage[];
  customPages?: DynamicPage[];
}

export default function Header({ settings, services, locations, customPages = [] }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [locationsOpen, setLocationsOpen] = useState(false);

  return (
    <header className="w-full sticky top-0 z-50 shadow-2xl">
      {/* 1. Top Announcement Marquee */}
      <div className="bg-[#542b6e] text-amber-300 py-1.5 px-3 text-xs md:text-sm font-semibold text-center border-b border-amber-400/20 flex items-center justify-center space-x-2">
        <Star className="w-4 h-4 fill-amber-400 text-amber-400 animate-spin-slow" />
        <span className="tracking-wide">{settings.headerAnnouncement}</span>
        <Star className="w-4 h-4 fill-amber-400 text-amber-400 animate-spin-slow" />
      </div>

      {/* 2. Top Info & Social Bar */}
      <div className="bg-[#0c0e3d] text-slate-300 py-2 px-4 border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center text-xs md:text-sm gap-2">
          <div className="flex items-center space-x-4">
            <a
              href={`tel:${settings.phone}`}
              className="flex items-center space-x-1.5 text-amber-400 hover:text-amber-300 font-bold transition"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>{settings.phoneDisplay}</span>
            </a>
            <a
              href={`mailto:${settings.email}`}
              className="hidden sm:flex items-center space-x-1.5 hover:text-white transition"
            >
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>{settings.email}</span>
            </a>
          </div>

          <div className="flex items-center space-x-3">
            <span className="hidden md:inline-block text-slate-400 text-xs">Follow Us:</span>
            {settings.youtubeUrl && (
              <a
                href={settings.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition"
                aria-label="YouTube"
              >
                <div className="w-6 h-6 rounded-full bg-red-600 flex items-center justify-center text-white text-xs font-bold">
                  ▶
                </div>
              </a>
            )}
            {settings.facebookUrl && (
              <a
                href={settings.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition"
                aria-label="Facebook"
              >
                <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                  f
                </div>
              </a>
            )}
            {settings.instagramUrl && (
              <a
                href={settings.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition"
                aria-label="Instagram"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-yellow-500 via-pink-600 to-purple-700 flex items-center justify-center text-white text-xs font-bold">
                  📷
                </div>
              </a>
            )}
            <Link
              href="/admin"
              className="ml-3 flex items-center space-x-1 text-slate-400 hover:text-amber-400 text-xs px-2 py-0.5 rounded border border-slate-700 hover:border-amber-400/50 transition"
              title="Admin Panel"
            >
              <Lock className="w-3 h-3" />
              <span className="hidden lg:inline">Admin</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 3. Main Navigation Bar */}
      <nav className="bg-slate-950/95 backdrop-blur-md border-b border-purple-900/40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative w-48 sm:w-56 h-12 sm:h-14">
              <Image
                src="/images/logo.png"
                alt="Psychic Shankar"
                fill
                className="object-contain object-left"
                priority
              />
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-1 xl:space-x-2 font-medium text-sm text-slate-200">
            <Link
              href="/"
              className="px-3 py-2 rounded-lg hover:text-amber-400 hover:bg-white/5 transition"
            >
              Home
            </Link>
            <Link
              href="/aboutus"
              className="px-3 py-2 rounded-lg hover:text-amber-400 hover:bg-white/5 transition"
            >
              About Astrologer
            </Link>

            {/* Services Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setServicesOpen(true)}
              onMouseLeave={() => setServicesOpen(false)}
            >
              <button
                className="px-3 py-2 rounded-lg hover:text-amber-400 hover:bg-white/5 flex items-center space-x-1 transition cursor-pointer"
              >
                <span>Astrology Services</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {servicesOpen && (
                <div className="absolute left-0 top-full w-80 bg-slate-900/98 border border-amber-400/30 rounded-xl shadow-2xl p-2 grid grid-cols-1 max-h-[70vh] overflow-y-auto backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-150 z-50">
                  <div className="px-3 py-1.5 text-xs font-bold text-amber-400 uppercase tracking-wider border-b border-slate-800">
                    All 20+ Sacred Services
                  </div>
                  {services.map((srv) => (
                    <Link
                      key={srv.id}
                      href={`/${srv.slug}`}
                      className="px-3 py-2 text-xs text-slate-200 hover:text-amber-300 hover:bg-purple-950/50 rounded-lg flex items-center space-x-2 transition"
                      onClick={() => setServicesOpen(false)}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                      <span className="truncate">{srv.title}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Locations Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setLocationsOpen(true)}
              onMouseLeave={() => setLocationsOpen(false)}
            >
              <button
                className="px-3 py-2 rounded-lg hover:text-amber-400 hover:bg-white/5 flex items-center space-x-1 transition cursor-pointer"
              >
                <span>US Locations</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {locationsOpen && (
                <div className="absolute -left-20 top-full w-96 bg-slate-900/98 border border-amber-400/30 rounded-xl shadow-2xl p-3 grid grid-cols-2 gap-1 max-h-[70vh] overflow-y-auto backdrop-blur-xl z-50">
                  <div className="col-span-2 px-2 py-1 text-xs font-bold text-amber-400 uppercase tracking-wider border-b border-slate-800 mb-1">
                    All 50 US States
                  </div>
                  {locations.slice(0, 30).map((loc) => (
                    <Link
                      key={loc.id}
                      href={`/${loc.slug}`}
                      className="px-2 py-1.5 text-xs text-slate-300 hover:text-amber-300 hover:bg-purple-950/50 rounded flex items-center space-x-1.5 truncate transition"
                      onClick={() => setLocationsOpen(false)}
                    >
                      <span className="text-[10px] text-amber-400/70">✦</span>
                      <span className="truncate">{loc.title.replace('Astrologer in ', '')}</span>
                    </Link>
                  ))}
                  <Link
                    href="/#usa-locations"
                    className="col-span-2 text-center text-xs text-amber-400 hover:underline py-2 font-bold"
                    onClick={() => setLocationsOpen(false)}
                  >
                    View All 50 States →
                  </Link>
                </div>
              )}
            </div>

            {/* Custom Pages */}
            {customPages && customPages.length > 0 && (
              <div className="relative group">
                <button className="px-3 py-2 rounded-lg hover:text-amber-400 hover:bg-white/5 flex items-center space-x-1 transition">
                  <span>More</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                <div className="absolute left-0 top-full hidden group-hover:block w-48 bg-slate-900 border border-slate-700 rounded-xl shadow-xl p-2 z-50">
                  {customPages.map((cp) => (
                    <Link
                      key={cp.id}
                      href={`/${cp.slug}`}
                      className="block px-3 py-2 text-xs text-slate-200 hover:text-amber-400 hover:bg-slate-800 rounded-lg"
                    >
                      {cp.title}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <Link
              href="/contactus"
              className="px-3 py-2 rounded-lg hover:text-amber-400 hover:bg-white/5 transition"
            >
              Contact Us
            </Link>
          </div>

          {/* Quick Call & CTA */}
          <div className="hidden md:flex items-center space-x-3">
            <a
              href={`https://wa.me/${settings.whatsapp}?text=Hello%20Psychic%20Shankar,%20I%20would%20like%20to%20book%20a%20consultation.`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-xs flex items-center space-x-1.5 shadow-lg shadow-emerald-900/30 transition transform hover:scale-105"
            >
              <span>WhatsApp</span>
            </a>
            <a
              href={`tel:${settings.phone}`}
              className="px-4 py-2 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:brightness-110 text-slate-950 font-extrabold rounded-lg text-xs md:text-sm flex items-center space-x-2 shadow-lg shadow-amber-500/20 transition transform hover:scale-105"
            >
              <Phone className="w-4 h-4 fill-slate-950" />
              <span>CALL NOW</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-200 hover:text-amber-400 focus:outline-none"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-slate-900/98 border-t border-purple-900/50 px-4 py-4 space-y-2 max-h-[80vh] overflow-y-auto animate-in slide-in-from-top duration-200">
            <Link
              href="/"
              className="block py-2 text-slate-200 hover:text-amber-400 font-medium border-b border-slate-800"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/aboutus"
              className="block py-2 text-slate-200 hover:text-amber-400 font-medium border-b border-slate-800"
              onClick={() => setMobileMenuOpen(false)}
            >
              About Astrologer
            </Link>

            {/* Mobile Services Accordion */}
            <div>
              <button
                onClick={() => setServicesOpen(!servicesOpen)}
                className="w-full flex justify-between items-center py-2 text-slate-200 hover:text-amber-400 font-medium border-b border-slate-800"
              >
                <span>Astrology Services ({services.length})</span>
                <ChevronDown className={`w-4 h-4 transition ${servicesOpen ? 'rotate-180' : ''}`} />
              </button>
              {servicesOpen && (
                <div className="pl-4 py-2 space-y-1.5 bg-slate-950/50 rounded-lg my-1 max-h-60 overflow-y-auto">
                  {services.map((srv) => (
                    <Link
                      key={srv.id}
                      href={`/${srv.slug}`}
                      className="block py-1 text-xs text-slate-300 hover:text-amber-400 truncate"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      ✦ {srv.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Locations Accordion */}
            <div>
              <button
                onClick={() => setLocationsOpen(!locationsOpen)}
                className="w-full flex justify-between items-center py-2 text-slate-200 hover:text-amber-400 font-medium border-b border-slate-800"
              >
                <span>US Locations ({locations.length})</span>
                <ChevronDown className={`w-4 h-4 transition ${locationsOpen ? 'rotate-180' : ''}`} />
              </button>
              {locationsOpen && (
                <div className="pl-4 py-2 space-y-1.5 bg-slate-950/50 rounded-lg my-1 max-h-60 overflow-y-auto grid grid-cols-2 gap-1">
                  {locations.slice(0, 24).map((loc) => (
                    <Link
                      key={loc.id}
                      href={`/${loc.slug}`}
                      className="block py-1 text-xs text-slate-300 hover:text-amber-400 truncate"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      • {loc.title.replace('Astrologer in ', '')}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/contactus"
              className="block py-2 text-slate-200 hover:text-amber-400 font-medium border-b border-slate-800"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact Us
            </Link>

            <Link
              href="/admin"
              className="block py-2 text-amber-400 font-medium border-b border-slate-800 flex items-center space-x-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Lock className="w-4 h-4" />
              <span>Admin Dashboard</span>
            </Link>

            <div className="pt-3 flex flex-col space-y-2">
              <a
                href={`tel:${settings.phone}`}
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-bold rounded-lg text-center flex items-center justify-center space-x-2 shadow-lg"
              >
                <Phone className="w-4 h-4 fill-slate-950" />
                <span>Call {settings.phoneDisplay}</span>
              </a>
              <a
                href={`https://wa.me/${settings.whatsapp}?text=Hello%20Psychic%20Shankar`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-center flex items-center justify-center space-x-2"
              >
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

