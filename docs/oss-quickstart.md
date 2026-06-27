# OSS quickstart (web + Express)

Run the **My Health** pair locally: Postgres first, then Express API, then the Next.js dashboard.

| Repo | URL |
|------|-----|
| Web | https://github.com/Luckee-Core/my-health-open-source |
| Express | https://github.com/Luckee-Core/my-health-open-source-express-server |

Governance pack: [mentorai-server `data/open-source/`](https://github.com/trouthouse-tech/mentorai-server/tree/main/data/open-source).

**Wire contract:** [`docs/oss/wire-contract.md`](./oss/wire-contract.md) (ports, env, routes, JSON envelopes).

---

## 1. Postgres database

**Option A — Luckee Dev Hub (recommended):** Projects → My Health → **Setup database**. See [local-database-setup.md](https://github.com/trouthouse-tech/mentorai-server/blob/main/data/how-to/central-hub/local-database-setup.md).

**Option B — Manual:** Follow [docs/how-to/local-postgres-mac.md](./how-to/local-postgres-mac.md):

```bash
createdb my_health
export DATABASE_URL="postgresql://$(whoami)@127.0.0.1:5432/my_health"
psql "$DATABASE_URL" -f migrations/001_hospitals_specialties_doctors_appointments.sql
psql "$DATABASE_URL" -f migrations/002_focus_areas_daily_entries.sql
psql "$DATABASE_URL" -f migrations/003_health_record.sql
```

Or apply all at once: `psql "$DATABASE_URL" -f migrations/setup.sql`

---

## 2. Express API

```bash
cd my-health-open-source-express-server
cp .env.example .env
# Set DATABASE_URL (server only — never NEXT_PUBLIC_*)

npm install
npm run dev
```

Default listen: **http://localhost:3009**

```bash
curl http://localhost:3009/api/health
# → { "status": "ok", "message": "...", "timestamp": "...", "environment": "..." }
```

---

## 3. Web app

```bash
cd my-health-open-source
cp .env.example .env.local
# NEXT_PUBLIC_API_URL=http://localhost:3009

npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) → landing at `/`, dashboard at `/appointments`.

---

## 4. Smoke test

1. Express health returns `{ "status": "ok", ... }` (no `{ success }` wrapper on health)
2. Web landing loads at `/` (health record section visible)
3. Dashboard loads appointments and care team tables
4. Open [http://localhost:3000/docs/api](http://localhost:3000/docs/api) — API reference (Express must be running)
5. Create a doctor or appointment — confirm `{ success: true }` in network tab

---

## Environment reference

See [`docs/oss/wire-contract.md`](./oss/wire-contract.md) for full env tables.

**Never** put `DATABASE_URL` in `NEXT_PUBLIC_*`.
