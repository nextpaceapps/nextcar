import type { Vehicle, VehicleSchema } from '@nextcar/shared';
import { requestJson } from './api';

type ApiResponse<T> = {
    success: boolean;
    data: T;
    error?: string | { message?: string };
};

export const vehicleService = {
    async getVehicles(): Promise<Vehicle[]> {
        const { data } = await requestJson<ApiResponse<Vehicle[]>>('/api/admin/vehicles');
        return data.data;
    },

    async getVehicle(id: string): Promise<Vehicle | null> {
        const { response, data } = await requestJson<ApiResponse<Vehicle>>(`/api/admin/vehicles/${id}`, {
            ignoreStatuses: [404],
        });
        if (response.status === 404) return null;
        return data.data;
    },

    async createVehicle(vehicleData: VehicleSchema): Promise<string> {
        const { data } = await requestJson<ApiResponse<Vehicle>>('/api/admin/vehicles', {
            method: 'POST',
            body: JSON.stringify(vehicleData)
        });
        if (!data.data.id) throw new Error('Created vehicle is missing an ID');
        return data.data.id;
    },

    async updateVehicle(id: string, vehicleData: Partial<VehicleSchema>): Promise<void> {
        await requestJson<ApiResponse<Vehicle>>(`/api/admin/vehicles/${id}`, {
            method: 'PUT',
            body: JSON.stringify(vehicleData)
        });
    },

    async deleteVehicle(id: string): Promise<void> {
        await requestJson<ApiResponse<{ id: string; message: string }>>(`/api/admin/vehicles/${id}`, {
            method: 'DELETE',
        });
    }
};
