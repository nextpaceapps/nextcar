import { resolveVehicleSlug, type Vehicle } from '@nextcar/shared';

const SITE_ORIGIN = 'https://nextcar.lv';

export function createVehiclePath(vehicle: Vehicle): string {
  const slug = resolveVehicleSlug(vehicle);
  const id = typeof vehicle.id === 'string' ? vehicle.id.trim() : '';

  return id ? `/vehicles/${slug}/${id}` : `/vehicles/${slug}`;
}

export function createLocalizedVehiclePath(vehicle: Vehicle, locale: string): string {
  return `/${locale}${createVehiclePath(vehicle)}`;
}

export function getVehicleAbsoluteUrl(vehicle: Vehicle, locale: string): string {
  return `${SITE_ORIGIN}${createLocalizedVehiclePath(vehicle, locale)}`;
}

