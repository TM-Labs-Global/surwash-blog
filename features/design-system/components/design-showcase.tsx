import React from "react";

const ColorSwatch = ({
    name,
    variable,
}: {
    name: string;
    variable: string;
}) => (
    <div className="flex flex-col gap-2 group">
        <div
            className="h-20 w-full rounded-xl shadow-sm border border-[var(--color-border-subtle)] transition-transform group-hover:scale-105"
            style={{ backgroundColor: `var(${variable})` }}
        />
        <div className="flex flex-col">
            <span className="text-caption font-semibold text-[var(--color-text-primary)]">
                {name}
            </span>
            <span className="text-[10px] text-[var(--color-text-tertiary)] font-mono">
                {variable}
            </span>
        </div>
    </div>
);

interface ColorGroupProps {
    title: string;
    prefix: string;
    count: number;
    rangeStart?: number;
}

const ColorGroup = ({ title, prefix, count, rangeStart = 100 }: ColorGroupProps) => (
    <div className="space-y-4">
        <h3 className="text-h4 text-[var(--color-text-secondary)]">{title}</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-9 gap-4">
            {Array.from({ length: count }).map((_, i) => {
                const weight = rangeStart + i * 100;
                return (
                    <ColorSwatch
                        key={weight}
                        name={`${weight}`}
                        variable={`--color-${prefix}-${weight}`}
                    />
                );
            })}
        </div>
    </div>
);

interface ButtonShowcaseProps {
    bgClass: string;
    title: string;
    textClass: string;
}

const ButtonShowcase = ({ bgClass, title, textClass }: ButtonShowcaseProps) => (
    <div className={`p-8 rounded-2xl ${bgClass} space-y-6`}>
        <h3 className={`text-h3 ${textClass}`}>{title}</h3>
        <div className="flex flex-wrap gap-4 items-center">
            <button className="px-6 py-3 rounded-lg bg-[var(--color-action-primary)] text-[var(--text-inverse)] font-semibold hover:bg-[var(--color-action-primary-hover)] transition-all shadow-sm hover:shadow-md cursor-pointer">
                Primary Action
            </button>
            <button className="px-6 py-3 rounded-lg bg-[var(--color-action-secondary)] text-white font-semibold hover:bg-[var(--color-action-secondary-hover)] transition-all cursor-pointer">
                Secondary Action
            </button>
            <button
                className={`px-6 py-3 rounded-lg border-2 font-semibold transition-all cursor-pointer ${
                    bgClass === "bg-[var(--color-bg-inverse)]"
                        ? "border-white text-white hover:bg-white hover:text-[var(--color-secondary-900)]"
                        : "border-[var(--color-action-tertiary)] text-[var(--color-action-tertiary)] hover:bg-[var(--color-action-tertiary)] hover:text-white"
                }`}
            >
                Outline Action
            </button>
            <button className="px-6 py-3 rounded-lg bg-[var(--bg-danger)] text-white font-semibold hover:bg-[var(--bg-danger-hover)] transition-all cursor-pointer">
                Destructive
            </button>
            <button className="px-6 py-3 rounded-lg bg-[var(--color-action-disabled)] text-[var(--text-disabled)] font-semibold cursor-not-allowed">
                Disabled
            </button>
        </div>
    </div>
);

export function DesignShowcase() {
    return (
        <div className="w-full space-y-24">
            {/* Introduction */}
            <section className="space-y-6">
                <h2 className="text-display text-[var(--text-base)]">
                    Design System
                </h2>
                <p className="text-body-large text-[var(--text-secondary)] max-w-3xl">
                    A comprehensive guide to the SURWASH visual language, featuring
                    our core color palettes, typography scales, and semantic component
                    behaviors across different contexts.
                </p>
            </section>

            {/* Colors */}
            <section className="space-y-10">
                <div className="flex items-baseline justify-between border-b border-[var(--border-default)] pb-4">
                    <h2 className="text-h2 text-[var(--text-base)]">Colors</h2>
                    <span className="text-body text-[var(--text-secondary)]">
                        Core Palette
                    </span>
                </div>

                <ColorGroup title="SURWASH Blue (Primary)" prefix="primary" count={10} rangeStart={50} />
                <ColorGroup title="SURWASH Navy (Secondary)" prefix="secondary" count={10} rangeStart={50} />

                <div className="space-y-4">
                    <h3 className="text-h4 text-[var(--text-secondary)]">Neutral</h3>
                    <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-10 gap-4">
                        <ColorSwatch name="White" variable="--color-white" />
                        <ColorSwatch name="50" variable="--color-neutral-50" />
                        <ColorSwatch name="100" variable="--color-neutral-100" />
                        <ColorSwatch name="200" variable="--color-neutral-200" />
                        <ColorSwatch name="300" variable="--color-neutral-300" />
                        <ColorSwatch name="400" variable="--color-neutral-400" />
                        <ColorSwatch name="500" variable="--color-neutral-500" />
                        <ColorSwatch name="600" variable="--color-neutral-600" />
                        <ColorSwatch name="700" variable="--color-neutral-700" />
                        <ColorSwatch name="800" variable="--color-neutral-800" />
                        <ColorSwatch name="900" variable="--color-neutral-900" />
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-12 pt-8">
                    <div className="space-y-8">
                        <ColorGroup title="Success" prefix="success" count={3} rangeStart={500} />
                        <ColorGroup title="Error" prefix="error" count={3} rangeStart={500} />
                    </div>
                    <div className="space-y-8">
                        <ColorGroup title="Warning" prefix="warning" count={3} rangeStart={500} />
                        <ColorGroup title="Info" prefix="info" count={3} rangeStart={500} />
                    </div>
                </div>
            </section>

            {/* Typography */}
            <section className="space-y-10">
                <div className="flex items-baseline justify-between border-b border-[var(--border-default)] pb-4">
                    <h2 className="text-h2 text-[var(--text-base)]">
                        Typography
                    </h2>
                    <span className="text-body text-[var(--text-secondary)]">
                        Font Scale
                    </span>
                </div>

                <div className="grid lg:grid-cols-2 gap-12">
                    <div className="space-y-8">
                        <div className="space-y-2">
                            <span className="text-caption text-[var(--text-secondary)] uppercase tracking-wider">
                                Display
                            </span>
                            <p className="text-hero-display text-[var(--text-base)]">
                                Hero Display
                            </p>
                            <p className="text-display text-[var(--text-base)]">
                                Display Title
                            </p>
                        </div>

                        <div className="space-y-4">
                            <span className="text-caption text-[var(--text-secondary)] uppercase tracking-wider">
                                Headings
                            </span>
                            <div className="space-y-2">
                                <p className="text-h1 text-[var(--text-base)]">
                                    Heading 1 - The quick brown fox
                                </p>
                                <p className="text-h2 text-[var(--text-base)]">
                                    Heading 2 - Jumps over the lazy dog
                                </p>
                                <p className="text-h3 text-[var(--text-base)]">
                                    Heading 3 - Discover new horizons
                                </p>
                                <p className="text-h4 text-[var(--text-base)]">
                                    Heading 4 - A journey of a thousand miles
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="space-y-4">
                            <span className="text-caption text-[var(--text-secondary)] uppercase tracking-wider">
                                Body & Utility
                            </span>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-body-large text-[var(--text-base)] mb-1">
                                        Body Large
                                    </p>
                                    <p className="text-body-large text-[var(--text-secondary)]">
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                                        do eiusmod tempor incididunt ut labore et dolore magna
                                        aliqua. Ut enim ad minim veniam.
                                    </p>
                                </div>
                                <div>
                                    <p className="text-body text-[var(--text-base)] mb-1">
                                        Body Regular
                                    </p>
                                    <p className="text-body text-[var(--text-secondary)]">
                                        Quis nostrud exercitation ullamco laboris nisi ut aliquip ex
                                        ea commodo consequat. Duis aute irure dolor in reprehenderit
                                        in voluptate velit esse cillum.
                                    </p>
                                </div>
                                <div className="flex gap-12">
                                    <div>
                                        <p className="text-caption text-[var(--text-base)] mb-1">
                                            Caption
                                        </p>
                                        <p className="text-caption text-[var(--text-secondary)]">
                                            Image caption or meta text
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-overline text-[var(--text-base)] mb-1">
                                            Overline
                                        </p>
                                        <p className="text-overline text-[var(--text-secondary)]">
                                            Uppercased Tracking
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Surface Tests */}
            <section className="space-y-10">
                <div className="flex items-baseline justify-between border-b border-[var(--border-default)] pb-4">
                    <h2 className="text-h2 text-[var(--text-base)]">
                        Contextual Semantics
                    </h2>
                    <span className="text-body text-[var(--text-secondary)]">
                        Components on Surfaces
                    </span>
                </div>

                <div className="grid gap-8">
                    <ButtonShowcase
                        bgClass="bg-[var(--bg-page)]"
                        title="Page Background (Light)"
                        textClass="text-[var(--text-base)]"
                    />
                    <ButtonShowcase
                        bgClass="bg-[var(--color-neutral-900)]"
                        title="Inverse Background (Dark)"
                        textClass="text-white"
                    />
                    <ButtonShowcase
                        bgClass="bg-[var(--bg-primary-subtle)]"
                        title="Brand Background (Subtle)"
                        textClass="text-[var(--text-base)]"
                    />
                </div>
            </section>
        </div>
    );
}
