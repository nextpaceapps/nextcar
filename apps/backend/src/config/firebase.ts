import admin from 'firebase-admin';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config({ path: path.join(__dirname, '../../.env.local') });
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Initialize using Application Default Credentials with GOOGLE_APPLICATION_CREDENTIALS

if (process.env.NODE_ENV !== 'production') {
    process.env.FIREBASE_AUTH_EMULATOR_HOST = process.env.FIREBASE_AUTH_EMULATOR_HOST || '127.0.0.1:9099';
    process.env.FIRESTORE_EMULATOR_HOST = process.env.FIRESTORE_EMULATOR_HOST || '127.0.0.1:8080';
}

if (!admin.apps.length) {
    try {
        const projectId = process.env.FIREBASE_PROJECT_ID || 'nextcar-83e67';
        const credPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;

        let credential;
        if (credPath) {
            // Support both absolute and relative paths
            const absolutePath = path.isAbsolute(credPath)
                ? credPath
                : path.resolve(process.cwd(), credPath);

            if (fs.existsSync(absolutePath)) {
                credential = admin.credential.cert(absolutePath);
            } else {
                console.warn(`⚠️ Warning: GOOGLE_APPLICATION_CREDENTIALS set but file not found at: ${absolutePath}. Falling back to Application Default Credentials.`);
            }
        }

        if (!credential) {
            credential = admin.credential.applicationDefault();
        }

        admin.initializeApp({
            projectId,
            credential
        });

        console.log(`Firebase Admin Initialized for project: ${projectId}`);
    } catch (error) {
        console.error('Firebase Admin Initialization Error:', error);
    }
}

export const db = admin.firestore();
export const auth = admin.auth();
