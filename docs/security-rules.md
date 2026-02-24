# Security Rules

## Overview

NextCar follows an **API-first architecture** where all Firestore access goes through the
Firebase Admin SDK (server components + API routes). The Admin SDK bypasses Firestore
security rules entirely, so the rules serve as a **safety net** — they block any
accidental or malicious direct client-side access.

Firebase Storage is the one exception: the admin app uploads photos directly to Storage
from the browser using Firebase Auth credentials.

## Firestore Rules

```
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

**Rationale:** All data access flows through Admin SDK which bypasses rules.
Denying everything client-side prevents:
- Accidental direct Firestore reads from frontend code
- Unauthorized access if a Firebase API key is exposed (API keys are not secrets, but
  rules prevent them from being useful for data access)

## Storage Rules

```
rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {
    match /vehicles/{vehicleId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

**Rationale:**
| Path | Read | Write | Why |
|------|------|-------|-----|
| `vehicles/{id}/**` | Public | Authenticated | Photos are displayed on the public site; only admin users (authenticated via Firebase Auth) can upload or delete. |
| Everything else | Denied | Denied | No other Storage paths are in use. Deny by default. |

## Deployment

Deploy rules to Firebase (production):

```bash
firebase deploy --only firestore:rules,storage
```

Rules are automatically loaded by the emulators during local development from
`firestore.rules` and `storage.rules` at the project root.

## Key Design Decisions

1. **Deny-all Firestore** — Since we never read Firestore from the client, there is no
   reason to allow any access. This is the most restrictive and safest posture.

2. **Public Storage reads** — Vehicle photos must be accessible without authentication
   for the public-facing website. The `vehicles/` prefix scoping ensures only intended
   assets are publicly readable.

3. **Authenticated Storage writes** — The admin app uploads directly to Storage using
   Firebase Auth tokens. This requires `request.auth != null` on write rules. No
   role-based scoping is applied at the rules level because the admin app already
   enforces role checks via its own authentication layer before allowing uploads.
