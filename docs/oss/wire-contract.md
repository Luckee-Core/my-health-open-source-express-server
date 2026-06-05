# My Health — Web + Express wire contract

Documented seam between the Next.js web app and the companion Express API.

## 1. Contract summary

| Field | Value |
|-------|-------|
| **Product name** | My Health |
| **Web repo** | https://github.com/matthewruiz/my-health-open-source |
| **Express repo** | https://github.com/matthewruiz/my-health-open-source-express-server |
| **Default web port** | 3000 |
| **Default API port** | 3009 |
| **API base env (web)** | `NEXT_PUBLIC_API_URL` (alias: checklist `NEXT_PUBLIC_SERVER_URL`) |
| **Health endpoint** | `GET /api/health` and `GET /` |
| **Success JSON** | `{ success: true, data?, count?, message? }` |
| **Error JSON** | `{ success: false, error: string, message? }` |
| **Auth (OSS default)** | None — open API on localhost for trusted local dev |

### Router layout exception

Entity HTTP routers live in `src/services/{entity}/`. Supabase CRUD lives in `src/data/{entity}/`. This differs from Lead Studio’s `src/data/{entity}/router.ts` pattern but matches this repo’s ADRs.

## 2. Environment variables

### 2.1 Web (`my-health-open-source`)

| Variable | Client-visible? | Required | Purpose |
|----------|-----------------|----------|---------|
| `NEXT_PUBLIC_API_URL` | **Yes** | Rec (defaults `http://localhost:3009`) | Browser → Express base URL |
| `NEXT_PUBLIC_GITHUB_ORG` | **Yes** | No | Landing page GitHub org |
| `NEXT_PUBLIC_GITHUB_WEB_URL` | **Yes** | No | Override web repo URL on landing |
| `NEXT_PUBLIC_GITHUB_API_URL` | **Yes** | No | Override API repo URL on landing |
| `NEXT_PUBLIC_DOCS_URL` | **Yes** | No | Override docs link on landing |
| `NEXT_PUBLIC_THT_URL` | **Yes** | No | TroutHouseTech link on landing |

**Rule:** Never put Supabase service-role keys or other server secrets in `NEXT_PUBLIC_*`.

### 2.2 Express (`my-health-open-source-express-server`)

| Variable | Required | Purpose |
|----------|----------|---------|
| `PORT` | No (default 3009) | Listen port |
| `NODE_ENV` | No | `development` / `production` |
| `SUPABASE_URL` | **Yes** | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | **Yes** | Server-side Supabase client |
| `SUPABASE_SERVICE_KEY` | Alias | Accepted alias for service role key |
| `CORS_ORIGINS` | No | Future: comma-separated browser origins |

## 3. HTTP routing map

### Browser → Express

```text
{NEXT_PUBLIC_API_URL}/api/data/...
{NEXT_PUBLIC_API_URL}/api/health
```

### Entity CRUD

Each entity supports `GET /`, `POST /`, `PATCH /:id`, `DELETE /:id` under `/api/data/{entity}`:

| Entity | Path prefix |
|--------|-------------|
| Hospitals | `/api/data/hospitals` |
| Specialties | `/api/data/specialties` |
| Doctors | `/api/data/doctors` |
| Appointments | `/api/data/appointments` |
| Focus areas | `/api/data/focus-areas` |
| Daily entries | `/api/data/daily-entries` |

Aggregator: `src/services/my-health-data-service/router.ts`.

## 4. Setup verification

### Express

```bash
cp .env.example .env
# Fill SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
# Apply docs/supabase/*.sql in order
npm install
npm run dev
curl http://localhost:3009/api/health
```

### Web

```bash
cp .env.example .env.local
# NEXT_PUBLIC_API_URL=http://localhost:3009
npm install
npm run dev
# Open http://localhost:3000 — landing and dashboard should load
```

## 5. Governance

OSS release checklist and security audit guides: see [docs/oss/README.md](./README.md).
