export * from './types/car.js';
export * from './schemas/car.js';

// Firestore collection names — single source of truth
export const COLLECTIONS = {
    CARS: 'cars',
} as const;

export interface User {
    uid: string;
    email: string;
    role: 'Admin' | 'Editor' | 'Viewer';
}
