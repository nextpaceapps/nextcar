import type { Car } from '@nextcar/shared';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001';

export const carService = {
    async getPublishedCars(): Promise<Car[]> {
        const response = await fetch(`${BACKEND_URL}/api/vehicles`);
        const data = await response.json();
        if (!data.success) throw new Error(data.error?.message || 'Failed to get cars');
        return data.data;
    },

    async getCar(id: string): Promise<Car | null> {
        const response = await fetch(`${BACKEND_URL}/api/vehicles/${id}`);
        if (response.status === 404) return null;
        const data = await response.json();
        if (!data.success) throw new Error(data.error?.message || 'Failed to fetch car');
        return data.data;
    }
};
