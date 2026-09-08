# 015 – Domain models (`src/model`)

## Status

Accepted

## Context

ADRs 001 and 003 previously allowed optional row types in `src/data/{table}/types.ts`. That mixed **CRUD** with the **domain contract** and drifted from the Next.js app, which already keeps persisted entities in `src/model/{entity}.ts`.

`src/data/` is CRUD only: one table folder, one function per file. Table row shapes and write inputs are shared by data functions, `processX()`, handlers, and utils. Those types belong in `src/model/`, not beside SQL.

## Decision

### 1) Canonical location

Every persisted table entity lives in **`src/model/{entity}.ts`** (singular kebab-case, matching the Next.js web app).

```text
src/model/
  appointment.ts
  feed-log.ts
  therapy-exercise.ts
  index.ts
```

✅ Correct:

```ts
// src/model/feed-log.ts
export type FeedLog = {
  id: string;
  log_date: string;
  // ...
};

export type UpsertFeedLogInput = {
  log_date: string;
  formula_id: string;
  // ...
};
```

❌ Incorrect:

```text
src/data/feed-logs/types.ts   # ❌ no model types in the data layer
```

### 2) One entity file

- One **table entity** per file (plus that entity’s status unions and create/update/upsert input types).
- Do not dump unrelated tables into one `types.ts`.
- Re-export from `src/model/index.ts`.

### 3) What stays out of `src/model`

| Location | Allowed types |
|----------|----------------|
| `src/services/{feature}/types.ts` | HTTP/feature DTOs that are **not** table rows (API docs catalog, C-CDA draft blobs, preview summaries) |
| `src/data/{table}/` | **No types files.** Import from `../../model/{entity}` |

### 4) Import rules

```ts
import type { FeedLog, UpsertFeedLogInput } from '../../model/feed-log';
import { upsertFeedLogByDate } from '../../data/feed-logs';
```

Data barrels export **CRUD functions only**. They must not re-export model types.

### 5) Pairing with the web app

Keep field names and entity file names aligned with **my-health-open-source** `src/model/`. Create/update **payloads** on the web stay in `src/api/{domain}/client.ts`; Express write inputs live next to the row type in `src/model/`.

## Consequences

- `src/data/` stays SQL/CRUD.
- Agents add `src/model/{entity}.ts` before the first data function for a new table.
- ADRs 001 and 003 no longer allow `src/data/{table}/types.ts`.

## Related

- [001 – File & service organization](./001-file-and-service-organization.md)
- [003 – Data layer CRUD boundaries](./003-data-layer-crud-boundaries.md)
