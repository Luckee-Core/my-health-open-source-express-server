# Contributing to My Health (Express API)

Thank you for contributing to the My Health open-source pair.

## Repositories

| Repo | Role |
|------|------|
| [my-health-open-source](https://github.com/matthewruiz/my-health-open-source) | Next.js dashboard and landing |
| [my-health-open-source-express-server](https://github.com/matthewruiz/my-health-open-source-express-server) | Express API backed by on-device Postgres |

Changes that touch API contracts should be coordinated across both repos. See [docs/oss/wire-contract.md](./docs/oss/wire-contract.md).

## Before you code

1. Read [.cursor/architecture/README.md](./.cursor/architecture/README.md).
2. Read [.cursor/rules/AGENTS.md](./.cursor/rules/AGENTS.md).
3. Keep CRUD in `src/data/{table}/`; HTTP in `src/services/{feature}/`.

## Development setup

1. Copy `.env.example` to `.env` and set `DATABASE_URL` (see [docs/how-to/local-postgres-mac.md](./docs/how-to/local-postgres-mac.md)).
2. Apply SQL in `migrations/` in numeric order with `psql`.
3. `npm install` then `npm run dev`.
4. Smoke test: `curl http://localhost:3009/api/health`

## Pull requests

- Keep PRs focused; one feature or fix per PR when possible.
- Run `npm run build` before opening a PR.
- Update README, wire contract, or SQL docs when routes or schema change.
- Do not commit secrets, `.env` files, or `DATABASE_URL` values.

## Questions

Open a GitHub issue for bugs or feature discussion.
