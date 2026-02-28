import Link from 'next/link';
import Image from 'next/image';
import type { Vehicle } from '@nextcar/shared';
import { DefectIndicator } from './DefectIndicator';

interface VehicleCardProps {
    vehicle: Vehicle;
    priority?: boolean;
}

export default function VehicleCard({ vehicle, priority = false }: VehicleCardProps) {
    const sortedPhotos = [...vehicle.photos].sort((a, b) => a.order - b.order);
    const coverPhoto = sortedPhotos[0];
    const imageUrl = coverPhoto?.url || 'https://placehold.co/600x400?text=No+Image';

    return (
        <div className="group flex flex-col gap-6">
            <Link href={`/vehicles/${vehicle.id}`} className="block">
                <div className="h-[280px] md:h-[480px] relative overflow-hidden rounded-[2rem]">
                    <Image
                        src={imageUrl}
                        alt={`${vehicle.make} ${vehicle.model}`}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
                        priority={priority}
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    {coverPhoto?.defects?.length ? (
                        <DefectIndicator
                            defects={coverPhoto.defects}
                            photoLabel={`${vehicle.make} ${vehicle.model}`}
                        />
                    ) : null}
                </div>
            </Link>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 px-2">
                <div className="md:col-span-7">
                    <Link href={`/vehicles/${vehicle.id}`} className="block w-fit">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 hover:opacity-80 transition-opacity">
                            {vehicle.make} {vehicle.model}
                        </h3>
                    </Link>
                    {vehicle.description && (
                        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-6 line-clamp-3">
                            {vehicle.description}
                        </p>
                    )}

                    <div className="flex gap-3 flex-wrap items-center">
                        <span className="px-4 py-1.5 border border-gray-200 dark:border-gray-800 rounded-full text-[10px] font-bold text-gray-600 dark:text-gray-400 tracking-wider">
                            {vehicle.year}
                        </span>
                        <span className="px-4 py-1.5 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white rounded-full text-[10px] font-bold tracking-wider">
                            ${vehicle.price.toLocaleString()}
                        </span>
                        <Link href={`/vehicles/${vehicle.id}`} className="ml-auto px-6 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-bold rounded-full hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors whitespace-nowrap">
                            View Details
                        </Link>
                    </div>
                </div>

                <div className="md:col-span-5 flex md:justify-end gap-8 pt-2">
                    <div>
                        <div className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Engine</div>
                        <div className="text-xs font-semibold text-gray-900 dark:text-white">{vehicle.fuelType}</div>
                    </div>
                    <div>
                        <div className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Gearbox</div>
                        <div className="text-xs font-semibold text-gray-900 dark:text-white">{vehicle.transmission}</div>
                    </div>
                    <div>
                        <div className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Mileage</div>
                        <div className="text-xs font-semibold text-gray-900 dark:text-white">{vehicle.mileage.toLocaleString()} miles</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
