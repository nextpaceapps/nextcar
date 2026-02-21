import admin from 'firebase-admin';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

// Initialize using Application Default Credentials with GOOGLE_APPLICATION_CREDENTIALS

if (process.env.NODE_ENV !== 'production') {
    process.env.FIREBASE_AUTH_EMULATOR_HOST = process.env.FIREBASE_AUTH_EMULATOR_HOST || '127.0.0.1:9099';
    process.env.FIRESTORE_EMULATOR_HOST = process.env.FIRESTORE_EMULATOR_HOST || '127.0.0.1:8080';
}

if (!admin.apps.length) {
    try {
        // Uses GOOGLE_APPLICATION_CREDENTIALS env var or automatic cloud discovery
        admin.initializeApp({
            projectId: 'nextcar-83e67',
            credential: admin.credential.applicationDefault()
        });
        console.log('Firebase Admin Initialized');
    } catch (error) {
        console.error('Firebase Admin Initialization Error:', error);
    }
}

export const db = admin.firestore();
export const auth = admin.auth();
