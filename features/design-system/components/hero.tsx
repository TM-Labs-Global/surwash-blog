export function Hero() {
    return (
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left w-full">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-secondary-100)] text-[var(--color-secondary-500)] text-overline font-bold">
                <span>Design System v1.0</span>
            </div>
            <h1 className="text-hero-display text-[var(--text-base)] max-w-2xl">
                SURWASH Program Newsletter
            </h1>
            <p className="text-body-large text-[var(--text-secondary)] max-w-xl">
                Sustainable Urban and Rural Water Supply, Sanitation and Hygiene (SURWASH) Program. 
                A scalable, domain-driven blogging platform built on a 3-layer styling system.
            </p>
        </div>
    );
}
