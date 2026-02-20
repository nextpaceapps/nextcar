import {
    collection,
    doc,
    getDocs,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    orderBy
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Car, CarSchema } from '@nextcar/shared';

const CARS_COLLECTION = 'cars';

export const carService = {
    async getCars(): Promise<Car[]> {
        const q = query(collection(db, CARS_COLLECTION), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Car));
    },

    async getCar(id: string): Promise<Car | null> {
        const docRef = doc(db, CARS_COLLECTION, id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as Car;
        }
        return null;
    },

    async createCar(carData: CarSchema): Promise<string> {
        const docRef = await addDoc(collection(db, CARS_COLLECTION), {
            ...carData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        });
        return docRef.id;
    },

    async updateCar(id: string, carData: Partial<CarSchema>): Promise<void> {
        const docRef = doc(db, CARS_COLLECTION, id);
        await updateDoc(docRef, {
            ...carData,
            updatedAt: new Date().toISOString()
        });
    },

    async deleteCar(id: string): Promise<void> {
        const docRef = doc(db, CARS_COLLECTION, id);
        await deleteDoc(docRef);
    }
};
