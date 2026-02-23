import { db } from '../firebase-admin';
import { COLLECTIONS, type Car } from '@nextcar/shared';
import { cache } from 'react';

export const getPublishedVehicles = cache(async (limit = 20): Promise<Car[]> => {
    const query = db.collection(COLLECTIONS.CARS)
        .where('deleted', '==', false)
        .where('status', '==', 'published')
        .orderBy('createdAt', 'desc')
        .limit(limit);

    const snapshot = await query.get();
    return snapshot.docs.map(doc => {
        const data = doc.data() as Car;
        if (data.photos && Array.isArray(data.photos)) {
            data.photos.sort((a, b) => a.order - b.order);
        }

        // Ensure serialization of dates from Firestore Timestamp
        const transformed = {
            id: doc.id,
            ...data,
            createdAt: data.createdAt ? data.createdAt.toDate?.().toISOString() || data.createdAt : undefined,
            updatedAt: data.updatedAt ? data.updatedAt.toDate?.().toISOString() || data.updatedAt : undefined
        };
        return transformed as Car;
    });
});

export const getPublishedVehicleById = cache(async (id: string): Promise<Car | null> => {
    const doc = await db.collection(COLLECTIONS.CARS).doc(id).get();

    if (!doc.exists) {
        return null;
    }

    const data = doc.data() as Car;
    if (data.deleted === true || data.status !== 'published') {
        return null;
    }

    if (data.photos && Array.isArray(data.photos)) {
        data.photos.sort((a, b) => a.order - b.order);
    }

    const transformed = {
        id: doc.id,
        ...data,
        createdAt: data.createdAt ? data.createdAt.toDate?.().toISOString() || data.createdAt : undefined,
        updatedAt: data.updatedAt ? data.updatedAt.toDate?.().toISOString() || data.updatedAt : undefined
    };

    return transformed as Car;
});
