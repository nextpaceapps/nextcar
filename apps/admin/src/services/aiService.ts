import { requestJson } from './api';
import type { VehicleSchema } from '@nextcar/shared';

type ParsedVehicleListing = Partial<VehicleSchema>;

export const aiService = {
    async parseVehicleListing(rawText: string) {
        const { data } = await requestJson<ParsedVehicleListing>('/api/ai/parse-listing', {
            method: 'POST',
            body: JSON.stringify({ rawText }),
        });
        return data;
    },
};
