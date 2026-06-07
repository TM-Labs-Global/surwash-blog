'use client';

import React, { useState } from 'react';
import RichTextRenderer from '../components/RichTextRenderer';
import CommentForm from '../components/CommentForm';
import Header from '../components/Header';
import { Post, Comment } from '../lib/sanity';

interface BlogDetailPageProps {
  post: Post | null;
}

export default function BlogDetailPage({ post }: BlogDetailPageProps) {
  const [localComments, setLocalComments] = useState<Comment[]>(post?.comments || []);

  const handleCommentSubmitted = (newComment: Comment) => {
    setLocalComments((prev) => [...prev, newComment]);
  };
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
            Return to Blog Feed
          </a>
        </main>
      </div>
    );
  }

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
    <div className="min-h-screen bg-[var(--color-neutral-50)] flex flex-col font-sans">
      {/* Navigation Header */}
      <Header activeLink="blog" />

      {/* Main Post Wrapper */}
      <div className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Link */}
        <a
          href="/"
          className="inline-flex items-center gap-1 text-sm font-bold text-[var(--color-neutral-500)] hover:text-surwash-blue mb-8 transition-colors duration-200"
        >
          <span className="material-symbols-outlined text-sm font-bold">arrow_back</span>
          <span>Back to Blog Feed</span>
        </a>

        {/* Post Metadata Card */}
        <article className="bg-white border border-[var(--color-neutral-200)] rounded-xl overflow-hidden shadow-sm p-6 sm:p-10">
          <header className="border-b border-[var(--color-neutral-100)] pb-8 mb-8">
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
              <div className="aspect-[4/5] relative w-full overflow-hidden flex flex-col">
                {/* 80% Immersive Image */}
                <div className="h-[80%] w-full relative">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* 20% Brand Bar */}
                <div className="h-[20%] w-full bg-white border-t border-[var(--color-neutral-100)] flex items-center justify-between px-4 py-2">
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

          {/* Comments Section */}
          <div className="border-t border-[var(--color-neutral-200)] pt-10 mt-10">
            <h3 className="text-lg font-bold text-[#1A3A5C] font-display mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-xl text-surwash-blue">forum</span>
              <span>Discussion ({localComments.length})</span>
            </h3>

            {/* Comments List */}
            {localComments.length === 0 ? (
              <p className="text-xs text-[var(--color-neutral-500)] italic mb-8 bg-[var(--color-neutral-50)] p-4 rounded-lg border border-[var(--color-neutral-200)] text-center">
                No comments yet. Be the first to share your thoughts on this update!
              </p>
            ) : (
              <div className="space-y-6 mb-10">
                {localComments.map((c) => (
                  <div
                    key={c._id}
                    className="p-4 rounded-lg bg-[var(--color-neutral-50)] border border-[var(--color-neutral-200)] transition-all hover:shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-surwash-navy flex items-center justify-center text-white font-bold text-xs">
                          {c.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <span className="block text-xs font-bold text-[#1A3A5C]">
                            {c.name}
                          </span>
                          <span className="block text-[10px] text-[var(--color-neutral-400)]">
                            {new Date(c._createdAt).toLocaleDateString('en-NG', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      </div>
                      
                      {c.approved === false && (
                        <span className="inline-flex items-center gap-1 text-[9px] font-semibold bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full font-sans">
                          <span className="material-symbols-outlined text-[10px] animate-pulse">pending</span>
                          <span>Awaiting moderation</span>
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[var(--color-neutral-700)] leading-relaxed pl-10 whitespace-pre-line font-sans">
                      {c.comment}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Comment Submission Form */}
            <div className="mt-8">
              <CommentForm postId={post._id} onCommentSubmitted={handleCommentSubmitted} />
            </div>
          </div>
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
              <a href="/" className="hover:underline">Blog</a>
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
