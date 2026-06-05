# My Health Express — documentation

## Quick links

| Doc | Description |
|-----|-------------|
| [OSS wire contract](./oss/wire-contract.md) | Web + Express pairing, env vars, routes |
| [OSS governance](./oss/README.md) | Release checklist and audit guide links |
| [Supabase schema](./supabase/) | Database tables and migration SQL |

## Supabase setup (run in order)

1. [001_hospitals_specialties_doctors_appointments.sql](./supabase/001_hospitals_specialties_doctors_appointments.sql)
2. [002_focus_areas_daily_entries.sql](./supabase/002_focus_areas_daily_entries.sql)

Apply in the Supabase SQL editor or your migration tool before starting the API.

## Smoke test

```bash
curl http://localhost:3009/api/health
```

Expected: JSON with `status: "ok"`.
