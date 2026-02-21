# Conventions

## Types & Schemas

- **Zod is the single source of truth.** Define shapes in `packages/shared/src/schemas/car.ts`.
- **Never write manual interfaces** that duplicate a Zod schema. Use `z.infer<>` in `packages/shared/src/types/car.ts`.
- The `Car` interface extends the schema type, adding only Firestore-managed fields (`createdAt`, `updatedAt`).

## Firestore

- **Collection names** live in `COLLECTIONS` constant (`packages/shared/src/index.ts`). Never hardcode `'cars'` or any collection string.
- **Soft deletes** — set `deleted: true`, never remove documents. All queries must filter `where('deleted', '==', false)`.
- **Timestamps** — use `serverTimestamp()` for `createdAt`/`updatedAt`. Never set them client-side.

## Code Quality

- **No `as any`** — use `declare global` for HMR guards, `keyof` for typed register helpers, explicit type narrowing everywhere.
- **No `alert()`** — use inline error state with a dismissible UI banner.
- **Error typing** — catch blocks use `error: unknown` with `instanceof Error` narrowing.

## Naming

- Entity is currently "Car" throughout the codebase. Rename to "Vehicle" is tracked in GitHub issue #23.
