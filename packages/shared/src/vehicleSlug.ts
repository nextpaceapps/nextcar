import type { VehicleSchema } from './schemas/vehicle.js';

type VehicleSlugSource = Pick<VehicleSchema, 'make' | 'model' | 'year' | 'engineSize' | 'fuelType'> & {
    slug?: string | null | undefined;
};

export function normalizeVehicleSlug(value: string | null | undefined): string | undefined {
    if (typeof value !== 'string') return undefined;

    const normalized = value
        .trim()
        .normalize('NFKD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

    return normalized || undefined;
}

function normalizeSlugPart(value: string | number | null | undefined): string | null {
    if (value === null || value === undefined) return null;

    const normalized = normalizeVehicleSlug(String(value));
    return normalized ?? null;
}

export function createVehicleSlug(vehicle: Pick<VehicleSlugSource, 'make' | 'model' | 'year' | 'engineSize' | 'fuelType'>): string {
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

    return parts.length > 0 ? parts.join('-') : 'vehicle';
}

export function resolveVehicleSlug(vehicle: VehicleSlugSource): string {
    return normalizeVehicleSlug(vehicle.slug) ?? createVehicleSlug(vehicle);
}
