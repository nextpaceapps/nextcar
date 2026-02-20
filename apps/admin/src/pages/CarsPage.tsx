import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { carService } from '../services/carService';
import { Link } from 'react-router-dom';
import type { Car } from '@nextcar/shared';

export default function CarsPage() {
    const queryClient = useQueryClient();
    const { data: cars, isLoading, error } = useQuery({
        queryKey: ['cars'],
        queryFn: carService.getCars
    });

    const deleteMutation = useMutation({
        mutationFn: carService.deleteCar,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cars'] });
        }
    });

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this car?')) {
            await deleteMutation.mutateAsync(id);
        }
    };

    if (isLoading) return <div>Loading cars...</div>;
    if (error) return <div>Error loading cars</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Car Inventory</h1>
                <Link to="/cars/new" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    Add New Car
                </Link>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                        <tr className="bg-gray-50">
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Make/Model</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {cars?.map((car: Car) => (
                            <tr key={car.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{car.make} {car.model}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{car.year}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    ${car.price.toLocaleString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${car.status === 'published' ? 'bg-green-100 text-green-800' :
                                            car.status === 'sold' ? 'bg-red-100 text-red-800' :
                                                'bg-gray-100 text-gray-800'}`}>
                                        {car.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <Link to={`/cars/${car.id}/edit`} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</Link>
                                    <button onClick={() => handleDelete(car.id!)} className="text-red-600 hover:text-red-900">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
