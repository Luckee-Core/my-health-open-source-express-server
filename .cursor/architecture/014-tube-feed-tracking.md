# ADR 014: Tube feed tracking

## Status

Accepted — 2026-09-08
Amended — 2026-09-10 (no starting-point row)

## Context

Enteral (tube) feeding is tracked from pump readings taken each morning: total volume infused, milliliters left in the current bag, and the prescribed intermittent rate. Formula cans list brand, name, calories per 1000 mL, and container label volumes (FL OZ, QT, L). Daily calories must come from actual pump totals, not from rate × hours.

## Decision

### Tables

- `feed_formulas` — catalog of formulas (brand, name, `calories_per_1000_ml`, 1000 mL container, optional label FL OZ / QT / L)
- `feed_logs` — one pump snapshot per `log_date` with `total_fed_ml`, `feed_left_ml`, `intermittent_rate_ml_per_hr`, `pump_reset`, and a **snapshotted** `calories_per_1000_ml`. There is no separate origin / `is_start` row.

Volume since the prior snapshot and calories are **not** stored. The web app derives them from consecutive snapshots.

### Calorie math

- Source of truth is `total_fed_ml` (pump cumulative).
- First snapshot, or a reset (`pump_reset` or current total lower than previous): milliliters = `current.total_fed_ml`.
- Otherwise: milliliters = `current.total_fed_ml - previous.total_fed_ml`.
- `calories = milliliters * (kcal per 1000 mL / 1000)` using the **formula on that log** (`formula_id`). Example: 500 mL at 2000 kcal / 1000 mL is 1000 kcal. Fall back to the snapshotted `calories_per_1000_ml` only if the formula row is missing.
- Rate and feed left are operational context (hours of bag remaining = feed left / rate). They are not used for calorie estimates. `feed_left_ml` is remaining bag volume and is **not** capped by formula `container_volume_ml`.

### Endpoints

- `GET/POST/PATCH/DELETE /api/data/feed-formulas` — catalog CRUD
- `GET /api/data/feed-logs` — all snapshots
- `PUT /api/data/feed-logs` — upsert the snapshot for `log_date`; copies `calories_per_1000_ml` from the selected formula
- `DELETE /api/data/feed-logs/:id` — remove a snapshot

## Consequences

- Morning check-in and the tube-feed page upsert **today’s** row. Every save is a normal log.
- History calories follow the formula currently linked on each log. Changing that formula’s kcal / 1000 mL updates displayed calories; the log still stores a snapshot for fallback.
- Intra-day bag hangs and pump resets are out of scope unless the next morning’s snapshot flags `pump_reset`.
