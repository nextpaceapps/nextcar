import { Request, Response, NextFunction } from 'express';
import { auth, db } from '../config/firebase';
import type { DecodedIdToken } from 'firebase-admin/auth';

export interface AuthRequest extends Request {
    user?: DecodedIdToken;
}

export const requireAdmin = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Missing or invalid authorization header' });
    }

    const token = authHeader.split('Bearer ')[1];

    try {
        const decodedToken = await auth.verifyIdToken(token);

        // Check user role in Firestore
        const userDoc = await db.collection('users').doc(decodedToken.uid).get();

        if (!userDoc.exists) {
            return res.status(403).json({ error: 'User not found in database' });
        }

        const userData = userDoc.data();
        if (userData?.role !== 'Admin') {
            return res.status(403).json({ error: 'Insufficient permissions' });
        }

        req.user = decodedToken;
        next();
    } catch (error) {
        console.error('Error verifying token:', error);
        return res.status(401).json({ error: 'Unauthorized' });
    }
};
