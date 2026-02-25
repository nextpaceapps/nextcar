# Nextcar Work Rules (Safety + Delivery)

_Last updated: 2026-02-25_

## 0) Golden Rule

**Never work directly on `main`.**

Every change starts from a fresh branch and goes through PR.

---

## 1) Git Safety Rules

1. Branch required:
   - `feat/<slug>` for features
   - `fix/<slug>` for bugfixes
   - `chore/<slug>` for infra/docs/tooling
2. No force push to shared branches.
3. No direct commits to `main`.
4. PR merge only when CI `verify` is green.
5. Keep commits atomic and reversible.

---

## 2) Deletion & Data Safety

1. Prefer soft-delete over hard-delete (domain entities).
2. No destructive DB/storage operations without explicit confirmation.
3. For risky refactors, create backup branch first:
   - `backup/<date>-<slug>`
4. Never remove security rules/config blindly; changes require explicit rationale.

---

## 3) Quality Gate Policy

A task is not "done" unless all pass:

- `npm run lint`
- `npm run typecheck`
- `npm run test`
- `npm run verify` (aggregated gate)

CI must mirror local result (`npm ci` + `npm run verify`).

---

## 4) Scope Discipline

1. No business-logic changes in infra-only tasks.
2. No hidden refactors outside approved scope.
3. If unexpected debt appears, raise separate issue instead of mixing.

---

## 5) Issue/Requirement Hygiene

Every issue should include:

- Goal / business value
- Scope (in/out)
- DoD
- Constraints
- Acceptance test cases
- Risks/assumptions

---

## 6) Review Workflow

1. Cursor CLI writes code.
2. Claude CLI performs review (logic, edge cases, safety, readability).
3. Blocking comments fixed before merge.
4. Final report includes changed files + checks + risks + next step.

---

## 7) Documentation Sync

For any non-trivial change, update relevant docs in `docs/` in the same PR.
If architecture/tooling changed, update `PROJECT_MEMORY.md` too.
