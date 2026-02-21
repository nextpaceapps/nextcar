# AGENTS.md

NextCar — monorepo for a used-car dealership platform (public catalogue, admin panel, backend API, shared types) backed by Firebase.

## Docs

| Doc | What it covers |
|---|---|
| [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) | Repo structure, data flow, package layering, key entry points |
| [`docs/CONVENTIONS.md`](docs/CONVENTIONS.md) | Type strategy (Zod-first), Firestore patterns, code quality rules |
| [`docs/SECURITY.md`](docs/SECURITY.md) | Auth state, API key handling, CORS, production checklist |
| [`docs/firebase-setup.md`](docs/firebase-setup.md) | Firebase project setup, emulators, env vars |

## Tooling

```bash
npm run dev:frontend          # Customer site       :5173
npm run dev:admin             # Admin panel         :5174
npm run dev:backend           # Express API         :5001
npx firebase emulators:start  # Auth/Firestore/Storage emulators
npm run build                 # Build all workspaces
```

## Key Invariants

- Types are **derived from Zod schemas** — see `docs/CONVENTIONS.md`.
- Collection names use the **shared `COLLECTIONS` constant** — never hardcode.
- Documents use **soft delete** (`deleted: true`) — never remove.
- Security rules are **temporarily open** — see `docs/SECURITY.md`.
