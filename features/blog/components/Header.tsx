'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

interface HeaderProps {
  activeLink: 'newsletter' | 'publications' | 'none';
}

function HeaderContent({ activeLink }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Sync component state with URL parameters on page load or query change
  useEffect(() => {
    const query = searchParams.get('search') || '';
    if (query) {
      setIsSearchOpen(true);
      setSearchQuery(query);
    }
  }, [searchParams]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set('search', value);
    } else {
      params.delete('search');
    }
    
    // If user is inside an article detail page, redirect to main newsletter feed
    let targetPath = pathname;
    if (pathname.startsWith('/blog/')) {
      targetPath = '/';
    }
    
    router.replace(`${targetPath}?${params.toString()}`);
  };

  const toggleSearch = () => {
    if (isSearchOpen) {
      setIsSearchOpen(false);
      setSearchQuery('');
      
      const params = new URLSearchParams(searchParams.toString());
      params.delete('search');
      
      let targetPath = pathname;
      if (pathname.startsWith('/blog/')) {
        targetPath = '/';
      }
      
      router.replace(`${targetPath}?${params.toString()}`);
    } else {
      setIsSearchOpen(true);
    }
  };

  return (
    <header className="bg-white border-b border-[var(--color-neutral-200)] sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <a href="/" className="flex items-center gap-3">
          <img
            src="/brand/logo/SVG/SURWASH Logo.svg"
            alt="SURWASH Logo"
            className="h-8 w-auto object-contain"
          />
        </a>
        
        <nav className="flex items-center gap-6">
          {!isSearchOpen && (
            <>
              <a
                href="/"
                className={`text-sm ${
                  activeLink === 'newsletter'
                    ? 'font-bold text-surwash-blue'
                    : 'font-semibold text-[var(--color-neutral-600)] hover:text-surwash-blue transition-colors'
                }`}
              >
                Newsletter
              </a>
              <a
                href="/publications"
                className={`text-sm ${
                  activeLink === 'publications'
                    ? 'font-bold text-surwash-blue'
                    : 'font-semibold text-[var(--color-neutral-600)] hover:text-surwash-blue transition-colors'
                }`}
              >
                Publications
              </a>
            </>
          )}

          {/* Search Input Bar */}
          {isSearchOpen && (
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search updates..."
              autoFocus
              className="text-xs border border-[var(--color-neutral-300)] rounded-full px-4 py-1.5 bg-white text-[var(--color-neutral-800)] focus:ring-1 focus:ring-surwash-blue focus:border-surwash-blue outline-none w-36 sm:w-56 font-sans transition-all"
            />
          )}

          <button
            onClick={toggleSearch}
            className="text-[var(--color-neutral-600)] hover:text-surwash-blue transition-colors p-1 flex items-center justify-center outline-none focus-visible:ring-2 focus-visible:ring-surwash-blue rounded cursor-pointer"
            aria-label={isSearchOpen ? 'Close search' : 'Open search'}
          >
            <span className="material-symbols-outlined text-lg">
              {isSearchOpen ? 'close' : 'search'}
            </span>
          </button>
        </nav>
      </div>
    </header>
  );
}

// Fallback skeleton header while hydrating Next.js search parameters statically
function HeaderSkeleton({ activeLink }: HeaderProps) {
  return (
    <header className="bg-white border-b border-[var(--color-neutral-200)] sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <a href="/" className="flex items-center gap-3">
          <img
            src="/brand/logo/SVG/SURWASH Logo.svg"
            alt="SURWASH Logo"
            className="h-8 w-auto object-contain"
          />
        </a>
        <nav className="flex items-center gap-6">
          <a href="/" className={`text-sm ${activeLink === 'newsletter' ? 'font-bold text-surwash-blue' : 'font-semibold text-[var(--color-neutral-600)]'}`}>
            Newsletter
          </a>
          <a href="/publications" className={`text-sm ${activeLink === 'publications' ? 'font-bold text-surwash-blue' : 'font-semibold text-[var(--color-neutral-600)]'}`}>
            Publications
          </a>
          <button className="text-[var(--color-neutral-600)] p-1 flex items-center justify-center" aria-label="Search">
            <span className="material-symbols-outlined text-lg">search</span>
          </button>
        </nav>
      </div>
    </header>
  );
}

export default function Header(props: HeaderProps) {
  return (
    <Suspense fallback={<HeaderSkeleton activeLink={props.activeLink} />}>
      <HeaderContent {...props} />
    </Suspense>
  );
}
