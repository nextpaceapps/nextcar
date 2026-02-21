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
import { COLLECTIONS } from '@nextcar/shared';

const CARS_COLLECTION = COLLECTIONS.CARS;

export const carService = {
    async getPublishedCars(): Promise<Car[]> {
        const q = query(
            collection(db, CARS_COLLECTION),
            where('status', '==', 'published'),
            where('deleted', '==', false),
            orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Car));
    },

    async getCar(id: string): Promise<Car | null> {
        const docRef = doc(db, CARS_COLLECTION, id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && !docSnap.data().deleted) {
            return { id: docSnap.id, ...docSnap.data() } as Car;
        }
        return null;
    }
};
