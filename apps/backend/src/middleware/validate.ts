import { Request, Response, NextFunction, RequestHandler } from 'express';
import { ZodSchema } from 'zod';

/**
 * Reusable layout to validate request body using a Zod schema.
 */
export const withValidation = (schema: ZodSchema<any>): RequestHandler => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            // Reassign the body to the parsed data to strip unknown fields and apply type transformations
            req.body = schema.parse(req.body);
            next();
        } catch (error) {
            next(error); // Triggers the global errorHandler handling ZodError
        }
    };
};

/**
 * Wrapper for async route handlers to automatically catch and pass unhandled promise rejections directly to the errorHandler.
 */
export const asyncHandler = (fn: RequestHandler): RequestHandler => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
