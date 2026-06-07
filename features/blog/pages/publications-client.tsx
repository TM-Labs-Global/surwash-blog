'use client';

import React, { useState } from 'react';
import StateFilter from '../components/StateFilter';
import DocumentRegistry from '../components/DocumentRegistry';
import { Post } from '../lib/sanity';

interface PublicationsClientProps {
  posts: Post[];
}

export default function PublicationsClient({ posts }: PublicationsClientProps) {
  const [selectedState, setSelectedState] = useState('all');

  return (
    <div className="flex-1 flex flex-col min-h-[400px]">
      {/* 1. State Filter Bar */}
      <StateFilter currentState={selectedState} onStateChange={setSelectedState} />

      {/* 2. Main Document List Container */}
      <main className="flex-1 pb-16 bg-white">
        <DocumentRegistry posts={posts} selectedState={selectedState} />
      </main>
    </div>
  );
}
