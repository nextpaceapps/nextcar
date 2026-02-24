export * from './types/vehicle.js';
export * from './schemas/vehicle.js';
export * from './types/customer.js';
export * from './schemas/customer.js';
export * from './types/opportunity.js';
export * from './schemas/opportunity.js';

// Firestore collection names — single source of truth
export const COLLECTIONS = {
    VEHICLES: 'cars',
    CUSTOMERS: 'customers',
    OPPORTUNITIES: 'opportunities',
    USERS: 'users',
} as const;

export interface User {
    uid: string;
    email: string;
    role: 'Admin' | 'Editor' | 'Viewer';
}
