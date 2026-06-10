import React from 'react';
import Link from 'next/link';
import { Post } from '../lib/sanity';

// Shared label/color maps used across cards
export const CATEGORY_LABELS: Record<string, string> = {
  programme_overview: 'Programme Overview',
  leadership_message: 'Leadership',
  state_spotlight: 'State Spotlight',
  community: 'Community',
  forward_look: 'Forward Look',
  press_release: 'Press Release',
  news_update: 'News Update',
  field_report: 'Field Report',
  policy_brief: 'Policy Brief',
};

export const STATE_LABELS: Record<string, string> = {
  federal: 'Federal',
  abuja: 'FCT',
  plateau: 'Plateau',
  katsina: 'Katsina',
  gombe: 'Gombe',
  kaduna: 'Kaduna',
  ekiti: 'Ekiti',
  imo: 'Imo',
  delta: 'Delta',
  abia: 'Abia',
  bauchi: 'Bauchi',
  benue: 'Benue',
  taraba: 'Taraba',
  ogun: 'Ogun',
  jigawa: 'Jigawa',
};

// Category accent colours (used as top border + gradient)
const CATEGORY_ACCENTS: Record<string, { border: string; bg: string; text: string; gradient: string }> = {
  programme_overview: {
    border: 'border-[#1B9FD4]',
    bg: 'bg-[#1B9FD4]',
    text: 'text-white',
    gradient: 'from-[#0c4a6e] to-[#1B9FD4]',
  },
  leadership_message: {
    border: 'border-[#1A3A5C]',
    bg: 'bg-[#1A3A5C]',
    text: 'text-white',
    gradient: 'from-[#060d14] to-[#1A3A5C]',
  },
  state_spotlight: {
    border: 'border-[#E8762B]',
    bg: 'bg-[#E8762B]',
    text: 'text-white',
    gradient: 'from-[#7c3300] to-[#E8762B]',
  },
  community: {
    border: 'border-[#2E8B4A]',
    bg: 'bg-[#2E8B4A]',
    text: 'text-white',
    gradient: 'from-[#14532d] to-[#2E8B4A]',
  },
  forward_look: {
    border: 'border-[#1B9FD4]',
    bg: 'bg-[#1B9FD4]',
    text: 'text-white',
    gradient: 'from-[#082f49] to-[#1B9FD4]',
  },
  press_release: {
    border: 'border-[#E8762B]',
    bg: 'bg-[#E8762B]',
    text: 'text-white',
    gradient: 'from-[#7c3300] to-[#E8762B]',
  },
  news_update: {
    border: 'border-[#1B9FD4]',
    bg: 'bg-[#1B9FD4]',
    text: 'text-white',
    gradient: 'from-[#0c4a6e] to-[#1B9FD4]',
  },
  field_report: {
    border: 'border-[#2E8B4A]',
    bg: 'bg-[#2E8B4A]',
    text: 'text-white',
    gradient: 'from-[#14532d] to-[#2E8B4A]',
  },
  policy_brief: {
    border: 'border-[#1A3A5C]',
    bg: 'bg-[#1A3A5C]',
    text: 'text-white',
    gradient: 'from-[#060d14] to-[#1A3A5C]',
  },
};

const DEFAULT_ACCENT = {
  border: 'border-[#1B9FD4]',
  bg: 'bg-[#1B9FD4]',
  text: 'text-white',
  gradient: 'from-[#0c4a6e] to-[#1B9FD4]',
};

export default function BlogCard({ post }: { post: Post }) {
  const accent = CATEGORY_ACCENTS[post.postType] || DEFAULT_ACCENT;
  const categoryLabel = CATEGORY_LABELS[post.postType] || post.postType;
  const stateLabel = STATE_LABELS[post.stateScope] || post.stateScope;

  const formattedDate = new Date(post.publishedAt || post._createdAt).toLocaleDateString('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  // Default banner images from local blog-banners assets based on category
  const defaultImage = {
    programme_overview: '/blog-banners/surwash.webp',
    leadership_message: '/blog-banners/IMG_2873.jpg',
    state_spotlight: '/blog-banners/IMG_2832.jpg',
    community: '/blog-banners/IMG_2829.jpg',
    forward_look: '/blog-banners/IMG_2875.jpg',
    press_release: '/blog-banners/surwash.webp',
    news_update: '/blog-banners/IMG_2832.jpg',
    field_report: '/blog-banners/IMG_2829.jpg',
    policy_brief: '/blog-banners/IMG_2875.jpg',
  }[post.postType] || '/blog-banners/surwash.webp';

  const imageUrl = post.imageUrl || defaultImage;

  return (
    <article className={`group relative flex flex-col bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-[var(--color-neutral-200)] hover:border-[var(--color-primary-200)] hover:-translate-y-1`}>
      
      {/* Top accent line */}
      <div className={`h-1 w-full ${accent.bg}`} />

      {/* Image area */}
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: '4/3' }}>
        <img
          src={imageUrl}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {/* Subtle overlay overlay for readability of badges */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-60 pointer-events-none" />

        {/* Category badge overlay */}
        <div className="absolute top-3 left-3 z-10">
          <span className={`text-[9px] font-bold font-accent tracking-wider uppercase px-2 py-1 rounded shadow-md ${accent.bg} ${accent.text}`}>
            {categoryLabel}
          </span>
        </div>
      </div>

      {/* Card body */}
      <div className="flex flex-col flex-1 p-5">
        {/* State + date row */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-[9px] font-bold uppercase tracking-wider text-[var(--color-neutral-400)] font-accent border border-[var(--color-neutral-200)] px-2 py-0.5 rounded">
            {stateLabel}
          </span>
          <span className="text-[10px] text-[var(--color-neutral-400)] font-sans">
            {formattedDate}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-[#1A3A5C] line-clamp-2 mb-2 font-display leading-snug group-hover:text-[#1B9FD4] transition-colors duration-200">
          {post.title}
        </h3>

        {/* Excerpt */}
        <p className="text-sm text-[var(--color-surwash-grey)] line-clamp-3 mb-4 font-sans leading-relaxed flex-1">
          {post.metaDescription}
        </p>

        {/* CTA */}
        <div className="pt-3 border-t border-[var(--color-neutral-100)]">
          <Link
            href={`/newsletter/${post.slug?.current}`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1B9FD4] hover:text-[#1A3A5C] transition-colors duration-200 group/link outline-none after:absolute after:inset-0 after:content-['']"
          >
            <span>Read Article</span>
            <span className="material-symbols-outlined text-sm transition-transform duration-200 group-hover/link:translate-x-1">
              arrow_forward
            </span>
          </Link>
        </div>
      </div>
    </article>
  );
}
