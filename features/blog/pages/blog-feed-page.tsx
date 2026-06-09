import React, { Suspense } from 'react';
import { getEditionsWithPosts, getPostsByState, getTickerPages } from '../lib/sanity';
import LatestNewsTicker from '../components/LatestNewsTicker';
import NewsletterFeedClient from './newsletter-feed-client';
import Header from '../components/Header';

export default async function BlogFeedPage() {
  // Fetch editions (primary), fallback posts, and ticker pages in parallel
  const [editions, fallbackPosts, tickerPages] = await Promise.all([
    getEditionsWithPosts(),
    getPostsByState('all'),
    getTickerPages(),
  ]);

  return (
    <div className="min-h-screen bg-[var(--color-neutral-50)] flex flex-col font-sans">
      {/* Premium Header */}
      <Header activeLink="newsletter" />

      {/* Scrolling News Ticker Marquee */}
      <LatestNewsTicker posts={fallbackPosts} tickerPages={tickerPages} />

      {/* Hero Section — premium gradient masthead */}
      <section className="relative overflow-hidden bg-[#1A3A5C]">
        {/* Radial glow background */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(ellipse at 5% 80%, rgba(27,159,212,0.25) 0%, transparent 55%), radial-gradient(ellipse at 90% 10%, rgba(232,118,43,0.15) 0%, transparent 50%)',
          }}
        />
        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#1A3A5C] to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <div className="max-w-2xl">
            {/* Label pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#1B9FD4]/40 bg-[#1B9FD4]/10 text-[#1B9FD4] text-[10px] font-bold uppercase font-accent tracking-widest mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1B9FD4] animate-pulse" />
              <span>Official Newsletter Archive</span>
            </div>

            <h1 style={{ color: '#ffffff' }} className="text-4xl sm:text-6xl font-black tracking-tight font-display leading-none mb-5">
              SURWASH<br />
              <span>Newsletter</span>
            </h1>

            <p style={{ color: '#ffffff' }} className="text-sm sm:text-base leading-relaxed max-w-xl font-sans">
              The official bi-monthly newsletter of the Sustainable Urban and Rural Water Supply, Sanitation and Hygiene (SURWASH) Programme — programme milestones, state spotlights, and community voices.
            </p>

            {/* Divider stripe */}
            <div className="flex gap-1 mt-8">
              <span className="h-0.5 w-16 rounded-full bg-[#1B9FD4]" />
              <span className="h-0.5 w-8 rounded-full bg-[#E8762B]" />
              <span className="h-0.5 w-4 rounded-full bg-[#2E8B4A]" />
            </div>
          </div>
        </div>
      </section>

      {/* Edition-grouped Newsletter Feed */}
      <Suspense fallback={
        <div className="min-h-[400px] flex items-center justify-center text-xs text-surwash-grey">
          Loading newsletter editions...
        </div>
      }>
        <NewsletterFeedClient editions={editions} fallbackPosts={fallbackPosts} />
      </Suspense>

      {/* Footer */}
      <footer className="bg-surwash-navy text-white mt-auto py-12 border-t border-[var(--color-secondary-600)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-b border-[var(--color-secondary-400)] pb-8">
            <div className="flex items-center gap-3">
              <img
                src="/brand/logo/SVG/SURWASH Logo.svg"
                alt="SURWASH Logo"
                className="h-10 w-auto brightness-0 invert"
              />
            </div>
            <div className="flex gap-6 text-sm text-[var(--color-secondary-100)]">
              <a href="/" className="hover:underline">Newsletter</a>
              <a href="/publications" className="hover:underline">Publications</a>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 text-xs text-[var(--color-secondary-200)]">
            <span>© {new Date().getFullYear()} Sustainable Urban and Rural Water Supply, Sanitation and Hygiene (SURWASH) Program. All rights reserved.</span>
            <span>Federal Ministry of Water Resources and Sanitation, Nigeria</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
