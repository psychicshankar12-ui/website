'use client';

import React, { useState } from 'react';
import { Send, Phone, MessageSquare, CheckCircle, AlertCircle } from 'lucide-react';
import type { SiteSettings, DynamicPage } from '@/lib/db';

interface ConsultationFormProps {
  settings: SiteSettings;
  services?: DynamicPage[];
  pageSource?: string;
  compact?: boolean;
}

export default function ConsultationForm({
  settings,
  services = [],
  pageSource = 'Website Homepage',
  compact = false,
}: ConsultationFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: services.length > 0 ? services[0].title : 'Love Problem Solution',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          pageSource,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to submit your consultation request.');
      }

      setSubmitted(true);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Something went wrong. Please call directly.');
      } else {
        setError('Something went wrong. Please call directly.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-gradient-to-br from-purple-950/90 to-slate-900/95 border-2 border-amber-400/50 rounded-2xl p-6 text-center text-white shadow-2xl backdrop-blur-md animate-in fade-in">
        <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
        <h4 className="text-xl font-bold text-amber-300 mb-2">Consultation Request Received!</h4>
        <p className="text-sm text-slate-300 mb-4">
          Thank you, <strong>{formData.name}</strong>. Psychic Arjun Krishna has received your details and will connect with you shortly for a confidential reading.
        </p>
        <div className="flex flex-col sm:flex-row gap-2 justify-center pt-2">
          <a
            href={`tel:${settings.phone}`}
            className="px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center space-x-1.5"
          >
            <Phone className="w-3.5 h-3.5 fill-slate-950" />
            <span>Call Now: {settings.phoneDisplay}</span>
          </a>
          <a
            href={`https://wa.me/${settings.whatsapp}?text=Hello%20Psychic%20Arjun%20Krishna,%20I%20just%20submitted%20a%20consultation%20form%20for%20${encodeURIComponent(
              formData.service
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-1.5"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Open in WhatsApp</span>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-gradient-to-br from-[#1b143c] via-[#151233] to-[#0d0f28] border border-amber-400/30 rounded-2xl shadow-2xl backdrop-blur-md ${
        compact ? 'p-5' : 'p-6 md:p-8'
      }`}
    >
      <div className="text-center mb-6">
        <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
          100% Confidential
        </span>
        <h3 className="text-2xl font-black text-white mt-2 mb-1">
          CONSULT NOW
        </h3>
        <p className="text-xs md:text-sm text-slate-300">
          Book Your Live Phone / Video Astrology Reading with Psychic Arjun Krishna
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-950/80 border border-red-500/50 rounded-lg text-xs text-red-200 flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Your Full Name *</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. John Doe"
            className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-slate-700 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 rounded-xl text-sm text-white placeholder-slate-500 outline-none transition"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number *</label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+1 (555) 000-0000"
              className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-slate-700 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 rounded-xl text-sm text-white placeholder-slate-500 outline-none transition"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address *</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="you@example.com"
              className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-slate-700 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 rounded-xl text-sm text-white placeholder-slate-500 outline-none transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Select Service *</label>
          <select
            value={formData.service}
            onChange={(e) => setFormData({ ...formData, service: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-slate-700 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 rounded-xl text-sm text-white outline-none transition cursor-pointer"
          >
            {services.length > 0 ? (
              services.map((s) => (
                <option key={s.id} value={s.title} className="bg-slate-900 text-white">
                  {s.title}
                </option>
              ))
            ) : (
              <>
                <option value="Get your Ex love Back" className="bg-slate-900 text-white">
                  Get your Ex love Back
                </option>
                <option value="Love Relationship Problem" className="bg-slate-900 text-white">
                  Love Relationship Problem
                </option>
                <option value="Black Magic Specialist" className="bg-slate-900 text-white">
                  Black Magic Specialist
                </option>
                <option value="Spiritual Healing" className="bg-slate-900 text-white">
                  Spiritual Healing
                </option>
                <option value="Psychic Reading" className="bg-slate-900 text-white">
                  Psychic Reading
                </option>
                <option value="Husband and Wife Dispute" className="bg-slate-900 text-white">
                  Husband and Wife Dispute
                </option>
                <option value="Negative Energy Removal" className="bg-slate-900 text-white">
                  Negative Energy Removal
                </option>
                <option value="Financial / Business Problem" className="bg-slate-900 text-white">
                  Financial / Business Problem
                </option>
              </>
            )}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Describe Your Situation</label>
          <textarea
            rows={compact ? 2 : 3}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            placeholder="Tell Psychic Arjun Krishna about your problem in detail..."
            className="w-full px-3.5 py-2 bg-slate-900/80 border border-slate-700 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 rounded-xl text-sm text-white placeholder-slate-500 outline-none transition resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:brightness-110 text-slate-950 font-black text-sm uppercase tracking-wider rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center space-x-2 transition cursor-pointer disabled:opacity-60"
        >
          {loading ? (
            <span className="animate-pulse">Submitting Request...</span>
          ) : (
            <>
              <Send className="w-4 h-4 fill-slate-950" />
              <span>BOOK CONFIDENTIAL READING</span>
            </>
          )}
        </button>

        <p className="text-[11px] text-center text-slate-400">
          ✦ Your privacy is 100% guaranteed. Information is never shared.
        </p>
      </form>
    </div>
  );
}

