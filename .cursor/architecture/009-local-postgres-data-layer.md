# ADR 009: Local Postgres data layer

## Status

Accepted — 2026-06-27

## Context

Template ADRs 003–004 describe Supabase managed clients (`getManagedSupabaseClient()`). **My Health Express** uses **local/on-device Postgres** via the `pg` pool and `DATABASE_URL`.

## Decision

| Concern | This repo |
|---------|-----------|
| Database | Local Postgres (`my_health` database) |
| Client | `getManagedPgPool()` / `requirePgPool()` in `src/services/postgres/` |
| Env | `DATABASE_URL` (server only) |
| Schema | `migrations/*.sql` applied with `psql` or Luckee Hub Setup database |
| CRUD | Still only in `src/data/{entity}/` — one function per file |

HTTP routers remain in `src/services/{entity}/` (documented exception in wire contract).

## Consequences

- Do not add `@supabase/supabase-js` for OSS default paths.
- When copying ADR 003–004 from other Luckee slices, read this addendum first.
- Hub operators can provision Postgres via `localDatabaseSupported: true` in Luckee Dev Hub.
