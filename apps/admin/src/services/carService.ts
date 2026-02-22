import { auth } from '../lib/firebase';
import type { Car, CarSchema } from '@nextcar/shared';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001';

const getAuthHeaders = async () => {
    const token = await auth.currentUser?.getIdToken();
    if (!token) throw new Error('Not authenticated');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

export const carService = {
    async getCars(): Promise<Car[]> {
        const response = await fetch(`${BACKEND_URL}/api/admin/vehicles`, {
            headers: await getAuthHeaders()
        });
        const data = await response.json();
        if (!data.success) throw new Error(data.error?.message || 'Failed to get cars');
        return data.data;
    },

    async getCar(id: string): Promise<Car | null> {
        const response = await fetch(`${BACKEND_URL}/api/admin/vehicles/${id}`, {
            headers: await getAuthHeaders()
        });
        if (response.status === 404) return null;
        const data = await response.json();
        if (!data.success) throw new Error(data.error?.message || 'Failed to fetch car');
        return data.data;
    },

    async createCar(carData: CarSchema): Promise<string> {
        const response = await fetch(`${BACKEND_URL}/api/admin/vehicles`, {
            method: 'POST',
            headers: await getAuthHeaders(),
            body: JSON.stringify(carData)
        });
        const data = await response.json();
        if (!data.success) throw new Error(data.error?.message || 'Failed to create car');
        return data.data.id;
    },

    async updateCar(id: string, carData: Partial<CarSchema>): Promise<void> {
        const response = await fetch(`${BACKEND_URL}/api/admin/vehicles/${id}`, {
            method: 'PUT',
            headers: await getAuthHeaders(),
            body: JSON.stringify(carData)
        });
        const data = await response.json();
        if (!data.success) throw new Error(data.error?.message || 'Failed to update car');
    },

    async deleteCar(id: string): Promise<void> {
        const response = await fetch(`${BACKEND_URL}/api/admin/vehicles/${id}`, {
            method: 'DELETE',
            headers: await getAuthHeaders()
        });
        const data = await response.json();
        if (!data.success) throw new Error(data.error?.message || 'Failed to delete car');
    }
};
