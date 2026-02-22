export * from './types/car.js';
export * from './schemas/car.js';
export * from './types/customer.js';
export * from './schemas/customer.js';
export * from './types/opportunity.js';
export * from './schemas/opportunity.js';

// Firestore collection names — single source of truth
export const COLLECTIONS = {
    CARS: 'cars',
    CUSTOMERS: 'customers',
    OPPORTUNITIES: 'opportunities',
} as const;

export interface User {
    uid: string;
    email: string;
    role: 'Admin' | 'Editor' | 'Viewer';
}
