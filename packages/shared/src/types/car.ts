import { z } from 'zod';
import {
    carSchema,
    carPhotoSchema,
    carEquipmentSchema,
    carStatusSchema,
    fuelTypeSchema,
    transmissionSchema,
    bodyTypeSchema,
} from '../schemas/car.js';

// Derive types from Zod schemas — single source of truth
export type CarStatus = z.infer<typeof carStatusSchema>;
export type FuelType = z.infer<typeof fuelTypeSchema>;
export type Transmission = z.infer<typeof transmissionSchema>;
export type BodyType = z.infer<typeof bodyTypeSchema>;
export type CarPhoto = z.infer<typeof carPhotoSchema>;
export type CarEquipment = z.infer<typeof carEquipmentSchema>;

// Car extends the schema type with Firestore-managed fields
export interface Car extends z.infer<typeof carSchema> {
    createdAt?: any;  // Firestore Timestamp
    updatedAt?: any;  // Firestore Timestamp
}
