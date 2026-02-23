import { NextResponse } from 'next/server';
import { db } from '../../../lib/firebase-admin';
import * as admin from 'firebase-admin';
import { z } from 'zod';
import { COLLECTIONS } from '@nextcar/shared';

// Simple in-memory rate limiting (Note: in serverless environments, this resets per isolate, but it's okay for basic protection)
const rateLimitMap = new Map<string, { count: number, resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 5; // 5 requests per minute

let lastCleanupTime = Date.now();
function cleanupRateLimitMap() {
    const now = Date.now();
    if (now - lastCleanupTime > RATE_LIMIT_WINDOW_MS) {
        for (const [ip, limit] of rateLimitMap.entries()) {
            if (now > limit.resetTime) {
                rateLimitMap.delete(ip);
            }
        }
        lastCleanupTime = now;
    }
}

const leadSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    phone: z.string().optional(),
    email: z.string().email('Invalid email').or(z.literal('')).optional(),
    message: z.string().optional(),
    vehicleId: z.string().optional(),
}).refine(data => data.email || data.phone, {
    message: 'Either email or phone must be provided',
    path: ['email'],
});

export async function POST(request: Request) {
    try {
        const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
        const now = Date.now();

        cleanupRateLimitMap();

        let rateLimit = rateLimitMap.get(ip);
        if (!rateLimit || now > rateLimit.resetTime) {
            rateLimit = { count: 0, resetTime: now + RATE_LIMIT_WINDOW_MS };
        }

        rateLimit.count++;
        rateLimitMap.set(ip, rateLimit);

        if (rateLimit.count > MAX_REQUESTS_PER_WINDOW) {
            return NextResponse.json({ success: false, error: 'Too many requests. Please try again later.' }, { status: 429 });
        }

        const body = await request.json();

        const parseResult = leadSchema.safeParse(body);
        if (!parseResult.success) {
            return NextResponse.json({ success: false, error: parseResult.error.issues[0].message }, { status: 400 });
        }

        const { name, phone, email, message, vehicleId } = parseResult.data;

        // 1. Customer matching/creation
        let customerId: string | null = null;

        if (email) {
            const customerQuery = await db.collection(COLLECTIONS.CUSTOMERS)
                .where('email', '==', email)
                .where('deleted', '==', false)
                .limit(1)
                .get();

            if (!customerQuery.empty) {
                customerId = customerQuery.docs[0].id;
            }
        }

        if (!customerId) {
            const customerRef = db.collection(COLLECTIONS.CUSTOMERS).doc();
            customerId = customerRef.id;
            const newCustomer = {
                id: customerId,
                name,
                email: email || '',
                phone: phone || '',
                tags: ['lead'],
                notes: 'Created via web lead form',
                deleted: false,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            };
            await customerRef.set(newCustomer);
        }

        // 2. Opportunity creation
        const oppRef = db.collection(COLLECTIONS.OPPORTUNITIES).doc();
        const newOpp = {
            id: oppRef.id,
            customerId,
            vehicleId: vehicleId || null,
            stage: 'new',
            notes: message || '',
            source: {
                page: vehicleId ? `/vehicles/${vehicleId}` : '/vehicles',
                vehicleId: vehicleId || null,
                submittedAt: admin.firestore.FieldValue.serverTimestamp(),
            },
            deleted: false,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        };

        await oppRef.set(newOpp);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error submitting lead:', error);
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}
