import React from 'react';

interface StateFilterProps {
  currentState: string;
  onStateChange: (state: string) => void;
}

export default function StateFilter({ currentState, onStateChange }: StateFilterProps) {
  const states = [
    { title: 'All Regions',        value: 'all'     },
    { title: 'Federal / National', value: 'federal' },
    { title: 'Abuja (FCT)',        value: 'abuja'   },
    { title: 'Lagos State',        value: 'lagos'   },
    { title: 'Kano State',         value: 'kano'    }
  ];

  return (
    <div className="w-full border-b border-[var(--color-neutral-200)] bg-white sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          className="flex items-center gap-2 py-4 overflow-x-auto no-scrollbar scroll-smooth"
          role="group"
          aria-label="Filter updates by regional scope"
        >
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-surwash-grey)] mr-2 whitespace-nowrap font-sans flex items-center gap-1.5">
            <span className="material-symbols-outlined text-sm">filter_alt</span>
            Filter by Scope:
          </span>
          {states.map((s) => {
            const isActive = currentState === s.value || (s.value === 'all' && !currentState);
            return (
              <button
                key={s.value}
                onClick={() => onStateChange(s.value)}
                aria-pressed={isActive}
                className={`px-4 py-2 rounded-full text-xs font-bold font-accent transition-all duration-200 whitespace-nowrap cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-surwash-blue ${
                  isActive
                    ? 'bg-[var(--color-secondary-500)] text-white shadow-sm ring-2 ring-[var(--color-secondary-100)]'
                    : 'bg-[var(--color-neutral-100)] text-[var(--color-neutral-600)] hover:bg-[var(--color-neutral-200)] hover:text-[var(--color-secondary-500)]'
                }`}
              >
                {s.title}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
