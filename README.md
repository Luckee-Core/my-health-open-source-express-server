# My Health Express Server

Self-hosted Express API for the [My Health](https://github.com/matthewruiz/my-health-open-source) dashboard. Supabase-backed CRUD for hospitals, specialties, doctors, appointments, focus areas, and daily entries.

**Companion web repo:** [my-health-open-source](https://github.com/matthewruiz/my-health-open-source)

**Wire contract:** [docs/oss/wire-contract.md](./docs/oss/wire-contract.md)

## Features

- TypeScript + Express 5
- Supabase CRUD via managed client at startup
- `/api/data` entity routers (hospitals, specialties, doctors, appointments, focus areas, daily entries)
- Health checks at `/` and `/api/health`
- Consistent JSON: `{ success, data }` / `{ success: false, error }`

## Prerequisites

- Node.js 20+ (see `.nvmrc`)
- A Supabase project

## Quick start

### 1. Clone and install

```bash
git clone https://github.com/matthewruiz/my-health-open-source-express-server.git
cd my-health-open-source-express-server
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Fill in `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` from Supabase Dashboard → Project Settings → API.

### 3. Apply database schema

Run SQL in order in the Supabase SQL editor (see [docs/README.md](./docs/README.md)):

1. `docs/supabase/001_hospitals_specialties_doctors_appointments.sql`
2. `docs/supabase/002_focus_areas_daily_entries.sql`

### 4. Start the server

```bash
npm run dev
```

Server listens on **http://localhost:3009** by default.

### 5. Smoke test

```bash
curl http://localhost:3009/api/health
```

## API routes

Mounted under `/api/data`. Each entity supports list, create, update, and delete:

| Entity | Base path | Methods |
|--------|-----------|---------|
| Hospitals | `/api/data/hospitals` | GET, POST, PATCH `/:id`, DELETE `/:id` |
| Specialties | `/api/data/specialties` | GET, POST, PATCH `/:id`, DELETE `/:id` |
| Doctors | `/api/data/doctors` | GET, POST, PATCH `/:id`, DELETE `/:id` |
| Appointments | `/api/data/appointments` | GET, POST, PATCH `/:id`, DELETE `/:id` |
| Focus areas | `/api/data/focus-areas` | GET, POST, PATCH `/:id`, DELETE `/:id` |
| Daily entries | `/api/data/daily-entries` | GET, POST, PATCH `/:id`, DELETE `/:id` |

Health: `GET /` and `GET /api/health`

## Environment variables

| Variable | Required | Default | Notes |
|----------|----------|---------|-------|
| `PORT` | No | `3009` | API listen port |
| `NODE_ENV` | No | `development` | |
| `SUPABASE_URL` | Yes | — | Server only |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | — | Server only; alias `SUPABASE_SERVICE_KEY` |
| `CORS_ORIGINS` | No | — | Future production CORS |

See [.env.example](./.env.example) for the full template.

## Project structure

```text
my-health-open-source-express-server/
├── index.ts                          # App wiring
├── docs/
│   ├── README.md                     # Doc index
│   ├── oss/                          # Wire contract + governance links
│   └── supabase/                     # SQL schema
├── src/
│   ├── data/{entity}/                # Supabase CRUD only
│   ├── services/
│   │   ├── {entity}/                 # HTTP routers + handlers
│   │   ├── my-health-data-service/   # /api/data aggregator
│   │   ├── managed/                  # Supabase client
│   │   ├── health/
│   │   ├── middleware/
│   │   └── server/
│   └── utils/http/                   # Response helpers
└── .cursor/architecture/             # ADRs for contributors
```

## Scripts

- `npm run dev` — development with nodemon
- `npm start` — run with ts-node
- `npm run build` — compile TypeScript

## Threat model

This OSS release is designed for **local or trusted-network** use:

- **No API authentication** on CRUD routes in v1. Do not expose this API to the public internet without adding auth.
- **Service-role key** stays server-side only. Never put it in the web app’s `NEXT_PUBLIC_*` vars.
- **CORS** uses permissive defaults for local dev. Restrict origins in production.

See [SECURITY.md](./SECURITY.md) for reporting vulnerabilities.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md). Architecture ADRs live in `.cursor/architecture/`.

## License

MIT — see [LICENSE](./LICENSE).
