# Architecture

> NextCar monorepo — used-car dealership platform.

## Repo Structure

```
apps/
├── frontend/    # Public customer catalogue — React + Vite (:5173)
├── admin/       # Internal inventory panel — React + Vite (:5174)
└── backend/     # Express API — Gemini AI proxy (:5001)

packages/
└── shared/      # Zod schemas, derived TS types, collection constants
```

## Data Flow

```
Admin UI → Backend API (AI parse) → Admin UI → Firestore
                                                  ↓
Frontend UI ← Firestore (published, non-deleted cars)
```

- All writes go through `apps/admin` → Firestore.
- AI listing parsing goes `Admin → Backend /api/ai/parse-listing → Gemini → Admin`.
- Frontend reads published, non-deleted documents.

> **Note:** Migration to API-first (Next.js API routes) is planned — see issue #2.

## Package Layering

| Layer | Package | Depends On |
|---|---|---|
| Shared types & schemas | `packages/shared` | `zod` |
| Admin | `apps/admin` | `shared`, Firebase SDK, React Query |
| Frontend | `apps/frontend` | `shared`, Firebase SDK, React Query |
| Backend | `apps/backend` | `shared`, `@google/genai`, Express |

## Key Entry Points

| Concern | File |
|---|---|
| Zod schemas (source of truth) | `packages/shared/src/schemas/car.ts` |
| Derived types | `packages/shared/src/types/car.ts` |
| Collection constants | `packages/shared/src/index.ts` |
| Admin car form | `apps/admin/src/components/cars/CarForm.tsx` |
| Admin Firestore service | `apps/admin/src/services/carService.ts` |
| Frontend Firestore service | `apps/frontend/src/services/carService.ts` |
| Backend AI route | `apps/backend/src/routes/ai.ts` |
| Firestore security rules | `firestore.rules` |
| Storage security rules | `storage.rules` |
