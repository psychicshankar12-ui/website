import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Phone, MessageSquare, ArrowRight, Star, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';
import { getAllPages, getSettings, getAllTestimonials, getFaqs } from '@/lib/db';
import Header from '@/components/Header';
import HeroSlider from '@/components/HeroSlider';
import ServiceCard from '@/components/ServiceCard';
import ConsultationForm from '@/components/ConsultationForm';
import WhyChooseUs from '@/components/WhyChooseUs';
import TestimonialsSection from '@/components/TestimonialsSection';
import StateLocationsSection from '@/components/StateLocationsSection';
import FaqAccordion from '@/components/FaqAccordion';
import Footer from '@/components/Footer';
import FloatingButtons from '@/components/FloatingButtons';


export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    title: `${settings.siteName} | ${settings.tagline}`,
    description:
      'Indian Astrologer in USA. Experience real-time Love psychic readings, black magic removal, ex love back remedies, and relationship solutions live on phone and video.',
    keywords:
      'Best Indian Astrologer in USA, Love Psychic Reader, Black Magic Removal, Get Ex Love Back, Psychic Arjun Krishna, Astrology Services USA',
    alternates: {
      canonical: '/',
    },
    openGraph: {
      title: `${settings.siteName} | Best Indian Astrologer in USA`,
      description:
        'Over 25 years of authentic Vedic astrology, accurate clairvoyant psychic readings, and guaranteed spiritual remedies.',
      url: '/',
      siteName: settings.siteName,
      images: [
        {
          url: settings.defaultOgImage || '/images/logo.png',
          width: 800,
          height: 600,
          alt: settings.siteName,
        },
      ],
      type: 'website',
    },
  };
}

export default async function HomePage() {
  const settings = await getSettings();
  const allPages = await getAllPages();
  const services = allPages.filter((p) => p.category === 'service' && p.status === 'published');
  const locations = allPages.filter((p) => p.category === 'location' && p.status === 'published');
  const customPages = allPages.filter((p) => p.category === 'custom' && p.status === 'published');
  const testimonials = await getAllTestimonials();
  const faqs = await getFaqs();

  // JSON-LD Schema markup for LocalBusiness & Astrologer Person
  const schemaData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'LocalBusiness',
        '@id': 'https://www.psychicarjunkrishna.com/#localbusiness',
        name: settings.siteName,
        description:
          'Best Indian Astrologer in USA. Authentic Vedic psychic reader, love back specialist, and spiritual healer.',
        telephone: settings.phone,
        email: settings.email,
        address: {
          '@type': 'PostalAddress',
          addressCountry: 'US',
          addressLocality: 'New York',
        },
        priceRange: '$$',
        openingHours: 'Mo-Su 00:00-24:00',
        url: 'https://www.psychicarjunkrishna.com',
        image: 'https://www.psychicarjunkrishna.com/images/logo.png',
      },
      {
        '@type': 'Person',
        '@id': 'https://www.psychicarjunkrishna.com/#astrologer',
        name: 'Psychic Arjun Krishna',
        jobTitle: 'Master Indian Astrologer & Psychic Reader',
        worksFor: {
          '@id': 'https://www.psychicarjunkrishna.com/#localbusiness',
        },
        description:
          'Celebrated generational Vedic Astrologer and Love Psychic with 25+ years experience helping over 15,000 clients across USA.',
      },
      {
        '@type': 'FAQPage',
        mainEntity: faqs.map((f) => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: f.answer,
          },
        })),
      },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col cosmic-bg text-slate-100">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />

      {/* Header */}
      <Header
        settings={settings}
        services={services}
        locations={locations}
        customPages={customPages}
      />

      <main className="flex-1">
        {/* 1. Hero Carousel */}
        <HeroSlider settings={settings} />

        {/* 2. Introduction / Profile Section */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-slate-950/90 to-[#120f30]/80 border-b border-purple-900/30">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Photo & Badge */}
              <div className="lg:col-span-5 relative">
                <div className="relative w-full h-[400px] sm:h-[480px] rounded-3xl overflow-hidden border-2 border-amber-400/40 shadow-2xl shadow-purple-950/60">
                  <Image
                    src="/images/seo/about_img3.webp"
                    alt="Psychic Arjun Krishna Expert in Indian Astrology"
                    fill
                    className="object-cover object-top"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 bg-slate-900/90 border border-amber-400/40 p-4 rounded-2xl backdrop-blur-md">
                    <div className="flex items-center space-x-2 text-amber-400 font-bold text-sm">
                      <Star className="w-4 h-4 fill-amber-400" />
                      <span>Psychic Arjun Krishna</span>
                    </div>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Master Indian Astrologer, Love Spell Caster & Spiritual Healer
                    </p>
                  </div>
                </div>
              </div>

              {/* Bio & Credentials */}
              <div className="lg:col-span-7 space-y-5">
                <div className="inline-flex items-center space-x-2 bg-amber-400/10 border border-amber-400/30 px-3 py-1 rounded-full text-xs font-bold text-amber-300">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>EXPERT IN VEDIC ASTROLOGY</span>
                </div>

                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight">
                  Psychic Arjun Krishna <br />
                  <span className="gold-gradient-text">Expert in Indian Astrology & Love Readings</span>
                </h2>

                <p className="text-sm md:text-base text-slate-300 leading-relaxed">
                  Psychic Arjun Krishna is a distinguished and internationally renowned Vedic astrologer, spiritual healer, and clairvoyant psychic with over 25 years of rich experience. Originating from a celebrated heritage of divine astrologers, he has dedicated his life to guiding individuals through their darkest hours toward light, love, and lasting fulfillment.
                </p>

                <p className="text-sm md:text-base text-slate-300 leading-relaxed">
                  Whether you are devastated by a sudden breakup, suffering from intense marital conflict, hindered by persistent bad luck, or targeted by malicious black magic and evil spirits, Psychic Arjun Krishna provides profound insights and powerful, customized remedies that deliver noticeable results.
                </p>

                {/* Key Benefits List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="flex items-center space-x-2 text-xs sm:text-sm text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Live Phone & Video Consultations</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs sm:text-sm text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>100% Strict Confidentiality</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs sm:text-sm text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Personalized Vedic Remedies & Pujas</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs sm:text-sm text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Proven 25+ Years Track Record</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-4 flex flex-wrap items-center gap-3">
                  <a
                    href={`tel:${settings.phone}`}
                    className="px-6 py-3.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:brightness-110 text-slate-950 font-black text-sm rounded-xl flex items-center space-x-2 shadow-lg shadow-amber-500/20 transition"
                  >
                    <Phone className="w-4 h-4 fill-slate-950" />
                    <span>Call: {settings.phoneDisplay}</span>
                  </a>
                  <a
                    href={`https://wa.me/${settings.whatsapp}?text=Hello%20Psychic%20Arjun%20Krishna,%20I%20would%20like%20to%20consult%20with%20you.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl flex items-center space-x-2 shadow-lg shadow-emerald-900/30 transition"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>WhatsApp</span>
                  </a>
                  <Link
                    href="/aboutus"
                    className="px-5 py-3.5 bg-slate-900 border border-slate-700 hover:border-amber-400 text-slate-200 font-bold text-sm rounded-xl transition"
                  >
                    Read Full Bio →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Services Grid Section */}
        <section id="services" className="py-16 md:py-24 max-w-7xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400 bg-amber-400/10 px-3.5 py-1 rounded-full border border-amber-400/20">
              OUR SACRED ASTROLOGICAL REMEDIES
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-white mt-3 mb-4">
              Our Special <span className="gold-gradient-text">Astrology Services</span>
            </h2>
            <p className="text-sm md:text-base text-slate-300">
              Explore our comprehensive range of Vedic spiritual services tailored to eliminate obstacles, bring back lost love, and invite prosperity.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {services.map((srv) => (
              <ServiceCard key={srv.id} service={srv} settings={settings} />
            ))}
          </div>

          {/* Quick Consultation Banner under services */}
          <div className="mt-16 bg-gradient-to-r from-purple-950 via-[#1e1545] to-slate-950 border border-amber-400/40 rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
            <div className="space-y-2 text-center md:text-left">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white">
                Need Urgent Astrological Advice?
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                Speak directly with Psychic Arjun Krishna today. Immediate appointments available via telephone or private video session.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <a
                href={`tel:${settings.phone}`}
                className="px-6 py-3.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:brightness-110 text-slate-950 font-black text-sm rounded-xl flex items-center space-x-2 shadow-xl shadow-amber-500/30 transition transform hover:scale-105"
              >
                <Phone className="w-4 h-4 fill-slate-950" />
                <span>{settings.phoneDisplay}</span>
              </a>
              <Link
                href="/contactus"
                className="px-5 py-3.5 bg-slate-900 border border-slate-700 hover:border-amber-400 text-slate-200 font-bold text-sm rounded-xl transition"
              >
                Book Appointment
              </Link>
            </div>
          </div>
        </section>

        {/* 4. Consultation Form Section */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-[#120f30]/80 via-slate-950 to-[#0c0e2a] border-t border-purple-900/30">
          <div className="max-w-4xl mx-auto px-4">
            <ConsultationForm settings={settings} services={services} />
          </div>
        </section>

        {/* 5. Why Choose Us Section */}
        <WhyChooseUs settings={settings} />

        {/* 6. Customer Testimonials */}
        <TestimonialsSection testimonials={testimonials} />

        {/* 7. US States Locations */}
        <StateLocationsSection locations={locations} />

        {/* 8. FAQ Accordion */}
        <FaqAccordion faqs={faqs} />
      </main>

      {/* Footer */}
      <Footer settings={settings} services={services} />

      {/* Floating Buttons */}
      <FloatingButtons settings={settings} />
    </div>
  );
}
