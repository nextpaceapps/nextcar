import type { Vehicle } from '@nextcar/shared';

const SITE_ORIGIN = 'https://nextcar.lv';

function normalizeSlugPart(value: string | number | null | undefined): string | null {
  if (value === null || value === undefined) return null;
  const str = String(value).trim();
  if (!str) return null;

  const normalized = str
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return normalized || null;
}

export function createVehicleSlug(vehicle: Vehicle): string {
  const engineParts: string[] = [];

  if (vehicle.engineSize) {
    engineParts.push(vehicle.engineSize);
  }

  if (vehicle.fuelType) {
    engineParts.push(vehicle.fuelType);
  }

  const engineType = engineParts.join(' ');

  const parts = [
    normalizeSlugPart(vehicle.make),
    normalizeSlugPart(vehicle.model),
    normalizeSlugPart(vehicle.year),
    normalizeSlugPart(engineType),
  ].filter((part): part is string => Boolean(part));

  if (parts.length === 0) {
    return 'vehicle';
  }

  return parts.join('-');
}

export function createVehiclePath(vehicle: Vehicle): string {
  const slug = createVehicleSlug(vehicle);
  const id = typeof vehicle.id === 'string' ? vehicle.id.trim() : '';

  return id ? `/vehicles/${slug}/${id}` : `/vehicles/${slug}`;
}

export function createLocalizedVehiclePath(vehicle: Vehicle, locale: string): string {
  return `/${locale}${createVehiclePath(vehicle)}`;
}

export function getVehicleAbsoluteUrl(vehicle: Vehicle, locale: string): string {
  return `${SITE_ORIGIN}${createLocalizedVehiclePath(vehicle, locale)}`;
}

