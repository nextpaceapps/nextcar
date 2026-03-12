import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../utils/AppError';
import { errorResponse } from '../utils/response';
import { Sentry } from '../lib/sentry';

export const errorHandler = (
    err: unknown,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (err instanceof ZodError) {
        const message = err.issues.map((e) => `${e.path.join('.')}: ${e.message}`).join('; ');
        return errorResponse(res, 'VALIDATION_ERROR', message, 400);
    }

    if (err instanceof AppError) {
        if (err.status >= 500) {
            Sentry.captureException(err, {
                tags: {
                    area: 'backend',
                    method: req.method,
                    route: req.path,
                },
            });
        }
        return errorResponse(res, err.code, err.message, err.status);
    }

    // Report unexpected errors to Sentry
    Sentry.captureException(err, {
        tags: {
            area: 'backend',
            method: req.method,
            route: req.path,
        },
    });
    console.error('Unhandled Server Error:', err);
    return errorResponse(res, 'INTERNAL_SERVER_ERROR', 'An unexpected error occurred', 500);
};
