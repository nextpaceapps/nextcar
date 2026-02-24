import { Router } from 'express';
import { db } from '../config/firebase';
import { withRole } from '../middleware/auth';
import { asyncHandler, withValidation } from '../middleware/validate';
import { carSchema, COLLECTIONS, type Car } from '@nextcar/shared';
import { AppError } from '../utils/AppError';
import { successResponse } from '../utils/response';
import { FieldValue } from 'firebase-admin/firestore';

const router = Router();

// GET /api/admin/vehicles
router.get('/', withRole('Viewer'), asyncHandler(async (req, res) => {
    const limit = Number(req.query.limit) || 50;

    const query = db.collection(COLLECTIONS.CARS)
        .where('deleted', '==', false)
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

// GET /api/admin/vehicles/:id
router.get('/:id', withRole('Viewer'), asyncHandler(async (req, res) => {
    const doc = await db.collection(COLLECTIONS.CARS).doc(req.params.id as string).get();

    if (!doc.exists) {
        throw new AppError('NOT_FOUND', 'Vehicle not found', 404);
    }

    const data = doc.data() as Car;
    if (data.deleted === true) {
        throw new AppError('NOT_FOUND', 'Vehicle not found', 404);
    }

    if (data.photos && Array.isArray(data.photos)) {
        data.photos.sort((a, b) => a.order - b.order);
    }

    successResponse(res, { id: doc.id, ...data });
}));

router.post('/', withRole('Editor'), withValidation(carSchema.omit({ status: true, deleted: true })), asyncHandler(async (req, res) => {
    const vehicleData = {
        ...req.body,
        status: 'draft',
        deleted: false,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
    };

    const docRef = await db.collection(COLLECTIONS.CARS).add(vehicleData);
    const newDoc = await docRef.get();
    successResponse(res, { id: docRef.id, ...newDoc.data() }, 201);
}));

// PUT /api/admin/vehicles/:id
router.put('/:id', withRole('Editor'), withValidation(carSchema.partial()), asyncHandler(async (req, res) => {
    const docRef = db.collection(COLLECTIONS.CARS).doc(req.params.id as string);
    const doc = await docRef.get();

    if (!doc.exists) {
        throw new AppError('NOT_FOUND', 'Vehicle not found', 404);
    }

    if (doc.data()?.deleted === true) {
        throw new AppError('NOT_FOUND', 'Vehicle not found', 404);
    }

    const { id, deleted, ...updateData } = req.body;

    const payload = {
        ...updateData,
        updatedAt: FieldValue.serverTimestamp(),
    };

    await docRef.update(payload);

    const updatedDoc = await docRef.get();
    successResponse(res, { id: updatedDoc.id, ...updatedDoc.data() });
}));

// DELETE /api/admin/vehicles/:id
router.delete('/:id', withRole('Editor'), asyncHandler(async (req, res) => {
    const docRef = db.collection(COLLECTIONS.CARS).doc(req.params.id as string);
    const doc = await docRef.get();

    if (!doc.exists) {
        throw new AppError('NOT_FOUND', 'Vehicle not found', 404);
    }

    if (doc.data()?.deleted === true) {
        throw new AppError('NOT_FOUND', 'Vehicle not found', 404);
    }

    await docRef.update({
        status: 'archived',
        deleted: true,
        updatedAt: FieldValue.serverTimestamp()
    });

    successResponse(res, { id: req.params.id as string, message: 'Vehicle deleted successfully' });
}));

export default router;
