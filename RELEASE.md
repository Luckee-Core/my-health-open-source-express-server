# Release — Luckee-Core

## Publish checklist

1. Commit all OSS readiness changes on `main` in both repos.
2. Public repos under [Luckee-Core](https://github.com/Luckee-Core):
   - `my-health-open-source-express-server`
   - `my-health-open-source`
3. Push both repos and set descriptions + topics (`health`, `open-source`, `nextjs`, `express`, `postgres`).
4. Tag releases (same date for the pair):

```bash
# Express
git tag -a v1.0.0 -m "First public OSS release"
git push origin v1.0.0

# Web
git tag -a v0.1.0 -m "First public OSS release"
git push origin v0.1.0
```

5. Create GitHub releases from tags; link companion repo in release notes.
6. Run governance audit per [mentorai-server data/open-source](https://github.com/Luckee-Core/mentorai-server/blob/main/data/open-source/README.md).

## Pair versions

| Repo | Tag | Notes |
|------|-----|-------|
| my-health-open-source-express-server | v1.0.0 | API + local Postgres + `GET /api-docs.json` |
| my-health-open-source | v0.1.0 | Web + landing + `/docs/api` |
