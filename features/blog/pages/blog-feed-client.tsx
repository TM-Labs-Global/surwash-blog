'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import StateFilter from '../components/StateFilter';
import BlogCard from '../components/BlogCard';
import HeroSpotlight from '../components/HeroSpotlight';
import { Post } from '../lib/sanity';

interface BlogFeedClientProps {
  initialPosts: Post[];
}

export default function BlogFeedClient({ initialPosts }: BlogFeedClientProps) {
  const [selectedState, setSelectedState] = useState('all');
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search')?.toLowerCase() || '';

  // Identify the featured post (explicitly flagged, or fallback to the latest post)
  const featuredPost = initialPosts.find(p => p.isFeatured) || initialPosts[0];

  // Exclude the featured post from the main grids on 'all' view to avoid duplication
  const remainingPosts = initialPosts.filter(p => p._id !== featuredPost?._id);

  // Filter lists by state scope
  const filterByState = (postList: Post[]) => {
    if (selectedState === 'all') return postList;
    return postList.filter(post => post.stateScope === selectedState);
  };

  // Divide the main feed posts into news/press releases (filterable)
  const newsPosts = initialPosts.filter(
    p => p.postType === 'news_update' || p.postType === 'press_release'
  );
  // Exclude featured news from grid when on 'all' view
  let displayGridNews = selectedState === 'all'
    ? newsPosts.filter(p => p._id !== featuredPost?._id)
    : filterByState(newsPosts);

  // Apply search query filtering
  if (searchQuery) {
    displayGridNews = displayGridNews.filter(
      post =>
        post.title.toLowerCase().includes(searchQuery) ||
        post.metaDescription.toLowerCase().includes(searchQuery)
    );
  }

  const isFeedEmpty = displayGridNews.length === 0;
  const showSpotlight = selectedState === 'all' && featuredPost && !searchQuery;

  return (
    <div className="flex flex-col flex-1">
      {/* 1. State Filter Selector Bar */}
      <StateFilter currentState={selectedState} onStateChange={setSelectedState} />

      {/* 2. Hero Spotlight (Only visible on 'All Regions' view) */}
      {showSpotlight && <HeroSpotlight post={featuredPost} />}

      {/* 3. Primary News & Press Releases Section */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Section Header */}
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-black text-[#1A3A5C] font-display tracking-tight">
            {selectedState === 'all' ? 'Latest News & Press Releases' : 'Regional Updates'}
          </h2>
          <p className="text-xs sm:text-sm text-surwash-grey mt-1 font-sans">
            Filtered news, operational updates, and announcements.
          </p>
        </div>

        {/* News Grid */}
        {!isFeedEmpty ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayGridNews.map((post) => (
              <BlogCard key={post._id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white border border-[var(--color-neutral-200)] rounded-lg">
            <span className="material-symbols-outlined text-5xl text-[var(--color-neutral-300)] mb-3">
              feed
            </span>
            <h3 className="text-base font-bold text-[#1A3A5C] mb-1 font-display">
              No News Updates
            </h3>
            <p className="text-xs text-surwash-grey max-w-xs mx-auto px-4">
              There are currently no news updates or press releases published under this region scope.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
