# AGENTS.md

Agent coding rules for this repo live in `.cursor/rules/AGENTS.md` (Express layout, router/handler/data-layer patterns) and `.cursor/architecture/`. Read those before changing feature code.

## Cursor Cloud specific instructions

This repo is the **Express API** half of the "My Health" product. It is a thin Postgres-backed REST API (default port **3009**). The companion **Next.js web app** lives in a separate repo (`my-health-open-source`) and calls this API via `NEXT_PUBLIC_API_URL`. Start this API (and Postgres) before the web app.

Standard commands are in `README.md` (Quick start) and `package.json` scripts — don't duplicate them. Notes below are the non-obvious, cloud-specific bits.

### Services / ports
- Express API: `npm run dev` (nodemon + ts-node) on port **3009**. Health check: `GET /api/health`. Data routes: `/api/data/*`.
- Requires a local PostgreSQL 16 instance (see below). Without a valid `DATABASE_URL`, data routes return 500.

### PostgreSQL (persisted in the VM snapshot, but NOT auto-started)
- PostgreSQL 16 is installed in the snapshot. The cluster is **not** started automatically on boot — start it each session:
  - `sudo pg_ctlcluster 16 main start`
- Database `my_health` with role `ubuntu` (password `my_health`, superuser) already exists in the snapshot, with schema + seed data applied. Connection string: `postgresql://ubuntu:my_health@127.0.0.1:5432/my_health`.
- Migrations are already applied; only re-apply against a fresh DB: `psql "$DATABASE_URL" -f migrations/setup.sql` then optional `migrations/seed.sql`. `setup.sql` = full schema (equivalent to running `001`→`004`).

### Env file (git-ignored, recreate if missing)
- `.env` is git-ignored and lives only in the working tree / snapshot. If it goes missing, recreate from `.env.example` with:
  - `PORT=3009`, `NODE_ENV=development`, `DATABASE_URL=postgresql://ubuntu:my_health@127.0.0.1:5432/my_health`

### Lint / build / typecheck
- There is no `lint` script. Typecheck with `npx tsc --noEmit` (passes clean). Build with `npm run build` (`tsc`).

### Node
- Node 22 is present and satisfies the repo's `>=20` engine requirement (`.nvmrc` pins 20; no need to switch).
