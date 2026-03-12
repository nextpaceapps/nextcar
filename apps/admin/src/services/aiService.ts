import { requestJson } from './api';

export const aiService = {
    async parseVehicleListing(rawText: string) {
        const { data } = await requestJson<Record<string, unknown>>('/api/ai/parse-listing', {
            method: 'POST',
            body: JSON.stringify({ rawText }),
        });
        return data;
    },
};
