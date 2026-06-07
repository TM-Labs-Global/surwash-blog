import { Check, Upload } from "lucide-react";
import { useState } from "react";
import { Text } from "@/shared/components/ui";

export function AdvancedFormsShowcase() {
    const [toggleStates, setToggleStates] = useState({
        notifications: true,
        marketing: false,
        sms: true,
    });

    return (
        <section className="space-y-8">
            <div>
                <Text variant="h2" weight="bold" className="mb-2 block">Advanced Forms</Text>
                <Text variant="base" intent="secondary">Complex form patterns and interactive controls.</Text>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-10">
                {/* Multistep Progress */}
                <div>
                    <Text variant="xs" weight="semibold" className="uppercase tracking-wider mb-6 block text-center" intent="muted">Publishing Progress</Text>
                    <div className="flex items-center justify-between max-w-2xl mx-auto">
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-10 h-10 bg-[var(--color-secondary-900)] text-white rounded-full flex items-center justify-center font-bold">
                                <Check className="w-5 h-5" />
                            </div>
                            <Text variant="xs" weight="bold" className="text-[var(--color-secondary-900)]">Draft</Text>
                        </div>
                        <div className="flex-1 h-1 bg-[var(--color-secondary-900)] mx-4 rounded-full" />
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-10 h-10 bg-[var(--color-action-primary)] text-[var(--text-inverse)] rounded-full flex items-center justify-center font-bold ring-4 ring-[var(--color-primary-100)]">
                                2
                            </div>
                            <Text variant="xs" weight="bold" className="text-[var(--color-secondary-900)]">Review</Text>
                        </div>
                        <div className="flex-1 h-1 bg-gray-200 mx-4 rounded-full" />
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-10 h-10 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center font-bold">
                                3
                            </div>
                            <Text variant="xs" weight="bold" intent="muted">Publish</Text>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-12">
                    {/* Toggle Switches */}
                    <div className="space-y-6">
                        <Text variant="xs" weight="semibold" className="uppercase tracking-wider block" intent="muted">Toggles & Switches</Text>
                        <div className="space-y-4">
                            {[
                                { id: 'notifications', label: 'Push Notifications', sub: 'Get real-time publication alerts' },
                                { id: 'marketing', label: 'Email Alerts', sub: 'Notify state team on new drafts' },
                                { id: 'sms', label: 'SMS Updates', sub: 'Standard rates apply' }
                            ].map(item => (
                                <div key={item.id} className="flex items-center justify-between">
                                    <div>
                                        <Text weight="semibold" className="block text-[var(--text-base)]">{item.label}</Text>
                                        <Text variant="xs" className="block text-[var(--text-secondary)]">{item.sub}</Text>
                                    </div>
                                    <button
                                        onClick={() => setToggleStates(prev => ({ ...prev, [item.id as keyof typeof toggleStates]: !prev[item.id as keyof typeof toggleStates] }))}
                                        className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${toggleStates[item.id as keyof typeof toggleStates] ? 'bg-[var(--color-success-500)]' : 'bg-gray-200'
                                            }`}
                                    >
                                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${toggleStates[item.id as keyof typeof toggleStates] ? 'right-1' : 'left-1'
                                            }`} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* File Upload */}
                    <div className="space-y-6">
                        <Text variant="xs" weight="semibold" className="uppercase tracking-wider block" intent="muted">Document Upload</Text>
                        <div className="border-2 border-dashed border-[var(--border-default)] rounded-2xl p-8 text-center hover:border-[var(--color-action-secondary)] transition-colors cursor-pointer group bg-gray-50/50">
                            <div className="w-12 h-12 bg-[var(--color-secondary-100)] rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                <Upload className="w-6 h-6 text-[var(--color-action-secondary)]" />
                            </div>
                            <Text weight="bold" className="block text-gray-900">Upload Cover Image</Text>
                            <Text variant="xs" intent="secondary" className="mt-1 block">PDF, JPG or PNG (Max 5MB)</Text>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-[var(--color-success-50)] rounded-xl border border-[var(--color-success-200)]">
                            <div className="w-8 h-8 bg-white rounded flex items-center justify-center text-[var(--color-success-500)]">
                                <Check className="w-4 h-4" />
                            </div>
                            <div className="flex-1">
                                <Text variant="xs" weight="bold" className="block text-[var(--color-success-700)]">cover_image_nigeria.jpg</Text>
                                <div className="w-full h-1 bg-white/50 rounded-full mt-1 overflow-hidden">
                                    <div className="w-full h-full bg-[var(--color-success-500)]" />
                                </div>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
