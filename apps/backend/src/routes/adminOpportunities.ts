import { Router } from 'express';
import { db } from '../config/firebase';
import { requireAdmin } from '../middleware/auth';
import { asyncHandler, withValidation } from '../middleware/validate';
import { opportunitySchema, COLLECTIONS, type Opportunity } from '@nextcar/shared';
import { AppError } from '../utils/AppError';
import { successResponse } from '../utils/response';
import { FieldValue } from 'firebase-admin/firestore';

const router = Router();

// requireAdmin for all routes
router.use(requireAdmin);

const enrichOpportunity = async (data: Opportunity, docId: string) => {
    let customerName = 'Unknown Customer';
    let vehicleName = undefined;

    if (data.customerId) {
        const customerDoc = await db.collection(COLLECTIONS.CUSTOMERS).doc(data.customerId).get();
        if (customerDoc.exists) {
            customerName = customerDoc.data()?.name || customerName;
        }
    }

    if (data.vehicleId) {
        const vehicleDoc = await db.collection(COLLECTIONS.CARS).doc(data.vehicleId).get();
        if (vehicleDoc.exists) {
            const vData = vehicleDoc.data();
            vehicleName = `${vData?.make} ${vData?.model} (${vData?.year})`;
        }
    }

    return { id: docId, ...data, customerName, vehicleName };
};

// GET /api/admin/opportunities
router.get('/', asyncHandler(async (req, res) => {
    const limit = Number(req.query.limit) || 50;

    const query = db.collection(COLLECTIONS.OPPORTUNITIES)
        .where('deleted', '==', false)
        .orderBy('createdAt', 'desc')
        .limit(limit);

    const snapshot = await query.get();
    const rawOpportunities = snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as Opportunity) }));

    const customerIds = [...new Set(rawOpportunities.map(o => o.customerId).filter(Boolean))];
    const vehicleIds = [...new Set(rawOpportunities.map(o => o.vehicleId).filter(Boolean))];

    const customerDocs = customerIds.length > 0
        ? await db.getAll(...customerIds.map(id => db.collection(COLLECTIONS.CUSTOMERS).doc(id!)))
        : [];
    const vehicleDocs = vehicleIds.length > 0
        ? await db.getAll(...vehicleIds.map(id => db.collection(COLLECTIONS.CARS).doc(id!)))
        : [];

    const customerMap = new Map(customerDocs.map(doc => [doc.id, doc.data()]));
    const vehicleMap = new Map(vehicleDocs.map(doc => [doc.id, doc.data()]));

    const opportunities = rawOpportunities.map(opp => {
        let customerName = 'Unknown Customer';
        if (opp.customerId && customerMap.has(opp.customerId)) {
            const cData = customerMap.get(opp.customerId);
            if (cData) customerName = cData.name || customerName;
        }

        let vehicleName = undefined;
        if (opp.vehicleId && vehicleMap.has(opp.vehicleId)) {
            const vData = vehicleMap.get(opp.vehicleId);
            if (vData) vehicleName = `${vData.make} ${vData.model} (${vData.year})`;
        }

        return { ...opp, customerName, vehicleName };
    });

    successResponse(res, opportunities);
}));

// GET /api/admin/opportunities/:id
router.get('/:id', asyncHandler(async (req, res) => {
    const docRef = db.collection(COLLECTIONS.OPPORTUNITIES).doc(req.params.id as string);
    const doc = await docRef.get();

    if (!doc.exists) {
        throw new AppError('NOT_FOUND', 'Opportunity not found', 404);
    }

    const data = doc.data() as Opportunity;
    if (data.deleted === true) {
        throw new AppError('NOT_FOUND', 'Opportunity not found', 404);
    }

    const enriched = await enrichOpportunity(data, doc.id);
    successResponse(res, enriched);
}));

// POST /api/admin/opportunities
router.post('/', withValidation(opportunitySchema.omit({ deleted: true })), asyncHandler(async (req, res) => {
    const oppData = {
        ...req.body,
        deleted: false,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
    };

    const docRef = await db.collection(COLLECTIONS.OPPORTUNITIES).add(oppData);
    const newDoc = await docRef.get();
    successResponse(res, { id: docRef.id, ...newDoc.data() }, 201);
}));

// PUT /api/admin/opportunities/:id
router.put('/:id', withValidation(opportunitySchema.partial()), asyncHandler(async (req, res) => {
    const docRef = db.collection(COLLECTIONS.OPPORTUNITIES).doc(req.params.id as string);
    const doc = await docRef.get();

    if (!doc.exists) {
        throw new AppError('NOT_FOUND', 'Opportunity not found', 404);
    }

    if (doc.data()?.deleted === true) {
        throw new AppError('NOT_FOUND', 'Opportunity not found', 404);
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

// DELETE /api/admin/opportunities/:id
router.delete('/:id', asyncHandler(async (req, res) => {
    const docRef = db.collection(COLLECTIONS.OPPORTUNITIES).doc(req.params.id as string);
    const doc = await docRef.get();

    if (!doc.exists) {
        throw new AppError('NOT_FOUND', 'Opportunity not found', 404);
    }

    if (doc.data()?.deleted === true) {
        throw new AppError('NOT_FOUND', 'Opportunity not found', 404);
    }

    await docRef.update({
        deleted: true,
        updatedAt: FieldValue.serverTimestamp()
    });

    successResponse(res, { id: req.params.id as string, message: 'Opportunity deleted successfully' });
}));

export default router;
