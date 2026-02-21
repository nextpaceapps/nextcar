import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../utils/AppError';
import { errorResponse } from '../utils/response';

export const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (err instanceof ZodError) {
        // Format Zod validation errors to a unified string or structured message
        const message = (err as any).errors.map((e: any) => `${e.path.join('.')}: ${e.message}`).join('; ');
        return errorResponse(res, 'VALIDATION_ERROR', message, 400);
    }

    if (err instanceof AppError) {
        return errorResponse(res, err.code, err.message, err.status);
    }

    // Unhandled exception fallback
    console.error('Unhandled Server Error:', err);
    return errorResponse(res, 'INTERNAL_SERVER_ERROR', 'An unexpected error occurred', 500);
};
