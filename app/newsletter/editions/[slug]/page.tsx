import React from 'react';
import { Metadata } from 'next';
import { getEditionBySlug, getAllEditionSlugs } from '@/features/blog/lib/sanity';
import { EditionDetailPage } from '@/features/blog';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const edition = await getEditionBySlug(slug);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://surwash-blog-website.vercel.app';

  if (!edition) {
    return {
      title: 'Edition Not Found | SURWASH Newsletter',
      description: 'The requested newsletter edition could not be found.',
    };
  }

  const editionUrl = `${baseUrl}/newsletter/editions/${edition.slug.current}`;
  const imageUrl = edition.coverImage?.asset?.url || `${baseUrl}/brand/logo/SVG/SURWASH Logo.svg`;

  return {
    title: `${edition.title} — ${edition.theme} | SURWASH Newsletter`,
    description: edition.themeDescription || `SURWASH Newsletter ${edition.title}: ${edition.theme}`,
    openGraph: {
      type: 'article',
      url: editionUrl,
      title: `${edition.title} — ${edition.theme}`,
      description: edition.themeDescription,
      images: [{ url: imageUrl }],
    },
  };
}

export async function generateStaticParams() {
  const slugs = await getAllEditionSlugs();
  return slugs.map((slug: string) => ({ slug }));
}

export default async function EditionPage({ params }: PageProps) {
  const { slug } = await params;
  const edition = await getEditionBySlug(slug);

  if (!edition) {
    notFound();
  }

  return <EditionDetailPage edition={edition} />;
}
