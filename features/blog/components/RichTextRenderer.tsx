import React from 'react';
import { PortableText } from '@portabletext/react';
import { createImageUrlBuilder } from '@sanity/image-url';
import { sanityClient } from '../lib/sanity';

const builder = sanityClient ? createImageUrlBuilder(sanityClient) : null;

function urlFor(source: any) {
  return builder ? builder.image(source) : null;
}

interface RichTextRendererProps {
  content: any;
}

export default function RichTextRenderer({ content }: RichTextRendererProps) {
  if (!content) return null;

  // Custom components to style Portable Text blocks to align with brand guidelines
  const components = {
    types: {
      image: ({ value }: any) => {
        if (!value?.asset) return null;
        
        // Retrieve dimensions and url directly if dereferenced, otherwise fall back to builders/parsing
        const assetRef = value.asset._ref || value.asset._id || '';
        let width = value.asset.metadata?.dimensions?.width;
        let height = value.asset.metadata?.dimensions?.height;
        let imageUrl = value.asset.url;

        if (!imageUrl && assetRef) {
          imageUrl = urlFor(value)?.url() || '';
        }
        
        // Parse dimensions from reference ID if not resolved via metadata
        if ((!width || !height) && assetRef) {
          const parts = assetRef.split('-');
          if (parts.length >= 3) {
            const dims = parts[2].split('x');
            if (dims.length === 2) {
              width = parseInt(dims[0], 10);
              height = parseInt(dims[1], 10);
            }
          }
        }

        if (!imageUrl) return null;

        const hasDimensions = typeof width === 'number' && typeof height === 'number';
        const aspectRatio = hasDimensions ? width / height : null;

        return (
          <figure className="my-8 w-full max-w-2xl mx-auto rounded-lg overflow-hidden border border-[var(--color-neutral-200)] shadow-sm bg-[var(--color-neutral-50)]">
            <div 
              className="w-full relative overflow-hidden" 
              style={aspectRatio ? { aspectRatio: `${width} / ${height}` } : undefined}
            >
              <img
                src={imageUrl}
                alt={value.alt || 'Newsletter Image'}
                className="w-full h-full object-contain mx-auto"
                style={{ position: 'relative', display: 'block' }}
                width={width}
                height={height}
                loading="lazy"
              />
            </div>
            {(value.caption || value.alt) && (
              <figcaption className="bg-white border-t border-[var(--color-neutral-100)] px-4 py-2 text-center text-xs text-[var(--color-neutral-500)] font-sans italic">
                {value.caption || value.alt}
              </figcaption>
            )}
          </figure>
        );
      },
      ctaButton: ({ value }: any) => {
        if (!value?.buttonText || !value?.url) return null;
        return (
          <div className="my-8 flex justify-center">
            <a
              href={value.url}
              target={value.url.startsWith('/') ? undefined : '_blank'}
              rel={value.url.startsWith('/') ? undefined : 'noopener noreferrer'}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-surwash-blue text-white text-xs font-bold hover:bg-surwash-navy hover:shadow transition-all duration-200 font-accent tracking-wide uppercase"
            >
              <span>{value.buttonText}</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </a>
          </div>
        );
      },
    },
    block: {
      h1: ({ children }: any) => (
        <h1 className="text-3xl sm:text-4xl font-bold font-display text-[var(--color-secondary-500)] mt-8 mb-4 border-l-4 border-[var(--color-surwash-blue)] pl-4 leading-tight">
          {children}
        </h1>
      ),
      h2: ({ children }: any) => (
        <h2 className="text-2xl sm:text-3xl font-bold font-display text-[var(--color-secondary-500)] mt-8 mb-4 border-l-4 border-[var(--color-surwash-blue)] pl-4 leading-tight">
          {children}
        </h2>
      ),
      h3: ({ children }: any) => (
        <h3 className="text-xl sm:text-2xl font-bold font-display text-[var(--color-secondary-500)] mt-6 mb-3 leading-snug">
          {children}
        </h3>
      ),
      normal: ({ children }: any) => (
        <p className="text-base text-[var(--color-surwash-grey)] leading-relaxed mb-6 font-sans">
          {children}
        </p>
      ),
      blockquote: ({ children }: any) => (
        <blockquote className="border-l-4 border-[var(--color-surwash-blue)] pl-4 italic text-[var(--color-neutral-600)] bg-[var(--color-neutral-50)] py-3 pr-4 my-6 rounded-r font-sans">
          {children}
        </blockquote>
      ),
    },
    list: {
      bullet: ({ children }: any) => (
        <ul className="list-disc pl-6 mb-6 text-[var(--color-surwash-grey)] font-sans space-y-2">
          {children}
        </ul>
      ),
      number: ({ children }: any) => (
        <ol className="list-decimal pl-6 mb-6 text-[var(--color-surwash-grey)] font-sans space-y-2">
          {children}
        </ol>
      ),
    },
    marks: {
      strong: ({ children }: any) => <strong className="font-bold text-[var(--color-secondary-500)]">{children}</strong>,
      em: ({ children }: any) => <em className="italic">{children}</em>,
      link: ({ children, value }: any) => {
        const rel = !value.href.startsWith('/') ? 'noreferrer noopener' : undefined;
        const target = !value.href.startsWith('/') ? '_blank' : undefined;
        return (
          <a
            href={value.href}
            rel={rel}
            target={target}
            className="text-[var(--color-primary-500)] hover:text-[var(--color-primary-600)] underline font-semibold transition-colors duration-150"
          >
            {children}
          </a>
        );
      },
    },
  };

  return (
    <div className="w-full max-w-none">
      <PortableText value={content} components={components} />
    </div>
  );
}
