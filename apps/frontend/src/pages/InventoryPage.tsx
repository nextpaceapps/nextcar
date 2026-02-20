import { useQuery } from '@tanstack/react-query';
import { carService } from '../services/carService';
import CarCard from '../components/CarCard';

export default function InventoryPage() {
    const { data: cars, isLoading, error } = useQuery({
        queryKey: ['cars', 'published'],
        queryFn: carService.getPublishedCars
    });

    if (isLoading) return <div>Loading inventory...</div>;
    if (error) return <div>Error loading inventory</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Our Inventory</h1>

            {cars?.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                    No cars found matching your criteria.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {cars?.map(car => (
                        <CarCard key={car.id} car={car} />
                    ))}
                </div>
            )}
        </div>
    );
}
