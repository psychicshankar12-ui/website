import fs from 'fs';
import path from 'path';

export interface DynamicPage {
  id: string;
  title: string;
  slug: string;
  category: 'service' | 'location' | 'blog' | 'custom';
  bannerTitle: string;
  bannerSubtitle: string;
  bannerImage: string;
  featuredImage: string;
  shortExcerpt: string;
  content: string;
  videoUrl?: string;
  faqs?: Array<{ question: string; answer: string }>;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  canonicalUrl?: string;
  ogImage?: string;
  noIndex?: boolean;
  schemaType?: 'Service' | 'LocalBusiness' | 'Article' | 'FAQPage';
  customSchemaJson?: string;
  status: 'published' | 'draft';
  createdAt?: string;
  updatedAt?: string;
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  pageSource?: string;
  status: 'new' | 'contacted' | 'resolved';
  createdAt: string;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  review: string;
  featured: boolean;
  createdAt?: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface SiteSettings {
  siteName: string;
  tagline: string;
  phone: string;
  phoneDisplay: string;
  whatsapp: string;
  email: string;
  address: string;
  headerAnnouncement: string;
  facebookUrl: string;
  instagramUrl: string;
  youtubeUrl: string;
  twitterUrl: string;
  defaultOgImage: string;
  googleAnalyticsId: string;
  adminUser: string;
  adminPass: string;
}

interface DatabaseSchema {
  pages: DynamicPage[];
  testimonials: Testimonial[];
  faqs: FaqItem[];
  settings: SiteSettings;
  inquiries: Inquiry[];
}

const DB_FILE = path.join(process.cwd(), 'src/data/db.json');

function readDb(): DatabaseSchema {
  try {
    if (!fs.existsSync(DB_FILE)) {
      throw new Error('Database file does not exist');
    }
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading database file:', err);
    return {
      pages: [],
      testimonials: [],
      faqs: [],
      settings: {
        siteName: 'Psychic Arjun Krishna',
        tagline: 'Best Indian Astrologer in USA',
        phone: '+19298677866',
        phoneDisplay: '+1 (929) 867-7866',
        whatsapp: '+19298677866',
        email: 'psychicarjunkrishna@gmail.com',
        address: 'New York, USA',
        headerAnnouncement: 'All Religions Are Welcome • Top Indian Astrologer in USA',
        facebookUrl: '',
        instagramUrl: '',
        youtubeUrl: '',
        twitterUrl: '',
        defaultOgImage: '/images/logo.png',
        googleAnalyticsId: '',
        adminUser: 'admin',
        adminPass: 'arjun2026!'
      },
      inquiries: []
    };
  }
}

function writeDb(db: DatabaseSchema) {
  const tempFile = `${DB_FILE}.tmp.${Date.now()}`;
  fs.writeFileSync(tempFile, JSON.stringify(db, null, 2), 'utf-8');
  fs.renameSync(tempFile, DB_FILE);
}

// Pages API
export function getAllPages(category?: string, status?: string): DynamicPage[] {
  const db = readDb();
  let pages = db.pages || [];
  if (category) {
    pages = pages.filter((p) => p.category === category);
  }
  if (status) {
    pages = pages.filter((p) => p.status === status);
  }
  return pages;
}

export function getPageBySlug(slug: string): DynamicPage | null {
  const db = readDb();
  const cleanSlug = slug.replace(/\.php$/, '').replace(/^\//, '');
  return db.pages.find((p) => p.slug === cleanSlug) || null;
}

export function getPageById(id: string): DynamicPage | null {
  const db = readDb();
  return db.pages.find((p) => p.id === id) || null;
}

export function createPage(pageData: Omit<DynamicPage, 'id'> & { id?: string }): DynamicPage {
  const db = readDb();
  const id = pageData.id || `page-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date().toISOString();
  
  // ensure unique slug
  let slug = pageData.slug.trim().toLowerCase().replace(/[^a-z0-9\-]/g, '-').replace(/-+/g, '-');
  if (slug.endsWith('-')) slug = slug.slice(0, -1);
  if (slug.startsWith('-')) slug = slug.slice(1);
  
  const existing = db.pages.find((p) => p.slug === slug);
  if (existing) {
    slug = `${slug}-${Date.now().toString().slice(-4)}`;
  }

  const newPage: DynamicPage = {
    ...pageData,
    id,
    slug,
    createdAt: now,
    updatedAt: now,
  };

  db.pages.unshift(newPage);
  writeDb(db);
  return newPage;
}

export function updatePage(id: string, updates: Partial<DynamicPage>): DynamicPage | null {
  const db = readDb();
  const index = db.pages.findIndex((p) => p.id === id);
  if (index === -1) return null;

  if (updates.slug) {
    updates.slug = updates.slug.trim().toLowerCase().replace(/[^a-z0-9\-]/g, '-').replace(/-+/g, '-');
    // check if another page uses this slug
    const conflict = db.pages.find((p) => p.id !== id && p.slug === updates.slug);
    if (conflict) {
      throw new Error(`A page with slug '${updates.slug}' already exists.`);
    }
  }

  const updated: DynamicPage = {
    ...db.pages[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  db.pages[index] = updated;
  writeDb(db);
  return updated;
}

export function deletePage(id: string): boolean {
  const db = readDb();
  const initialLength = db.pages.length;
  db.pages = db.pages.filter((p) => p.id !== id);
  if (db.pages.length !== initialLength) {
    writeDb(db);
    return true;
  }
  return false;
}

// Inquiries API
export function getAllInquiries(): Inquiry[] {
  const db = readDb();
  return db.inquiries || [];
}

export function createInquiry(data: Omit<Inquiry, 'id' | 'createdAt' | 'status'>): Inquiry {
  const db = readDb();
  const newInquiry: Inquiry = {
    ...data,
    id: `inq-${Date.now()}`,
    status: 'new',
    createdAt: new Date().toISOString(),
  };
  db.inquiries = db.inquiries || [];
  db.inquiries.unshift(newInquiry);
  writeDb(db);
  return newInquiry;
}

export function updateInquiryStatus(id: string, status: Inquiry['status']): boolean {
  const db = readDb();
  const inquiry = (db.inquiries || []).find((i) => i.id === id);
  if (inquiry) {
    inquiry.status = status;
    writeDb(db);
    return true;
  }
  return false;
}

export function deleteInquiry(id: string): boolean {
  const db = readDb();
  const prevLen = (db.inquiries || []).length;
  db.inquiries = (db.inquiries || []).filter((i) => i.id !== id);
  if (db.inquiries.length !== prevLen) {
    writeDb(db);
    return true;
  }
  return false;
}

// Testimonials API
export function getAllTestimonials(): Testimonial[] {
  const db = readDb();
  return db.testimonials || [];
}

export function createTestimonial(data: Omit<Testimonial, 'id'>): Testimonial {
  const db = readDb();
  const item: Testimonial = {
    ...data,
    id: `test-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  db.testimonials = db.testimonials || [];
  db.testimonials.unshift(item);
  writeDb(db);
  return item;
}

export function deleteTestimonial(id: string): boolean {
  const db = readDb();
  const prevLen = (db.testimonials || []).length;
  db.testimonials = (db.testimonials || []).filter((t) => t.id !== id);
  if (db.testimonials.length !== prevLen) {
    writeDb(db);
    return true;
  }
  return false;
}

// Settings API
export function getSettings(): SiteSettings {
  const db = readDb();
  return db.settings;
}

export function updateSettings(updates: Partial<SiteSettings>): SiteSettings {
  const db = readDb();
  db.settings = {
    ...db.settings,
    ...updates,
  };
  writeDb(db);
  return db.settings;
}

// FAQs API
export function getFaqs(): FaqItem[] {
  const db = readDb();
  return db.faqs || [];
}

