import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Phone, MessageSquare, Award, Star, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { getAllPages, getSettings, getAllTestimonials } from '@/lib/db';
import Header from '@/components/Header';
import WhyChooseUs from '@/components/WhyChooseUs';
import TestimonialsSection from '@/components/TestimonialsSection';
import Footer from '@/components/Footer';
import FloatingButtons from '@/components/FloatingButtons';


export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    title: `About Us | Best Vedic Indian Astrologer in USA - ${settings.siteName}`,
    description:
      'Learn about Psychic Shankar, internationally renowned master Indian Astrologer with 25+ years experience in love psychic reading, black magic removal, and spiritual healing.',
    alternates: {
      canonical: '/aboutus',
    },
  };
}

export default async function AboutPage() {
  const settings = await getSettings();
  const allPages = await getAllPages();
  const services = allPages.filter((p) => p.category === 'service' && p.status === 'published');
  const locations = allPages.filter((p) => p.category === 'location' && p.status === 'published');
  const testimonials = await getAllTestimonials();

  return (
    <div className="min-h-screen flex flex-col cosmic-bg text-slate-100">
      <Header settings={settings} services={services} locations={locations} />

      {/* Banner */}
      <div className="py-16 md:py-20 bg-gradient-to-r from-purple-950 via-[#191240] to-slate-950 border-b border-purple-900/40 text-center px-4">
        <span className="text-xs font-bold uppercase tracking-widest text-amber-400 bg-amber-400/10 px-3.5 py-1 rounded-full border border-amber-400/20">
          SACRED VEDIC LINEAGE
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mt-3 mb-2">
          About <span className="gold-gradient-text">Psychic Shankar</span>
        </h1>
        <p className="text-sm md:text-base text-slate-300 max-w-2xl mx-auto">
          Best Vedic Indian Astrologer, Love Psychic Reader & Spiritual Healer in the United States
        </p>
      </div>

      <main className="flex-1 max-w-7xl mx-auto px-4 py-16 space-y-16">
        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5 relative">
            <div className="relative w-full h-[450px] rounded-3xl overflow-hidden border-2 border-amber-400/40 shadow-2xl">
              <Image
                src="/images/seo/v2/about_img3.webp"
                alt="Psychic Shankar"
                fill
                className="object-cover object-top"
                priority
              />
            </div>
          </div>

          <div className="lg:col-span-7 space-y-5 text-slate-200 leading-relaxed text-sm sm:text-base">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Over 25 Years of Divine Guidance & Transformative Results
            </h2>
            <p>
              Psychic Shankar descends from a prestigious generational lineage of revered Vedic astrologers in India. From early childhood, he was schooled in ancient Sanskrit sacred scriptures, planetary astronomy, palmistry, face reading, and spiritual rituals under the direct tutelage of enlightened gurus.
            </p>
            <p>
              Over the last two decades in the United States, Psychic Shankar has successfully assisted over 15,000 individuals, families, couples, and entrepreneurs. His warm, empathetic approach combined with uncompromising accuracy has earned him the trust of clients from all religious backgrounds, walks of life, and continents.
            </p>
            <p>
              He firmly believes that no difficulty is insurmountable when addressed with genuine spiritual insight and authentic Vedic remedies. Whether resolving severe marital conflict, turning around catastrophic business losses, removing dark generational curses, or rekindling lost love, Psychic Shankar delivers peace of mind and lasting harmony.
            </p>

            <div className="pt-4 flex flex-wrap gap-4">
              <a
                href={`tel:${settings.phone}`}
                className="px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-bold rounded-xl text-sm flex items-center space-x-2 shadow-lg hover:brightness-110 transition"
              >
                <Phone className="w-4 h-4 fill-slate-950" />
                <span>Call Now: {settings.phoneDisplay}</span>
              </a>
              <Link
                href="/contactus"
                className="px-6 py-3 bg-purple-900 border border-amber-400/40 text-amber-300 font-bold rounded-xl text-sm hover:bg-purple-800 transition"
              >
                Schedule Private Consultation
              </Link>
            </div>
          </div>
        </div>

        {/* Why Choose Us */}
        <WhyChooseUs settings={settings} />

        {/* Testimonials */}
        <TestimonialsSection testimonials={testimonials} />
      </main>

      <Footer settings={settings} services={services} />
      <FloatingButtons settings={settings} />
    </div>
  );
}

