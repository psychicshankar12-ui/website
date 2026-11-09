import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  themeColor: '#0c0e2a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: 'Best Indian Astrologer in USA | Love Psychic Reader | Psychic Shankar',
  description:
    'Indian Astrologer in USA. Experience real-time Love psychic readings, black magic removal, ex love back, and authentic psychic readings live on phone and video.',
  keywords: 'Indian Astrologer, Psychic Shankar, Love Psychic Reader, USA Astrologer, Black Magic Specialist',
  metadataBase: new URL('https://www.psychicshankar.com'),
  icons: {
    icon: '/images/logo-20261109.webp',
    apple: '/images/logo-20261109.webp',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen bg-[#0c0e2a] text-slate-100 antialiased selection:bg-amber-400 selection:text-slate-950">
        {children}
      </body>
    </html>
  );
}
