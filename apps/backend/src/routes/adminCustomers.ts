import { Router } from 'express';
import { db } from '../config/firebase';
import { requireAdmin } from '../middleware/auth';
import { asyncHandler, withValidation } from '../middleware/validate';
import { customerSchema, COLLECTIONS, type Customer } from '@nextcar/shared';
import { AppError } from '../utils/AppError';
import { successResponse } from '../utils/response';
import { FieldValue } from 'firebase-admin/firestore';

const router = Router();

// requireAdmin for all routes
router.use(requireAdmin);

// GET /api/admin/customers
router.get('/', asyncHandler(async (req, res) => {
    const limit = Number(req.query.limit) || 50;

    const query = db.collection(COLLECTIONS.CUSTOMERS)
        .where('deleted', '==', false)
        .orderBy('createdAt', 'desc')
        .limit(limit);

    const snapshot = await query.get();
    const customers = snapshot.docs.map(doc => {
        const data = doc.data() as Customer;
        return { id: doc.id, ...data };
    });

    successResponse(res, customers);
}));

// GET /api/admin/customers/:id
router.get('/:id', asyncHandler(async (req, res) => {
    const docRef = db.collection(COLLECTIONS.CUSTOMERS).doc(req.params.id as string);
    const doc = await docRef.get();

    if (!doc.exists) {
        throw new AppError('NOT_FOUND', 'Customer not found', 404);
    }

    const data = doc.data() as Customer;
    if (data.deleted === true) {
        throw new AppError('NOT_FOUND', 'Customer not found', 404);
    }

    successResponse(res, { id: doc.id, ...data });
}));

// POST /api/admin/customers
router.post('/', withValidation(customerSchema.omit({ deleted: true })), asyncHandler(async (req, res) => {
    const customerData = {
        ...req.body,
        deleted: false,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
    };

    const docRef = await db.collection(COLLECTIONS.CUSTOMERS).add(customerData);
    successResponse(res, { id: docRef.id, ...customerData }, 201);
}));

// PUT /api/admin/customers/:id
router.put('/:id', withValidation(customerSchema.partial()), asyncHandler(async (req, res) => {
    const docRef = db.collection(COLLECTIONS.CUSTOMERS).doc(req.params.id as string);
    const doc = await docRef.get();

    if (!doc.exists) {
        throw new AppError('NOT_FOUND', 'Customer not found', 404);
    }

    if (doc.data()?.deleted === true) {
        throw new AppError('NOT_FOUND', 'Customer not found', 404);
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

// DELETE /api/admin/customers/:id
router.delete('/:id', asyncHandler(async (req, res) => {
    const docRef = db.collection(COLLECTIONS.CUSTOMERS).doc(req.params.id as string);
    const doc = await docRef.get();

    if (!doc.exists) {
        throw new AppError('NOT_FOUND', 'Customer not found', 404);
    }

    if (doc.data()?.deleted === true) {
        throw new AppError('NOT_FOUND', 'Customer not found', 404);
    }

    await docRef.update({
        deleted: true,
        updatedAt: FieldValue.serverTimestamp()
    });

    successResponse(res, { id: req.params.id as string, message: 'Customer deleted successfully' });
}));

export default router;
