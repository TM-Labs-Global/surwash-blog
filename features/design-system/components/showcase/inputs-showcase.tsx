import { MapPin, Check, Search, Mail, Lock } from "lucide-react";
import { Text, Input } from "@/shared/components/ui";
import { FormInput } from "@/shared/components/form";

export function InputsShowcase() {
    // Mock errors object as if from react-hook-form
    const mockErrors = {
        email: { message: "Please enter a valid email address" },
        password: { message: "Password must be at least 8 characters" }
    };

    return (
        <section className="space-y-8">
            <div>
                <Text variant="h2" weight="bold" className="mb-2 block">Form Inputs</Text>
                <Text variant="base" intent="secondary">
                    Input fields, selects, and form controls for blog management flows.
                </Text>
            </div>

            {/* Base UI Inputs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <Text variant="lg" weight="semibold" className="mb-4 block">
                    Base UI Inputs
                </Text>
                <div className="grid grid-cols-2 gap-6">
                    <Input
                        label="Default Input"
                        placeholder="Enter post title"
                    />

                    <Input
                        label="With Left Icon"
                        placeholder="State region scope"
                        icon={<MapPin className="w-5 h-5" />}
                    />

                    <Input
                        label="Filled State"
                        defaultValue="Lagos State"
                        readOnly
                    />

                    <Input
                        label="Error State"
                        placeholder="Email address"
                        hasError
                    />

                    <Input
                        label="Success State"
                        defaultValue="john@surwash.gov.ng"
                        hasSuccess
                        rightIcon={<Check className="w-5 h-5 text-[var(--color-success-500)]" />}
                    />

                    <Input
                        label="Disabled"
                        placeholder="Disabled input"
                        disabled
                    />
                </div>
            </div>

            {/* Form Integration */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="mb-4">
                    <Text variant="lg" weight="semibold" className="block">Form Integration</Text>
                    <Text variant="xs" intent="muted">Using shared/components/form/FormInput with react-hook-form errors</Text>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <FormInput
                        name="email"
                        label="Email Address"
                        placeholder="your@email.com"
                        icon={<Mail className="w-5 h-5" />}
                        errors={mockErrors}
                    />

                    <FormInput
                        name="password"
                        label="Password"
                        type="password"
                        placeholder="••••••••"
                        icon={<Lock className="w-5 h-5" />}
                        errors={mockErrors}
                    />

                    <FormInput
                        name="username"
                        label="Username"
                        placeholder="johndoe"
                        errors={{}} // No error
                    />
                </div>
            </div>

            {/* Select & Date */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <Text variant="lg" weight="semibold" className="mb-4 block">
                    Select & Date Inputs
                </Text>
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <Text variant="sm" weight="medium" intent="secondary" className="mb-2 block">
                            Select State Scope
                        </Text>
                        <select className="w-full px-4 py-3 border border-[var(--border-default)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)] focus:border-transparent appearance-none bg-white">
                            <option>Federal / National</option>
                            <option>Abuja (FCT)</option>
                            <option>Lagos State</option>
                            <option>Kano State</option>
                        </select>
                    </div>
                    <div>
                        <Text variant="sm" weight="medium" intent="secondary" className="mb-2 block">
                            Publication Date
                        </Text>
                        <input
                            type="date"
                            className="w-full px-4 py-3 border border-[var(--border-default)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)] focus:border-transparent"
                        />
                    </div>
                </div>
            </div>

            {/* Checkbox & Radio */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <Text variant="lg" weight="semibold" className="mb-4 block">
                    Checkbox & Radio
                </Text>
                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                className="w-5 h-5 rounded border-gray-300 text-[var(--color-primary-500)] focus:ring-[var(--border-focus)]"
                                defaultChecked
                            />
                            <Text variant="base" intent="secondary">
                                Subscribe to federal WASH notifications
                            </Text>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                className="w-5 h-5 rounded border-gray-300 text-[var(--color-primary-500)] focus:ring-[var(--border-focus)]"
                            />
                            <Text variant="base" intent="secondary">
                                Request editorial review priority
                            </Text>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                className="w-5 h-5 rounded border-gray-300 text-[var(--color-primary-500)] focus:ring-[var(--border-focus)]"
                            />
                            <Text variant="base" intent="secondary">
                                Save draft on local device
                            </Text>
                        </label>
                    </div>
                    <div className="space-y-3">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="radio"
                                name="scope"
                                className="w-5 h-5 border-gray-300 text-[var(--color-primary-500)] focus:ring-[var(--border-focus)]"
                                defaultChecked
                            />
                            <Text variant="base" intent="secondary">
                                National Scope
                            </Text>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="radio"
                                name="scope"
                                className="w-5 h-5 border-gray-300 text-[var(--color-primary-500)] focus:ring-[var(--border-focus)]"
                            />
                            <Text variant="base" intent="secondary">
                                Regional Scope
                            </Text>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="radio"
                                name="scope"
                                className="w-5 h-5 border-gray-300 text-[var(--color-primary-500)] focus:ring-[var(--border-focus)]"
                            />
                            <Text variant="base" intent="secondary">
                                State-Specific Scope
                            </Text>
                        </label>
                    </div>
                </div>
            </div>

            {/* Search Input */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <Text variant="lg" weight="semibold" className="mb-4 block">
                    Search Input
                </Text>
                <div className="max-w-md">
                    <Input
                        placeholder="Search articles by state, category, or title..."
                        icon={<Search className="w-5 h-5" />}
                        className="text-lg py-4 rounded-xl"
                    />
                </div>
            </div>
        </section>
    );
}
