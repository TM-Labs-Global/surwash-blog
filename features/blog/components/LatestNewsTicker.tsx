import React from 'react';
import { Post, TickerPage } from '../lib/sanity';

interface LatestNewsTickerProps {
  posts: Post[];
  tickerPages?: TickerPage[];
}

export default function LatestNewsTicker({ posts, tickerPages = [] }: LatestNewsTickerProps) {
  // Filter for news and press releases, take the latest 4
  const tickerPosts = posts
    .filter(p => p.postType === 'news_update' || p.postType === 'press_release')
    .slice(0, 4);

  if (tickerPosts.length === 0 && tickerPages.length === 0) return null;

  return (
    <div className="w-full text-white h-10 flex items-center overflow-hidden" style={{ backgroundColor: '#E8762B', borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
      <style>{`
        @keyframes ticker {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        .animate-ticker {
          display: inline-flex;
          white-space: nowrap;
          animation: ticker 25s linear infinite;
        }
        .animate-ticker:hover,
        .animate-ticker:focus-within {
          animation-play-state: paused;
        }
      `}</style>
      
      {/* Title Label */}
      <div className="pl-4 pr-3 shrink-0 z-10 flex items-center h-full" style={{ borderRight: '1px solid rgba(255,255,255,0.25)', backgroundColor: '#E8762B' }}>
        <div className="bg-white text-[#E8762B] text-[9px] font-bold font-sans uppercase px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm tracking-wider">
          <span className="relative flex h-1.5 w-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E8762B] animate-ping absolute inline-flex opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#E8762B]"></span>
          </span>
          <span>Latest Update</span>
        </div>
      </div>

      {/* Marquee Container */}
      <div 
        className="flex-1 overflow-hidden relative flex items-center h-full"
        style={{ backgroundColor: '#E8762B' }}
        aria-label="Latest program updates news ticker"
        role="region"
      >
        <div className="animate-ticker py-1 flex items-center gap-12 text-xs font-medium tracking-wide">
          {/* Duplicate the full set twice for a seamless infinite loop */}
          {[0, 1].map((pass) => (
            <React.Fragment key={pass}>

              {/* CMS-driven featured pages — gold styled */}
              {tickerPages.map((page) => (
                <a
                  key={`page-${page._id}-${pass}`}
                  href={`/${page.slug.current}`}
                  className="flex items-center gap-2 text-[#F5A623] hover:text-white transition-colors duration-150 whitespace-nowrap"
                >
                  <span className="material-symbols-outlined text-sm leading-none">star</span>
                  <span className="font-sans font-bold">{page.title}</span>
                  <span className="text-[var(--color-secondary-400)] text-xs">•</span>
                </a>
              ))}

              {/* Regular news & press release posts — white */}
              {tickerPosts.map((post, idx) => (
                <a
                  key={`post-${post._id}-${pass}-${idx}`}
                  href={`/blog/${post.slug?.current}`}
                  className="text-white hover:text-[#1A3A5C] flex items-center gap-3 transition-colors duration-150 whitespace-nowrap"
                >
                  <span className="text-white/70 font-sans text-[10px]">
                    {new Date(post._createdAt).toLocaleDateString('en-NG', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </span>
                  <span className="font-sans font-semibold">{post.title}</span>
                  <span className="text-white/60 text-xs">•</span>
                </a>
              ))}

            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
