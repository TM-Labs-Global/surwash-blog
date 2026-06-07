import React from 'react';
import { Input, InputProps, Text } from '@/shared/components/ui';

interface FormInputProps extends InputProps {
    name: string;
    errors?: Record<string, unknown>;
}

/**
 * FormInput component that integrates with react-hook-form.
 * Extracts and displays validation errors automatically using the Text component.
 */
export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
    ({ name, errors, label, hasError, ...props }, ref) => {
        // Extract error message for this specific field
        // Handles nested errors (e.g., user.name)
        const error = name.split('.').reduce((obj: unknown, key) => {
            if (obj && typeof obj === 'object') {
                return (obj as Record<string, unknown>)[key];
            }
            return undefined;
        }, errors as unknown);
        const errorMessage = (error && typeof error === 'object' && 'message' in error)
            ? (error as { message?: string }).message
            : undefined;
        const fieldHasError = !!errorMessage || hasError;

        return (
            <div className="w-full">
                <Input
                    ref={ref}
                    name={name}
                    label={label}
                    hasError={fieldHasError}
                    {...props}
                />

                {errorMessage && (
                    <Text
                        variant="xs"
                        intent="error"
                        className="mt-1"
                    >
                        {errorMessage}
                    </Text>
                )}
            </div>
        );
    }
);

FormInput.displayName = 'FormInput';
