import { Router } from 'express';
import { db } from '../config/firebase';
import { withRole, type AuthRequest } from '../middleware/auth';
import { asyncHandler } from '../middleware/validate';
import { successResponse } from '../utils/response';
import { AppError } from '../utils/AppError';

const router = Router();

// GET /api/admin/users/me — returns current user's role (any authenticated user)
router.get('/me', withRole('Viewer'), asyncHandler(async (req, res) => {
    const authReq = req as AuthRequest;
    const uid = authReq.user!.uid;
    const userDoc = await db.collection('users').doc(uid).get();

    if (!userDoc.exists) {
        throw new AppError('NOT_FOUND', 'User not found', 404);
    }

    const data = userDoc.data();
    successResponse(res, {
        uid,
        email: data?.email || authReq.user!.email,
        role: data?.role || 'Viewer',
    });
}));

// GET /api/admin/users — list all users (Admin only)
router.get('/', withRole('Admin'), asyncHandler(async (req, res) => {
    const snapshot = await db.collection('users').orderBy('email').get();
    const users = snapshot.docs.map(doc => ({
        uid: doc.id,
        ...doc.data(),
    }));
    successResponse(res, users);
}));

// PUT /api/admin/users/:uid — update user role (Admin only)
router.put('/:uid', withRole('Admin'), asyncHandler(async (req, res) => {
    const { uid } = req.params;
    const { role } = req.body;

    const validRoles = ['Admin', 'Editor', 'Viewer'];
    if (!role || !validRoles.includes(role)) {
        throw new AppError('VALIDATION_ERROR', `Role must be one of: ${validRoles.join(', ')}`, 400);
    }

    const userDoc = await db.collection('users').doc(uid as string).get();
    if (!userDoc.exists) {
        throw new AppError('NOT_FOUND', 'User not found', 404);
    }

    await db.collection('users').doc(uid as string).update({ role });

    successResponse(res, { uid, role, message: 'Role updated successfully' });
}));

export default router;
