import {
    collection,
    doc,
    getDocs,
    getDoc,
    query,
    orderBy,
    where
} from 'firebase/firestore';
import { db } from '../../firebase';
import type { Car } from '@nextcar/shared';

const CARS_COLLECTION = 'cars';

export const carService = {
    async getPublishedCars(): Promise<Car[]> {
        const q = query(
            collection(db, CARS_COLLECTION),
            where('status', '==', 'published'),
            orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Car));
    },

    async getCar(id: string): Promise<Car | null> {
        const docRef = doc(db, CARS_COLLECTION, id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const data = docSnap.data() as Car;
            // Only return if published (or maybe fine to return draft if accessed directly? sticking to published for now safety)
            // Actually common pattern is to allow fetching by ID, but maybe check status in component.
            // For now just return data.
            return { id: docSnap.id, ...data };
        }
        return null;
    }
};
