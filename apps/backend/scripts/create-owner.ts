import * as readline from 'readline';
import path from 'path';
import fs from 'fs';
import { COLLECTIONS } from '@nextcar/shared';

// Force production environment if requested
if (process.argv.includes('--prod')) {
    process.env.NODE_ENV = 'production';
    // Clear any emulator variables that might be in the environment
    delete process.env.FIREBASE_AUTH_EMULATOR_HOST;
    delete process.env.FIRESTORE_EMULATOR_HOST;
    delete process.env.FIREBASE_STORAGE_EMULATOR_HOST;
}

// Automatic credential lookup for production to avoid relative path issues
if (process.env.NODE_ENV === 'production') {
    const keyFile = 'nextcar-83e67-firebase-adminsdk-fbsvc-b3954080d7.json';
    const localKeyPath = path.resolve(__dirname, '..', keyFile);

    if (fs.existsSync(localKeyPath)) {
        // Fix relative path if it's set in .env or fix missing variable
        const currentCreds = process.env.GOOGLE_APPLICATION_CREDENTIALS;
        if (!currentCreds || currentCreds.startsWith('.')) {
            process.env.GOOGLE_APPLICATION_CREDENTIALS = localKeyPath;
        }
    }
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const question = (query: string): Promise<string> => {
    return new Promise((resolve) => rl.question(query, resolve));
};

async function createOwner() {
    try {
        console.log('\n--- NextCar Admin Provisioning Tool ---');

        // Use require to ensure environment is locked in before module evaluation
        const { auth, db } = require('../src/config/firebase');
        const admin = require('firebase-admin');

        const isProd = process.env.NODE_ENV === 'production';
        console.log(`Target Environment : ${isProd ? 'PRODUCTION (Live)' : 'EMULATOR (Local)'}`);
        console.log(`Service Account    : ${process.env.GOOGLE_APPLICATION_CREDENTIALS || 'Default'}`);

        if (isProd) {
            if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
                console.error('\n❌ Error: Production mode requires GOOGLE_APPLICATION_CREDENTIALS.');
                process.exit(1);
            }
            console.log('\n⚠️  DANGER: You are modifying the LIVE production database.');
            const inputConfirm = await question('To proceed, type "PROD" to confirm: ');

            if (inputConfirm.trim().toUpperCase() !== 'PROD') {
                console.log(`\n❌ Aborted: confirmation failed (received: "${inputConfirm.trim()}")`);
                process.exit(0);
            }
            console.log('✅ Confirmation accepted.');
        } else {
            console.log('\nℹ️  Running in emulator mode. Use --prod to target production.');
        }

        const rawEmail = await question('\nEnter Email: ');
        const rawPassword = await question('Enter Password: ');

        const email = rawEmail.trim();
        const password = rawPassword.trim();

        if (!email || !password) {
            console.error('Email and password are required.');
            process.exit(1);
        }

        console.log(`\nCreating user ${email} in ${isProd ? 'Production' : 'Emulator'}...`);

        const userRecord = await auth.createUser({
            email,
            password,
            emailVerified: true
        });

        console.log(`✅ Auth user created: ${userRecord.uid}`);
        console.log('Setting Admin role in Firestore...');

        await db.collection(COLLECTIONS.USERS).doc(userRecord.uid).set({
            uid: userRecord.uid,
            email: userRecord.email,
            role: 'Admin',
            deleted: false,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        console.log('✨ Success! Admin account provisioned.');
        process.exit(0);
    } catch (error) {
        console.error('\n❌ FAILED:', error);
        if (error && typeof error === 'object' && 'code' in error) {
            console.error(`Error Code: ${(error as any).code}`);
        }
        process.exit(1);
    }
}

createOwner();
