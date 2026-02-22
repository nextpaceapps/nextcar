export * from './types/car.js';
export * from './schemas/car.js';
export * from './types/customer.js';
export * from './schemas/customer.js';

// Firestore collection names — single source of truth
export const COLLECTIONS = {
    CARS: 'cars',
    CUSTOMERS: 'customers',
} as const;

export interface User {
    uid: string;
    email: string;
    role: 'Admin' | 'Editor' | 'Viewer';
}
