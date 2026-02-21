import * as readline from 'readline';
import { auth, db } from '../src/config/firebase';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const question = (query: string): Promise<string> => {
    return new Promise((resolve) => rl.question(query, resolve));
};

async function createOwner() {
    try {
        console.log('--- Create Admin Owner ---');
        const email = await question('Email: ');
        const password = await question('Password: ');

        if (!email || !password) {
            console.error('Email and password are required.');
            process.exit(1);
        }

        console.log(`Creating user ${email}...`);

        const userRecord = await auth.createUser({
            email,
            password,
            emailVerified: true
        });

        console.log(`User created with UID: ${userRecord.uid}`);

        console.log('Setting admin role in Firestore...');

        const admin = require('firebase-admin');

        await db.collection('users').doc(userRecord.uid).set({
            uid: userRecord.uid,
            email: userRecord.email,
            role: 'Admin',
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        console.log('Successfully provisioned the owner account!');
        process.exit(0);
    } catch (error) {
        console.error('Error provisioning owner:', error);
        process.exit(1);
    }
}

createOwner();
