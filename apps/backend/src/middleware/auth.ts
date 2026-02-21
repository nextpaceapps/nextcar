import { Request, Response, NextFunction } from 'express';
import { auth, db } from '../config/firebase';
import type { DecodedIdToken } from 'firebase-admin/auth';
import { errorResponse } from '../utils/response';

export interface AuthRequest extends Request {
    user?: DecodedIdToken;
}

export const requireAdmin = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        errorResponse(res, 'UNAUTHORIZED', 'Missing or invalid authorization header', 401);
        return;
    }

    const token = authHeader.split('Bearer ')[1];

    try {
        const decodedToken = await auth.verifyIdToken(token);

        // Check user role in Firestore
        const userDoc = await db.collection('users').doc(decodedToken.uid).get();

        if (!userDoc.exists) {
            errorResponse(res, 'FORBIDDEN', 'User not found in database', 403);
            return;
        }

        const userData = userDoc.data();
        if (userData?.role !== 'Admin') {
            errorResponse(res, 'FORBIDDEN', 'Insufficient permissions', 403);
            return;
        }

        req.user = decodedToken;
        next();
    } catch (error) {
        console.error('Error verifying token:', error);
        errorResponse(res, 'UNAUTHORIZED', 'Unauthorized', 401);
        return;
    }
};
