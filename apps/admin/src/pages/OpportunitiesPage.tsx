import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { opportunityService } from '../services/opportunityService';
import { Link } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import type { Opportunity } from '@nextcar/shared';

const SOURCE_FILTER_OPTIONS = [
    { value: 'all', label: 'All sources' },
    { value: 'carvertical', label: 'CarVertical' },
    { value: 'web', label: 'Web lead' },
] as const;

function getSourceLabel(opportunity: Opportunity): string {
    const page = opportunity.source?.page;
    if (page === 'carvertical') return 'CarVertical';
    if (page?.startsWith('/vehicles')) return 'Web lead';
    return page || '—';
}

export default function OpportunitiesPage() {
    const { role } = useAuth();
    const canWrite = role === 'Admin' || role === 'Editor';
    const queryClient = useQueryClient();
    const [sourceFilter, setSourceFilter] = useState<string>('all');

    const { data: opportunities = [], isLoading, error } = useQuery({
        queryKey: ['opportunities'],
        queryFn: opportunityService.getOpportunities
    });

    const filteredOpportunities =
        sourceFilter === 'all'
            ? opportunities
            : sourceFilter === 'carvertical'
                ? opportunities.filter((o) => o.source?.page === 'carvertical')
                : opportunities.filter((o) => o.source?.page !== 'carvertical' && (o.source?.page?.startsWith('/vehicles') ?? false));

    const deleteMutation = useMutation({
        mutationFn: opportunityService.deleteOpportunity,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['opportunities'] })
    });

    const handleDelete = async (id: string) => {
        if (window.confirm(`Are you sure you want to delete this opportunity?`)) {
            await deleteMutation.mutateAsync(id);
        }
    };

    if (isLoading) return <div className="p-8 text-center text-gray-500">Loading opportunities...</div>;
    if (error) return <div className="p-8 text-center text-red-500">Error loading opportunities</div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap justify-between items-center gap-4">
                <h1 className="text-3xl font-bold text-gray-900">Opportunities</h1>
                <div className="flex items-center gap-3">
                    <label htmlFor="source-filter" className="text-sm font-medium text-gray-700">Source</label>
                    <select
                        id="source-filter"
                        value={sourceFilter}
                        onChange={(e) => setSourceFilter(e.target.value)}
                        className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                        {SOURCE_FILTER_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                    {canWrite && (
                        <Link
                            to="/opportunities/new"
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 font-medium shadow-sm transition-colors"
                        >
                            + Add Opportunity
                        </Link>
                    )}
                </div>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Customer
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Vehicle
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Source
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Stage
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Expected Value
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Next Action Date
                                </th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredOpportunities.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                                        {opportunities.length === 0
                                            ? 'No opportunities found. Click "Add Opportunity" to create one.'
                                            : 'No opportunities match the selected source filter.'}
                                    </td>
                                </tr>
                            ) : (
                                filteredOpportunities.map((opportunity) => (
                                    <tr key={opportunity.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{opportunity.customerName || 'Unknown Customer'}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{opportunity.vehicleName || 'None'}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium
                                                    ${opportunity.source?.page === 'carvertical'
                                                        ? 'bg-amber-100 text-amber-800'
                                                        : 'bg-gray-100 text-gray-700'
                                                }`}
                                            >
                                                {getSourceLabel(opportunity)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium uppercase
                                                ${opportunity.stage === 'won' ? 'bg-green-100 text-green-800' :
                                                    opportunity.stage === 'lost' ? 'bg-red-100 text-red-800' :
                                                        opportunity.stage === 'negotiation' ? 'bg-yellow-100 text-yellow-800' :
                                                            'bg-blue-100 text-blue-800'
                                                }`}>
                                                {opportunity.stage}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {opportunity.expectedValue ? `$${opportunity.expectedValue.toLocaleString()}` : '-'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {opportunity.nextActionDate || '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            {canWrite ? (
                                                <>
                                                    <Link
                                                        to={`/opportunities/${opportunity.id}/edit`}
                                                        className="text-indigo-600 hover:text-indigo-900 mr-4 transition-colors"
                                                    >
                                                        Edit
                                                    </Link>
                                                    <button
                                                        onClick={() => opportunity.id && handleDelete(opportunity.id)}
                                                        className="text-red-600 hover:text-red-900 transition-colors"
                                                        disabled={deleteMutation.isPending}
                                                    >
                                                        {deleteMutation.isPending ? '...' : 'Delete'}
                                                    </button>
                                                </>
                                            ) : (
                                                <Link
                                                    to={`/opportunities/${opportunity.id}/edit`}
                                                    className="text-indigo-600 hover:text-indigo-900 transition-colors"
                                                >
                                                    View Details
                                                </Link>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
