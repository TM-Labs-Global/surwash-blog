'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { NewsletterEdition, Post } from '../lib/sanity';
import EditionBlock from '../components/EditionBlock';
import BlogCard from '../components/BlogCard';

interface NewsletterFeedClientProps {
  editions: NewsletterEdition[];
  fallbackPosts: Post[];
}

const FILTER_OPTIONS = [
  { label: 'All Regions',        value: 'all'      },
  { label: 'By Edition',         value: 'edition'  },
  { label: 'Federal / National', value: 'federal'  },
  { label: 'Abuja (FCT)',        value: 'abuja'    },
  { label: 'Lagos State',        value: 'lagos'    },
  { label: 'Kano State',         value: 'kano'     },
];

export default function NewsletterFeedClient({ editions, fallbackPosts }: NewsletterFeedClientProps) {
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const hasEditions = editions && editions.length > 0;
  const totalArticles = editions.reduce((sum, e) => sum + (e.posts?.length || 0), 0);

  // Collect all posts from all editions for state-filtered views
  const allPosts: Post[] = editions.flatMap((e) => e.posts || []);

  // Posts to show when filtering by state
  const filteredPosts =
    activeFilter === 'all' || activeFilter === 'edition'
      ? allPosts
      : allPosts.filter((p) => p.stateScope === activeFilter);

  if (!hasEditions) {
    return (
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-black text-[#1A3A5C] font-display tracking-tight">
            Latest Articles
          </h2>
          <p className="text-xs sm:text-sm text-[var(--color-surwash-grey)] mt-1 font-sans">
            Newsletter articles and programme updates.
          </p>
        </div>
        {fallbackPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fallbackPosts.map((post) => (
              <BlogCard key={post._id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white border border-[var(--color-neutral-200)] rounded-2xl">
            <span className="material-symbols-outlined text-5xl text-[var(--color-neutral-300)] mb-3 block">feed</span>
            <h3 className="text-base font-bold text-[#1A3A5C] mb-1 font-display">No Articles Yet</h3>
            <p className="text-xs text-[var(--color-surwash-grey)] max-w-xs mx-auto px-4">
              Newsletter articles will appear here once published in Sanity Studio.
            </p>
          </div>
        )}
      </main>
    );
  }

  return (
    <main className="flex-grow w-full">

      {/* ── Archive stat bar ── */}
      <div className="bg-white border-b border-[var(--color-neutral-200)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Rainbow stripe accent */}
            <div className="flex gap-0.5 h-4 items-center">
              <span className="w-1 h-full rounded-full bg-[#1B9FD4]" />
              <span className="w-1 h-3 rounded-full bg-[#E8762B]" />
              <span className="w-1 h-2 rounded-full bg-[#2E8B4A]" />
            </div>
            <span className="text-xs text-[var(--color-surwash-grey)] font-sans">
              <strong className="text-[#1A3A5C] font-bold">{editions.length}</strong>{' '}
              edition{editions.length !== 1 ? 's' : ''}{' '}
              <span className="text-[var(--color-neutral-300)] mx-1">·</span>{' '}
              <strong className="text-[#1A3A5C] font-bold">{totalArticles}</strong>{' '}
              articles published
            </span>
          </div>
          <span className="text-[10px] uppercase tracking-widest text-[var(--color-neutral-400)] font-bold font-accent hidden sm:block">
            Newest first
          </span>
        </div>
      </div>

      {/* ── Filter bar ── */}
      <div className="bg-white border-b border-[var(--color-neutral-200)] sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="flex items-center gap-2 py-3 overflow-x-auto no-scrollbar scroll-smooth"
            role="group"
            aria-label="Filter newsletter content"
          >
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-surwash-grey)] mr-2 whitespace-nowrap font-sans flex items-center gap-1.5 flex-shrink-0">
              <span className="material-symbols-outlined text-sm">filter_alt</span>
              Filter by:
            </span>
            {FILTER_OPTIONS.map((opt) => {
              const isActive = activeFilter === opt.value;
              const isEdition = opt.value === 'edition';
              return (
                <button
                  key={opt.value}
                  onClick={() => setActiveFilter(opt.value)}
                  aria-pressed={isActive}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold font-accent transition-all duration-200 whitespace-nowrap cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#1B9FD4] flex-shrink-0 ${
                    isActive
                      ? isEdition
                        ? 'bg-[#E8762B] text-white shadow-sm ring-2 ring-[#E8762B]/30'
                        : 'bg-[#1A3A5C] text-white shadow-sm ring-2 ring-[#1A3A5C]/20'
                      : 'bg-[var(--color-neutral-100)] text-[var(--color-neutral-600)] hover:bg-[var(--color-neutral-200)] hover:text-[#1A3A5C]'
                  }`}
                >
                  {isEdition && (
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-70 align-middle" />
                  )}
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Edition view: group by edition */}
        {(activeFilter === 'all' || activeFilter === 'edition') && (
          <div className="flex flex-col gap-12">
            {editions.map((edition) => (
              <EditionBlock key={edition._id} edition={edition} />
            ))}
          </div>
        )}

        {/* State-filtered view: flat card grid */}
        {activeFilter !== 'all' && activeFilter !== 'edition' && (
          <div>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-[#1A3A5C] font-display tracking-tight">
                  {FILTER_OPTIONS.find(f => f.value === activeFilter)?.label}
                </h2>
                <p className="text-xs text-[var(--color-surwash-grey)] mt-0.5 font-sans">
                  {filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''} in this region
                </p>
              </div>
              <button
                onClick={() => setActiveFilter('all')}
                className="text-xs text-[var(--color-neutral-500)] hover:text-[#1A3A5C] transition-colors font-sans flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">close</span>
                Clear filter
              </button>
            </div>

            {filteredPosts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredPosts.map((post) => (
                  <BlogCard key={post._id} post={post} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white border border-dashed border-[var(--color-neutral-200)] rounded-2xl">
                <span className="material-symbols-outlined text-4xl text-[var(--color-neutral-300)] mb-3 block">search_off</span>
                <h3 className="text-sm font-bold text-[#1A3A5C] mb-1 font-display">No articles for this region</h3>
                <p className="text-xs text-[var(--color-surwash-grey)] max-w-xs mx-auto">
                  No published articles match this regional scope yet.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
