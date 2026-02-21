# API Conventions

This document outlines the conventions applied across the `apps/backend` Express API, enforcing consistent behaviors for routing, structured payload formatting, validations, and explicit error handling. 

## Base Structure
- All endpoints prefixed with `/api`.
- Routes organized logically under `/api/[resource]`.

## Response Formats
We use a standardized envelope. Raw arrays or objects are wrapped within a `data` parameter for successes, or `error` for failures.

### Success (`2xx` Range)
\`\`\`json
{
  "success": true,
  "data": { ... } // or []
}
\`\`\`

### Errors (`4xx` / `5xx` Range)
\`\`\`json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "body.name: Required"
  }
}
\`\`\`

## Using Handlers & Wrappers
When adding a new route handler, you should combine the standardized wrapping functions exported within `apps/backend/src/middleware/`.

### 1. `asyncHandler`
Express doesn't automatically trap unhandled async promise rejections. **Every asynchronous route** must be wrapped in `asyncHandler((req, res) => {...})` so that unhandled exceptions correctly bubble to the global HTTP 500 boundary.

### 2. `withValidation`
Accepts a Zod schema from `@nextcar/shared` and validates `req.body` directly. If parsing fails, it stops execution and drops structured validation errors into the global error handler (`VALIDATION_ERROR`).
\`\`\`ts
import { withValidation } from '../middleware/validate';
import { OpportunitySchema } from '@nextcar/shared/schemas';

router.post('/', withValidation(OpportunitySchema), asyncHandler(async (req, res) => {
    // req.body is fully validated
}))
\`\`\`

### 3. `requireAdmin`
If an endpoint reads, updates, or deletes sensitive administrative data, ensure the `requireAdmin` Auth Context middleware blocks unauthenticated traffic. This requires the consumer payload to append `Authorization: Bearer <token>`.

### 4. Throwing Managed Exceptions
Instead of raw `throw new Error()`, we deploy `AppError`. These integrate synchronously into the middleware stream providing HTTP appropriate responses directly from the root.

\`\`\`ts
import { AppError } from '../utils/AppError';

throw new AppError('VEHICLE_NOT_FOUND', 'The vehicle you specified does not exist', 404);
\`\`\`

## Endpoint Blueprint Planning (CRUD)
The NextCar platform aims to incorporate the following structured layout. Each of these endpoints must respect the conventions listed above.

### Vehicles
- \`GET /api/vehicles\` (Public)
- \`GET /api/vehicles/:id\` (Public)
- \`POST /api/vehicles\` (Admin Only)
- \`PUT /api/vehicles/:id\` (Admin Only)
- \`DELETE /api/vehicles/:id\` (Admin Only)

### Customers
- \`GET /api/customers\` (Admin Only)
- \`POST /api/customers\` (Public: Creating a customer entity)
- \`PUT /api/customers/:id\` (Admin Only)
- \`DELETE /api/customers/:id\` (Admin Only)

### Opportunities
- \`GET /api/opportunities\` (Admin Only)
- \`POST /api/opportunities\` (Public: Submitting interest generates an oppty)
- \`PUT /api/opportunities/:id\` (Admin Only)
- \`DELETE /api/opportunities/:id\` (Admin Only)

*Note: All endpoints dealing with dynamic sub-resources utilize Express' native \`/:id\` bindings opposed to manual parsing mechanisms.*
