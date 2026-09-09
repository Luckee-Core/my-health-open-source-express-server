# ADR 014: Tube feed tracking

## Status

Accepted — 2026-09-08

## Context

Enteral (tube) feeding is tracked from pump readings taken each morning: total volume infused, milliliters left in the current bag, and the prescribed intermittent rate. Formula cans list brand, name, calories per 1000 mL, and container label volumes (FL OZ, QT, L). Daily calories must come from actual pump totals, not from rate × hours.

## Decision

### Tables

- `feed_formulas` — catalog of formulas (brand, name, `calories_per_1000_ml`, 1000 mL container, optional label FL OZ / QT / L)
- `feed_logs` — pump snapshots with `total_fed_ml`, `feed_left_ml`, `intermittent_rate_ml_per_hr`, `pump_reset`, `is_start`, and a **snapshotted** `calories_per_1000_ml`. One **morning** row per `log_date` (`is_start = false`). The start row is separate and may share a date with that morning.

Volume since the prior snapshot and calories are **not** stored. The web app derives them from consecutive snapshots.

### Starting point

Tracking begins with a **one-time** `is_start` snapshot: current pump total, feed left, and rate as of now (any time of day). That row has no calories and is not today’s morning log. After it exists, the morning form never loads or updates it. Later morning snapshots compute volume from this origin. Only one start row is allowed.

### Calorie math

- Source of truth is `total_fed_ml` (pump cumulative).
- The `is_start` snapshot is a baseline (no calories).
- Later snapshots: `volume = current.total_fed_ml - previous.total_fed_ml`, unless `pump_reset` is true or the current total is lower than the previous (implicit reset) — then `volume = current.total_fed_ml`.
- `calories = milliliters * (formula.calories_per_1000_ml / 1000)` using the **formula on that log** (`formula_id`). Milliliters are volume since the prior snapshot; the start row uses its `total_fed_ml` (example: 500 mL at 2000 kcal / 1000 mL is 1000 kcal). Fall back to the snapshotted `calories_per_1000_ml` only if the formula row is missing.
- Rate and feed left are operational context (hours of bag remaining = feed left / rate). They are not used for calorie estimates. `feed_left_ml` is remaining bag volume and is **not** capped by formula `container_volume_ml`.

### Endpoints

- `GET/POST/PATCH/DELETE /api/data/feed-formulas` — catalog CRUD
- `GET /api/data/feed-logs` — all snapshots
- `PUT /api/data/feed-logs` — insert the start row once, or upsert the morning row for `log_date`; copies `calories_per_1000_ml` from the selected formula
- `DELETE /api/data/feed-logs/:id` — remove a snapshot

## Consequences

- Morning check-in and the tube-feed page upsert **today’s morning** row. Saving the start does not occupy that slot.
- History calories follow the formula currently linked on each log. Changing that formula’s kcal / 1000 mL updates displayed calories; the log still stores a snapshot for fallback.
- Intra-day bag hangs and pump resets are out of scope unless the next morning’s snapshot flags `pump_reset`.
