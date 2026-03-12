import { requestJson } from './api';
import type { User } from '@nextcar/shared';

type ApiResponse<T> = {
    success: boolean;
    data: T;
    error?: string | { message?: string };
};

export const userService = {
    async getMyRole(): Promise<User> {
        const { data } = await requestJson<ApiResponse<User>>('/api/admin/users/me');
        return data.data;
    },

    async getUsers(): Promise<User[]> {
        const { data } = await requestJson<ApiResponse<User[]>>('/api/admin/users');
        return data.data;
    },

    async updateUserRole(uid: string, role: 'Admin' | 'Editor' | 'Viewer'): Promise<void> {
        await requestJson<ApiResponse<User>>(`/api/admin/users/${uid}`, {
            method: 'PUT',
            body: JSON.stringify({ role }),
        });
    },
};
