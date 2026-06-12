# Security Policy

## Supported versions

| Version | Supported |
|---------|-----------|
| Latest release tag | Yes |
| `main` branch | Best-effort |

## Reporting a vulnerability

Please **do not** open a public GitHub issue for security vulnerabilities.

Report privately via GitHub Security Advisories on this repository, or email security concerns to the maintainers through your TroutHouseTech contact channel.

## Scope

This project is a **self-hosted health data API** backed by on-device Postgres.

### In scope

- Unauthorized data access or mutation on exposed deployments
- `DATABASE_URL` exposure in client bundles or logs
- CORS misconfiguration on internet-facing deployments
- SQL injection in data layer (parameterized queries required)

### Known limitations (OSS v1)

- **No API authentication** on CRUD routes. This is intentional for local/trusted development. Do not expose this API to the public internet without adding authentication and authorization.
- **Permissive CORS** (`cors()` default) in development. Restrict origins in production via future `CORS_ORIGINS` support or a reverse proxy.

## Threat model

| Trust boundary | OSS default |
|----------------|-------------|
| Operator machine | Trusted — localhost dev |
| Browser | Calls API via `NEXT_PUBLIC_API_URL`; no database credentials in browser |
| Postgres | Server-only via `DATABASE_URL` |
| Internet | **Not supported** without auth, HTTPS, and CORS hardening |

## Environment secrets

| Variable | Exposure |
|----------|----------|
| `DATABASE_URL` | Server only — never in web `NEXT_PUBLIC_*` |
| `PG_POOL_MAX` | Server only |
| `PORT`, `NODE_ENV` | Server only |

## Best practices for operators

1. Bind to `127.0.0.1` or firewall the port when running locally.
2. Never commit `.env` or paste `DATABASE_URL` into issues or READMEs.
3. Use least-privilege Postgres roles if you add multi-user auth later.
4. Enable GitHub private vulnerability reporting on the public repo.
