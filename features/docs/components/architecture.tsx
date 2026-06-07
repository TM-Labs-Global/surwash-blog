import React from "react";

export function Architecture() {
    return (
        <section className="mb-24" id="architecture">
            <div className="flex items-center gap-3 mb-8">
                <span className="material-symbols-outlined text-[var(--color-primary-500)] text-3xl">
                    account_tree
                </span>
                <h2 className="text-3xl font-display font-bold">Understanding the Architecture</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                    <div className="size-12 bg-[var(--color-primary-50)] text-[var(--color-primary-500)] rounded-xl flex items-center justify-center mb-6">
                        <span className="material-symbols-outlined">data_object</span>
                    </div>
                    <h3 className="text-xl font-display font-bold mb-4">Content & Delivery Decoupling</h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed font-sans">
                        State editors use a hosted <strong>Sanity Studio</strong> interface to publish structured content.
                        The content layer is fully decoupled from the Next.js delivery layer, allowing zero-maintenance operation without rebuilds.
                    </p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                    <div className="size-12 bg-[var(--color-primary-50)] text-[var(--color-primary-500)] rounded-xl flex items-center justify-center mb-6">
                        <span className="material-symbols-outlined">bolt</span>
                    </div>
                    <h3 className="text-xl font-display font-bold mb-4">On-Demand ISR (Edge)</h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed font-sans">
                        Sanity dispatches a webhook to the Edge API route (<code className="bg-gray-100 dark:bg-gray-900 px-1.5 py-0.5 rounded">/api/revalidate</code>).
                        Vercel instantly purges the stale cache and silently rebuilds the specific page path globally. Sub-second updates, zero downtime.
                    </p>
                </div>
            </div>
        </section>
    );
}
