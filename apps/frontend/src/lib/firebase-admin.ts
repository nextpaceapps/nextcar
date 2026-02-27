import * as admin from 'firebase-admin';

if (!admin.apps.length) {
    // Prevent accidental connection to emulators during build/production
    // if they are defined in .env.local but not explicitly requested.
    if (process.env.NODE_ENV === 'production' && !process.env.FIREBASE_FORCE_EMULATOR) {
        delete process.env.FIRESTORE_EMULATOR_HOST;
        delete process.env.FIREBASE_AUTH_EMULATOR_HOST;
        delete process.env.FIREBASE_STORAGE_EMULATOR_HOST;
    }

    const projectId = process.env.FIREBASE_PROJECT_ID || process.env.GCLOUD_PROJECT;
    admin.initializeApp({
        ...(projectId ? { projectId } : {})
    });
}

export const db = admin.firestore();
