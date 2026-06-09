import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPageBySlug, sanityClient } from '@/features/blog/lib/sanity';
import Header from '@/features/blog/components/Header';
import RichTextRenderer from '@/features/blog/components/RichTextRenderer';

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

// Reserved paths that should never be matched by dynamic CMS pages
const RESERVED_PATHS = ['blog', 'publications', 'design-system', 'docs', 'api'];

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const slugArray = (await params).slug;
  const slugString = slugArray.join('/');

  // Return empty metadata if this is a reserved path
  if (RESERVED_PATHS.includes(slugArray[0])) {
    return {};
  }

  const page = await getPageBySlug(slugString);
  if (!page) {
    return {
      title: 'Page Not Found | SURWASH Program',
    };
  }

  return {
    title: page.title,
    description: `Official ${page.title} page for the SURWASH program.`,
  };
}

export async function generateStaticParams() {
  if (!sanityClient) return [];

  try {
    const query = `*[_type == "page" && defined(slug.current)][].slug.current`;
    const slugs: string[] = await sanityClient.fetch(query, {}, { next: { tags: ['pages'] } });
    return slugs.map((slug) => ({
      slug: slug.split('/'),
    }));
  } catch (error) {
    console.error('Failed to generate static params for custom pages:', error);
    return [];
  }
}

export default async function CustomDynamicPage({ params }: PageProps) {
  const slugArray = (await params).slug;
  const slugString = slugArray.join('/');

  // Bypass dynamic rendering for reserved paths to let Next.js route correctly
  if (RESERVED_PATHS.includes(slugArray[0])) {
    notFound();
  }

  const page = await getPageBySlug(slugString);

  if (!page) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[var(--color-neutral-50)] flex flex-col font-sans">
      {/* Header */}
      <Header activeLink="none" />

      {/* Hero Header Section */}
      <section className="bg-white py-16 border-b border-[var(--color-neutral-100)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl font-black text-[#1A3A5C] tracking-tight font-display mb-4">
              {page.title}
            </h1>
            <div className="h-1 w-12 bg-surwash-blue rounded"></div>
          </div>
        </div>
      </section>

      {/* Page Body Content */}
      <main className="flex-grow max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <article className="bg-white border border-[var(--color-neutral-200)] rounded-xl shadow-sm p-6 sm:p-10 prose prose-blue max-w-none">
          <RichTextRenderer content={page.content} />
        </article>
      </main>

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
            <span>Federal Ministry of Water Resources, Nigeria</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
