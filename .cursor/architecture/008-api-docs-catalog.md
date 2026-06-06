# 008 – API docs catalog (`/api-docs.json`)

## Status
Accepted

## Context
**my-health-open-source-express-server** exposes REST CRUD under `/api/data` (ADR 001–007). The Next.js app renders human-readable docs at `/docs/api` by fetching a machine-readable catalog from this server. No OpenAPI or third-party doc tools.

## Decision

### 1) Service location
- Catalog and router live in `src/services/api-docs/`.
- Pure helpers for REST CRUD doc templates live in `src/utils/api-docs/` (`buildCrudEntityDocs`).
- Do **not** place catalog code in `src/data/` (no database access).

### 2) Endpoint
- `GET /api-docs.json` returns `{ success: true, data: ApiDocsCatalog }` via `sendSuccess`.
- Mount `createApiDocsRouter()` in `index.ts` after `/api/data`, before error middleware.

### 3) Handler rules (fork exception)
- **No Supabase** or managed clients — metadata-only route (exception to ADR 002 step 1).
- Handler: `📥` log → `buildApiDocsCatalog()` → `sendSuccess` → `📤` log; `try/catch` → `sendHandlerError`.
- JSDoc on router factory, handler, and `buildApiDocsCatalog`.

### 4) Catalog maintenance
- Update `api-docs-catalog.ts` in the **same PR** when routes change.
- Paths must match `src/services/{entity}/router.ts` mounts exactly.
- Use `buildCrudEntityDocs` with `includeGetById: false` (no single-entity GET today).

### 5) Catalog content
- First group: **Overview** (name exactly `Overview`, empty `endpoints`, multi-paragraph `description`).
- Second group: **Health** (separate from Overview).
- Six entity groups with usage `description` each.
- Root fields: `version`, `baseUrl`, `responseEnvelope`, `groups` — **no** top-level `title`.
- Document DELETE as `{ success: true, data: null }`.

### 6) Types
- Use `type` (not `interface`) in `src/services/api-docs/types.ts`.

## Consequences
- Web app fetches catalog through `src/api/api-docs/client.ts` (see web ADR 009).
- Catalog drift is manual — treat updates like README edits.

## Related
- [002 – Router factory & handler pattern](./002-router-factory-and-handler-pattern.md)
- [006 – Logging & error response standards](./006-logging-and-error-response-standards.md)
- Web repo [009 – Documentation site API reference](../../my-health-open-source/.cursor/architecture/009-api-docs-page.md)
