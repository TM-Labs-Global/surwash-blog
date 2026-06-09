import React from 'react';
import { Metadata } from 'next';
import { getPostBySlug, getAllPostSlugs } from '@/features/blog/lib/sanity';
import { BlogDetailPage } from '@/features/blog';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Dynamically generate SEO tags for individual newsletter articles
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://surwash-blog-website.vercel.app';

  if (!post) {
    return {
      title: 'Article Not Found | SURWASH Newsletter',
      description: 'The requested newsletter article could not be found.',
    };
  }

  const postUrl = `${baseUrl}/newsletter/${post.slug.current}`;
  const imageUrl = post.imageUrl ? post.imageUrl : `${baseUrl}/brand/logo/SVG/SURWASH Logo.svg`;

  return {
    title: `${post.title} | SURWASH Newsletter`,
    description: post.metaDescription || 'SURWASH Newsletter — Water, Sanitation & Hygiene programme updates.',
    openGraph: {
      type: 'article',
      url: postUrl,
      title: post.title,
      description: post.metaDescription,
      publishedTime: post.publishedAt || post._createdAt,
      images: [
        {
          url: imageUrl,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.metaDescription,
      images: [imageUrl],
    },
  };
}

// Generate static paths at build-time for sub-second delivery
export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map((slug: string) => ({
    slug,
  }));
}

export default async function NewsletterArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return <BlogDetailPage post={null} />;
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://surwash-blog-website.vercel.app';
  const postUrl = `${baseUrl}/newsletter/${post.slug.current}`;
  const imageUrl = post.imageUrl ? post.imageUrl : `${baseUrl}/brand/logo/SVG/SURWASH Logo.svg`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: post.title,
    description: post.metaDescription,
    image: imageUrl,
    datePublished: post.publishedAt || post._createdAt,
    dateModified: post._createdAt,
    author: {
      '@type': 'Organization',
      name: 'SURWASH Programme',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Federal Ministry of Water Resources and Sanitation, Nigeria',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/brand/logo/SVG/SURWASH Logo.svg`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': postUrl,
    },
    isPartOf: post.edition ? {
      '@type': 'PublicationIssue',
      name: post.edition.title,
    } : undefined,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogDetailPage post={post} />
    </>
  );
}
