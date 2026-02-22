import type { Opportunity, OpportunitySchema } from '@nextcar/shared';
import { BACKEND_URL, getAuthHeaders } from './api';

export const opportunityService = {
    async getOpportunities(): Promise<Opportunity[]> {
        const response = await fetch(`${BACKEND_URL}/api/admin/opportunities`, {
            headers: await getAuthHeaders()
        });
        const data = await response.json();
        if (!data.success) throw new Error(data.error?.message || 'Failed to get opportunities');
        return data.data;
    },

    async getOpportunity(id: string): Promise<Opportunity | null> {
        const response = await fetch(`${BACKEND_URL}/api/admin/opportunities/${id}`, {
            headers: await getAuthHeaders()
        });
        if (response.status === 404) return null;
        const data = await response.json();
        if (!data.success) throw new Error(data.error?.message || 'Failed to fetch opportunity');
        return data.data;
    },

    async createOpportunity(opportunityData: OpportunitySchema): Promise<string> {
        const response = await fetch(`${BACKEND_URL}/api/admin/opportunities`, {
            method: 'POST',
            headers: await getAuthHeaders(),
            body: JSON.stringify(opportunityData)
        });
        const data = await response.json();
        if (!data.success) throw new Error(data.error?.message || 'Failed to create opportunity');
        return data.data.id;
    },

    async updateOpportunity(id: string, opportunityData: Partial<OpportunitySchema>): Promise<void> {
        const response = await fetch(`${BACKEND_URL}/api/admin/opportunities/${id}`, {
            method: 'PUT',
            headers: await getAuthHeaders(),
            body: JSON.stringify(opportunityData)
        });
        const data = await response.json();
        if (!data.success) throw new Error(data.error?.message || 'Failed to update opportunity');
    },

    async deleteOpportunity(id: string): Promise<void> {
        const response = await fetch(`${BACKEND_URL}/api/admin/opportunities/${id}`, {
            method: 'DELETE',
            headers: await getAuthHeaders()
        });
        const data = await response.json();
        if (!data.success) throw new Error(data.error?.message || 'Failed to delete opportunity');
    }
};
