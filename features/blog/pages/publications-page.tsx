import React, { Suspense } from 'react';
import { getPostsByState } from '../lib/sanity';
import PublicationsClient from './publications-client';
import Header from '../components/Header';

export default async function PublicationsPage() {
  // Fetch all posts initially on the server for full SEO indexability
  const posts = await getPostsByState('all');

  return (
    <div className="min-h-screen bg-[var(--color-neutral-50)] flex flex-col font-sans">
      {/* Premium Header */}
      <Header activeLink="publications" />

      {/* Hero Section */}
      <section className="bg-white py-12 border-b border-[var(--color-neutral-100)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-secondary-50)] text-surwash-navy text-[10px] font-bold uppercase font-accent tracking-wider mb-4">
              <span>Publications Directory</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-[#1A3A5C] tracking-tight font-display mb-3">
              Strategic Briefs & Official Publications
            </h1>
            <p className="text-sm sm:text-base text-surwash-grey leading-relaxed">
              Official publications registry database for the Sustainable Urban and Rural Water Supply, Sanitation and Hygiene (SURWASH) program. Access policies, environmental rules, and assessments.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Client Filter Registry */}
      <Suspense fallback={<div className="min-h-[400px] flex items-center justify-center text-xs text-surwash-grey">Loading publications...</div>}>
        <PublicationsClient posts={posts} />
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
              <a href="/" className="hover:underline">Blog</a>
              <a href="/publications" className="hover:underline">Publications</a>
              <a href="/design-system" className="hover:underline">Design System</a>
              <a href="/docs" className="hover:underline">Documentation</a>
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
