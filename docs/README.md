# My Health Express — documentation

## Quick links

| Doc | Description |
|-----|-------------|
| [Local Postgres (Mac)](./how-to/local-postgres-mac.md) | Homebrew install, `my_health` database, `psql` migrations |
| [OSS wire contract](./oss/wire-contract.md) | Web + Express pairing, env vars, routes |
| [OSS governance](./oss/README.md) | Release checklist and audit guide links |

## Schema setup (run in order)

Apply with `psql` against your `DATABASE_URL`:

1. [001_hospitals_specialties_doctors_appointments.sql](../migrations/001_hospitals_specialties_doctors_appointments.sql)
2. [002_focus_areas_daily_entries.sql](../migrations/002_focus_areas_daily_entries.sql)

See [local-postgres-mac.md](./how-to/local-postgres-mac.md) for copy-paste commands.

## Smoke test

```bash
curl http://localhost:3009/api/health
curl http://localhost:3009/api/data/specialties
```

Expected: JSON with `status: "ok"` and seeded specialty rows.
