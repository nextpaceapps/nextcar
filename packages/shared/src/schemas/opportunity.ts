import { z } from 'zod';

export const OPPORTUNITY_STAGES = ['new', 'contacted', 'negotiation', 'won', 'lost'] as const;
export const opportunityStageSchema = z.enum(OPPORTUNITY_STAGES);

export const opportunitySchema = z.object({
    id: z.string().optional(),
    customerId: z.string().min(1, 'Customer is required'),
    vehicleId: z.string().optional(),
    stage: opportunityStageSchema.default('new'),
    expectedValue: z.number().min(0).optional(),
    notes: z.string().optional(),
    nextActionDate: z.string().optional(),
    deleted: z.boolean().optional().default(false),
});

export type OpportunitySchema = z.infer<typeof opportunitySchema>;
