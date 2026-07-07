'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import Link from 'next/link';

interface HeaderProps {
  activeLink: 'newsletter' | 'publications' | 'none';
}

function HeaderContent({ activeLink }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Close mobile menu on path changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

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
    if (pathname.startsWith('/newsletter/')) {
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
      if (pathname.startsWith('/newsletter/')) {
        targetPath = '/';
      }
      
      router.replace(`${targetPath}?${params.toString()}`);
    } else {
      setIsSearchOpen(true);
      // Close hamburger menu if search is opened
      setIsMenuOpen(false);
    }
  };

  return (
    <header className="bg-white border-b border-[var(--color-neutral-200)] sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <img
            src="/brand/logo/SVG/SURWASH Logo.svg"
            alt="SURWASH Logo"
            className="h-8 w-auto object-contain"
          />
        </Link>
        
        <div className="flex items-center gap-4">
          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6">
            {!isSearchOpen && (
              <>
                <Link
                  href="/"
                  className={`text-sm ${
                    activeLink === 'newsletter'
                      ? 'font-bold text-surwash-blue'
                      : 'font-semibold text-[var(--color-neutral-600)] hover:text-surwash-blue transition-colors'
                  }`}
                >
                  Newsletter
                </Link>
                <Link
                  href="/publications"
                  className={`text-sm ${
                    activeLink === 'publications'
                      ? 'font-bold text-surwash-blue'
                      : 'font-semibold text-[var(--color-neutral-600)] hover:text-surwash-blue transition-colors'
                  }`}
                >
                  Publications
                </Link>
              </>
            )}

            {/* Search Input Bar (Desktop) */}
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
          </nav>

          {/* Mobile Search Bar (Only shown if Search is active on Mobile) */}
          {isSearchOpen && (
            <div className="md:hidden flex-1 max-w-[200px]">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search updates..."
                autoFocus
                className="text-xs border border-[var(--color-neutral-300)] rounded-full px-4 py-1.5 bg-white text-[var(--color-neutral-800)] focus:ring-1 focus:ring-surwash-blue focus:border-surwash-blue outline-none w-full font-sans transition-all"
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-1">
            {/* Search Toggle Button */}
            <button
              onClick={toggleSearch}
              className="text-[var(--color-neutral-600)] hover:text-surwash-blue transition-colors p-2 flex items-center justify-center outline-none focus-visible:ring-2 focus-visible:ring-surwash-blue rounded cursor-pointer"
              aria-label={isSearchOpen ? 'Close search' : 'Open search'}
            >
              <span className="material-symbols-outlined text-lg">
                {isSearchOpen ? 'close' : 'search'}
              </span>
            </button>

            {/* Mobile Hamburger Toggle Button */}
            <button
              onClick={() => {
                setIsMenuOpen(!isMenuOpen);
                if (isSearchOpen) setIsSearchOpen(false); // Close search when menu opens
              }}
              className="md:hidden text-[var(--color-neutral-600)] hover:text-surwash-blue transition-colors p-2 flex items-center justify-center outline-none focus-visible:ring-2 focus-visible:ring-surwash-blue rounded cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              <span className="material-symbols-outlined text-lg">
                {isMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-[var(--color-neutral-200)] bg-white absolute top-16 left-0 w-full shadow-lg z-20 animate-in fade-in slide-in-from-top-2 duration-150">
          <nav className="flex flex-col p-4 gap-3">
            <Link
              href="/"
              className={`px-4 py-3 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 ${
                activeLink === 'newsletter'
                  ? 'bg-surwash-blue/10 text-surwash-blue'
                  : 'text-[var(--color-neutral-700)] hover:bg-[var(--color-neutral-50)] hover:text-surwash-blue'
              }`}
            >
              <span className="material-symbols-outlined text-lg">feed</span>
              <span>Newsletter Archive</span>
            </Link>
            <Link
              href="/publications"
              className={`px-4 py-3 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 ${
                activeLink === 'publications'
                  ? 'bg-surwash-blue/10 text-surwash-blue'
                  : 'text-[var(--color-neutral-700)] hover:bg-[var(--color-neutral-50)] hover:text-surwash-blue'
              }`}
            >
              <span className="material-symbols-outlined text-lg">menu_book</span>
              <span>Publications Registry</span>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

// Fallback skeleton header while hydrating Next.js search parameters statically
function HeaderSkeleton({ activeLink }: HeaderProps) {
  return (
    <header className="bg-white border-b border-[var(--color-neutral-200)] sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <img
            src="/brand/logo/SVG/SURWASH Logo.svg"
            alt="SURWASH Logo"
            className="h-8 w-auto object-contain"
          />
        </Link>
        <div className="flex items-center gap-6">
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className={`text-sm ${activeLink === 'newsletter' ? 'font-bold text-surwash-blue' : 'font-semibold text-[var(--color-neutral-600)]'}`}>
              Newsletter
            </Link>
            <Link href="/publications" className={`text-sm ${activeLink === 'publications' ? 'font-bold text-surwash-blue' : 'font-semibold text-[var(--color-neutral-600)]'}`}>
              Publications
            </Link>
          </nav>
          <button className="text-[var(--color-neutral-600)] p-1 flex items-center justify-center" aria-label="Search">
            <span className="material-symbols-outlined text-lg">search</span>
          </button>
          <button className="md:hidden text-[var(--color-neutral-600)] p-1 flex items-center justify-center" aria-label="Menu">
            <span className="material-symbols-outlined text-lg">menu</span>
          </button>
        </div>
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
