import React from 'react';
import { Post } from '../lib/sanity';

export default function BlogCard({ post }: { post: Post }) {
  const formattedDate = new Date(post._createdAt).toLocaleDateString('en-NG', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const stateLabels: Record<string, string> = {
    federal: 'Federal',
    abuja: 'Abuja (FCT)',
    lagos: 'Lagos',
    kano: 'Kano',
  };

  const stateColors: Record<string, string> = {
    federal: 'bg-surwash-blue text-white',
    abuja: 'bg-surwash-navy text-white',
    lagos: 'bg-surwash-grey text-white',
    kano: 'bg-[var(--color-neutral-600)] text-white',
  };

  const typeLabels: Record<string, string> = {
    press_release: 'Press Release',
    news_update: 'News Update',
    field_report: 'Field Report',
    policy_brief: 'Policy Brief',
  };

  const typeColors: Record<string, string> = {
    press_release: 'bg-surwash-orange text-white',
    news_update: 'bg-surwash-blue text-white',
    field_report: 'bg-surwash-green text-white',
    policy_brief: 'bg-surwash-navy text-white',
  };

  return (
    <article className="group relative flex flex-col bg-white border border-[var(--color-neutral-200)] rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-surwash-blue">
      {/* 4/5 Aspect Ratio Brand Canvas */}
      <div className="aspect-[4/5] relative w-full overflow-hidden flex flex-col bg-[var(--color-neutral-50)]">
        {/* Top 4/5 (80% height) - Image Area */}
        <div className="h-[80%] w-full relative overflow-hidden">
          {post.imageUrl ? (
            <img
              src={post.imageUrl}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-[var(--color-neutral-100)] text-[var(--color-neutral-400)]">
              <span className="material-symbols-outlined text-4xl">image</span>
            </div>
          )}
          {/* Badge Overlay (State + Category) */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-1.5 z-10">
            <span className={`text-[9px] font-semibold font-accent tracking-wider uppercase px-2 py-0.5 rounded shadow-sm ${stateColors[post.stateScope] || 'bg-gray-500 text-white'}`}>
              {stateLabels[post.stateScope] || post.stateScope}
            </span>
            <span className={`text-[9px] font-semibold font-accent tracking-wider uppercase px-2 py-0.5 rounded shadow-sm ${typeColors[post.postType] || 'bg-gray-500 text-white'}`}>
              {typeLabels[post.postType] || post.postType}
            </span>
          </div>
        </div>

        {/* Bottom 1/5 (20% height) - Logo and Branding Bar */}
        <div className="h-[20%] w-full bg-white border-t border-[var(--color-neutral-100)] flex items-center justify-between px-4 py-2">
          {/* SURWASH Spread Signature Logo */}
          <div className="h-6 w-auto relative flex items-center">
            <img
              src="/brand/logo/SVG/SURWASH Logo.svg"
              alt="SURWASH Program"
              className="h-full object-contain"
            />
          </div>
          {/* Nigerian Coat of Arms Space / Subtext */}
          <div className="text-right flex flex-col justify-center">
            <span className="text-[9px] uppercase font-bold tracking-wider text-[var(--color-neutral-400)] font-sans">
              WASH Intervention
            </span>
            <span className="text-[8px] text-[var(--color-neutral-500)] font-sans">
              Federal Republic of Nigeria
            </span>
          </div>
        </div>
      </div>

      {/* Card Body - Content Area */}
      <div className="flex flex-col flex-1 p-5 bg-white">
        <span className="text-xs text-[var(--color-neutral-400)] font-medium mb-2 font-sans">
          {formattedDate}
        </span>
        <h3 className="text-lg sm:text-xl font-extrabold text-[#1A3A5C] line-clamp-2 mb-2 font-display leading-snug group-hover:text-surwash-blue transition-colors duration-200">
          {post.title}
        </h3>
        <p className="text-sm text-surwash-grey line-clamp-3 mb-4 font-sans leading-relaxed">
          {post.metaDescription}
        </p>
        <div className="mt-auto">
          <a
            href={`/blog/${post.slug?.current}`}
            className="inline-flex items-center gap-1 text-sm font-bold text-surwash-blue hover:text-surwash-blue transition-colors duration-200 outline-none after:absolute after:inset-0 after:content-['']"
          >
            <span>Read Article</span>
            <span className="material-symbols-outlined text-sm font-bold transition-transform duration-200 group-hover:translate-x-1">arrow_forward</span>
          </a>
        </div>
      </div>
    </article>
  );
}
