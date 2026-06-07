import React from 'react';
import { Post } from '../lib/sanity';

interface HeroSpotlightProps {
  post: Post;
}

export default function HeroSpotlight({ post }: HeroSpotlightProps) {
  if (!post) return null;

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
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-warning-50)] text-[var(--color-warning-600)] text-[10px] font-bold uppercase font-accent tracking-wider mb-4">
        <span>Featured Story</span>
      </div>

      <div className="group relative bg-white border border-[var(--color-neutral-200)] rounded-xl overflow-hidden shadow-sm flex flex-col lg:flex-row w-full min-h-[420px] transition-all duration-300 hover:shadow-md focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-surwash-blue">
        {/* Left Section (3/4 - 75% width on desktop) - Immersive Cover Image */}
        <div className="w-full lg:w-3/4 relative min-h-[260px] lg:min-h-auto bg-[var(--color-neutral-100)]">
          {post.imageUrl ? (
            <img
              src={post.imageUrl}
              alt={post.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 w-full h-full flex items-center justify-center text-[var(--color-neutral-400)]">
              <span className="material-symbols-outlined text-6xl">image</span>
            </div>
          )}
          {/* Badge Overlays */}
          <div className="absolute top-6 left-6 flex flex-wrap gap-2 z-10">
            <span className={`text-[10px] font-semibold font-accent tracking-wider uppercase px-3 py-1 rounded shadow-md ${stateColors[post.stateScope] || 'bg-gray-500 text-white'}`}>
              {stateLabels[post.stateScope] || post.stateScope}
            </span>
            <span className={`text-[10px] font-semibold font-accent tracking-wider uppercase px-3 py-1 rounded shadow-md ${typeColors[post.postType] || 'bg-gray-500 text-white'}`}>
              {typeLabels[post.postType] || post.postType}
            </span>
          </div>
        </div>

        {/* Right Section (1/4 - 25% width on desktop) - Branding & Headline Sidebar */}
        <div className="w-full lg:w-1/4 bg-white p-6 sm:p-8 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-[var(--color-neutral-100)]">
          
          {/* Text block with left rule accent bar */}
          <div className="flex-1 flex flex-col justify-center">
            <span className="text-xs text-[var(--color-neutral-400)] font-medium mb-2 font-sans block">
              {formattedDate}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-surwash-navy font-display leading-tight mb-3 group-hover:text-surwash-blue transition-colors duration-200">
              {post.title}
            </h2>
            <p className="text-sm text-surwash-grey font-sans leading-relaxed line-clamp-4 mb-4">
              {post.metaDescription}
            </p>
            <div>
              <a
                href={`/blog/${post.slug?.current}`}
                className="inline-flex items-center gap-1.5 text-sm font-bold text-surwash-blue hover:text-surwash-blue transition-colors duration-200 outline-none after:absolute after:inset-0 after:content-['']"
              >
                <span>Read Full Story</span>
                <span className="material-symbols-outlined text-sm font-bold transition-transform duration-200 group-hover:translate-x-1">arrow_forward</span>
              </a>
            </div>
          </div>

          {/* Bottom Branding Space */}
          <div className="mt-8 pt-6 border-t border-[var(--color-neutral-100)] flex items-center justify-between">
            <div className="h-6 w-auto relative">
              <img
                src="/brand/logo/SVG/SURWASH Logo.svg"
                alt="SURWASH Program"
                className="h-full object-contain"
              />
            </div>
            <span className="text-[8px] text-[var(--color-neutral-400)] uppercase tracking-wider font-bold text-right font-sans">
              National Brief
            </span>
          </div>

        </div>
      </div>
    </section>
  );
}
