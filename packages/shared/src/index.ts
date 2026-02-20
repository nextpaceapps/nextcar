export * from './types/car.js';
export * from './schemas/car.js';

export interface User {
    uid: string;
    email: string;
    role: 'Admin' | 'Editor' | 'Viewer';
}
