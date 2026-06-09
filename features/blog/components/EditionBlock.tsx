import React from 'react';
import Link from 'next/link';
import { NewsletterEdition, Post } from '../lib/sanity';
import BlogCard from './BlogCard';

interface EditionBlockProps {
  edition: NewsletterEdition;
}

export default function EditionBlock({ edition }: EditionBlockProps) {
  const formattedDate = edition.publishedAt
    ? new Date(edition.publishedAt).toLocaleDateString('en-NG', {
        month: 'long',
        year: 'numeric',
      })
    : null;

  const articleCount = edition.posts?.length || 0;

  return (
    <section aria-label={`Newsletter Edition: ${edition.title}`}>

      {/* ── Edition header ── */}
      <div className="mb-5 pb-4 border-b border-[var(--color-neutral-200)]">

        {/* Top row: badge + desktop CTA */}
        <div className="flex items-start justify-between gap-3 mb-3">
          {/* Compact badge — Edition number + date only */}
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#1A3A5C] text-white text-[9px] font-bold uppercase tracking-widest font-accent whitespace-nowrap">
            <span className="w-1 h-1 rounded-full bg-[#E8762B] animate-pulse flex-shrink-0" />
            Edition {edition.editionNumber}{formattedDate ? ` · ${formattedDate}` : ''}
          </span>

          {/* CTA — visible on desktop only here */}
          <Link
            href={`/newsletter/editions/${edition.slug.current}`}
            className="hidden sm:inline-flex flex-shrink-0 items-center gap-1.5 px-4 py-2 rounded-full border border-[#1A3A5C] text-[#1A3A5C] text-xs font-bold hover:bg-[#1A3A5C] hover:text-white transition-all duration-200 group font-accent tracking-wide"
          >
            <span>View Full Edition</span>
            <span className="material-symbols-outlined text-sm transition-transform duration-200 group-hover:translate-x-0.5">arrow_forward</span>
          </Link>
        </div>

        {/* Theme heading */}
        <h2
          style={{ color: '#1A3A5C' }}
          className="text-xl sm:text-2xl font-black font-display tracking-tight leading-snug mb-2"
        >
          {edition.theme}
        </h2>

        {/* Description */}
        {edition.themeDescription && (
          <p className="text-xs text-[var(--color-surwash-grey)] font-sans max-w-xl mb-4 sm:mb-0">
            {edition.themeDescription}
          </p>
        )}

        {/* CTA — mobile only, full width below description */}
        <Link
          href={`/newsletter/editions/${edition.slug.current}`}
          className="sm:hidden mt-3 w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#1A3A5C] text-[#1A3A5C] text-xs font-bold hover:bg-[#1A3A5C] hover:text-white transition-all duration-200 group font-accent tracking-wide"
        >
          <span>View Full Edition</span>
          <span className="material-symbols-outlined text-sm transition-transform duration-200 group-hover:translate-x-0.5">arrow_forward</span>
        </Link>
      </div>

      {/* ── Horizontal card row ── */}
      {articleCount > 0 ? (
        <div className="flex gap-5 overflow-x-auto pb-2 scroll-smooth snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none' }}
        >
          {edition.posts.map((post: Post) => (
            <div
              key={post._id}
              className="flex-shrink-0 w-[280px] sm:w-[300px] snap-start"
            >
              <BlogCard post={post} />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center h-32 bg-[var(--color-neutral-50)] rounded-xl border border-dashed border-[var(--color-neutral-200)] text-[var(--color-neutral-400)]">
          <span className="text-xs font-sans">Articles coming soon</span>
        </div>
      )}
    </section>
  );
}
