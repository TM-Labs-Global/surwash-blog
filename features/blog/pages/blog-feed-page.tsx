import React, { Suspense } from 'react';
import { getPostsByState, getTickerPages } from '../lib/sanity';
import LatestNewsTicker from '../components/LatestNewsTicker';
import BlogFeedClient from './blog-feed-client';
import Header from '../components/Header';

export default async function BlogFeedPage() {
  // Fetch posts and ticker-enabled CMS pages in parallel
  const [posts, tickerPages] = await Promise.all([
    getPostsByState('all'),
    getTickerPages(),
  ]);

  return (
    <div className="min-h-screen bg-[var(--color-neutral-50)] flex flex-col font-sans">
      {/* Premium Header */}
      <Header activeLink="newsletter" />

      {/* Scrolling News Ticker Marquee */}
      <LatestNewsTicker posts={posts} tickerPages={tickerPages} />

      {/* Hero Section */}
      <section className="bg-white py-12 border-b border-[var(--color-neutral-100)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-primary-50)] text-surwash-blue text-[10px] font-bold uppercase font-accent tracking-wider mb-4">
              <span>National & Regional Updates</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-[#1A3A5C] tracking-tight font-display mb-3">
              Re-introducing SURWASH
            </h1>
            <p className="text-sm sm:text-base text-surwash-grey leading-relaxed">
              Real-time updates, field assessments, and strategic briefings from the Sustainable Urban and Rural Water Supply, Sanitation and Hygiene (SURWASH) program across Nigeria.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Client Blog Area */}
      <Suspense fallback={<div className="min-h-[400px] flex items-center justify-center text-xs text-surwash-grey">Loading newsletter feed...</div>}>
        <BlogFeedClient initialPosts={posts} />
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
            <span>Federal Ministry of Water Resources, Nigeria</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
