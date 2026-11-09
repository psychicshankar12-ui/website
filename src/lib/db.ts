import fs from 'fs';
import path from 'path';
import { Redis } from '@upstash/redis';

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

const defaultSettings: SiteSettings = {
  siteName: 'Psychic Shankar',
  tagline: 'Best Indian Astrologer in USA',
  phone: '+19298677866',
  phoneDisplay: '+1 (929) 867-7866',
  whatsapp: '+19298677866',
  email: 'psychicshankar12@gmail.com',
  address: 'New York, USA',
  headerAnnouncement: 'All Religions Are Welcome • Top Indian Astrologer in USA',
  facebookUrl: '',
  instagramUrl: '',
  youtubeUrl: '',
  twitterUrl: '',
  defaultOgImage: '/images/logo.png',
  googleAnalyticsId: '',
  adminUser: 'admin',
  adminPass: 'shankar2026!',
};

const redisUrl =
  process.env.KV_REST_API_URL ||
  process.env.UPSTASH_REDIS_REST_URL ||
  process.env.STORAGE_REST_API_URL ||
  process.env.STORAGE_URL ||
  process.env.REDIS_REST_API_URL ||
  process.env.REDIS_URL;

const redisToken =
  process.env.KV_REST_API_TOKEN ||
  process.env.UPSTASH_REDIS_REST_TOKEN ||
  process.env.STORAGE_REST_API_TOKEN ||
  process.env.STORAGE_TOKEN ||
  process.env.REDIS_REST_API_TOKEN ||
  process.env.REDIS_TOKEN;

const redis = (redisUrl && redisToken)
  ? new Redis({
      url: redisUrl,
      token: redisToken,
    })
  : null;

const REDIS_KEY = 'psychic_db';
const LOCAL_DB_FILE = path.join(process.cwd(), 'src/data/db.json');

let memoryCache: DatabaseSchema | null = null;

function getLocalFallback(): DatabaseSchema {
  try {
    if (fs.existsSync(LOCAL_DB_FILE)) {
      const data = fs.readFileSync(LOCAL_DB_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading local fallback db.json:', err);
  }
  return {
    pages: [],
    testimonials: [],
    faqs: [],
    settings: defaultSettings,
    inquiries: [],
  };
}

async function readDb(): Promise<DatabaseSchema> {
  if (redis) {
    try {
      const remote = await redis.get<DatabaseSchema>(REDIS_KEY);
      if (remote && remote.pages && remote.pages.length > 0) {
        return remote;
      }
      // Auto seed Redis on first run
      const seed = getLocalFallback();
      await redis.set(REDIS_KEY, seed);
      return seed;
    } catch (err) {
      console.error('Redis error during readDb, falling back to local data:', err);
    }
  }

  if (!memoryCache) {
    memoryCache = getLocalFallback();
  }
  return memoryCache;
}

async function writeDb(db: DatabaseSchema): Promise<void> {
  memoryCache = db;

  if (redis) {
    try {
      await redis.set(REDIS_KEY, db);
      return;
    } catch (err) {
      console.error('Redis error during writeDb:', err);
    }
  }

  // Attempt local filesystem write
  try {
    const tempFile = `${LOCAL_DB_FILE}.tmp.${Date.now()}`;
    fs.writeFileSync(tempFile, JSON.stringify(db, null, 2), 'utf-8');
    fs.renameSync(tempFile, LOCAL_DB_FILE);
  } catch (err) {
    // In serverless without Redis, container memory retains changes for warm requests
    console.warn('Filesystem write skipped (read-only environment):', err);
  }
}

// Pages API
export async function getAllPages(category?: string, status?: string): Promise<DynamicPage[]> {
  const db = await readDb();
  let pages = db.pages || [];
  if (category) {
    pages = pages.filter((p) => p.category === category);
  }
  if (status) {
    pages = pages.filter((p) => p.status === status);
  }
  return pages;
}

export async function getPageBySlug(slug: string): Promise<DynamicPage | null> {
  const db = await readDb();
  const cleanSlug = slug.replace(/\.php$/, '').replace(/^\//, '');
  return db.pages.find((p) => p.slug === cleanSlug) || null;
}

export async function getPageById(id: string): Promise<DynamicPage | null> {
  const db = await readDb();
  return db.pages.find((p) => p.id === id) || null;
}

export async function createPage(pageData: Omit<DynamicPage, 'id'> & { id?: string }): Promise<DynamicPage> {
  const db = await readDb();
  const id = pageData.id || `page-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date().toISOString();

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
  await writeDb(db);
  return newPage;
}

export async function updatePage(id: string, updates: Partial<DynamicPage>): Promise<DynamicPage | null> {
  const db = await readDb();
  const index = db.pages.findIndex((p) => p.id === id);
  if (index === -1) return null;

  if (updates.slug) {
    updates.slug = updates.slug.trim().toLowerCase().replace(/[^a-z0-9\-]/g, '-').replace(/-+/g, '-');
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
  await writeDb(db);
  return updated;
}

export async function deletePage(id: string): Promise<boolean> {
  const db = await readDb();
  const initialLength = db.pages.length;
  db.pages = db.pages.filter((p) => p.id !== id);
  if (db.pages.length !== initialLength) {
    await writeDb(db);
    return true;
  }
  return false;
}

// Inquiries API
export async function getAllInquiries(): Promise<Inquiry[]> {
  const db = await readDb();
  return db.inquiries || [];
}

export async function createInquiry(data: Omit<Inquiry, 'id' | 'createdAt' | 'status'>): Promise<Inquiry> {
  const db = await readDb();
  const newInquiry: Inquiry = {
    ...data,
    id: `inq-${Date.now()}`,
    status: 'new',
    createdAt: new Date().toISOString(),
  };
  db.inquiries = db.inquiries || [];
  db.inquiries.unshift(newInquiry);
  await writeDb(db);
  return newInquiry;
}

export async function updateInquiryStatus(id: string, status: Inquiry['status']): Promise<boolean> {
  const db = await readDb();
  const inquiry = (db.inquiries || []).find((i) => i.id === id);
  if (inquiry) {
    inquiry.status = status;
    await writeDb(db);
    return true;
  }
  return false;
}

export async function deleteInquiry(id: string): Promise<boolean> {
  const db = await readDb();
  const prevLen = (db.inquiries || []).length;
  db.inquiries = (db.inquiries || []).filter((i) => i.id !== id);
  if (db.inquiries.length !== prevLen) {
    await writeDb(db);
    return true;
  }
  return false;
}

// Testimonials API
export async function getAllTestimonials(): Promise<Testimonial[]> {
  const db = await readDb();
  return db.testimonials || [];
}

export async function createTestimonial(data: Omit<Testimonial, 'id'>): Promise<Testimonial> {
  const db = await readDb();
  const item: Testimonial = {
    ...data,
    id: `test-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  db.testimonials = db.testimonials || [];
  db.testimonials.unshift(item);
  await writeDb(db);
  return item;
}

export async function deleteTestimonial(id: string): Promise<boolean> {
  const db = await readDb();
  const prevLen = (db.testimonials || []).length;
  db.testimonials = (db.testimonials || []).filter((t) => t.id !== id);
  if (db.testimonials.length !== prevLen) {
    await writeDb(db);
    return true;
  }
  return false;
}

// Settings API
export async function getSettings(): Promise<SiteSettings> {
  const db = await readDb();
  return db.settings;
}

export async function updateSettings(updates: Partial<SiteSettings>): Promise<SiteSettings> {
  const db = await readDb();
  db.settings = {
    ...db.settings,
    ...updates,
  };
  await writeDb(db);
  return db.settings;
}

// FAQs API
export async function getFaqs(): Promise<FaqItem[]> {
  const db = await readDb();
  return db.faqs || [];
}
