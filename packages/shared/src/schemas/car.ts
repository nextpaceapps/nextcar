import { z } from 'zod';

export const carStatusSchema = z.enum(['draft', 'published', 'sold']);
export const fuelTypeSchema = z.enum(['Petrol', 'Diesel', 'Electric', 'Hybrid', 'Plug-in Hybrid']);
export const transmissionSchema = z.enum(['Manual', 'Automatic']);
export const bodyTypeSchema = z.enum(['Sedan', 'SUV', 'Hatchback', 'Coupe', 'Convertible', 'Wagon', 'Van', 'Truck']);

export const carPhotoSchema = z.object({
    url: z.string().url(),
    order: z.number().int().min(0),
});

export const carEquipmentSchema = z.object({
    airConditioning: z.array(z.string()).optional(),
    infotainment: z.array(z.string()).optional(),
    mirrors: z.array(z.string()).optional(),
    parkingAid: z.array(z.string()).optional(),
    safety: z.array(z.string()).optional(),
    seats: z.array(z.string()).optional(),
    steeringWheel: z.array(z.string()).optional(),
    wheels: z.array(z.string()).optional(),
    windows: z.array(z.string()).optional(),
    other: z.array(z.string()).optional(),
});

export const carSchema = z.object({
    id: z.string().optional(),
    make: z.string().min(1, 'Make is required'),
    model: z.string().min(1, 'Model is required'),
    year: z.number().int().min(1900).max(new Date().getFullYear() + 1),
    price: z.number().min(0),
    mileage: z.number().min(0),
    fuelType: fuelTypeSchema,
    transmission: transmissionSchema,
    bodyType: bodyTypeSchema,
    color: z.string().min(1, 'Color is required'),
    vin: z.string().optional(),
    description: z.string().optional(),
    features: z.array(z.string()).optional(),
    photos: z.array(carPhotoSchema),
    videoLinks: z.array(z.string().url()).optional(),
    status: carStatusSchema,
    deleted: z.boolean().optional(),
    // Extended fields
    power: z.string().optional(),
    engineSize: z.string().optional(),
    doors: z.number().int().min(1).max(10).optional(),
    seats: z.number().int().min(1).max(20).optional(),
    co2Standard: z.string().optional(),
    interiorColor: z.string().optional(),
    numberOfKeys: z.number().int().optional(),
    firstRegistration: z.string().optional(),
    technicalInspection: z.string().optional(),
    condition: z.string().optional(),
    equipment: carEquipmentSchema.optional(),
});

export type CarSchema = z.infer<typeof carSchema>;
