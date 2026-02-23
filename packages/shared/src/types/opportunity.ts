import { z } from 'zod';
import { opportunitySchema, opportunityStageSchema } from '../schemas/opportunity.js';

export type OpportunityStage = z.infer<typeof opportunityStageSchema>;

export interface Opportunity extends z.infer<typeof opportunitySchema> {
    customerName?: string;
    vehicleName?: string;
    createdAt?: any;  // Firestore Timestamp
    updatedAt?: any;  // Firestore Timestamp
}
