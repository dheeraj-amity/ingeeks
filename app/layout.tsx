import './globals.css';
import type { Metadata } from 'next';
import { ReactNode } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { SpeedInsights } from '@vercel/speed-insights/next';

export const metadata: Metadata = {
  title: 'InGeeks Technologies | Innovating Ideas, Building Futures',
  description: 'Premium AI, Web & Mobile solutions.',
  openGraph: {
    title: 'InGeeks Technologies',
    description: 'Premium AI, Web & Mobile solutions.',
    images: [{ url: '/og?title=InGeeks%20Technologies', width:1200, height:630, alt:'InGeeks Technologies'}]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'InGeeks Technologies',
    description: 'Premium AI, Web & Mobile solutions.',
    images: ['/og?title=InGeeks%20Technologies']
  }
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="font-body bg-gradient-to-br from-[#0d1422] via-[#0f1828] to-[#09121c] text-slate-200 antialiased selection:bg-brand-accent/30">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:rounded-lg focus:bg-brand-accent focus:px-4 focus:py-2 focus:text-xs focus:font-semibold focus:text-[#0d1422] shadow-lg">Skip to content</a>
        <Header />
        <div className="pt-16 min-h-screen flex flex-col">
          <div id="main" className="flex-1 outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/60">
            {children}
          </div>
          <Footer />
        </div>
        <SpeedInsights />
      </body>
    </html>
  );
}
