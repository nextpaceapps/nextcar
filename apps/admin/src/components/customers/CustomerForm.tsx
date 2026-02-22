import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { customerSchema, CUSTOMER_TAGS, type CustomerSchema, type Customer, type CustomerTag } from '@nextcar/shared';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { customerService } from '../../services/customerService';
import { useNavigate } from 'react-router-dom';

interface CustomerFormProps {
    initialData?: Customer;
    isEdit?: boolean;
}

export default function CustomerForm({ initialData, isEdit = false }: CustomerFormProps) {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [saveError, setSaveError] = useState<string | null>(null);

    const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm<z.input<typeof customerSchema>>({
        resolver: zodResolver(customerSchema),
        defaultValues: initialData ? {
            ...initialData,
            tags: initialData.tags || [],
        } : {
            name: '',
            phone: '',
            email: '',
            notes: '',
            tags: [],
            deleted: false,
        }
    });

    const watchTags = watch('tags') || [];

    const toggleTag = (tag: CustomerTag) => {
        const newTags = watchTags.includes(tag)
            ? watchTags.filter(t => t !== tag)
            : [...watchTags, tag];
        setValue('tags', newTags, { shouldValidate: true, shouldDirty: true });
    };

    const createMutation = useMutation({
        mutationFn: customerService.createCustomer,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['customers'] });
            navigate('/customers');
        }
    });

    const updateMutation = useMutation({
        mutationFn: (data: CustomerSchema) => {
            const id = initialData?.id;
            if (!id) throw new Error('Cannot update customer without an ID');
            return customerService.updateCustomer(id, data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['customers'] });
            navigate('/customers');
        }
    });

    const onSubmit: SubmitHandler<z.input<typeof customerSchema>> = async (data) => {
        try {
            if (isEdit) {
                await updateMutation.mutateAsync(data as CustomerSchema);
            } else {
                await createMutation.mutateAsync(data as CustomerSchema);
            }
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'An unexpected error occurred';
            console.error('Error saving customer:', error);
            setSaveError(message);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 rounded-lg shadow">
                <h2 className="text-2xl font-bold mb-6">{isEdit ? 'Edit Customer' : 'Add New Customer'}</h2>

                {saveError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center justify-between">
                        <span className="text-sm">❌ {saveError}</span>
                        <button type="button" onClick={() => setSaveError(null)} className="text-red-500 hover:text-red-700 font-bold">×</button>
                    </div>
                )}

                <fieldset className="border border-gray-200 rounded-lg p-4 space-y-4">
                    <legend className="text-sm font-semibold text-gray-600 px-2">Customer Details</legend>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Name *</label>
                            <input {...register('name')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2" />
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Phone</label>
                            <input {...register('phone')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2" />
                            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input type="email" {...register('email')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2" />
                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                        <div className="flex flex-wrap gap-2">
                            {CUSTOMER_TAGS.map(tag => (
                                <button
                                    key={tag}
                                    type="button"
                                    onClick={() => toggleTag(tag)}
                                    className={`px-3 py-1 rounded-full border text-sm font-medium transition-colors ${watchTags.includes(tag)
                                        ? 'bg-blue-100 border-blue-300 text-blue-800 hover:bg-blue-200'
                                        : 'bg-gray-100 border-gray-300 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                        {errors.tags && <p className="text-red-500 text-xs mt-1">{errors.tags.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Notes</label>
                        <textarea {...register('notes')} rows={4} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2" />
                        {errors.notes && <p className="text-red-500 text-xs mt-1">{errors.notes.message}</p>}
                    </div>
                </fieldset>

                <div className="flex justify-end gap-4">
                    <button
                        type="button"
                        onClick={() => navigate('/customers')}
                        className="px-6 py-2.5 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-6 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 font-medium flex items-center gap-2"
                    >
                        {isSubmitting ? 'Saving...' : '💾 Save Customer'}
                    </button>
                </div>
            </form>
        </div>
    );
}
