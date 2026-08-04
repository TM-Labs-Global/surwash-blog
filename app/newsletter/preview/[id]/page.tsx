import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getDraftPostById } from '@/features/blog/lib/sanity';
import { BlogDetailPage } from '@/features/blog';

export const metadata: Metadata = {
  title: 'Draft Preview | SURWASH Newsletter',
  robots: {
    index: false,
    follow: false,
  },
};

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ secret?: string }>;
}

export default async function DraftPreviewPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { secret } = await searchParams;

  const expectedSecret = process.env.SANITY_PREVIEW_SECRET || 'surwash-preview-secret-2026';

  // Security Gate: Reject requests with invalid or missing secret token
  if (!secret || secret !== expectedSecret) {
    return notFound();
  }

  const decodedId = decodeURIComponent(id);
  const post = await getDraftPostById(decodedId);

  if (!post) {
    return notFound();
  }

  return (
    <div className="relative">
      {/* Draft Watermark Banner */}
      <div className="bg-[#E8762B] text-white text-[11px] font-bold uppercase tracking-widest px-4 py-2 text-center sticky top-0 z-50 shadow-md font-accent flex items-center justify-center gap-2">
        <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
        <span>Draft Preview Mode — Internal Review Only</span>
        <span className="opacity-75 font-normal">({post.approvalStatus || 'draft'})</span>
      </div>

      <BlogDetailPage post={post} />
    </div>
  );
}
