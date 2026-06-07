import React from 'react';
import { useSearchParams } from 'next/navigation';
import { Post } from '../lib/sanity';

interface DocumentRegistryProps {
  posts: Post[];
  selectedState: string;
}

export default function DocumentRegistry({ posts, selectedState }: DocumentRegistryProps) {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search')?.toLowerCase() || '';

  // Filter for policy briefs and field reports
  const documents = posts.filter(
    p => p.postType === 'policy_brief' || p.postType === 'field_report'
  );

  // Apply state filtering if not 'all'
  let filteredDocs = selectedState === 'all'
    ? documents
    : documents.filter(doc => doc.stateScope === selectedState);

  // Apply search query filtering
  if (searchQuery) {
    filteredDocs = filteredDocs.filter(
      doc =>
        doc.title.toLowerCase().includes(searchQuery) ||
        doc.metaDescription.toLowerCase().includes(searchQuery)
    );
  }

  if (filteredDocs.length === 0) {
    return (
      <section className="bg-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header (retained for layout clarity) */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-secondary-50)] text-[var(--color-secondary-600)] text-[10px] font-bold uppercase font-accent tracking-wider mb-2">
              <span>Publications Registry</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-surwash-navy tracking-tight font-display">
              Strategic Briefs & Official Publications
            </h2>
          </div>
          
          <div className="text-center py-16 border border-[var(--color-neutral-200)] rounded-lg">
            <span className="material-symbols-outlined text-5xl text-[var(--color-neutral-300)] mb-3">
              folder_open
            </span>
            <h3 className="text-base font-bold text-[#1A3A5C] mb-1 font-display">
              No Documents Found
            </h3>
            <p className="text-xs text-surwash-grey max-w-xs mx-auto px-4">
              We couldn't find any publications matching your search query. Try adjusting your search term.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const stateLabels: Record<string, string> = {
    federal: 'Federal',
    abuja: 'Abuja (FCT)',
    lagos: 'Lagos State',
    kano: 'Kano State',
  };

  const typeLabels: Record<string, string> = {
    field_report: 'Field Assessment',
    policy_brief: 'Strategic Brief / Policy',
  };

  return (
    <section className="bg-white border-t border-[var(--color-neutral-200)] py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-secondary-50)] text-[var(--color-secondary-600)] text-[10px] font-bold uppercase font-accent tracking-wider mb-2">
            <span>Publications Registry</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-surwash-navy tracking-tight font-display">
            Strategic Briefs & Official Publications
          </h2>
          <p className="text-sm text-surwash-grey mt-1 font-sans">
            Access policy frameworks, environmental guidelines, and field reports issued under the SURWASH program.
          </p>
        </div>

        {/* Desktop Table Registry */}
        <div className="hidden md:block overflow-hidden border border-[var(--color-neutral-200)] rounded-lg shadow-sm">
          <table className="min-w-full divide-y divide-[var(--color-neutral-200)]">
            <thead className="bg-[var(--color-neutral-50)]">
              <tr>
                <th scope="col" className="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-[var(--color-neutral-500)] font-sans">
                  Document Title & Scope
                </th>
                <th scope="col" className="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-[var(--color-neutral-500)] font-sans">
                  State Scope
                </th>
                <th scope="col" className="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-[var(--color-neutral-500)] font-sans">
                  Document Type
                </th>
                <th scope="col" className="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-[var(--color-neutral-500)] font-sans">
                  Release Date
                </th>
                <th scope="col" className="relative px-6 py-3.5 text-right font-sans">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-[var(--color-neutral-100)]">
              {filteredDocs.map((doc) => (
                <tr key={doc._id} className="hover:bg-[var(--color-neutral-50)] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <a
                        href={`/blog/${doc.slug?.current}`}
                        className="font-bold text-sm text-surwash-navy hover:text-surwash-blue transition-colors font-display"
                      >
                        {doc.title}
                      </a>
                      <span className="text-xs text-surwash-grey mt-1 font-sans line-clamp-1">
                        {doc.metaDescription}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-surwash-navy font-sans font-semibold">
                    {stateLabels[doc.stateScope] || doc.stateScope}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-0.5 rounded text-[9px] font-semibold font-accent uppercase tracking-wider ${
                      doc.postType === 'policy_brief'
                        ? 'bg-[var(--color-secondary-100)] text-[var(--color-secondary-600)]'
                        : 'bg-[var(--color-success-100)] text-[var(--color-success-700)]'
                    }`}>
                      {typeLabels[doc.postType] || doc.postType}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-[var(--color-neutral-400)] font-sans">
                    {new Date(doc._createdAt).toLocaleDateString('en-NG', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-xs font-medium">
                    <a
                      href={`/blog/${doc.slug?.current}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[var(--color-neutral-300)] text-surwash-navy font-bold hover:bg-[var(--color-neutral-100)] hover:text-surwash-blue transition-all duration-150"
                    >
                      <span className="material-symbols-outlined text-sm">description</span>
                      <span>View document</span>
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile List Registry */}
        <div className="md:hidden flex flex-col gap-4">
          {filteredDocs.map((doc) => (
            <div
              key={doc._id}
              className="bg-white border border-[var(--color-neutral-200)] rounded-lg p-5 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <span className="text-[9px] font-semibold font-accent uppercase tracking-wider bg-[var(--color-neutral-100)] text-[var(--color-neutral-600)] px-2 py-0.5 rounded">
                  {stateLabels[doc.stateScope] || doc.stateScope}
                </span>
                <span className="text-[9px] font-semibold font-accent uppercase tracking-wider bg-[var(--color-secondary-50)] text-[var(--color-secondary-600)] px-2 py-0.5 rounded">
                  {typeLabels[doc.postType] || doc.postType}
                </span>
              </div>
              <h3 className="font-bold text-base text-surwash-navy font-display leading-snug">
                <a href={`/blog/${doc.slug?.current}`} className="hover:text-surwash-blue transition-colors">
                  {doc.title}
                </a>
              </h3>
              <p className="text-xs text-surwash-grey font-sans leading-relaxed line-clamp-2">
                {doc.metaDescription}
              </p>
              <div className="flex justify-between items-center pt-3 border-t border-[var(--color-neutral-100)] mt-2">
                <span className="text-[10px] text-[var(--color-neutral-400)] font-sans">
                  {new Date(doc._createdAt).toLocaleDateString('en-NG', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </span>
                <a
                  href={`/blog/${doc.slug?.current}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-surwash-blue"
                >
                  <span>Read Brief</span>
                  <span className="material-symbols-outlined text-xs">arrow_forward</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
