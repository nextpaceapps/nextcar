import { Router } from 'express';
import { db } from '../config/firebase';
import { asyncHandler } from '../middleware/validate';
import { COLLECTIONS, type Car } from '@nextcar/shared';
import { AppError } from '../utils/AppError';
import { successResponse } from '../utils/response';

const router = Router();

// GET /api/vehicles
router.get('/', asyncHandler(async (req, res) => {
    const limit = Number(req.query.limit) || 20;

    const query = db.collection(COLLECTIONS.CARS)
        .where('deleted', '==', false)
        .where('status', '==', 'published')
        .orderBy('createdAt', 'desc')
        .limit(limit);

    const snapshot = await query.get();
    const vehicles = snapshot.docs.map(doc => {
        const data = doc.data() as Car;
        if (data.photos && Array.isArray(data.photos)) {
            data.photos.sort((a, b) => a.order - b.order);
        }
        return { id: doc.id, ...data };
    });

    successResponse(res, vehicles);
}));

// GET /api/vehicles/:id
router.get('/:id', asyncHandler(async (req, res) => {
    const doc = await db.collection(COLLECTIONS.CARS).doc(req.params.id as string).get();

    if (!doc.exists) {
        throw new AppError('NOT_FOUND', 'Vehicle not found', 404);
    }

    const data = doc.data() as Car;
    if (data.deleted === true || data.status !== 'published') {
        throw new AppError('NOT_FOUND', 'Vehicle not found', 404);
    }

    // Sort photos by order exactly matching the drag-and-drop ordering in admin UI
    if (data.photos && Array.isArray(data.photos)) {
        data.photos.sort((a, b) => a.order - b.order);
    }

    successResponse(res, { id: doc.id, ...data });
}));

export default router;
