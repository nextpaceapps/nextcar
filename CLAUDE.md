# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

NextCar — monorepo for a used-vehicle dealership platform (public catalogue, admin panel, backend API, shared types) backed by Firebase (`nextcar-83e67`).

## Commands

```bash
# Development
npm run dev:frontend          # Customer site (Next.js)    :5173
npm run dev:admin             # Admin panel (Vite)          :5174
npm run dev:backend           # Express API                 :5001
npx firebase emulators:start  # Auth / Firestore / Storage emulators

# Quality gates (all must pass before merge)
npm run lint                  # ESLint --max-warnings=0 across all workspaces
npm run typecheck             # tsc --noEmit across all workspaces
npm run test                  # Tests across all workspaces
npm run verify                # lint + typecheck + test combined

# Build (order matters: shared → admin/backend → frontend)
npm run build
```

CI runs `npm ci && npm run verify` on every PR — all three checks must be green.

## Architecture

```
apps/frontend/    Next.js 16 + React 19 + next-intl   (public customer catalogue)
apps/admin/       Vite + React 19 + React Router 7     (internal inventory management)
apps/backend/     Express 5 + TypeScript               (REST API, Gemini AI integration)
packages/shared/  Zod schemas, derived types, COLLECTIONS constant
```

**Data flow:** Admin UI → Backend API (Firestore writes, Gemini AI) → Firestore → Frontend (server-side reads).

### Shared package

All domain schemas live in `packages/shared/src/schemas/`. Types are derived with `z.infer<>` — never write manual interfaces that duplicate a Zod schema. Collection names are exported as `COLLECTIONS` from `packages/shared/src/index.ts` — never hardcode `'vehicles'` or any other string.

### Backend (Express)

Routes under `/api`: `/api/admin/*` (CRUD, role-protected), `/api/ai/*` (Gemini, rate-limited), `/api/health`.

Every async route uses `asyncHandler`. Inputs validated with `withValidation(ZodSchema)`. Auth enforced with `withRole('Editor' | 'Admin')`. Errors thrown as `new AppError('CODE', 'message', httpStatus)`.

**Response envelope:**
```json
{ "success": true,  "data": { ... } }
{ "success": false, "error": { "code": "VALIDATION_ERROR", "message": "..." } }
```

### Frontend (Next.js)

App Router with `[locale]` directory for i18n via `next-intl`. Default locale is Latvian (`/lv`). Server-side data fetching via Firebase Admin SDK with React `cache()`.

### Admin (Vite)

React Router v7. Auth state via Context. Server state via React Query. Forms via React Hook Form + Zod. AutoStudio page (`/autostudio`) uses IndexedDB (Dexie) for local history and Google Gemini API via backend for vehicle photo isolation/composition.

## Firestore Conventions

- **Soft deletes only** — set `deleted: true`, never call `deleteDoc()`. All queries must filter `where('deleted', '==', false)`.
- **Timestamps** — always `serverTimestamp()`, never `new Date()`.
- **Collection names** — always use `COLLECTIONS` constant, never hardcode.
- **Composite indexes** — required for any query combining `where()` + `orderBy()`.

## Code Conventions

- No `as any` — use explicit type narrowing, `keyof`, or `declare global`.
- No `alert()` — use inline error state with a dismissible UI banner.
- Catch blocks: `error: unknown` with `instanceof Error` narrowing.
- No `VITE_` env vars for secrets — route API keys through the backend.

## Git Workflow

- **Never commit directly to `main`** — every change requires a branch and PR.
- Branch naming: `feat/<slug>`, `fix/<slug>`, `chore/<slug>`.
- Commits must be atomic and reversible.
- **No AI/editor attribution** in commit messages or PR descriptions (no `Co-authored-by: Cursor`, `Generated-by: AI`, etc.).
- For non-trivial changes, update the relevant file in `docs/` in the same PR.

## Key Docs

| File | Contents |
|------|----------|
| `docs/ARCHITECTURE.md` | Data flow diagrams, package layering, entry points |
| `docs/CONVENTIONS.md` | Zod-first types, Firestore patterns, code quality rules |
| `docs/SECURITY.md` | Auth, CORS, production readiness checklist |
| `docs/api-conventions.md` | Response envelope, middleware wrappers, endpoint blueprint |
| `docs/firebase-setup.md` | Firebase project setup, emulator config, env vars |
| `docs/PROJECT_MEMORY.md` | Live project memory: milestones, current delivery context |
| `docs/WORK_RULES.md` | Branch policy, deletion safety, scope discipline |
