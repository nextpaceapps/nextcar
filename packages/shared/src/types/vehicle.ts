import { z } from 'zod';
import {
    vehicleSchema,
    vehiclePhotoSchema,
    vehicleEquipmentSchema,
    vehicleStatusSchema,
    fuelTypeSchema,
    transmissionSchema,
    bodyTypeSchema,
} from '../schemas/vehicle.js';

// Derive types from Zod schemas — single source of truth
export type VehicleStatus = z.infer<typeof vehicleStatusSchema>;
export type FuelType = z.infer<typeof fuelTypeSchema>;
export type Transmission = z.infer<typeof transmissionSchema>;
export type BodyType = z.infer<typeof bodyTypeSchema>;
export type VehiclePhoto = z.infer<typeof vehiclePhotoSchema>;
export type VehicleEquipment = z.infer<typeof vehicleEquipmentSchema>;

// Vehicle extends the schema type with Firestore-managed fields
export interface Vehicle extends z.infer<typeof vehicleSchema> {
    createdAt?: any;  // Firestore Timestamp
    updatedAt?: any;  // Firestore Timestamp
}
