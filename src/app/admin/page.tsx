'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  FileText,
  Plus,
  Trash2,
  Edit,
  ExternalLink,
  Search,
  CheckCircle,
  AlertCircle,
  Phone,
  Mail,
  Lock,
  LogOut,
  Globe,
  Settings,
  Users,
  Star,
  Eye,
  RefreshCw,
  Sparkles,
  Layers,
  ChevronRight,
  ShieldCheck,
  Check,
  Save,
  X
} from 'lucide-react';
import type { DynamicPage, Inquiry, Testimonial, SiteSettings } from '@/lib/db';

export default function AdminDashboard() {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState<'pages' | 'inquiries' | 'testimonials' | 'settings'>('pages');

  // Data states
  const [pages, setPages] = useState<DynamicPage[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loadingData, setLoadingData] = useState(false);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Modal State for Add / Edit Page
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPageId, setEditingPageId] = useState<string | null>(null);
  const [modalTab, setModalTab] = useState<'content' | 'seo'>('content');
  const [modalLoading, setModalLoading] = useState(false);
  const [modalMessage, setModalMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Page Form State
  const initialFormState: Partial<DynamicPage> = {
    title: '',
    slug: '',
    category: 'custom',
    bannerTitle: '',
    bannerSubtitle: '',
    bannerImage: '/images/herobanner/ban01.png',
    featuredImage: '/images/our_service_img/v2/pro_im_1.png',
    shortExcerpt: '',
    content: '',
    videoUrl: '',
    status: 'published',
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
    canonicalUrl: '',
    ogImage: '',
    noIndex: false,
    schemaType: 'Service',
  };
  const [formData, setFormData] = useState<Partial<DynamicPage>>(initialFormState);

  const fetchAllData = useCallback(async () => {
    setLoadingData(true);
    try {
      const [pagesRes, inqRes, testRes, setRes] = await Promise.all([
        fetch('/api/pages'),
        fetch('/api/inquiries'),
        fetch('/api/testimonials'),
        fetch('/api/settings'),
      ]);
      const pagesData = await pagesRes.json();
      const inqData = await inqRes.json();
      const testData = await testRes.json();
      const setData = await setRes.json();

      if (pagesData.pages) setPages(pagesData.pages);
      if (inqData.inquiries) setInquiries(inqData.inquiries);
      if (testData.testimonials) setTestimonials(testData.testimonials);
      if (setData.settings) setSettings(setData.settings);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoadingData(false);
    }
  }, []);

  // Check Auth on Mount
  useEffect(() => {
    let ignore = false;
    async function init() {
      try {
        const res = await fetch('/api/auth');
        const data = await res.json();
        if (!ignore) {
          setIsAuthenticated(data.authenticated);
          if (data.authenticated) {
            fetchAllData();
          }
        }
      } catch {
        if (!ignore) {
          setIsAuthenticated(false);
        }
      }
    }
    void init();
    return () => {
      ignore = true;
    };
  }, [fetchAllData]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: loginUser, password: loginPass }),
      });
      const data = await res.json();
      if (data.success) {
        setIsAuthenticated(true);
        fetchAllData();
      } else {
        setLoginError(data.error || 'Invalid credentials');
      }
    } catch {
      setLoginError('Server error logging in');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth', { method: 'DELETE' });
    setIsAuthenticated(false);
  };

  // Open Create Page
  const handleOpenCreate = () => {
    setEditingPageId(null);
    setFormData(initialFormState);
    setModalTab('content');
    setModalMessage(null);
    setIsModalOpen(true);
  };

  // Open Edit Page
  const handleOpenEdit = (page: DynamicPage) => {
    setEditingPageId(page.id);
    setFormData({
      ...page,
      canonicalUrl: page.canonicalUrl || `/${page.slug}`,
    });
    setModalTab('content');
    setModalMessage(null);
    setIsModalOpen(true);
  };

  // Auto-generate slug and meta from Title if creating new page
  const handleTitleChange = (val: string) => {
    const updates: Partial<DynamicPage> = { title: val };
    if (!editingPageId) {
      const slugVal = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      updates.slug = slugVal;
      updates.bannerTitle = val;
      updates.metaTitle = `${val} | Psychic Shankar`;
      updates.canonicalUrl = `/${slugVal}`;
    }
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  // Pre-fill Template
  const applyTemplate = (type: 'service' | 'location') => {
    if (type === 'service') {
      setFormData((prev) => ({
        ...prev,
        category: 'service',
        schemaType: 'Service',
        bannerSubtitle: 'Fast, Effective & 100% Confidential Vedic Astrology Remedies',
        shortExcerpt: `Overcome difficult challenges with authentic spiritual prayers and astrology solutions by Psychic Shankar.`,
        content: `<h3>Why Consult Psychic Shankar For ${prev.title || 'This Problem'}?</h3>
<p>Over the past 25 years, master astrologer Psychic Shankar has assisted countless individuals in resolving deep karmic blockages, restoring peace of mind, and reuniting broken bonds.</p>
<h4>How Our Vedic Remedies Work</h4>
<p>Through precise natal chart reading and sacred rituals, negative energies are dissolved, bringing clarity, positive attraction, and lasting stability.</p>
<ul>
  <li>100% Private & Confidential</li>
  <li>Immediate Phone & Video Consultations</li>
  <li>Customized Gemstones, Mantras & Pujas</li>
</ul>`,
        metaDescription: `Best ${prev.title || 'Astrology Service'} in USA by Psychic Shankar. Authentic Vedic remedies with 100% guaranteed confidentiality.`,
        metaKeywords: `${prev.title}, astrologer usa, psychic reading, spiritual healing remedies`,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        category: 'location',
        schemaType: 'LocalBusiness',
        bannerSubtitle: `Top Indian Astrologer & Spiritual Healer in ${prev.title || 'Your Area'}`,
        shortExcerpt: `Looking for the best Indian Astrologer in ${prev.title || 'this location'}? Psychic Shankar provides trusted astrology consultations.`,
        content: `<h3>Trusted Vedic Astrology in ${prev.title || 'Your City'}</h3>
<p>Residents have experienced life-changing results with the guidance of world-renowned Indian Astrologer Psychic Shankar. From love problems to black magic removal and business growth, get authentic answers today.</p>
<h4>Services Available Locally:</h4>
<ul>
  <li>Love Relationship Problem Solutions</li>
  <li>Get Ex Love Back with Spiritual Prayers</li>
  <li>Black Magic, Evil Eye & Curse Removal</li>
  <li>Accurate Palmistry & Clairvoyant Readings</li>
</ul>`,
        metaDescription: `Best Indian Astrologer in ${prev.title || 'USA'}. Trusted Vedic astrology, psychic readings, and love problem remedies by Psychic Shankar.`,
        metaKeywords: `astrologer in ${prev.title}, indian astrologer, psychic reader, love back expert`,
      }));
    }
  };

  // Save Page (Create or Update)
  const handleSavePage = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalLoading(true);
    setModalMessage(null);

    try {
      if (editingPageId) {
        // Update
        const res = await fetch('/api/pages', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingPageId, ...formData }),
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.error);

        setPages((prev) => prev.map((p) => (p.id === editingPageId ? data.page : p)));
        setModalMessage({ type: 'success', text: 'Page updated successfully!' });
      } else {
        // Create
        const res = await fetch('/api/pages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.error);

        setPages((prev) => [data.page, ...prev]);
        setModalMessage({ type: 'success', text: 'New dynamic page created successfully!' });
        setTimeout(() => setIsModalOpen(false), 1200);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save page';
      setModalMessage({ type: 'error', text: msg });
    } finally {
      setModalLoading(false);
    }
  };

  // Delete Page
  const handleDeletePage = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${title}"?`)) return;
    try {
      const res = await fetch(`/api/pages?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setPages((prev) => prev.filter((p) => p.id !== id));
      } else {
        alert(data.error || 'Failed to delete page');
      }
    } catch {
      alert('Error deleting page');
    }
  };

  // Delete Inquiry
  const handleDeleteInquiry = async (id: string) => {
    if (!window.confirm('Delete this inquiry record?')) return;
    try {
      const res = await fetch(`/api/inquiries?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setInquiries((prev) => prev.filter((i) => i.id !== id));
      }
    } catch {
      alert('Failed to delete inquiry');
    }
  };

  // Update Inquiry Status
  const handleUpdateInquiryStatus = async (id: string, newStatus: Inquiry['status']) => {
    try {
      const res = await fetch('/api/inquiries', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setInquiries((prev) =>
          prev.map((i) => (i.id === id ? { ...i, status: newStatus } : i))
        );
      }
    } catch {
      alert('Failed to update inquiry status');
    }
  };

  // Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (data.success) {
        alert('Site settings updated successfully!');
      }
    } catch {
      alert('Error saving site settings');
    }
  };

  // Filtered Pages
  const filteredPages = pages.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === 'all' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // -------------------------------------------------------------
  // Render: Loading Screen
  // -------------------------------------------------------------
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen cosmic-bg flex items-center justify-center text-amber-400">
        <RefreshCw className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  // -------------------------------------------------------------
  // Render: Login Screen
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen cosmic-bg flex flex-col justify-center items-center px-4">
        <div className="w-full max-w-md bg-slate-900/90 border border-amber-400/40 rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
          <div className="text-center mb-8">
            <div className="relative w-48 h-12 mx-auto mb-4">
              <Image
                src="/images/logo.png"
                alt="Psychic Shankar"
                fill
                className="object-contain"
              />
            </div>
            <h1 className="text-2xl font-black text-white">Admin Control Panel</h1>
            <p className="text-xs text-slate-400 mt-1">
              Dynamic Pages CMS & SEO Management Suite
            </p>
          </div>

          {loginError && (
            <div className="mb-4 p-3 rounded-xl bg-red-950/80 border border-red-500/50 text-xs text-red-200 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Username
              </label>
              <input
                type="text"
                required
                value={loginUser}
                onChange={(e) => setLoginUser(e.target.value)}
                placeholder="admin"
                className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-700 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 rounded-xl text-sm text-white placeholder-slate-500 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={loginPass}
                onChange={(e) => setLoginPass(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-700 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 rounded-xl text-sm text-white placeholder-slate-500 outline-none transition"
              />
            </div>

            <div className="text-[11px] text-amber-300/80 bg-amber-400/10 p-2.5 rounded-lg border border-amber-400/20">
              Default demo credentials: <strong>admin</strong> / <strong>shankar2026!</strong>
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black rounded-xl text-sm hover:brightness-110 shadow-lg shadow-amber-500/20 transition disabled:opacity-50 cursor-pointer"
            >
              {loginLoading ? 'Signing in...' : 'Sign In to Dashboard'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/" className="text-xs text-slate-400 hover:text-amber-400 transition">
              ← Return to Live Website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // Render: Main Admin Dashboard
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Admin Top Navigation */}
      <header className="bg-slate-900 border-b border-purple-900/40 sticky top-0 z-40 px-4 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-3">
          <div className="flex items-center space-x-3">
            <div className="relative w-36 h-10">
              <Image
                src="/images/logo.png"
                alt="Psychic Shankar"
                fill
                className="object-contain object-left"
              />
            </div>
            <span className="hidden sm:inline-block px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-400 rounded-full border border-amber-400/30">
              Admin CMS & SEO Suite
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/"
              target="_blank"
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg flex items-center space-x-1.5 transition border border-slate-700"
            >
              <span>View Live Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <button
              onClick={handleLogout}
              className="px-3 py-1.5 bg-red-950/50 hover:bg-red-900 text-red-300 text-xs font-semibold rounded-lg flex items-center space-x-1.5 transition border border-red-800/40 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Admin Subheader with Tabs */}
      <div className="bg-slate-900/60 border-b border-slate-800 px-4 py-2">
        <div className="max-w-7xl mx-auto flex space-x-2 overflow-x-auto text-xs font-bold">
          <button
            onClick={() => setActiveTab('pages')}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition cursor-pointer ${
              activeTab === 'pages'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Dynamic Pages ({pages.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('inquiries')}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition cursor-pointer relative ${
              activeTab === 'inquiries'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Consultation Leads ({inquiries.length})</span>
            {inquiries.filter((i) => i.status === 'new').length > 0 && (
              <span className="w-2 h-2 rounded-full bg-red-500 absolute top-1.5 right-1.5" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('testimonials')}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition cursor-pointer ${
              activeTab === 'testimonials'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Star className="w-4 h-4" />
            <span>Testimonials ({testimonials.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Site & SEO Settings</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        {/* ======================================================== */}
        {/* TAB 1: DYNAMIC PAGES MANAGEMENT (Add, Edit, Delete)      */}
        {/* ======================================================== */}
        {activeTab === 'pages' && (
          <div className="space-y-6">
            {/* Header Action Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/80 p-4 rounded-2xl border border-purple-900/30">
              <div>
                <h2 className="text-xl font-black text-white flex items-center space-x-2">
                  <span>Dynamic Pages & SEO CMS</span>
                  <span className="text-xs text-amber-400 font-normal">({filteredPages.length} pages found)</span>
                </h2>
                <p className="text-xs text-slate-400">
                  Add, edit, or delete dynamic services, US state landing pages, and custom programmatic SEO URLs.
                </p>
              </div>

              <button
                onClick={handleOpenCreate}
                className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black rounded-xl text-xs flex items-center space-x-2 shadow-lg hover:brightness-110 transition cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Create New Page</span>
              </button>
            </div>

            {/* Filter & Search Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-8 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by page title or slug (e.g. ex love, new york, black magic)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 outline-none focus:border-amber-400 transition"
                />
              </div>

              <div className="sm:col-span-4">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs sm:text-sm text-white outline-none focus:border-amber-400 transition cursor-pointer"
                >
                  <option value="all">All Categories ({pages.length})</option>
                  <option value="service">Services ({pages.filter((p) => p.category === 'service').length})</option>
                  <option value="location">Locations ({pages.filter((p) => p.category === 'location').length})</option>
                  <option value="custom">Custom Pages ({pages.filter((p) => p.category === 'custom').length})</option>
                </select>
              </div>
            </div>

            {/* Pages Table */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-950/80 text-slate-400 uppercase text-[11px] font-bold border-b border-slate-800">
                    <tr>
                      <th className="py-3.5 px-4">Page Title</th>
                      <th className="py-3.5 px-4">Slug / URL</th>
                      <th className="py-3.5 px-4">Category</th>
                      <th className="py-3.5 px-4">SEO Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredPages.map((page) => (
                      <tr key={page.id} className="hover:bg-slate-800/40 transition group">
                        <td className="py-3.5 px-4 font-semibold text-white">
                          <div className="flex items-center space-x-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                            <span className="truncate max-w-[200px] sm:max-w-xs">{page.title}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-slate-400 font-mono text-xs">
                          <Link
                            href={`/${page.slug}`}
                            target="_blank"
                            className="hover:text-amber-400 flex items-center space-x-1"
                          >
                            <span>/{page.slug}</span>
                            <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-amber-400" />
                          </Link>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              page.category === 'service'
                                ? 'bg-purple-950 text-purple-300 border border-purple-800'
                                : page.category === 'location'
                                ? 'bg-blue-950 text-blue-300 border border-blue-800'
                                : 'bg-slate-800 text-slate-300'
                            }`}
                          >
                            {page.category}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center space-x-1.5">
                            <span className="text-emerald-400 text-xs font-bold">Indexed</span>
                            <span className="text-slate-500 text-[10px]">•</span>
                            <span className="text-slate-400 text-[11px] truncate max-w-[150px]">
                              {page.metaTitle ? `${page.metaTitle.slice(0, 30)}...` : 'Auto'}
                            </span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Link
                              href={`/${page.slug}`}
                              target="_blank"
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                              title="View Live"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </Link>

                            <button
                              onClick={() => handleOpenEdit(page)}
                              className="p-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500 text-amber-400 hover:text-slate-950 transition cursor-pointer"
                              title="Edit Page & SEO"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => handleDeletePage(page.id, page.title)}
                              className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-800 text-red-400 hover:text-white transition cursor-pointer"
                              title="Delete Page"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {filteredPages.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-slate-400">
                          No pages found matching your search.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: CONSULTATION INQUIRIES & LEADS                    */}
        {/* ======================================================== */}
        {activeTab === 'inquiries' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-slate-900/80 p-4 rounded-2xl border border-purple-900/30">
              <div>
                <h2 className="text-xl font-black text-white">Consultation Inquiries & Leads</h2>
                <p className="text-xs text-slate-400">
                  Real-time consultation requests submitted through the website forms.
                </p>
              </div>
              <button
                onClick={fetchAllData}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg flex items-center space-x-1.5 transition"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Refresh Leads</span>
              </button>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-950/80 text-slate-400 uppercase text-[11px] font-bold border-b border-slate-800">
                    <tr>
                      <th className="py-3.5 px-4">Date</th>
                      <th className="py-3.5 px-4">Client Name</th>
                      <th className="py-3.5 px-4">Phone / WhatsApp</th>
                      <th className="py-3.5 px-4">Service Requested</th>
                      <th className="py-3.5 px-4">Message</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {inquiries.map((inq) => (
                      <tr key={inq.id} className="hover:bg-slate-800/40 transition">
                        <td className="py-3.5 px-4 text-slate-400 text-xs whitespace-nowrap">
                          {new Date(inq.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-white">
                          <div>{inq.name}</div>
                          {inq.email && (
                            <a href={`mailto:${inq.email}`} className="text-xs text-slate-400 hover:text-amber-400 font-normal">
                              {inq.email}
                            </a>
                          )}
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <a
                            href={`tel:${inq.phone}`}
                            className="text-amber-400 hover:underline font-bold flex items-center space-x-1"
                          >
                            <Phone className="w-3 h-3" />
                            <span>{inq.phone}</span>
                          </a>
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-slate-300">
                          {inq.service}
                        </td>
                        <td className="py-3.5 px-4 text-xs text-slate-400 max-w-xs truncate">
                          {inq.message || 'No additional message.'}
                        </td>
                        <td className="py-3.5 px-4">
                          <select
                            value={inq.status}
                            onChange={(e) =>
                              handleUpdateInquiryStatus(inq.id, e.target.value as Inquiry['status'])
                            }
                            className={`px-2 py-1 rounded text-xs font-bold outline-none cursor-pointer ${
                              inq.status === 'new'
                                ? 'bg-red-950 text-red-300 border border-red-700'
                                : inq.status === 'contacted'
                                ? 'bg-amber-950 text-amber-300 border border-amber-700'
                                : 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                            }`}
                          >
                            <option value="new">New</option>
                            <option value="contacted">Contacted</option>
                            <option value="resolved">Resolved</option>
                          </select>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => handleDeleteInquiry(inq.id)}
                            className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-800 text-red-400 hover:text-white transition cursor-pointer"
                            title="Delete Lead"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}

                    {inquiries.length === 0 && (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-slate-400">
                          No leads or consultation inquiries received yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: TESTIMONIALS                                      */}
        {/* ======================================================== */}
        {activeTab === 'testimonials' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-slate-900/80 p-4 rounded-2xl border border-purple-900/30">
              <div>
                <h2 className="text-xl font-black text-white">Customer Testimonials</h2>
                <p className="text-xs text-slate-400">
                  Manage customer reviews shown on the website and schema review snippets.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {testimonials.map((t) => (
                <div
                  key={t.id}
                  className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-4"
                >
                  <div>
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-white text-base">{t.name}</h4>
                        <span className="text-xs text-amber-400 font-medium">{t.location}</span>
                      </div>
                      <div className="flex space-x-1">
                        {Array.from({ length: t.rating || 5 }).map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-300 mt-3 italic leading-relaxed">
                      &ldquo;{t.review}&rdquo;
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400">
                    <span>Featured on Home: Yes</span>
                    <button
                      onClick={async () => {
                        if (confirm('Delete review?')) {
                          await fetch(`/api/testimonials?id=${t.id}`, { method: 'DELETE' });
                          setTestimonials((prev) => prev.filter((item) => item.id !== t.id));
                        }
                      }}
                      className="text-red-400 hover:underline flex items-center space-x-1 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: GLOBAL SITE & SEO SETTINGS                        */}
        {/* ======================================================== */}
        {activeTab === 'settings' && settings && (
          <div className="max-w-4xl bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
            <div>
              <h2 className="text-xl font-black text-white">Site & SEO Configuration</h2>
              <p className="text-xs text-slate-400 mt-1">
                Update brand phone numbers, announcement marquee, social channels, and credentials.
              </p>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Site Name</label>
                  <input
                    type="text"
                    value={settings.siteName}
                    onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Tagline</label>
                  <input
                    type="text"
                    value={settings.tagline}
                    onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Phone (Dial Link)</label>
                  <input
                    type="text"
                    value={settings.phone}
                    onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Display Format</label>
                  <input
                    type="text"
                    value={settings.phoneDisplay}
                    onChange={(e) => setSettings({ ...settings, phoneDisplay: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">WhatsApp Number</label>
                  <input
                    type="text"
                    value={settings.whatsapp}
                    onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={settings.email}
                    onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Top Announcement Marquee</label>
                <input
                  type="text"
                  value={settings.headerAnnouncement}
                  onChange={(e) => setSettings({ ...settings, headerAnnouncement: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">YouTube Channel</label>
                  <input
                    type="text"
                    value={settings.youtubeUrl}
                    onChange={(e) => setSettings({ ...settings, youtubeUrl: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Facebook Page</label>
                  <input
                    type="text"
                    value={settings.facebookUrl}
                    onChange={(e) => setSettings({ ...settings, facebookUrl: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-bold rounded-xl text-sm hover:brightness-110 shadow transition cursor-pointer"
                >
                  Save Settings
                </button>
              </div>
            </form>
          </div>
        )}
      </main>

      {/* ======================================================== */}
      {/* MODAL: ADD / EDIT DYNAMIC PAGE & SEO STUDIO              */}
      {/* ======================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in">
          <div className="bg-slate-900 border border-amber-400/40 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-950/80">
              <div>
                <h3 className="text-lg sm:text-xl font-black text-white flex items-center space-x-2">
                  <span>{editingPageId ? 'Edit Dynamic Page' : 'Create New Dynamic Page'}</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Manage content, templates, URL slug, and SEO metadata with live SERP preview.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-white rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex border-b border-slate-800 bg-slate-950/40 px-5 text-xs font-bold">
              <button
                onClick={() => setModalTab('content')}
                className={`py-3 px-4 border-b-2 transition cursor-pointer ${
                  modalTab === 'content'
                    ? 'border-amber-400 text-amber-400'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                1. Content & Media
              </button>
              <button
                onClick={() => setModalTab('seo')}
                className={`py-3 px-4 border-b-2 transition cursor-pointer flex items-center space-x-1.5 ${
                  modalTab === 'seo'
                    ? 'border-amber-400 text-amber-400'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>2. SEO Centric Studio</span>
              </button>
            </div>

            {modalMessage && (
              <div
                className={`p-3 text-xs flex items-center space-x-2 ${
                  modalMessage.type === 'success'
                    ? 'bg-emerald-950/90 text-emerald-300 border-b border-emerald-800'
                    : 'bg-red-950/90 text-red-300 border-b border-red-800'
                }`}
              >
                {modalMessage.type === 'success' ? (
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                )}
                <span>{modalMessage.text}</span>
              </div>
            )}

            {/* Modal Body Form */}
            <form onSubmit={handleSavePage} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
              {modalTab === 'content' && (
                <div className="space-y-4">
                  {/* Quick Template buttons */}
                  {!editingPageId && (
                    <div className="p-3 bg-purple-950/50 border border-purple-800/60 rounded-xl flex flex-wrap items-center justify-between gap-2 text-xs">
                      <span className="text-purple-300 font-semibold">⚡ Quick Start Templates:</span>
                      <div className="flex space-x-2">
                        <button
                          type="button"
                          onClick={() => applyTemplate('service')}
                          className="px-3 py-1 bg-amber-500/20 hover:bg-amber-500 hover:text-slate-950 text-amber-300 rounded font-bold transition cursor-pointer"
                        >
                          + Astrological Service Template
                        </button>
                        <button
                          type="button"
                          onClick={() => applyTemplate('location')}
                          className="px-3 py-1 bg-blue-500/20 hover:bg-blue-500 hover:text-white text-blue-300 rounded font-bold transition cursor-pointer"
                        >
                          + US City / State Location Template
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Page Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.title || ''}
                        onChange={(e) => handleTitleChange(e.target.value)}
                        placeholder="e.g. Best Astrologer in Miami, Florida"
                        className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Slug / URL Path * (e.g. /astrologer-in-miami)
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.slug || ''}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        placeholder="astrologer-in-miami"
                        className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-amber-400 font-mono outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Category
                      </label>
                      <select
                        value={formData.category || 'custom'}
                        onChange={(e) =>
                          setFormData({ ...formData, category: e.target.value as DynamicPage['category'] })
                        }
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-white"
                      >
                        <option value="service">Astrology Service</option>
                        <option value="location">US / World Location</option>
                        <option value="custom">Custom Page</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Publication Status
                      </label>
                      <select
                        value={formData.status || 'published'}
                        onChange={(e) =>
                          setFormData({ ...formData, status: e.target.value as DynamicPage['status'] })
                        }
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-white"
                      >
                        <option value="published">Published (Live on Web & Sitemap)</option>
                        <option value="draft">Draft (Hidden)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Featured Image
                      </label>
                      <input
                        type="text"
                        value={formData.featuredImage || ''}
                        onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
                        placeholder="/images/our_service_img/v2/pro_im_1.png"
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Banner Title & Subtitle
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={formData.bannerTitle || ''}
                        onChange={(e) => setFormData({ ...formData, bannerTitle: e.target.value })}
                        placeholder="Banner Headline"
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
                      />
                      <input
                        type="text"
                        value={formData.bannerSubtitle || ''}
                        onChange={(e) => setFormData({ ...formData, bannerSubtitle: e.target.value })}
                        placeholder="Banner Subtitle"
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Short Excerpt / Teaser
                    </label>
                    <textarea
                      rows={2}
                      value={formData.shortExcerpt || ''}
                      onChange={(e) => setFormData({ ...formData, shortExcerpt: e.target.value })}
                      placeholder="Brief 1-2 sentence overview shown on service cards and search previews..."
                      className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Main Rich Content (HTML or Text)
                    </label>
                    <textarea
                      rows={8}
                      value={formData.content || ''}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      placeholder="Write your comprehensive page content here. You can use <h3>, <p>, <ul>, <li> HTML tags..."
                      className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs font-mono text-white resize-y leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      YouTube Video ID or Embed Link (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.videoUrl || ''}
                      onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                      placeholder="e.g. dQw4w9WgXcQ"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
                    />
                  </div>
                </div>
              )}

              {modalTab === 'seo' && (
                <div className="space-y-5">
                  {/* LIVE GOOGLE SERP PREVIEW */}
                  <div className="p-4 rounded-2xl bg-white text-slate-900 border border-slate-300 shadow-md">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                      ✦ Live Google Search Result Preview
                    </span>
                    <div className="space-y-1 font-sans">
                      <div className="text-xs text-slate-700 flex items-center space-x-1 truncate">
                        <span>https://www.psychicshankar.com</span>
                        <span>›</span>
                        <span className="text-slate-500">{formData.slug || 'page-slug'}</span>
                      </div>
                      <h4 className="text-lg font-medium text-[#1a0dab] hover:underline cursor-pointer truncate">
                        {formData.metaTitle || formData.title || 'Page Title | Psychic Shankar'}
                      </h4>
                      <p className="text-xs text-[#4d5156] line-clamp-2 leading-relaxed">
                        {formData.metaDescription ||
                          formData.shortExcerpt ||
                          'Indian Astrologer in USA. Experience real-time Love psychic readings, black magic removal, ex love back remedies, and relationship solutions live on phone.'}
                      </p>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-semibold text-slate-300">Meta Title *</label>
                      <span className={`text-[10px] font-mono ${
                        (formData.metaTitle?.length || 0) > 60 ? 'text-amber-400' : 'text-emerald-400'
                      }`}>
                        {formData.metaTitle?.length || 0} / 60 characters
                      </span>
                    </div>
                    <input
                      type="text"
                      value={formData.metaTitle || ''}
                      onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                      placeholder="e.g. Best Astrologer in New York, USA | Love Psychic Reader"
                      className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-white"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-semibold text-slate-300">Meta Description *</label>
                      <span className={`text-[10px] font-mono ${
                        (formData.metaDescription?.length || 0) > 160 ? 'text-amber-400' : 'text-emerald-400'
                      }`}>
                        {formData.metaDescription?.length || 0} / 160 characters
                      </span>
                    </div>
                    <textarea
                      rows={3}
                      value={formData.metaDescription || ''}
                      onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                      placeholder="Concise 150-160 character description summarizing the value and inviting clicks..."
                      className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Focus Keywords</label>
                    <input
                      type="text"
                      value={formData.metaKeywords || ''}
                      onChange={(e) => setFormData({ ...formData, metaKeywords: e.target.value })}
                      placeholder="astrologer in miami, love psychic, black magic removal"
                      className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Canonical URL</label>
                      <input
                        type="text"
                        value={formData.canonicalUrl || ''}
                        onChange={(e) => setFormData({ ...formData, canonicalUrl: e.target.value })}
                        placeholder="/astrologer-in-miami"
                        className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Schema.org Type</label>
                      <select
                        value={formData.schemaType || 'Service'}
                        onChange={(e) =>
                          setFormData({ ...formData, schemaType: e.target.value as DynamicPage['schemaType'] })
                        }
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
                      >
                        <option value="Service">Service Schema</option>
                        <option value="LocalBusiness">LocalBusiness Schema</option>
                        <option value="Article">Article Schema</option>
                        <option value="FAQPage">FAQPage Schema</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Modal Footer */}
              <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={modalLoading}
                  className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-bold rounded-xl text-xs hover:brightness-110 shadow-lg shadow-amber-500/20 transition cursor-pointer flex items-center space-x-1.5 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{modalLoading ? 'Saving...' : editingPageId ? 'Update Page & SEO' : 'Publish Page'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

