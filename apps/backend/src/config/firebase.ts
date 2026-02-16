import admin from 'firebase-admin';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

// Initialize using Application Default Credentials with GOOGLE_APPLICATION_CREDENTIALS

if (!admin.apps.length) {
    try {
        // Uses GOOGLE_APPLICATION_CREDENTIALS env var or automatic cloud discovery
        admin.initializeApp({
            credential: admin.credential.applicationDefault()
        });
        console.log('Firebase Admin Initialized');
    } catch (error) {
        console.error('Firebase Admin Initialization Error:', error);
    }
}

export const db = admin.firestore();
export const auth = admin.auth();
