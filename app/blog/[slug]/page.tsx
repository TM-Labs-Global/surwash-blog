import React from 'react';
import { Metadata } from 'next';
import { getPostBySlug, getAllPostSlugs } from '@/features/blog/lib/sanity';
import { BlogDetailPage } from '@/features/blog';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Dynamically generate SEO tags for individual blog posts
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: 'Article Not Found | SURWASH Program Blog',
      description: 'The requested blog post could not be found.',
    };
  }

  return {
    title: `${post.title} | SURWASH Program Blog`,
    description: post.metaDescription || 'SURWASH WASH program reports and updates.',
  };
}

// Generate static paths at build-time for sub-second delivery
export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map((slug: string) => ({
    slug,
  }));
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  return <BlogDetailPage post={post} />;
}
