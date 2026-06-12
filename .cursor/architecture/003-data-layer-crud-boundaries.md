# 003 - Data Layer CRUD Boundaries

## Status

Accepted

## Applies to

**express-server-template** and Express apps created from it.

## Context

Database access must stay isolated from HTTP handlers and business logic. **`src/data/{table}/` is CRUD only.** Action and business logic that **uses** CRUD lives in **`src/services/{feature}/`** (`processX()`), never in `src/data/` and never in `src/domains/` (which this template does not use).

## Decision

### 1) CRUD location

1. All database CRUD lives in `src/data/{table}/` — **one folder per database table**.
2. Never inline SQL or query-builder calls in handlers, routers, or `processX()`.
3. Only the data layer talks directly to tables.

### 2) One function per file

1. Each file in `src/data/{table}/` exports exactly one CRUD function.
2. File names describe the action (`get-user-by-id.ts`, `create-user.ts`, …).
3. Every function has JSDoc.
4. Optional `types.ts` in the same table folder for row types.

### 3) What is forbidden in `src/data/`

- Business rules (validation beyond DB constraints, pricing, permissions orchestration)
- HTTP or Express types
- Calling `processX()` or handlers
- AI / external API calls

### 4) Postgres pool contract

1. Every data function accepts `Pool` (from `pg`) as the first parameter.
2. No `new Pool()` in data, services, or handlers.
3. Handlers get the pool via `requirePgPool()` / `getManagedPgPool()`, pass into `processX()`, then into data functions.
4. Null managed pool → HTTP `500`.

### 5) Service layer (`src/services/{feature}/`)

1. `router.ts` — factory only, thin wiring.
2. `routes/` — one handler per file; no inline queries.
3. `process-*.ts` — business/action logic; **may call** `src/data/{table}/` only.
4. Handlers: get client → validate → `processX()` → try/catch → response.

Status codes: `200` success, `400` client error, `500` server error.

```json
{ "success": false, "error": "..." }
```

## Reference layout

```text
src/
  data/
    users/                       # table name = folder name
      get-user-by-id.ts
      create-user.ts
      types.ts
      index.ts
  services/
    users/
      router.ts
      routes/
        get-user-handler.ts
      process-get-user.ts
      types.ts
```

## ✅ Correct examples

### Data (`src/data/users/get-user-by-id.ts`)

```ts
import type { Pool } from 'pg';
import type { UserRow } from './types';

/**
 * Fetches one user row by ID.
 */
export async function getUserById(
  pool: Pool,
  userId: string,
): Promise<UserRow | null> {
  const result = await pool.query<UserRow>(
    'SELECT * FROM users WHERE id = $1',
    [userId],
  );
  return result.rows[0] ?? null;
}
```

### Business logic (`src/services/users/process-get-user.ts`)

```ts
import type { Pool } from 'pg';
import { getUserById } from '../../data/users/get-user-by-id';

/**
 * Loads a user for GET /users/:id.
 */
export async function processGetUser(pool: Pool, userId: string) {
  const user = await getUserById(pool, userId);
  if (!user) throw new Error('User not found');
  return user;
}
```

### Handler (`src/services/users/routes/get-user-handler.ts`)

```ts
import type { Request, Response } from 'express';
import { requirePgPool, sendSuccess, sendHandlerError } from '../../../utils/http';
import { processGetUser } from '../process-get-user';

/**
 * Handles GET /users/:id.
 */
export async function getUserHandler(req: Request, res: Response) {
  const pool = requirePgPool(res);
  if (!pool) return;
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ success: false, error: 'Missing id' });
    }
    console.log('📥 GET /users/:id', { id });
    const user = await processGetUser(pool, id);
    sendSuccess(res, user);
  } catch (error) {
    sendHandlerError(res, error, 'GET /users/:id');
  }
}
```

## ❌ Incorrect examples

### Inline query in `processX` (not allowed)

```ts
// src/services/users/process-get-user.ts
export async function processGetUser(pool, userId: string) {
  const result = await pool.query('SELECT * FROM users WHERE id = $1', [userId]); // ❌
  return data;
}
```

### Business logic in data layer (not allowed)

```ts
// src/data/users/get-user-by-id.ts
export async function getUserById(supabase, userId: string) {
  if (!userId.startsWith('usr_')) throw new Error('bad id'); // ❌
}
```

### Multiple CRUD functions in one file (not allowed)

```ts
// src/data/users/user-crud.ts  ❌
export async function getUserById(...) {}
export async function createUser(...) {}
```

### Using `src/domains/` (not allowed)

```text
src/domains/users/   # ❌ not part of this template
```

## Enforcement checklist

- [ ] One `src/data/{table}/` folder per table
- [ ] One CRUD function per file with JSDoc
- [ ] No queries in handlers or `processX()`
- [ ] Business logic in `src/services/{feature}/process-*.ts`
- [ ] No `src/domains/` directory
