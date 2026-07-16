# ADR 011: Multipart upload & C-CDA health import

## Status

Accepted — 2026-07-15

## Context

My Health needs to import Jefferson-style Health Summary packages (zip of C-CDA `DOC*.XML`, optionally with a PDF rendering). The API previously only accepted JSON. Upload must stay memory-only (localhost PHI) and match the data-layer / service split.

## Decision

### Transport

- Use **multer** memory storage for `POST /api/data/health-imports/preview` only.
- Max upload size: **25MB**.
- Zip safety: max entry count, max uncompressed total, reject `../` paths.
- XML: parse with **fast-xml-parser**; external entities disabled.
- Files are **never** written to disk and **never** stored after commit.
- PDF bytes inside a zip are **ignored in v1** (XML is source of truth). Future PDF parser may plug into the same preview/commit contract.

### Two-step import

1. **Preview** — multipart `file` → parse C-CDA → insert `health_imports` (`status=previewed`) + `health_import_drafts.draft_json` (full draft) → return **summary** DTO to the client (counts + bounded samples; no full result set / note bodies).
2. **Commit** — JSON `{ previewId }` only → load server draft → `BEGIN`/`COMMIT` upserts by `(source_system, source_entry_key)` → mark `committed` → clear `draft_json`.
3. Concurrent commit: `UPDATE … WHERE status = 'previewed' RETURNING` so a second commit gets `400`.

### Provenance

Importable rows may carry `source_system`, `source_document_id`, `source_entry_key` (nullable for manual CRUD). Unique `(source_system, source_entry_key)` where key is not null.

### Layout

- Orchestration in `src/services/health-import/` (`process-preview-*`, `process-commit-*`, `parse/`).
- Persistence via `src/data/{table}/` upsert helpers (and existing CRUD).
- Use `pool.connect()` for the commit transaction.

## Consequences

- Web preview uses `FormData`; commit uses JSON.
- Full draft never lives in Redux — only a summary slice + `previewId` primitives in a builder.
- Supabase-compatible plain Postgres SQL; no `@supabase/supabase-js` / `auth.users` FKs in OSS v1.
