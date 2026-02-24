import { BACKEND_URL, getAuthHeaders } from './api';
import type { User } from '@nextcar/shared';

export const userService = {
    async getMyRole(): Promise<User> {
        const headers = await getAuthHeaders();
        const res = await fetch(`${BACKEND_URL}/api/admin/users/me`, { headers });
        if (!res.ok) throw new Error('Failed to fetch user role');
        const json = await res.json();
        return json.data;
    },

    async getUsers(): Promise<User[]> {
        const headers = await getAuthHeaders();
        const res = await fetch(`${BACKEND_URL}/api/admin/users`, { headers });
        if (!res.ok) throw new Error('Failed to fetch users');
        const json = await res.json();
        return json.data;
    },

    async updateUserRole(uid: string, role: 'Admin' | 'Editor' | 'Viewer'): Promise<void> {
        const headers = await getAuthHeaders();
        const res = await fetch(`${BACKEND_URL}/api/admin/users/${uid}`, {
            method: 'PUT',
            headers,
            body: JSON.stringify({ role }),
        });
        if (!res.ok) throw new Error('Failed to update user role');
    },
};
