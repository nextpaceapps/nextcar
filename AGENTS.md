# AGENTS.md

NextCar is a monorepo for a used-car dealership platform: a public-facing vehicle catalogue, an admin panel for inventory management (with AI-powered listing parsing), and a shared type-safe core — all backed by Firebase.

## Repo Layout

```
nextcar-monorepo/
├── apps/
│   ├── frontend/      # Public customer-facing catalogue (React + Vite)
│   ├── admin/         # Internal inventory management panel (React + Vite)
│   └── backend/       # Express API server (Gemini AI proxy, future endpoints)
├── packages/
│   └── shared/        # Zod schemas, TS types, Firestore collection constants
├── docs/              # Guides (Firebase setup, etc.)
├── firestore.rules    # Firestore security rules
├── storage.rules      # Cloud Storage security rules
├── firestore.indexes.json
├── firebase.json      # Emulator & deployment config
└── cors.json          # Storage CORS config (dev origins)
```

## Entry Points

| Area | Start here |
|---|---|
| Shared types & schemas | `packages/shared/src/schemas/car.ts` — Zod schemas, single source of truth |
| Shared type exports | `packages/shared/src/types/car.ts` — all types derived via `z.infer<>` |
| Collection constants | `packages/shared/src/index.ts` — `COLLECTIONS.CARS` and `User` type |
| Admin car form | `apps/admin/src/components/cars/CarForm.tsx` |
| Admin services | `apps/admin/src/services/carService.ts`, `aiService.ts`, `storageService.ts` |
| Frontend services | `apps/frontend/src/services/carService.ts` |
| Backend AI route | `apps/backend/src/routes/ai.ts` |
| Firebase init (admin) | `apps/admin/src/lib/firebase.ts` |
| Firebase init (frontend) | `apps/frontend/firebase.ts` |

## Docs

| Document | Purpose |
|---|---|
| `docs/firebase-setup.md` | Firebase project setup, emulators, environment variables |
| `firestore.rules` | Firestore security rules — **see TODOs referencing #21** |
| `storage.rules` | Cloud Storage security rules — **see TODOs referencing #21** |
| `firestore.indexes.json` | Composite indexes for Firestore queries |
| `cors.json` | Storage CORS (currently dev-only origins) |

> TODO: create `docs/architecture.md` — high-level architecture, data flow diagrams, deployment topology  
> TODO: create `CONTRIBUTING.md` — coding conventions, PR process, commit message format  

## Key Conventions

- **Types are derived from Zod** — never duplicate interfaces manually. Define the schema in `packages/shared/src/schemas/`, then use `z.infer<>` in `packages/shared/src/types/`.
- **Collection names** live in `COLLECTIONS` constant (`packages/shared/src/index.ts`). Never hardcode `'cars'` or any collection string.
- **Soft deletes** — documents are flagged `deleted: true`, never removed. All queries filter `where('deleted', '==', false)`.
- **Server timestamps** — `createdAt`/`updatedAt` are set via `serverTimestamp()`, not client-side.
- **No `as any`** — use `declare global` for HMR guards, `keyof` for register helpers, explicit type narrowing everywhere else.
- **No `alert()`** — use inline error state with dismissible UI.
- **Entity naming** — currently "Car" throughout; rename to "Vehicle" tracked in issue #23.

## Tooling Commands

All commands are run from the monorepo root.

```bash
# Install dependencies
npm install

# Development (run each in a separate terminal)
npm run dev:frontend          # Vite dev server – localhost:5173
npm run dev:admin             # Vite dev server – localhost:5174
npm run dev:backend           # Express server  – localhost:5001
npx firebase emulators:start  # Auth :9099, Firestore :8080, Storage :9199

# Build (all workspaces)
npm run build

# Build single workspace
npm run build --workspace=packages/shared
npm run build --workspace=apps/admin
npm run build --workspace=apps/frontend
npm run build --workspace=apps/backend

# Deploy Firebase rules & indexes
firebase deploy --only firestore:rules
firebase deploy --only storage
```

## Open Issues (Key)

Track these in [GitHub Issues](https://github.com/nextpaceapps/nextcar/issues):

| Issue | Priority | Summary |
|---|---|---|
| #21 | P0 | Production release security checklist (rules, CORS, auth) |
| #23 | — | Rename "Car" entity to "Vehicle" across codebase |
| #12 | P0 | CRM operations |
| #16 | P1 | Firestore indexes & query optimization |

## Environment Variables

Both `apps/admin` and `apps/frontend` require a `.env.local` with:

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

`apps/backend` requires:

```
GEMINI_API_KEY=
```

## Security Notes

- Firestore and Storage write rules are **temporarily open** (`if true`) because admin auth is not yet implemented. See `firestore.rules` and `storage.rules` TODO comments referencing issue #21.
- The `GEMINI_API_KEY` must **never** be exposed to the client. AI calls go through `apps/backend/src/routes/ai.ts`.
- `cors.json` currently allows only `localhost` origins. Update before production deployment.
