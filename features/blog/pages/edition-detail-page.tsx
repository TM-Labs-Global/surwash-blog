import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { NewsletterEdition, Post } from '../lib/sanity';
import Header from '../components/Header';
import BlogCard from '../components/BlogCard';

interface EditionDetailPageProps {
  edition: NewsletterEdition;
}

export default function EditionDetailPage({ edition }: EditionDetailPageProps) {
  const formattedDate = edition.publishedAt
    ? new Date(edition.publishedAt).toLocaleDateString('en-NG', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null;

  const articleCount = edition.posts?.length || 0;

  return (
    <div className="min-h-screen bg-[var(--color-neutral-50)] flex flex-col font-sans">
      <Header activeLink="newsletter" />

      {/* ── Edition Hero (Clean Light/White Design) ── */}
      <section className="relative overflow-hidden bg-white border-b border-[var(--color-neutral-200)]">
        {/* Radial glows */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(ellipse at 5% 80%, rgba(27,159,212,0.06) 0%, transparent 55%), radial-gradient(ellipse at 90% 10%, rgba(232,118,43,0.04) 0%, transparent 50%)',
          }}
        />
        {/* Bottom rainbow stripe */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#1B9FD4] via-[#E8762B] to-[#2E8B4A]" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-[10px] text-[var(--color-neutral-400)] font-sans uppercase tracking-widest mb-8">
            <Link href="/" className="hover:text-[#1B9FD4] transition-colors">Newsletter</Link>
            <span className="text-[var(--color-neutral-300)]">/</span>
            <span className="text-[var(--color-neutral-600)]">{edition.title}</span>
          </div>

          <div className="flex flex-col lg:flex-row gap-10 items-start">
            {/* Cover image */}
            {edition.coverImage?.asset?.url && (
              <div className="w-full lg:w-56 flex-shrink-0 rounded-2xl overflow-hidden border border-[var(--color-neutral-200)] shadow-xl ring-1 ring-[var(--color-neutral-100)] bg-[var(--color-neutral-50)]">
                <Image
                  src={edition.coverImage.asset.url}
                  alt={edition.coverImage.alt || edition.title}
                  width={560}
                  height={700}
                  className="w-full h-auto object-cover"
                  priority
                />
              </div>
            )}

            {/* Meta */}
            <div className="flex-1">
              {/* Edition badge */}
              <div className="flex items-center gap-3 mb-5 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[var(--color-neutral-200)] text-[var(--color-neutral-600)] text-[10px] font-bold uppercase tracking-widest font-accent">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E8762B] animate-pulse" />
                  Edition {edition.editionNumber}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-4xl sm:text-5xl font-black text-[#1A3A5C] font-display tracking-tight leading-tight mb-6">
                {edition.theme}
              </h1>

              {edition.themeDescription && (
                <p className="text-sm text-[var(--color-surwash-grey)] leading-relaxed max-w-xl font-sans mt-4">
                  {edition.themeDescription}
                </p>
              )}

              {/* Stat */}
              <div className="flex items-center gap-2 mt-6 text-xs text-[var(--color-neutral-500)] font-sans">
                <span className="material-symbols-outlined text-sm text-[#1B9FD4]">article</span>
                <span>
                  <strong className="text-[#1A3A5C] font-bold">{articleCount}</strong>{' '}
                  article{articleCount !== 1 ? 's' : ''} in this edition
                </span>
              </div>

              {/* Stripe */}
              <div className="flex gap-1 mt-8">
                <span className="h-0.5 w-16 rounded-full bg-[#1B9FD4]" />
                <span className="h-0.5 w-8 rounded-full bg-[#E8762B]" />
                <span className="h-0.5 w-4 rounded-full bg-[#2E8B4A]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Table of Contents (Desktop 4 Cards Grid) ── */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Section header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl font-black text-[#1A3A5C] font-display tracking-tight">
              Articles in This Edition
            </h2>
            <p className="text-xs text-[var(--color-surwash-grey)] mt-0.5 font-sans">
              Read each article in sequence for the full picture.
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-xs font-bold text-[var(--color-neutral-500)] hover:text-[#1B9FD4] transition-colors duration-200"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            <span className="hidden sm:inline">All Editions</span>
          </Link>
        </div>

        {articleCount > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {edition.posts.map((post: Post) => (
              <BlogCard key={post._id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white border border-[var(--color-neutral-200)] rounded-2xl">
            <span className="material-symbols-outlined text-5xl text-[var(--color-neutral-300)] mb-3 block">article</span>
            <h3 className="text-base font-bold text-[#1A3A5C] mb-1 font-display">Articles Coming Soon</h3>
            <p className="text-xs text-[var(--color-surwash-grey)] max-w-xs mx-auto">
              Articles for this edition are currently being prepared.
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#1A3A5C] text-white mt-auto py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-b border-white/10 pb-8">
            <img src="/brand/logo/SVG/SURWASH Logo.svg" alt="SURWASH Logo" className="h-10 w-auto brightness-0 invert" />
            <div className="flex gap-6 text-sm text-white/50">
              <a href="/" className="hover:text-white transition-colors">Newsletter</a>
              <a href="/publications" className="hover:text-white transition-colors">Publications</a>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 text-xs text-white/30">
            <span>© {new Date().getFullYear()} SURWASH Programme. All rights reserved.</span>
            <span>Federal Ministry of Water Resources and Sanitation, Nigeria</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
