import type { Opportunity, OpportunitySchema } from '@nextcar/shared';
import { requestJson } from './api';

type ApiResponse<T> = {
    success: boolean;
    data: T;
    error?: string | { message?: string };
};

export const opportunityService = {
    async getOpportunities(): Promise<Opportunity[]> {
        const { data } = await requestJson<ApiResponse<Opportunity[]>>('/api/admin/opportunities');
        return data.data;
    },

    async getOpportunity(id: string): Promise<Opportunity | null> {
        const { response, data } = await requestJson<ApiResponse<Opportunity>>(`/api/admin/opportunities/${id}`, {
            ignoreStatuses: [404],
        });
        if (response.status === 404) return null;
        return data.data;
    },

    async createOpportunity(opportunityData: OpportunitySchema): Promise<string> {
        const { data } = await requestJson<ApiResponse<Opportunity>>('/api/admin/opportunities', {
            method: 'POST',
            body: JSON.stringify(opportunityData)
        });
        if (!data.data.id) throw new Error('Created opportunity is missing an ID');
        return data.data.id;
    },

    async updateOpportunity(id: string, opportunityData: Partial<OpportunitySchema>): Promise<void> {
        await requestJson<ApiResponse<Opportunity>>(`/api/admin/opportunities/${id}`, {
            method: 'PUT',
            body: JSON.stringify(opportunityData)
        });
    },

    async deleteOpportunity(id: string): Promise<void> {
        await requestJson<ApiResponse<{ id: string; message: string }>>(`/api/admin/opportunities/${id}`, {
            method: 'DELETE',
        });
    }
};
