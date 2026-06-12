# Local Postgres — My Health

Canonical docs moved to **mentorai-server** (shared how-to library):

| Topic | Path |
|-------|------|
| **Install + smoke test** | `mentorai-server/data/how-to/on-device-postgres/my-health-local-postgres-mac.md` |
| **Supabase → local migration** | `mentorai-server/data/how-to/on-device-postgres/my-health-supabase-to-local-postgres.md` |
| **What `createdb` does / disk layout** | `mentorai-server/data/how-to/on-device-postgres/createdb-and-where-data-lives.md` |
| **Folder index** | `mentorai-server/data/how-to/on-device-postgres/README.md` |

Quick start (from express-server repo root):

```bash
createdb my_health
export DATABASE_URL="postgresql://$(whoami)@127.0.0.1:5432/my_health"
psql "$DATABASE_URL" -f migrations/001_hospitals_specialties_doctors_appointments.sql
psql "$DATABASE_URL" -f migrations/002_focus_areas_daily_entries.sql
```

Set `DATABASE_URL` in `.env`, then `npm run dev`.
