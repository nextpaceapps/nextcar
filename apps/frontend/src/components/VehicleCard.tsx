import Link from 'next/link';
import Image from 'next/image';
import type { Vehicle } from '@nextcar/shared';

interface VehicleCardProps {
    vehicle: Vehicle;
    priority?: boolean;
}

export default function VehicleCard({ vehicle, priority = false }: VehicleCardProps) {
    const sortedPhotos = [...vehicle.photos].sort((a, b) => a.order - b.order);
    const imageUrl = sortedPhotos[0]?.url || 'https://placehold.co/600x400?text=No+Image';

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
            <div className="h-64 relative overflow-hidden shrink-0">
                <Image
                    src={imageUrl}
                    alt={`${vehicle.make} ${vehicle.model}`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority={priority}
                    className="object-cover"
                />
            </div>
            <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-gray-900 mb-1">{vehicle.make} {vehicle.model}</h3>
                <p className="text-gray-600 text-sm mb-4">{vehicle.year} • {vehicle.mileage.toLocaleString()} miles</p>
                <div className="flex justify-between items-center mt-auto mb-4">
                    <span className="text-2xl font-bold text-blue-600">${vehicle.price.toLocaleString()}</span>
                    <Link href={`/vehicles/${vehicle.id}`} className="px-4 py-2 bg-gray-900 text-white text-sm rounded hover:bg-gray-800 transition-colors">
                        View Details
                    </Link>
                </div>
                <div className="flex gap-2 text-xs text-gray-500 pt-3 border-t border-gray-100">
                    <span className="bg-gray-100 px-2 py-1 rounded">{vehicle.fuelType}</span>
                    <span className="bg-gray-100 px-2 py-1 rounded">{vehicle.transmission}</span>
                </div>
            </div>
        </div>
    );
}
