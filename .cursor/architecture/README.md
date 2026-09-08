# Architecture Documentation

ADRs for **My Health Express** (my-health-open-source-express-server) and Express apps in this family.

## ADR index

1. [001 – File & service organization](./001-file-and-service-organization.md) — `src/data/{table}/` CRUD only; `src/services/{feature}/` for HTTP and business logic. **No `src/domains/`.**
2. [002 – Router factory & handler pattern](./002-router-factory-and-handler-pattern.md) — Thin routers, handlers, `processX()`.
3. [003 – Data layer CRUD boundaries](./003-data-layer-crud-boundaries.md) — One table folder, one function per file.
4. [004 – Managed clients & startup init](./004-managed-clients-and-startup-init.md) — Startup init, accessors.
5. [005 – Edge functions & Railway boundaries](./005-edge-functions-railway-only.md) — Edge → Railway only.
6. [006 – Logging & error response standards](./006-logging-and-error-response-standards.md) — Emoji logging, response shape.
7. [007 – Starter template layout](./007-starter-template-layout.md) — Shipped `src/services/` tree.
8. [008 – API docs catalog](./008-api-docs-catalog.md) — `GET /api-docs.json`, hand-maintained REST catalog for web `/docs/api`.
9. [009 – Local Postgres data layer](./009-local-postgres-data-layer.md) — `pg` pool + `DATABASE_URL` (not Supabase).
10. [011 – Multipart upload & C-CDA health import](./011-multipart-health-import.md) — preview/commit, multer memory, draft JSONB, provenance keys.
11. [012 – Therapy exercises & photo import](./012-therapy-exercises-and-photo-import.md) — speech homework tracking, increment logs, vision preview/commit.
12. [013 – Three-table AI audit and costs](./013-ai-audit-and-costs.md) — requests/responses/exchanges, `llm_models`, `exchange_table_registry`.
13. [014 – Tube feed tracking](./014-tube-feed-tracking.md) — formula catalog, morning pump snapshots, derived calories.
14. [015 – Domain models (`src/model`)](./015-domain-models.md) — table row and write-input types; **not** in `src/data/`.
15. [016 – Speech therapy consumption](./016-speech-therapy-consumption.md) — daily ice-cube (and later type) counts.

## How to use

1. Open the ADR for your feature.
2. Follow the patterns exactly.
3. Add ADRs when decisions change and update this index.
