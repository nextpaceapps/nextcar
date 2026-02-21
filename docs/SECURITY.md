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
