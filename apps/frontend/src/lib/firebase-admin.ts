import * as admin from 'firebase-admin';

if (!admin.apps.length) {
    admin.initializeApp({
        projectId: process.env.FIREBASE_PROJECT_ID || 'nextcar-83e67',
        // In local development, firestore emulator takes over automatically 
        // if process.env.FIRESTORE_EMULATOR_HOST is set (e.g., localhost:8080)
    });
}

export const db = admin.firestore();
