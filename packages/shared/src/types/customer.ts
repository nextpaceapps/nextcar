import { z } from 'zod';
import { customerSchema, customerTagSchema } from '../schemas/customer.js';

export type CustomerTag = z.infer<typeof customerTagSchema>;

export interface Customer extends z.infer<typeof customerSchema> {
    createdAt?: any;  // Firestore Timestamp
    updatedAt?: any;  // Firestore Timestamp
}
