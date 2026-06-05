# My Health Express Server

**TL;DR:** Thin Express API for the [My Health](https://github.com/matthewruiz/my-health-open-source) dashboard. Supabase-backed CRUD for hospitals, specialties, doctors, appointments, focus areas, and daily entries. Managed client at startup; consistent `{ success, data }` JSON.

I split this out on purpose: the browser app should not hold a service-role key, and I wanted entity HTTP separate from raw Supabase calls. CRUD lives in `src/data/{table}/`; routers and handlers live in `src/services/{entity}/`.

**Companion web repo:** [my-health-open-source](https://github.com/matthewruiz/my-health-open-source)

**Wire contract:** [docs/oss/wire-contract.md](./docs/oss/wire-contract.md)

---

## What you get

- TypeScript + Express 5
- `/api/data` mounts for six entities (full CRUD each)
- Health at `/` and `/api/health`
- Supabase via `getManagedSupabaseClient()` — initialized once at boot, null → 500
- SQL migrations in `docs/supabase/` you can paste into the Supabase SQL editor

---

## Prerequisites

- Node.js 20+ (see `.nvmrc`)
- A Supabase project (free tier is fine for local dev)

---

## Quick start

### 1. Clone and install

```bash
git clone https://github.com/matthewruiz/my-health-open-source-express-server.git
cd my-health-open-source-express-server
npm install
```

### 2. Environment

```bash
cp .env.example .env
```

From Supabase Dashboard → Project Settings → API:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY` (server only — never in the web app's `NEXT_PUBLIC_*`)

### 3. Schema (order matters)

Run in the Supabase SQL editor ([docs/README.md](./docs/README.md)):

1. `docs/supabase/001_hospitals_specialties_doctors_appointments.sql`
2. `docs/supabase/002_focus_areas_daily_entries.sql`

### 4. Run

```bash
npm run dev
```

Default URL: **http://localhost:3009**

### 5. Smoke test

```bash
curl http://localhost:3009/api/health
```

You should see JSON with `status: "ok"`. If Supabase env is missing, data routes return 500 — fix `.env` first.

---

## API routes

Everything under `/api/data`. Each entity: `GET /`, `POST /`, `PATCH /:id`, `DELETE /:id`.

| Entity | Base path |
|--------|-----------|
| Hospitals | `/api/data/hospitals` |
| Specialties | `/api/data/specialties` |
| Doctors | `/api/data/doctors` |
| Appointments | `/api/data/appointments` |
| Focus areas | `/api/data/focus-areas` |
| Daily entries | `/api/data/daily-entries` |

Health: `GET /` and `GET /api/health`

Aggregator: `src/services/my-health-data-service/router.ts`.

---

## Environment variables

| Variable | Required | Default | Notes |
|----------|----------|---------|-------|
| `PORT` | No | `3009` | Must match web `NEXT_PUBLIC_API_URL` |
| `NODE_ENV` | No | `development` | |
| `SUPABASE_URL` | Yes | — | Server only |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | — | Alias `SUPABASE_SERVICE_KEY` also works |
| `CORS_ORIGINS` | No | — | Not wired in v1; document before public deploy |

Template: [.env.example](./.env.example)

---

## Project structure

```text
my-health-open-source-express-server/
├── index.ts                          # Middleware, managed init, mounts
├── docs/
│   ├── README.md
│   ├── oss/                          # Wire contract + governance links
│   └── supabase/                     # Schema SQL
├── src/
│   ├── data/{entity}/                # Supabase CRUD only — one fn per file
│   ├── services/
│   │   ├── {entity}/                 # HTTP routers + handlers
│   │   ├── my-health-data-service/   # /api/data aggregator
│   │   ├── managed/                  # Supabase client
│   │   ├── health/
│   │   ├── middleware/
│   │   └── server/
│   └── utils/http/                   # sendSuccess, sendClientError, etc.
└── .cursor/architecture/             # ADRs
```

**Layout note:** Entity HTTP is in `src/services/`, not `src/data/*/router.ts` like Lead Studio. CRUD boundary is the same — SQL only in `src/data/`. Documented in the [wire contract](./docs/oss/wire-contract.md).

---

## Scripts

| Command | What it does |
|---------|----------------|
| `npm run dev` | Nodemon + ts-node |
| `npm start` | ts-node |
| `npm run build` | `tsc` compile |

---

## Threat model

Built for **local or trusted-network** use in v1:

- **No API authentication** on CRUD routes. Do not put this on the public internet without auth, HTTPS, and tight CORS.
- **Service-role key** never belongs in the Next.js bundle.
- **CORS** is permissive for local dev (`cors()` default). Tighten before production.

Report issues: [SECURITY.md](./SECURITY.md)

---

## Key takeaways

1. **Apply both SQL files in order** before you wonder why focus areas fail.
2. **Port 3009** is the default everywhere — Express `PORT` and web `NEXT_PUBLIC_API_URL`.
3. **Handlers stay thin** — validate, call data layer, return `{ success, error }`.
4. **Pair changes with the web repo** when you add entities or rename paths.

---

## Contributing

[CONTRIBUTING.md](./CONTRIBUTING.md) · ADRs in `.cursor/architecture/`

## License

MIT — [LICENSE](./LICENSE)
