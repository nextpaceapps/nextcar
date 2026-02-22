import type { Customer, CustomerSchema } from '@nextcar/shared';
import { BACKEND_URL, getAuthHeaders } from './api';

export const customerService = {
    async getCustomers(): Promise<Customer[]> {
        const response = await fetch(`${BACKEND_URL}/api/admin/customers`, {
            headers: await getAuthHeaders()
        });
        const data = await response.json();
        if (!data.success) throw new Error(data.error?.message || 'Failed to get customers');
        return data.data;
    },

    async getCustomer(id: string): Promise<Customer | null> {
        const response = await fetch(`${BACKEND_URL}/api/admin/customers/${id}`, {
            headers: await getAuthHeaders()
        });
        if (response.status === 404) return null;
        const data = await response.json();
        if (!data.success) throw new Error(data.error?.message || 'Failed to fetch customer');
        return data.data;
    },

    async createCustomer(customerData: CustomerSchema): Promise<string> {
        const response = await fetch(`${BACKEND_URL}/api/admin/customers`, {
            method: 'POST',
            headers: await getAuthHeaders(),
            body: JSON.stringify(customerData)
        });
        const data = await response.json();
        if (!data.success) throw new Error(data.error?.message || 'Failed to create customer');
        return data.data.id;
    },

    async updateCustomer(id: string, customerData: Partial<CustomerSchema>): Promise<void> {
        const response = await fetch(`${BACKEND_URL}/api/admin/customers/${id}`, {
            method: 'PUT',
            headers: await getAuthHeaders(),
            body: JSON.stringify(customerData)
        });
        const data = await response.json();
        if (!data.success) throw new Error(data.error?.message || 'Failed to update customer');
    },

    async deleteCustomer(id: string): Promise<void> {
        const response = await fetch(`${BACKEND_URL}/api/admin/customers/${id}`, {
            method: 'DELETE',
            headers: await getAuthHeaders()
        });
        const data = await response.json();
        if (!data.success) throw new Error(data.error?.message || 'Failed to delete customer');
    }
};
