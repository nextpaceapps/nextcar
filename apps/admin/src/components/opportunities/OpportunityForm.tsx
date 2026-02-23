import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { opportunitySchema, OPPORTUNITY_STAGES, type OpportunitySchema, type Opportunity } from '@nextcar/shared';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { opportunityService } from '../../services/opportunityService';
import { customerService } from '../../services/customerService';
import { carService } from '../../services/carService';
import { useNavigate, useSearchParams } from 'react-router-dom';

interface OpportunityFormProps {
    initialData?: Opportunity;
    isEdit?: boolean;
}

export default function OpportunityForm({ initialData, isEdit = false }: OpportunityFormProps) {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [searchParams] = useSearchParams();
    const [saveError, setSaveError] = useState<string | null>(null);

    // Provide a way to default to a customer from query params if passed.
    const prefillCustomerId = searchParams.get('customerId') || '';

    const { data: customers = [] } = useQuery({
        queryKey: ['customers'],
        queryFn: customerService.getCustomers
    });

    const { data: vehicles = [] } = useQuery({
        queryKey: ['cars'],
        queryFn: carService.getCars
    });

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<z.input<typeof opportunitySchema>>({
        resolver: zodResolver(opportunitySchema),
        defaultValues: initialData ? {
            ...initialData,
        } : {
            customerId: prefillCustomerId,
            vehicleId: '',
            stage: 'new',
            expectedValue: undefined,
            notes: '',
            nextActionDate: '',
            deleted: false,
        }
    });

    // Helper for optional number fields
    const optionalNumber = (name: keyof OpportunitySchema) => register(name, {
        setValueAs: (v: string | undefined | null) => (v === '' || v === undefined || v === null) ? undefined : Number(v)
    });

    const createMutation = useMutation({
        mutationFn: opportunityService.createOpportunity,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['opportunities'] });
            navigate('/opportunities');
        }
    });

    const updateMutation = useMutation({
        mutationFn: (data: OpportunitySchema) => {
            const id = initialData?.id;
            if (!id) throw new Error('Cannot update opportunity without an ID');
            return opportunityService.updateOpportunity(id, data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['opportunities'] });
            navigate('/opportunities');
        }
    });

    const onSubmit: SubmitHandler<z.input<typeof opportunitySchema>> = async (data) => {
        try {
            // make empty strings undefined for vehicleId so it doesn't try to store ''
            const submissionData = {
                ...data,
                vehicleId: data.vehicleId === '' ? undefined : data.vehicleId,
            };
            if (isEdit) {
                await updateMutation.mutateAsync(submissionData as OpportunitySchema);
            } else {
                await createMutation.mutateAsync(submissionData as OpportunitySchema);
            }
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'An unexpected error occurred';
            console.error('Error saving opportunity:', error);
            setSaveError(message);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 rounded-lg shadow">
                <h2 className="text-2xl font-bold mb-6">{isEdit ? 'Edit Opportunity' : 'Add New Opportunity'}</h2>

                {saveError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center justify-between">
                        <span className="text-sm">❌ {saveError}</span>
                        <button type="button" onClick={() => setSaveError(null)} className="text-red-500 hover:text-red-700 font-bold">×</button>
                    </div>
                )}

                <fieldset className="border border-gray-200 rounded-lg p-4 space-y-4">
                    <legend className="text-sm font-semibold text-gray-600 px-2">Key Entities</legend>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Customer *</label>
                            <select {...register('customerId')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2">
                                <option value="">Select a Customer...</option>
                                {customers.map(c => (
                                    <option key={c.id} value={c.id}>{c.name} {c.email ? `(${c.email})` : ''}</option>
                                ))}
                            </select>
                            {errors.customerId && <p className="text-red-500 text-xs mt-1">{errors.customerId.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Vehicle</label>
                            <select {...register('vehicleId')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2">
                                <option value="">None (Optional)</option>
                                {vehicles.map(v => (
                                    <option key={v.id} value={v.id}>{v.make} {v.model} - {v.year}</option>
                                ))}
                            </select>
                            {errors.vehicleId && <p className="text-red-500 text-xs mt-1">{errors.vehicleId.message}</p>}
                        </div>
                    </div>
                </fieldset>

                <fieldset className="border border-gray-200 rounded-lg p-4 space-y-4">
                    <legend className="text-sm font-semibold text-gray-600 px-2">Opportunity Details</legend>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Stage</label>
                            <select {...register('stage')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2 uppercase text-sm">
                                {OPPORTUNITY_STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                            {errors.stage && <p className="text-red-500 text-xs mt-1">{errors.stage.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Expected Value ($)</label>
                            <input type="number" {...optionalNumber('expectedValue')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2" />
                            {errors.expectedValue && <p className="text-red-500 text-xs mt-1">{errors.expectedValue.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Next Action Date</label>
                            <input type="date" {...register('nextActionDate')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2" />
                            {errors.nextActionDate && <p className="text-red-500 text-xs mt-1">{errors.nextActionDate.message}</p>}
                        </div>
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
                        onClick={() => navigate('/opportunities')}
                        className="px-6 py-2.5 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-6 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 font-medium flex items-center gap-2"
                    >
                        {isSubmitting ? 'Saving...' : '💾 Save Opportunity'}
                    </button>
                </div>
            </form>
        </div>
    );
}
