import { Link } from 'react-router-dom';
import type { Car } from '@nextcar/shared';

interface CarCardProps {
    car: Car;
}

export default function CarCard({ car }: CarCardProps) {
    const sortedPhotos = [...car.photos].sort((a, b) => a.order - b.order);
    const imageUrl = sortedPhotos[0]?.url || 'https://placehold.co/600x400?text=No+Image';

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="h-48 overflow-hidden">
                <img
                    src={imageUrl}
                    alt={`${car.make} ${car.model}`}
                    className="w-full h-full object-cover"
                />
            </div>
            <div className="p-4">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{car.make} {car.model}</h3>
                <p className="text-gray-600 text-sm mb-2">{car.year} • {car.mileage.toLocaleString()} miles</p>
                <div className="flex justify-between items-center mt-4">
                    <span className="text-2xl font-bold text-blue-600">${car.price.toLocaleString()}</span>
                    <Link to={`/inventory/${car.id}`} className="px-4 py-2 bg-gray-900 text-white text-sm rounded hover:bg-gray-800 transition-colors">
                        View Details
                    </Link>
                </div>
                <div className="mt-3 flex gap-2 text-xs text-gray-500">
                    <span className="bg-gray-100 px-2 py-1 rounded">{car.fuelType}</span>
                    <span className="bg-gray-100 px-2 py-1 rounded">{car.transmission}</span>
                </div>
            </div>
        </div>
    );
}
