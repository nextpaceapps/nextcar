import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { opportunityService } from '../services/opportunityService';
import { Link } from 'react-router-dom';

export default function OpportunitiesPage() {
    const queryClient = useQueryClient();

    const { data: opportunities = [], isLoading, error } = useQuery({
        queryKey: ['opportunities'],
        queryFn: opportunityService.getOpportunities
    });

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
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Opportunities</h1>
                <Link
                    to="/opportunities/new"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 font-medium shadow-sm transition-colors"
                >
                    + Add Opportunity
                </Link>
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
                            {opportunities.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                        No opportunities found. Click "Add Opportunity" to create one.
                                    </td>
                                </tr>
                            ) : (
                                opportunities.map((opportunity) => (
                                    <tr key={opportunity.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{opportunity.customerName || 'Unknown Customer'}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{opportunity.vehicleName || 'None'}</div>
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
