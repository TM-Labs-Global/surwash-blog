import { MoreHorizontal, ChevronLeft, ChevronRight, Filter, Sliders } from "lucide-react";
import { Text } from "@/shared/components/ui";

export function DataTablesShowcase() {
    const tableData = [
        { id: 'POST-001', author: 'Adebayo Chen', title: 'Improving Water Access in Kano State', date: 'Jun 01, 2026', views: '2,450', status: 'Published' },
        { id: 'POST-002', author: 'Sarah Ibrahim', title: 'Sanitation Reforms in FCT Abuja', date: 'Jun 03, 2026', views: '1,980', status: 'Draft' },
        { id: 'POST-003', author: 'Chidi Okafor', title: 'Hygiene Training in Lagos Schools', date: 'Jun 05, 2026', views: '0', status: 'Review' },
        { id: 'POST-004', author: 'Emeka Nwosu', title: 'Federal WASH Funding Allocation v2', date: 'Jun 06, 2026', views: '3,100', status: 'Published' },
    ];

    return (
        <section className="space-y-8">
            <div>
                <Text variant="h2" weight="bold" className="mb-2 block">Data Tables</Text>
                <Text variant="base" intent="secondary">Complex data representation for admin and article management.</Text>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Table Toolbar */}
                <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 cursor-pointer">
                            <Filter className="w-4 h-4 text-gray-500" />
                            <Text variant="sm" weight="medium">Filter</Text>
                        </button>
                        <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 cursor-pointer">
                            <Sliders className="w-4 h-4 text-gray-500" />
                            <Text variant="sm" weight="medium">Sort</Text>
                        </button>
                    </div>
                    <Text variant="sm" weight="medium" intent="muted">
                        Displaying 4 of 128 blog posts
                    </Text>
                </div>

                {/* Table Content */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="px-6 py-4 border-b border-gray-100">
                                    <Text variant="xs" weight="bold" className="uppercase tracking-widest" intent="muted">Post ID</Text>
                                </th>
                                <th className="px-6 py-4 border-b border-gray-100">
                                    <Text variant="xs" weight="bold" className="uppercase tracking-widest" intent="muted">Author</Text>
                                </th>
                                <th className="px-6 py-4 border-b border-gray-100">
                                    <Text variant="xs" weight="bold" className="uppercase tracking-widest" intent="muted">Title</Text>
                                </th>
                                <th className="px-6 py-4 border-b border-gray-100">
                                    <Text variant="xs" weight="bold" className="uppercase tracking-widest" intent="muted">Publish Date</Text>
                                </th>
                                <th className="px-6 py-4 border-b border-gray-100">
                                    <Text variant="xs" weight="bold" className="uppercase tracking-widest" intent="muted">Views</Text>
                                </th>
                                <th className="px-6 py-4 border-b border-gray-100">
                                    <Text variant="xs" weight="bold" className="uppercase tracking-widest" intent="muted">Status</Text>
                                </th>
                                <th className="px-6 py-4 border-b border-gray-100"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {tableData.map((row) => (
                                <tr key={row.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <Text variant="xs" weight="bold" className="font-mono bg-[var(--color-secondary-50)] px-2 py-1 rounded text-[var(--color-secondary-500)]">
                                            {row.id}
                                        </Text>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-[var(--color-primary-200)] flex items-center justify-center text-[var(--color-secondary-900)] font-bold text-xs">
                                                {row.author.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <Text weight="semibold">{row.author}</Text>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Text variant="sm" intent="secondary">{row.title}</Text>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Text variant="sm" intent="secondary">{row.date}</Text>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Text variant="sm" weight="bold">{row.views}</Text>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full border ${
                                            row.status === 'Published' ? 'bg-[var(--color-success-50)] border-[var(--color-success-200)]' :
                                            row.status === 'Draft' ? 'bg-[var(--color-warning-50)] border-[var(--color-warning-200)]' :
                                            'bg-[var(--color-error-50)] border-[var(--color-error-200)]'
                                        }`}>
                                            <Text
                                                variant="xs"
                                                weight="bold"
                                                className="uppercase"
                                                style={{
                                                    color: row.status === 'Published' ? 'var(--color-success-700)' :
                                                           row.status === 'Draft' ? 'var(--color-warning-700)' :
                                                           'var(--color-error-700)'
                                                }}
                                            >
                                                {row.status}
                                            </Text>
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
                                            <MoreHorizontal className="w-4 h-4 text-gray-400" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Table Pagination */}
                <div className="p-4 border-t border-gray-100 flex items-center justify-between">
                    <Text variant="sm" intent="muted">Page 1 of 32</Text>
                    <div className="flex gap-2">
                        <button className="p-2 border border-gray-200 rounded-lg disabled:opacity-30 cursor-not-allowed" disabled>
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button className="px-3 py-1 bg-[var(--color-secondary-100)] rounded-lg cursor-pointer">
                            <Text variant="sm" weight="bold" className="text-[var(--color-secondary-900)]">1</Text>
                        </button>
                        <button className="px-3 py-1 cursor-pointer">
                            <Text variant="sm" weight="medium" intent="muted">2</Text>
                        </button>
                        <button className="px-3 py-1 cursor-pointer">
                            <Text variant="sm" weight="medium" intent="muted">3</Text>
                        </button>
                        <button className="p-2 border border-gray-200 rounded-lg cursor-pointer">
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
