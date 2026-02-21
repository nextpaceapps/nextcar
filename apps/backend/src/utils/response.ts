import { Response } from 'express';

export const successResponse = (res: Response, data: any, status: number = 200) => {
    return res.status(status).json({
        success: true,
        data,
    });
};

export const errorResponse = (res: Response, code: string, message: string, status: number = 500) => {
    return res.status(status).json({
        success: false,
        error: {
            code,
            message,
        },
    });
};
