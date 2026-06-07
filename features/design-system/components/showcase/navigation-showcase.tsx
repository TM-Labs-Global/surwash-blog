import { Home, FileText, Bookmark, User, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Text } from "@/shared/components/ui";

export function NavigationShowcase() {
    const [activeTab, setActiveTab] = useState("articles");

    return (
        <section className="space-y-8">
            <div>
                <Text variant="h2" weight="bold" className="mb-2 block">Navigation</Text>
                <Text variant="base" intent="secondary">Site-wide and component-level navigation patterns.</Text>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-10">
                {/* Mobile Tab Bar */}
                <div className="max-w-md mx-auto">
                    <Text variant="xs" weight="semibold" className="uppercase tracking-wider mb-4 block text-center" intent="muted">Mobile Tab Bar</Text>
                    <div className="bg-white border border-[var(--border-default)] rounded-2xl flex items-center justify-around p-2 shadow-xl">
                        {[
                            { id: 'home', icon: Home, label: 'Home' },
                            { id: 'articles', icon: FileText, label: 'Articles' },
                            { id: 'saved', icon: Bookmark, label: 'Saved' },
                            { id: 'profile', icon: User, label: 'Profile' }
                        ].map(item => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all cursor-pointer ${activeTab === item.id
                                    ? 'text-[var(--color-action-secondary)] bg-[var(--color-secondary-100)]'
                                    : 'text-[var(--text-tertiary)] hover:bg-[var(--bg-surface-hover)]'
                                    }`}
                            >
                                <item.icon className="w-6 h-6" />
                                <Text variant="xs" weight="bold" className="uppercase" style={{ fontSize: '10px' }} intent={activeTab === item.id ? 'primary' : 'muted'}>{item.label}</Text>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Desktop Tabs */}
                <div>
                    <Text variant="xs" weight="semibold" className="uppercase tracking-wider mb-4 block" intent="muted">Desktop Sub-Tabs</Text>
                    <div className="flex items-center gap-2 border-b border-[var(--border-default)]">
                        {['All Posts', 'Published', 'Drafts', 'Archived'].map((tab, i) => (
                            <button
                                key={tab}
                                className={`px-6 py-4 border-b-2 transition-all cursor-pointer ${i === 0
                                    ? 'border-[var(--color-action-secondary)] text-[var(--color-action-secondary)]'
                                    : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--color-action-secondary)]'
                                    }`}
                            >
                                <Text variant="sm" weight="semibold" className="text-inherit">{tab}</Text>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Breadcrumbs */}
                <div>
                    <Text variant="xs" weight="semibold" className="uppercase tracking-wider mb-4 block" intent="muted">Breadcrumbs</Text>
                    <div className="flex items-center gap-2">
                        <Text variant="sm" intent="secondary" className="hover:text-[var(--color-action-secondary)] cursor-pointer">Dashboard</Text>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                        <Text variant="sm" intent="secondary" className="hover:text-[var(--color-action-secondary)] cursor-pointer">Articles</Text>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                        <Text variant="sm" weight="bold">Edit Article</Text>
                    </div>
                </div>
            </div>
        </section>
    );
}
