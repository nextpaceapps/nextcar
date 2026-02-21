import { Router } from 'express';
import { z } from 'zod';
import { successResponse } from '../utils/response';
import { withValidation, asyncHandler } from '../middleware/validate';
import { requireAdmin } from '../middleware/auth';
import { AppError } from '../utils/AppError';

const router = Router();

// A simple publicly accessible health check
router.get('/', (req, res) => {
    successResponse(res, { status: 'OK', uptime: process.uptime() });
});

// A dummy validation schema to illustrate the pattern
const PayloadSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    details: z.string().min(1, 'Details are required')
});

// An example protected route utilizing validation, auth middleware, and the async wrapper
router.post(
    '/protected',
    requireAdmin,
    withValidation(PayloadSchema),
    asyncHandler(async (req, res) => {
        // Since we reach this point, req.body is fully validated by Zod and req.user exists
        const { name } = req.body;

        // Simulating throwing an AppError
        if (name === 'error') {
            throw new AppError('BAD_NAME', 'The name "error" is not allowed', 400);
        }

        successResponse(res, {
            message: `Hello ${name}!`,
            user: (req as any).user?.uid
        }, 201);
    })
);

export default router;
