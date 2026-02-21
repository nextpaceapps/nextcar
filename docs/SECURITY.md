# Security

## Current State (Development)

Firestore and Storage write rules are **temporarily open** (`if true`) because admin authentication is not yet implemented. See TODO comments in:
- `firestore.rules`
- `storage.rules`

Both reference GitHub issue #21 for the production checklist.

## Rules

- **API keys**: `GEMINI_API_KEY` must never be exposed to the client. AI calls route through `apps/backend/src/routes/ai.ts`.
- **CORS**: `cors.json` currently allows only `localhost` origins. Must be updated before production.
- **Firebase config**: Client-side Firebase config values (`VITE_FIREBASE_*`) are safe to expose — they are not secrets. The `GEMINI_API_KEY` in `apps/backend/.env` is a secret.

## Production Checklist

Tracked in GitHub issue #21. Key items:
1. Implement admin authentication (issue #5)
2. Tighten Firestore rules to `request.auth != null` for writes
3. Tighten Storage rules to `request.auth != null` for writes
4. Update `cors.json` with production origins
5. Enable Firebase App Check

## Admin Authentication

To provision the initial admin account, run:
```bash
npm run create-owner
```
This script will prompt for an email and password, create the authenticated user, and assign the `Admin` role in Firestore.

**Manual Console Fallback:**
If you cannot use the script, you can manually provision the admin:
1. Go to Firebase Console > Authentication and create a user with email/password.
2. Go to Firestore Database > start a collection `users` if it doesn't exist.
3. Create a document with the Document ID set to the user's `uid` (from the Authentication tab).
4. Add a string field `role` with the value `Admin`.
