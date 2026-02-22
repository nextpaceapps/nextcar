import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { carService } from '../services/carService';
import { Link } from 'react-router-dom';
import type { Car } from '@nextcar/shared';
import { useState, useMemo } from 'react';

export default function CarsPage() {
    const queryClient = useQueryClient();
    const { data: cars, isLoading, error } = useQuery({
        queryKey: ['cars'],
        queryFn: carService.getCars
    });

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [makeFilter, setMakeFilter] = useState<string>('all');
    const [yearMin, setYearMin] = useState<string>('');
    const [yearMax, setYearMax] = useState<string>('');
    const [priceMin, setPriceMin] = useState<string>('');
    const [priceMax, setPriceMax] = useState<string>('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const ITEMS_PER_PAGE = 20;

    const deleteMutation = useMutation({
        mutationFn: carService.deleteCar,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cars'] });
        }
    });

    const updateStatusMutation = useMutation({
        mutationFn: ({ id, status }: { id: string, status: Car['status'] }) =>
            carService.updateCar(id, { status }),
        onMutate: async ({ id, status }) => {
            await queryClient.cancelQueries({ queryKey: ['cars'] });
            const previousCars = queryClient.getQueryData(['cars']);
            queryClient.setQueryData(['cars'], (old: any) =>
                old?.map((car: any) => car.id === id ? { ...car, status } : car)
            );
            return { previousCars };
        },
        onError: (_err, _variables, context) => {
            if (context?.previousCars) {
                queryClient.setQueryData(['cars'], context.previousCars);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['cars'] });
        },
    });

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this car?')) {
            await deleteMutation.mutateAsync(id);
        }
    };

    const handleUpdateStatus = async (id: string, status: Car['status']) => {
        await updateStatusMutation.mutateAsync({ id, status });
    };

    const availableMakes = useMemo(() => {
        if (!cars) return [];
        const makes = new Set(cars.map(c => c.make).filter(Boolean));
        return Array.from(makes).sort() as string[];
    }, [cars]);

    const filteredCars = useMemo(() => {
        if (!cars) return [];
        return cars.filter(car => {
            const title = `${car.make} ${car.model}`.toLowerCase();
            const vin = (car.vin || '').toLowerCase();
            const search = searchTerm.toLowerCase();

            if (search && !(title.includes(search) || vin.includes(search))) return false;
            if (statusFilter !== 'all' && car.status !== statusFilter) return false;
            if (makeFilter !== 'all' && car.make !== makeFilter) return false;

            if (yearMin && car.year < parseInt(yearMin, 10)) return false;
            if (yearMax && car.year > parseInt(yearMax, 10)) return false;

            if (priceMin && car.price < parseInt(priceMin, 10)) return false;
            if (priceMax && car.price > parseInt(priceMax, 10)) return false;

            return true;
        });
    }, [cars, searchTerm, statusFilter, makeFilter, yearMin, yearMax, priceMin, priceMax]);

    // Reset page if filters change
    useMemo(() => { setCurrentPage(1); }, [searchTerm, statusFilter, makeFilter, yearMin, yearMax, priceMin, priceMax]);

    const totalPages = Math.ceil(filteredCars.length / ITEMS_PER_PAGE);
    const paginatedCars = filteredCars.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    const hasActiveFilters = searchTerm !== '' || statusFilter !== 'all' || makeFilter !== 'all' || yearMin !== '' || yearMax !== '' || priceMin !== '' || priceMax !== '';

    const handleClearFilters = () => {
        setSearchTerm('');
        setStatusFilter('all');
        setMakeFilter('all');
        setYearMin('');
        setYearMax('');
        setPriceMin('');
        setPriceMax('');
        setCurrentPage(1);
    };

    if (isLoading) return <div>Loading cars...</div>;
    if (error) return <div>Error loading cars: {(error as Error).message}</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Car Inventory</h1>
                <Link to="/cars/new" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    Add New Car
                </Link>
            </div>

            <div className="bg-white p-4 rounded-lg shadow space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Search Make, Model, VIN</label>
                        <input
                            type="text"
                            placeholder="e.g. Toyota Camry or VIN..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 border"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 border"
                        >
                            <option value="all">All Statuses</option>
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                            <option value="sold">Sold</option>
                            <option value="archived">Archived</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Make</label>
                        <select
                            value={makeFilter}
                            onChange={(e) => setMakeFilter(e.target.value)}
                            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 border"
                        >
                            <option value="all">All Makes</option>
                            {availableMakes.map((m) => (
                                <option key={m} value={m}>{m}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex gap-2">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Min Year</label>
                            <input
                                type="number"
                                placeholder="e.g. 2010"
                                value={yearMin}
                                onChange={(e) => setYearMin(e.target.value)}
                                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 border"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Max Year</label>
                            <input
                                type="number"
                                placeholder="e.g. 2024"
                                value={yearMax}
                                onChange={(e) => setYearMax(e.target.value)}
                                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 border"
                            />
                        </div>
                    </div>
                    <div className="flex gap-2 lg:col-span-2">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Min Price</label>
                            <input
                                type="number"
                                placeholder="e.g. 5000"
                                value={priceMin}
                                onChange={(e) => setPriceMin(e.target.value)}
                                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 border"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Max Price</label>
                            <input
                                type="number"
                                placeholder="e.g. 50000"
                                value={priceMax}
                                onChange={(e) => setPriceMax(e.target.value)}
                                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 border"
                            />
                        </div>
                    </div>
                </div>

                {hasActiveFilters && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
                        <span>Filters applied!</span>
                        <button
                            onClick={handleClearFilters}
                            className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                            Clear filters
                        </button>
                    </div>
                )}
            </div>

            <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quick Actions</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {paginatedCars.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                    No vehicles found matching the given criteria.
                                </td>
                            </tr>
                        ) : (
                            paginatedCars.map((car: Car) => (
                                <tr key={car.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{car.make} {car.model}</div>
                                        <div className="text-xs text-gray-500 font-mono">VIN: {car.vin || 'N/A'}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {car.year} • {car.mileage?.toLocaleString()} km
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        ${car.price.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                            ${car.status === 'published' ? 'bg-green-100 text-green-800' :
                                                car.status === 'sold' ? 'bg-red-100 text-red-800' :
                                                    car.status === 'archived' ? 'bg-gray-100 text-gray-800' :
                                                        'bg-yellow-100 text-yellow-800'}`}>
                                            {car.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 flex gap-2 w-full text-sm">
                                        {(car.status === 'draft' || car.status === 'archived') && (
                                            <button
                                                onClick={() => handleUpdateStatus(car.id!, 'published')}
                                                disabled={updateStatusMutation.isPending}
                                                className="bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 px-2 py-1 rounded shadow-sm text-xs font-medium"
                                            >
                                                Publish
                                            </button>
                                        )}
                                        {car.status === 'published' && (
                                            <button
                                                onClick={() => handleUpdateStatus(car.id!, 'sold')}
                                                disabled={updateStatusMutation.isPending}
                                                className="bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 px-2 py-1 rounded shadow-sm text-xs font-medium"
                                            >
                                                Mark Sold
                                            </button>
                                        )}
                                        {car.status !== 'archived' && (
                                            <button
                                                onClick={() => handleUpdateStatus(car.id!, 'archived')}
                                                disabled={updateStatusMutation.isPending}
                                                className="bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100 px-2 py-1 rounded shadow-sm text-xs font-medium"
                                            >
                                                Archive
                                            </button>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <Link to={`/cars/${car.id}/edit`} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</Link>
                                        <button onClick={() => handleDelete(car.id!)} className="text-red-600 hover:text-red-900">Delete</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                {totalPages > 1 && (
                    <div className="bg-white px-4 py-3 border-t border-gray-200 flex items-center justify-between sm:px-6">
                        <div className="flex-1 flex justify-between sm:hidden">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
                            >
                                Next
                            </button>
                        </div>
                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-gray-700">
                                    Showing <span className="font-medium">{((currentPage - 1) * ITEMS_PER_PAGE) + 1}</span> to <span className="font-medium">{Math.min(currentPage * ITEMS_PER_PAGE, filteredCars.length)}</span> of <span className="font-medium">{filteredCars.length}</span> results
                                </p>
                            </div>
                            <div>
                                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                    <button
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100"
                                    >
                                        <span className="sr-only">Previous</span>
                                        &larr;
                                    </button>
                                    {[...Array(totalPages)].map((_, i) => (
                                        <button
                                            key={i + 1}
                                            onClick={() => setCurrentPage(i + 1)}
                                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium
                                                ${currentPage === i + 1
                                                    ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'}`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100"
                                    >
                                        <span className="sr-only">Next</span>
                                        &rarr;
                                    </button>
                                </nav>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

