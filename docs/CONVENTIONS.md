# Conventions

## Types & Schemas

- **Zod is the single source of truth.** Define shapes in `packages/shared/src/schemas/vehicle.ts`.
- **Never write manual interfaces** that duplicate a Zod schema. Use `z.infer<>` in `packages/shared/src/types/vehicle.ts`.
- The `Vehicle` interface extends the schema type, adding only Firestore-managed fields (`createdAt`, `updatedAt`).

## Firestore

- **Collection names** live in `COLLECTIONS` constant (`packages/shared/src/index.ts`). Never hardcode `'vehicles'` or any collection string.
- **Soft deletes** — set `deleted: true`, never remove documents. All queries must filter `where('deleted', '==', false)`.
- **Timestamps** — use `serverTimestamp()` for `createdAt`/`updatedAt`. Never set them client-side.

## Code Quality

- **No `as any`** — use `declare global` for HMR guards, `keyof` for typed register helpers, explicit type narrowing everywhere.
- **No `alert()`** — use inline error state with a dismissible UI banner.
- **Error typing** — catch blocks use `error: unknown` with `instanceof Error` narrowing.

## Don'ts

- Don't use `deleteDoc()` — use soft delete (`deleted: true`)
- Don't use `new Date()` for timestamps — use `serverTimestamp()`
- Don't expose API keys via `VITE_` env vars — route through backend
- Don't hardcode collection names — use `COLLECTIONS` constant
- Don't write manual interfaces that duplicate Zod schemas — use `z.infer<>`

## Naming

- Standardized on "Vehicle" throughout the codebase. Keep this consistent in future additions.
