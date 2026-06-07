import { Search } from "lucide-react";
import { Text } from "@/shared/components/ui";

export function BrandVoiceShowcase() {
    return (
        <section className="space-y-8">
            <div>
                <Text variant="h2" weight="bold" className="mb-2 block">Brand Voice</Text>
                <Text variant="base" intent="secondary">Representing SURWASH through copy and visual pairing.</Text>
            </div>

            <div className="grid grid-cols-2 gap-8">
                {/* Pairing Example */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="h-48 relative overflow-hidden bg-gray-200">
                        <img
                            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&fit=crop"
                            className="w-full h-full object-cover"
                            alt="Water"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-8 text-center">
                            <div className="space-y-2">
                                <Text
                                    variant="4xl"
                                    intent="inverse"
                                    className="block font-bold"
                                >
                                    Clean Water, Healthy Communities
                                </Text>
                                <Text
                                    variant="sm"
                                    weight="semibold"
                                    className="tracking-widest uppercase block text-[var(--color-primary-200)]"
                                >
                                    WASH PROGRAM IN NIGERIA
                                </Text>
                            </div>
                        </div>
                    </div>
                    <div className="p-6">
                        <Text variant="base" weight="semibold" className="mb-2 block">Typography Pairing</Text>
                        <Text variant="sm" intent="secondary" className="block">
                            Combine Unbounded (Display) for impact statistics with Fira Sans (Body) for clarity.
                            Always maintain structural alignment with the program rules.
                        </Text>
                    </div>
                </div>

                {/* Success Copy */}
                <div className="bg-[var(--color-info-50)] border border-[var(--color-info-200)] rounded-xl p-8 flex flex-col justify-center">
                    <Text variant="sm" weight="bold" className="uppercase tracking-widest mb-4 block text-[var(--color-info-700)]">
                        TONE OF VOICE
                    </Text>
                    <Text variant="2xl" weight="bold" className="mb-4 block text-[var(--color-secondary-900)] leading-tight">
                        &ldquo;Sustainable water, sanitation, and hygiene delivery in rural and urban Nigeria.&rdquo;
                    </Text>
                    <Text intent="secondary" className="italic block text-[var(--color-secondary-500)] opacity-80">
                        Keywords: Cleanliness, Vitality, Sustainability, Trust.
                    </Text>
                </div>
            </div>

            {/* Empty States */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search className="w-10 h-10 text-gray-300" />
                </div>
                <Text variant="h3" weight="bold" className="mb-2 block">No blog posts found</Text>
                <Text intent="secondary" className="max-w-sm mx-auto mb-8 block">
                    WASH updates are coming soon! No articles have been published for this region yet.
                </Text>
                <button className="px-6 py-3 bg-[var(--color-action-primary)] text-[var(--text-inverse)] font-semibold rounded-lg hover:shadow-lg transition-all cursor-pointer">
                    Browse All Posts
                </button>
            </div>
        </section>
    );
}
