# AGENTS.md

NextCar — monorepo for a used-vehicle dealership platform (public catalogue, admin panel, backend API, shared types) backed by Firebase.

## Project

- Firebase: `nextcar-83e67`
- GitHub: `nextpaceapps/nextcar`

## Working Process

- **Always create a new branch** before starting any new task or issue (e.g., `git checkout -b feature/issue-name`).


## Docs

| Doc | What it covers |
|---|---|
| [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) | Repo structure, data flow, package layering, key entry points |
| [`docs/CONVENTIONS.md`](docs/CONVENTIONS.md) | Type strategy (Zod-first), Firestore patterns, code quality rules |
| [`docs/SECURITY.md`](docs/SECURITY.md) | Auth state, API key handling, CORS, production checklist |
| [`docs/firebase-setup.md`](docs/firebase-setup.md) | Firebase project setup, emulators, env vars |
| [`docs/PROJECT_MEMORY.md`](docs/PROJECT_MEMORY.md) | Live project memory: milestones, stack, current delivery context |
| [`docs/WORK_RULES.md`](docs/WORK_RULES.md) | Safe execution rules: branch policy, no-main, quality gates |

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
- Queries must filter **`deleted == false`** — never return deleted documents.
- Composite indexes must exist for any query combining **`where()` + `orderBy()`**.
- Security rules are **temporarily open** — see `docs/SECURITY.md`.
