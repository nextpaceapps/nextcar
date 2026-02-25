# Nextcar Project Memory

_Last updated: 2026-02-25_

## Snapshot

- Project: **Nextcar** (used-vehicle platform)
- Repo: `nextpaceapps/nextcar`
- Local path: `~/git/nextcar`
- Production domain: **nextcar.lv**
- Today milestone: **initial launch of nextcar.lv**

## Current Product Context

- Immediate business phase: filling inventory (adding cars), post-launch stabilization, and rapid iteration.
- Product workflow with assistant: **Product Owner + Business Analyst mode** (requirements → GitHub issues → implementation/review orchestration).

## Tech Stack (observed from codebase)

- Monorepo: **npm workspaces** (`apps/*`, `packages/*`)
- Runtime: **Node 20** (`.nvmrc`, `engines`)
- Frontend public app: **Next.js 16 + React 19 + TypeScript** (`apps/frontend`)
- Admin app: **Vite + React 19 + TypeScript** (`apps/admin`)
- Backend API: **Express + TypeScript**, Firebase Functions deployment (`apps/backend`)
- Shared package: **Zod schemas + shared types/constants** (`packages/shared`)
- Data/Auth/Storage: **Firebase** (`nextcar-83e67`)
- Monitoring: **Sentry** packages present

## Quality & Delivery State

- Added baseline quality gates:
  - root scripts: `lint`, `typecheck`, `test`, `verify`
  - CI workflow: `.github/workflows/verify.yml` on `pull_request`
  - install strategy in CI: `npm ci`
  - lint strictness: `--max-warnings=0`
- Related commit: `53071a1` (`chore(ci): add monorepo verify gate and node pinning`)
- Known state: `verify` currently catches existing lint debt in `apps/admin` and `apps/frontend`.

## Working Principles Agreed with Igor

1. Brief first (goal, scope, DoD, constraints, test cases).
2. Code via Cursor CLI.
3. Review via Claude CLI.
4. Verify via `lint + typecheck + test`.
5. Report: changed files, checks status, risks, next step, PR link.

## Next Operational Direction

- Continue post-launch delivery by turning requirements into GitHub issues (and project board updates).
- Keep infrastructure quality gate strict; fix legacy lint debt in dedicated tasks (no hidden scope creep).
