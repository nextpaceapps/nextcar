import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { customerService } from '../services/customerService';
import { Link } from 'react-router-dom';

export default function CustomersPage() {
    const queryClient = useQueryClient();

    const { data: customers = [], isLoading, error } = useQuery({
        queryKey: ['customers'],
        queryFn: customerService.getCustomers
    });

    const deleteMutation = useMutation({
        mutationFn: customerService.deleteCustomer,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['customers'] })
    });

    const handleDelete = async (id: string, name: string) => {
        if (window.confirm(`Are you sure you want to delete customer ${name}?`)) {
            await deleteMutation.mutateAsync(id);
        }
    };

    if (isLoading) return <div className="p-8 text-center text-gray-500">Loading customers...</div>;
    if (error) return <div className="p-8 text-center text-red-500">Error loading customers</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
                <Link
                    to="/customers/new"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 font-medium shadow-sm transition-colors"
                >
                    + Add Customer
                </Link>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Name
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Contact
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Tags
                                </th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {customers.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                        No customers found. Click "Add Customer" to create one.
                                    </td>
                                </tr>
                            ) : (
                                customers.map((customer) => (
                                    <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                                            {customer.notes && (
                                                <div className="text-xs text-gray-500 truncate max-w-xs">{customer.notes}</div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{customer.email || '-'}</div>
                                            <div className="text-sm text-gray-500">{customer.phone || '-'}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-1">
                                                {customer.tags?.map(tag => (
                                                    <span key={tag} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <Link
                                                to={`/customers/${customer.id}/edit`}
                                                className="text-indigo-600 hover:text-indigo-900 mr-4 transition-colors"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => customer.id && handleDelete(customer.id, customer.name)}
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
