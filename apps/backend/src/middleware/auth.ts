import { Request, Response, NextFunction } from 'express';
import { auth, db } from '../config/firebase';
import type { DecodedIdToken } from 'firebase-admin/auth';
import { errorResponse } from '../utils/response';
import { COLLECTIONS } from '@nextcar/shared';

export interface AuthRequest extends Request {
    user?: DecodedIdToken;
    userRole?: 'Admin' | 'Editor' | 'Viewer';
}

const ROLE_HIERARCHY: Record<string, number> = {
    Admin: 3,
    Editor: 2,
    Viewer: 1,
};

/**
 * Middleware factory that requires the user to have at least the given role.
 * Role hierarchy: Admin > Editor > Viewer
 */
export const withRole = (minRole: 'Admin' | 'Editor' | 'Viewer') => {
    return async (req: AuthRequest, res: Response, next: NextFunction) => {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            errorResponse(res, 'UNAUTHORIZED', 'Missing or invalid authorization header', 401);
            return;
        }

        const token = authHeader.split('Bearer ')[1];

        try {
            const decodedToken = await auth.verifyIdToken(token);

            const userDoc = await db.collection(COLLECTIONS.USERS).doc(decodedToken.uid).get();

            if (!userDoc.exists) {
                errorResponse(res, 'FORBIDDEN', 'User not found in database', 403);
                return;
            }

            const userData = userDoc.data();
            const userRole = userData?.role as 'Admin' | 'Editor' | 'Viewer' | undefined;

            if (!userRole || (ROLE_HIERARCHY[userRole] || 0) < (ROLE_HIERARCHY[minRole] || 0)) {
                errorResponse(res, 'FORBIDDEN', 'Insufficient permissions', 403);
                return;
            }

            req.user = decodedToken;
            req.userRole = userRole;
            next();
        } catch (error) {
            console.error('Error verifying token:', error);
            errorResponse(res, 'UNAUTHORIZED', 'Unauthorized', 401);
            return;
        }
    };
};

/** Backward-compatible alias: requires Admin role */
export const requireAdmin = withRole('Admin');
