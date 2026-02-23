import * as admin from 'firebase-admin';

if (!admin.apps.length) {
    const projectId = process.env.FIREBASE_PROJECT_ID || process.env.GCLOUD_PROJECT;
    admin.initializeApp({
        ...(projectId ? { projectId } : {})
    });
}

export const db = admin.firestore();
