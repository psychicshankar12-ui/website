import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Phone, MessageSquare, MapPin, Star, ShieldCheck, ChevronRight, CheckCircle2 } from 'lucide-react';
import { getPageBySlug, getAllPages, getSettings } from '@/lib/db';
import Header from '@/components/Header';
import ConsultationForm from '@/components/ConsultationForm';
import FaqAccordion from '@/components/FaqAccordion';
import Footer from '@/components/Footer';
import FloatingButtons from '@/components/FloatingButtons';


interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const pages = await getAllPages(undefined, 'published');
  return pages.map((page) => ({
    slug: page.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPageBySlug(slug);
  const settings = await getSettings();

  if (!page) {
    return {
      title: `Page Not Found | ${settings.siteName}`,
    };
  }

  return {
    title: page.metaTitle || `${page.title} | ${settings.siteName}`,
    description: page.metaDescription || page.shortExcerpt,
    keywords: page.metaKeywords || `${page.title}, Indian Astrologer, Psychic Shankar`,
    alternates: {
      canonical: page.canonicalUrl || `/${page.slug}`,
    },
    robots: {
      index: !page.noIndex,
      follow: !page.noIndex,
    },
    openGraph: {
      title: page.metaTitle || page.title,
      description: page.metaDescription || page.shortExcerpt,
      url: `/${page.slug}`,
      siteName: settings.siteName,
      images: [
        {
          url: page.ogImage || page.featuredImage || settings.defaultOgImage,
          width: 800,
          height: 600,
          alt: page.title,
        },
      ],
      type: 'article',
    },
  };
}

export default async function DynamicPageRoute({ params }: PageProps) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);

  if (!page) {
    notFound();
  }

  const settings = await getSettings();
  const allPages = await getAllPages();
  const services = allPages.filter((p) => p.category === 'service' && p.status === 'published');
  const locations = allPages.filter((p) => p.category === 'location' && p.status === 'published');
  const customPages = allPages.filter((p) => p.category === 'custom' && p.status === 'published');

  // Related items
  const relatedServices = services.filter((s) => s.id !== page.id).slice(0, 6);

  // Schema.org
  const isLocation = page.category === 'location';
  const schemaData = page.customSchemaJson
    ? JSON.parse(page.customSchemaJson)
    : {
        '@context': 'https://schema.org',
        '@type': isLocation ? 'LocalBusiness' : 'Service',
        name: page.title,
        description: page.metaDescription || page.shortExcerpt,
        provider: {
          '@type': 'Person',
          name: 'Psychic Shankar',
          telephone: settings.phone,
          email: settings.email,
        },
        url: `https://www.psychicshankar.com/${page.slug}`,
        ...(isLocation && {
          address: {
            '@type': 'PostalAddress',
            addressCountry: 'US',
            addressRegion: page.title.replace('Astrologer in ', ''),
          },
        }),
      };

  return (
    <div className="min-h-screen flex flex-col cosmic-bg text-slate-100">
      {/* Schema.org */}
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

      {/* Page Hero Banner */}
      <div className="relative w-full py-16 md:py-24 bg-gradient-to-r from-purple-950 via-[#18113c] to-slate-950 border-b border-purple-900/40 overflow-hidden">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#ffd700_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          {/* Breadcrumbs */}
          <nav className="flex items-center space-x-2 text-xs text-slate-400 mb-4" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-amber-400 transition">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="capitalize text-amber-300">{page.category}</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-white font-medium truncate max-w-xs">{page.title}</span>
          </nav>

          <div className="max-w-3xl space-y-3">
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
              {page.category === 'location' ? 'US Astrological Service Location' : 'Psychic Shankar'}
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight">
              {page.bannerTitle || page.title}
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-slate-300">
              {page.bannerSubtitle || page.shortExcerpt}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 py-12 md:py-16 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column: Rich Content */}
          <div className="lg:col-span-8 space-y-8">
            {/* Featured Image if exists */}
            {page.featuredImage && (
              <div className="relative w-full h-[300px] sm:h-[400px] rounded-3xl overflow-hidden border border-purple-900/50 shadow-2xl bg-slate-900">
                <Image
                  src={page.featuredImage}
                  alt={page.title}
                  fill
                  className="object-cover object-center"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              </div>
            )}

            {/* Content Body */}
            <article className="bg-slate-900/70 border border-purple-900/30 rounded-3xl p-6 sm:p-8 md:p-10 text-slate-200 leading-relaxed shadow-xl space-y-6 text-sm sm:text-base">
              <div
                className="prose prose-invert max-w-none prose-headings:text-amber-300 prose-headings:font-bold prose-a:text-amber-400 hover:prose-a:underline"
                dangerouslySetInnerHTML={{ __html: page.content }}
              />

              {/* YouTube Video Section if provided */}
              {page.videoUrl && (
                <div className="mt-8 pt-6 border-t border-slate-800">
                  <h3 className="text-xl font-bold text-white mb-4">Watch Spiritual Guidance Video</h3>
                  <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-amber-400/30">
                    <iframe
                      src={page.videoUrl.includes('embed') ? page.videoUrl : `https://www.youtube.com/embed/${page.videoUrl}`}
                      title={`${page.title} Video`}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}

              {/* In-content CTA */}
              <div className="mt-8 bg-gradient-to-r from-purple-950 via-[#1d1645] to-slate-900 border border-amber-400/30 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="text-lg font-bold text-white">Connect Directly with Psychic Shankar</h4>
                  <p className="text-xs text-slate-300 mt-1">Get urgent spiritual answers live over phone or video.</p>
                </div>
                <a
                  href={`tel:${settings.phone}`}
                  className="px-5 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 hover:brightness-110 text-slate-950 font-black text-xs rounded-xl flex items-center space-x-2 shrink-0 shadow-lg"
                >
                  <Phone className="w-4 h-4 fill-slate-950" />
                  <span>Call {settings.phoneDisplay}</span>
                </a>
              </div>
            </article>

            {/* Page specific FAQs if any */}
            {page.faqs && page.faqs.length > 0 && (
              <div className="mt-10">
                <FaqAccordion faqs={page.faqs} />
              </div>
            )}

            {/* Related Services */}
            <div className="bg-slate-900/60 border border-purple-900/30 rounded-3xl p-6 sm:p-8">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                <span className="text-amber-400">✦</span>
                <span>Other Popular Astrological Services</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {relatedServices.map((srv) => (
                  <Link
                    key={srv.id}
                    href={`/${srv.slug}`}
                    className="p-3 rounded-xl bg-slate-950/50 hover:bg-purple-950/60 border border-slate-800 hover:border-amber-400/40 text-xs sm:text-sm text-slate-200 hover:text-amber-300 flex items-center space-x-2 transition"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                    <span className="truncate font-medium">{srv.title}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Sidebar with Consultation Form & Quick Contact */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Consultation Booking Form */}
            <div className="sticky top-28 space-y-6">
              <ConsultationForm
                settings={settings}
                services={services}
                pageSource={`${page.title} (/${page.slug})`}
                compact
              />

              {/* Direct Help Call Box */}
              <div className="bg-gradient-to-br from-purple-950/80 to-slate-900/90 border border-amber-400/30 rounded-2xl p-6 text-center shadow-xl space-y-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                  Instant Response 24/7
                </span>
                <h4 className="text-lg font-black text-white">Have an Urgent Emergency?</h4>
                <p className="text-xs text-slate-300">
                  Speak directly with master astrologer Psychic Shankar right away.
                </p>
                <div className="pt-2 flex flex-col space-y-2">
                  <a
                    href={`tel:${settings.phone}`}
                    className="w-full py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center space-x-2 shadow-lg hover:brightness-110 transition"
                  >
                    <Phone className="w-4 h-4 fill-slate-950" />
                    <span>Call: {settings.phoneDisplay}</span>
                  </a>
                  <a
                    href={`https://wa.me/${settings.whatsapp}?text=Hello%20Psychic%20Shankar,%20I%20am%20inquiring%20about%20${encodeURIComponent(
                      page.title
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-2 transition shadow"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>WhatsApp Chat</span>
                  </a>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Footer */}
      <Footer settings={settings} services={services} />

      {/* Floating Buttons */}
      <FloatingButtons settings={settings} />
    </div>
  );
}

