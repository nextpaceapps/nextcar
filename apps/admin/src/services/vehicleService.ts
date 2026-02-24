import type { Vehicle, VehicleSchema } from '@nextcar/shared';
import { BACKEND_URL, getAuthHeaders } from './api';

export const vehicleService = {
    async getVehicles(): Promise<Vehicle[]> {
        const response = await fetch(`${BACKEND_URL}/api/admin/vehicles`, {
            headers: await getAuthHeaders()
        });
        const data = await response.json();
        if (!data.success) throw new Error(data.error?.message || 'Failed to get vehicles');
        return data.data;
    },

    async getVehicle(id: string): Promise<Vehicle | null> {
        const response = await fetch(`${BACKEND_URL}/api/admin/vehicles/${id}`, {
            headers: await getAuthHeaders()
        });
        if (response.status === 404) return null;
        const data = await response.json();
        if (!data.success) throw new Error(data.error?.message || 'Failed to fetch vehicle');
        return data.data;
    },

    async createVehicle(vehicleData: VehicleSchema): Promise<string> {
        const response = await fetch(`${BACKEND_URL}/api/admin/vehicles`, {
            method: 'POST',
            headers: await getAuthHeaders(),
            body: JSON.stringify(vehicleData)
        });
        const data = await response.json();
        if (!data.success) throw new Error(data.error?.message || 'Failed to create vehicle');
        return data.data.id;
    },

    async updateVehicle(id: string, vehicleData: Partial<VehicleSchema>): Promise<void> {
        const response = await fetch(`${BACKEND_URL}/api/admin/vehicles/${id}`, {
            method: 'PUT',
            headers: await getAuthHeaders(),
            body: JSON.stringify(vehicleData)
        });
        const data = await response.json();
        if (!data.success) throw new Error(data.error?.message || 'Failed to update vehicle');
    },

    async deleteVehicle(id: string): Promise<void> {
        const response = await fetch(`${BACKEND_URL}/api/admin/vehicles/${id}`, {
            method: 'DELETE',
            headers: await getAuthHeaders()
        });
        const data = await response.json();
        if (!data.success) throw new Error(data.error?.message || 'Failed to delete vehicle');
    }
};
