import { auth } from '../lib/firebase';

export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001';

export const getAuthHeaders = async () => {
    const token = await auth.currentUser?.getIdToken();
    if (!token) throw new Error('Not authenticated');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};
