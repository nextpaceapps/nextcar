import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Vehicle } from '@nextcar/shared';

const PLACEHOLDER_IMAGE = 'https://placehold.co/200x200?text=No+Image';

function getFirstPhotoUrl(vehicle: Vehicle): string {
  if (!vehicle.photos || vehicle.photos.length === 0) return PLACEHOLDER_IMAGE;
  const sorted = [...vehicle.photos].sort((a, b) => a.order - b.order);
  return sorted[0].url;
}

interface SidebarVehiclePreviewsProps {
  vehicles: Vehicle[];
  totalCount: number;
}

export default function SidebarVehiclePreviews({ vehicles, totalCount }: SidebarVehiclePreviewsProps) {
  const ringClass = 'ring-[6px] ring-background-light dark:ring-background-dark';
  const circleClass = `inline-block h-14 w-14 rounded-full ${ringClass} object-cover overflow-hidden shrink-0`;
  const shown = vehicles.slice(0, 3).length;
  const remaining = Math.max(0, totalCount - shown);

  return (
    <div className="flex items-center gap-4">
      <div className="flex -space-x-4 overflow-hidden">
        {vehicles.slice(0, 3).map((vehicle) => {
          const href = `/vehicles/${vehicle.id}`;
          const imageUrl = getFirstPhotoUrl(vehicle);
          const label = `${vehicle.year} ${vehicle.make} ${vehicle.model}`;
          return (
            <Link
              key={vehicle.id}
              href={href}
              className={`group relative ${circleClass}`}
              aria-label={`View ${label}`}
            >
              <span className="absolute inset-0 flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-full">
                <Image
                  src={imageUrl}
                  alt=""
                  width={56}
                  height={56}
                  className="object-cover w-full h-full rounded-full"
                  unoptimized={imageUrl === PLACEHOLDER_IMAGE}
                />
              </span>
              {/* Desktop hover preview */}
              <span
                className="absolute left-0 bottom-full mb-2 hidden lg:block w-48 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible transition-all duration-200 z-50 pointer-events-none"
                aria-hidden
              >
                <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-2 bg-slate-100 dark:bg-slate-800">
                  <Image
                    src={imageUrl}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="192px"
                    unoptimized={imageUrl === PLACEHOLDER_IMAGE}
                  />
                </div>
                <p className="font-semibold text-slate-900 dark:text-white text-sm truncate">
                  {vehicle.year} {vehicle.make} {vehicle.model}
                </p>
                <p className="text-primary dark:text-white font-bold text-sm mt-0.5">
                  ${vehicle.price.toLocaleString()}
                </p>
              </span>
            </Link>
          );
        })}
        <Link
          href="/vehicles"
          className={`flex items-center justify-center ${circleClass} bg-slate-100 dark:bg-slate-800 text-[10px] font-extrabold dark:text-white min-w-[3.5rem] min-h-[3.5rem]`}
          aria-label="View all vehicles"
        >
          {remaining > 0 ? `+${remaining}` : '0'}
        </Link>
      </div>
    </div>
  );
}
