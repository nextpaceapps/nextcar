import { z } from 'zod';

export const CUSTOMER_TAGS = ['buyer', 'seller', 'VIP', 'service', 'lead'] as const;
export const customerTagSchema = z.enum(CUSTOMER_TAGS);

export const customerSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, 'Name is required'),
    phone: z.string().optional(),
    email: z.string().email('Invalid email format').or(z.literal('')).optional(),
    notes: z.string().optional(),
    tags: z.array(customerTagSchema).optional().default([]),
    deleted: z.boolean().optional().default(false),
});

export type CustomerSchema = z.infer<typeof customerSchema>;
