import type { Customer, CustomerSchema } from '@nextcar/shared';
import { requestJson } from './api';

type ApiResponse<T> = {
    success: boolean;
    data: T;
    error?: string | { message?: string };
};

export const customerService = {
    async getCustomers(): Promise<Customer[]> {
        const { data } = await requestJson<ApiResponse<Customer[]>>('/api/admin/customers');
        return data.data;
    },

    async getCustomer(id: string): Promise<Customer | null> {
        const { response, data } = await requestJson<ApiResponse<Customer>>(`/api/admin/customers/${id}`, {
            ignoreStatuses: [404],
        });
        if (response.status === 404) return null;
        return data.data;
    },

    async createCustomer(customerData: CustomerSchema): Promise<string> {
        const { data } = await requestJson<ApiResponse<Customer>>('/api/admin/customers', {
            method: 'POST',
            body: JSON.stringify(customerData)
        });
        if (!data.data.id) throw new Error('Created customer is missing an ID');
        return data.data.id;
    },

    async updateCustomer(id: string, customerData: Partial<CustomerSchema>): Promise<void> {
        await requestJson<ApiResponse<Customer>>(`/api/admin/customers/${id}`, {
            method: 'PUT',
            body: JSON.stringify(customerData)
        });
    },

    async deleteCustomer(id: string): Promise<void> {
        await requestJson<ApiResponse<{ id: string; message: string }>>(`/api/admin/customers/${id}`, {
            method: 'DELETE',
        });
    }
};
