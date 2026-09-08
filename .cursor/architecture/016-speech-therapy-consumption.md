# ADR 016: Speech therapy consumption

## Status

Accepted — 2026-09-08

## Context

Speech therapy homework includes things to consume (ice cubes today; other items later). Counts are per calendar day and should be incrementable from a dedicated Consumption screen the same way exercise logs are incremented.

## Decision

### Table

- `speech_therapy_consumption` — one row per `(consumption_type, log_date)` with `quantity`

`consumption_type` is a closed text check. The only value for now is `ice_cube`. Add new types by expanding that check; do not create a second table per item.

### Increment endpoint

`POST /api/data/speech-therapy-consumption/increment` with `{ consumption_type, log_date, delta }` atomically upserts and applies delta (floored at 0). Used by the Consumption page.

`GET /api/data/speech-therapy-consumption` lists all rows newest first.

## Consequences

- Web stores rows in a Redux dump and derives today’s ice-cube count client-side.
- Future types (water, thickener, …) reuse the same table, endpoints, and dump.
