import { BACKEND_URL, getAuthHeaders } from './api';

export const aiService = {
    async parseVehicleListing(rawText: string) {
        const headers = await getAuthHeaders();
        const response = await fetch(`${BACKEND_URL}/api/ai/parse-listing`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ rawText }),
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ error: response.statusText }));
            throw new Error(error.error || 'Failed to parse listing');
        }

        return response.json();
    },
};
