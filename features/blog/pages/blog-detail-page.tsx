'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import RichTextRenderer from '../components/RichTextRenderer';
import Header from '../components/Header';
import { Post } from '../lib/sanity';

interface BlogDetailPageProps {
  post: Post | null;
}

export default function BlogDetailPage({ post }: BlogDetailPageProps) {
  if (!post) {
    return (
      <div className="min-h-screen bg-[var(--color-neutral-50)] flex flex-col justify-between font-sans">
        <header className="bg-white border-b border-[var(--color-neutral-200)] py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <a href="/">
              <img src="/brand/logo/SVG/SURWASH Logo.svg" alt="SURWASH Logo" className="h-8 w-auto object-contain" />
            </a>
          </div>
        </header>
        <main className="flex-1 flex flex-col items-center justify-center py-20 px-4">
          <span className="material-symbols-outlined text-6xl text-[var(--color-neutral-300)] mb-4">
            error
          </span>
          <h1 className="text-2xl font-bold text-surwash-navy mb-2 font-display">
            Article Not Found
          </h1>
          <p className="text-surwash-grey mb-6 text-center max-w-sm">
            The article you are looking for does not exist or has been removed from the platform.
          </p>
          <a
            href="/"
            className="px-6 py-2.5 rounded-full bg-surwash-navy text-white text-xs font-bold hover:bg-[var(--color-secondary-600)] transition-colors"
          >
            Return to Newsletter Feed
          </a>
        </main>
      </div>
    );
  }

  const formattedDate = new Date(post.publishedAt || post._createdAt).toLocaleDateString('en-NG', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const stateLabels: Record<string, string> = {
    federal: 'Federal',
    abuja: 'Abuja (FCT)',
    plateau: 'Plateau State',
    katsina: 'Katsina State',
    gombe: 'Gombe State',
    kaduna: 'Kaduna State',
    ekiti: 'Ekiti State',
    imo: 'Imo State',
    delta: 'Delta State',
    abia: 'Abia State',
    bauchi: 'Bauchi State',
    benue: 'Benue State',
    taraba: 'Taraba State',
    ogun: 'Ogun State',
    jigawa: 'Jigawa State',
  };

  const stateColors: Record<string, string> = {
    federal: 'bg-surwash-blue text-white',
    abuja: 'bg-surwash-navy text-white',
    plateau: 'bg-surwash-navy text-white',
    katsina: 'bg-surwash-blue text-white',
    gombe: 'bg-surwash-grey text-white',
    kaduna: 'bg-[var(--color-neutral-600)] text-white',
    ekiti: 'bg-surwash-blue text-white',
    imo: 'bg-surwash-navy text-white',
    delta: 'bg-surwash-blue text-white',
    abia: 'bg-surwash-grey text-white',
    bauchi: 'bg-surwash-navy text-white',
    benue: 'bg-surwash-blue text-white',
    taraba: 'bg-[var(--color-neutral-600)] text-white',
    ogun: 'bg-surwash-navy text-white',
    jigawa: 'bg-surwash-blue text-white',
  };

  const typeLabels: Record<string, string> = {
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

  const typeColors: Record<string, string> = {
    programme_overview: 'bg-surwash-blue text-white',
    leadership_message: 'bg-surwash-navy text-white',
    state_spotlight: 'bg-surwash-orange text-white',
    community: 'bg-surwash-green text-white',
    forward_look: 'bg-surwash-blue text-white',
    press_release: 'bg-surwash-orange text-white',
    news_update: 'bg-surwash-blue text-white',
    field_report: 'bg-surwash-green text-white',
    policy_brief: 'bg-surwash-navy text-white',
  };

  return (
    <div className="min-h-screen bg-[var(--color-neutral-50)] flex flex-col font-sans">
      {/* Navigation Header */}
      <Header activeLink="newsletter" />

      {/* Main Article Wrapper */}
      <div className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Edition Breadcrumb (shown only if article is linked to an edition) */}
        {post.edition && (
          <div className="mb-4 flex items-center gap-2 text-xs font-sans text-[var(--color-neutral-500)]">
            <Link href="/" className="hover:text-surwash-blue transition-colors">
              Newsletter
            </Link>
            <span className="text-[var(--color-neutral-300)]">/</span>
            <Link
              href={`/newsletter/editions/${post.edition.slug.current}`}
              className="hover:text-surwash-blue transition-colors"
            >
              {post.edition.title}
            </Link>
            <span className="text-[var(--color-neutral-300)]">/</span>
            <span className="text-surwash-navy font-medium truncate max-w-[200px]">{post.title}</span>
          </div>
        )}

        {/* Back Link */}
        <a
          href="/"
          className="inline-flex items-center gap-1 text-sm font-bold text-[var(--color-neutral-500)] hover:text-surwash-blue mb-6 transition-colors duration-200"
        >
          <span className="material-symbols-outlined text-sm font-bold">arrow_back</span>
          <span>Back to Newsletter Feed</span>
        </a>

        {/* Post Metadata Card */}
        <article className="bg-white border border-[var(--color-neutral-200)] rounded-xl overflow-hidden shadow-sm p-6 sm:p-10">
          <header className="border-b border-[var(--color-neutral-100)] pb-8 mb-8">

            {/* Edition + Theme Tag (if edition linked) */}
            {post.edition && (
              <Link
                href={`/newsletter/editions/${post.edition.slug.current}`}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-primary-50)] hover:bg-[var(--color-primary-100)] text-surwash-blue text-[10px] font-bold uppercase font-accent tracking-wider mb-4 transition-colors duration-200 group"
              >
                <span className="material-symbols-outlined text-xs">article</span>
                <span>{post.edition.title}</span>
                {post.edition.theme && (
                  <>
                    <span className="text-[var(--color-neutral-300)]">·</span>
                    <span className="text-surwash-orange">{post.edition.theme}</span>
                  </>
                )}
                <span className="material-symbols-outlined text-xs transition-transform duration-200 group-hover:translate-x-0.5">chevron_right</span>
              </Link>
            )}

            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className={`text-[10px] font-semibold font-accent tracking-wider uppercase px-2.5 py-1 rounded shadow-sm ${stateColors[post.stateScope] || 'bg-gray-500 text-white'}`}>
                {stateLabels[post.stateScope] || post.stateScope}
              </span>
              <span className={`text-[10px] font-semibold font-accent tracking-wider uppercase px-2.5 py-1 rounded shadow-sm ${typeColors[post.postType] || 'bg-gray-500 text-white'}`}>
                {typeLabels[post.postType] || post.postType}
              </span>
              <span className="text-xs text-[var(--color-neutral-400)] font-medium">
                Published on {formattedDate}
              </span>
            </div>

            {/* Title */}
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-surwash-navy tracking-tight font-display mb-4">
                {post.title}
              </h1>
            </div>
            
            <p className="text-base text-surwash-grey leading-relaxed italic">
              {post.metaDescription}
            </p>
          </header>

          {/* 4/5 Aspect Ratio Brand Canvas Featured Image */}
          {post.imageUrl && (
            <div className="max-w-xl mx-auto mb-10 border border-[var(--color-neutral-200)] rounded-lg overflow-hidden shadow-sm flex flex-col bg-[var(--color-neutral-50)]">
              <div className="w-full flex flex-col">
                {/* Immersive Image scaling naturally to original aspect ratio */}
                <div className="w-full relative">
                  <Image
                    src={post.imageUrl}
                    alt={post.mainImage?.alt || post.title}
                    width={post.mainImage?.asset?.metadata?.dimensions?.width || 800}
                    height={post.mainImage?.asset?.metadata?.dimensions?.height || 600}
                    sizes="(max-width: 768px) 100vw, 600px"
                    className="w-full h-auto object-contain mx-auto"
                    priority
                  />
                </div>
                {/* Brand Bar */}
                <div className="w-full bg-white border-t border-[var(--color-neutral-100)] flex items-center justify-between px-4 py-3">
                  <div className="h-6 w-auto flex items-center">
                    <img
                      src="/brand/logo/SVG/SURWASH Logo.svg"
                      alt="SURWASH Program"
                      className="h-full object-contain"
                    />
                  </div>
                  <div className="text-right">
                    <span className="block text-[9px] uppercase font-bold tracking-wider text-[var(--color-neutral-400)] font-sans">
                      WASH Intervention
                    </span>
                    <span className="block text-[8px] text-[var(--color-neutral-500)] font-sans">
                      Federal Republic of Nigeria
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Render article body */}
          <div className="prose prose-blue max-w-none mb-12">
            <RichTextRenderer content={post.content} />
          </div>

          {/* Edition navigation footer */}
          {post.edition && (
            <div className="border-t border-[var(--color-neutral-100)] pt-8 mt-4">
              <Link
                href={`/newsletter/editions/${post.edition.slug.current}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[var(--color-neutral-200)] text-xs font-bold text-surwash-navy hover:bg-[var(--color-primary-50)] hover:border-surwash-blue hover:text-surwash-blue transition-all duration-200 group"
              >
                <span className="material-symbols-outlined text-sm">menu_book</span>
                <span>More from {post.edition.title}</span>
                <span className="material-symbols-outlined text-sm transition-transform duration-200 group-hover:translate-x-0.5">chevron_right</span>
              </Link>
            </div>
          )}
        </article>
      </div>

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
