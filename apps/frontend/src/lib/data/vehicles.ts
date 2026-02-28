import { db } from '../firebase-admin';
import { COLLECTIONS, type Vehicle } from '@nextcar/shared';
import { cache } from 'react';

export const getPublishedVehicles = cache(async (limit = 20): Promise<Vehicle[]> => {
    const query = db.collection(COLLECTIONS.VEHICLES)
        .where('deleted', '==', false)
        .where('status', '==', 'published')
        .orderBy('createdAt', 'desc')
        .limit(limit);

    const snapshot = await query.get();
    return snapshot.docs.map(doc => {
        const data = doc.data() as Vehicle;
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
        return transformed as Vehicle;
    });
});

export const getFeaturedVehicles = cache(async (limit = 10): Promise<Vehicle[]> => {
    const query = db.collection(COLLECTIONS.VEHICLES)
        .where('deleted', '==', false)
        .where('status', '==', 'published')
        .where('featured', '==', true)
        .orderBy('createdAt', 'desc')
        .limit(limit);

    const snapshot = await query.get();
    return snapshot.docs.map(doc => {
        const data = doc.data() as Vehicle;
        if (data.photos && Array.isArray(data.photos)) {
            data.photos.sort((a, b) => a.order - b.order);
        }

        const transformed = {
            id: doc.id,
            ...data,
            createdAt: data.createdAt ? data.createdAt.toDate?.().toISOString() || data.createdAt : undefined,
            updatedAt: data.updatedAt ? data.updatedAt.toDate?.().toISOString() || data.updatedAt : undefined
        };
        return transformed as Vehicle;
    });
});

export const getPublishedVehiclesCount = cache(async (): Promise<number> => {
    const query = db.collection(COLLECTIONS.VEHICLES)
        .where('deleted', '==', false)
        .where('status', '==', 'published');
    const snapshot = await query.count().get();
    return snapshot.data().count;
});

export const getLowestPublishedPrice = cache(async (): Promise<number | null> => {
    const query = db.collection(COLLECTIONS.VEHICLES)
        .where('deleted', '==', false)
        .where('status', '==', 'published')
        .orderBy('price', 'asc')
        .limit(1);
    const snapshot = await query.get();
    if (snapshot.empty) return null;
    const data = snapshot.docs[0].data() as Vehicle;
    return typeof data.price === 'number' ? data.price : null;
});

export const getSidebarVehiclePreview = cache(async (): Promise<{
    vehicles: Vehicle[];
    totalCount: number;
    lowestPrice: number | null;
}> => {
    const [vehicles, totalCount, lowestPriceResult] = await Promise.all([
        getPublishedVehicles(3),
        getPublishedVehiclesCount(),
        getLowestPublishedPrice().catch(() => null),
    ]);
    const lowestPrice = lowestPriceResult ?? (vehicles.length > 0
        ? Math.min(...vehicles.map(v => v.price))
        : null);
    return { vehicles, totalCount, lowestPrice };
});

export const getPublishedVehicleById = cache(async (id: string): Promise<Vehicle | null> => {
    const doc = await db.collection(COLLECTIONS.VEHICLES).doc(id).get();

    if (!doc.exists) {
        return null;
    }

    const data = doc.data() as Vehicle;
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

    return transformed as Vehicle;
});
