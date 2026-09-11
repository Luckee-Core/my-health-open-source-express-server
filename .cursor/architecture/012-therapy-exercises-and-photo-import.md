# ADR 012: Therapy exercises & photo import

## Status

Accepted — 2026-09-05

## Context

Speech therapy homework has heterogeneous tracking: timed attempts (e.g. 10 × 5s) and sets/reps (e.g. 5 × 5). Users may receive paper instructions and need vision AI to extract exercises. Daily progress must be incrementable from multiple UI surfaces without race conditions.

## Decision

### Tables

- `therapy_exercises` — prescription (name, tracking_kind, target_count, unit_size, `frequency`, `is_active`, discipline, source)
- `therapy_exercise_logs` — one row per `(exercise_id, log_date)` with `completed_count`, `skipped`, and `due` (today only)
- `therapy_exercise_imports` — preview/commit draft JSON (no long-term image storage)

### Schedule (`frequency` + `is_active`)

| Schedule | Fields | Daily remaining list |
|----------|--------|----------------------|
| Daily homework | `frequency='daily'`, `is_active=true` | Included (dashboard, morning check-in, speech therapy remaining) |
| Therapy session only | `frequency='session'`, `is_active=true` | Excluded until today’s log has `due=true` |
| Session due today | `frequency='session'`, `is_active=true`, log `due=true` | Included for that date only |
| Paused | `is_active=false` | Excluded — logging disabled until reactivated |

`frequency` is `daily` or `session`. Pause is `is_active`, not a third frequency value. Session exercises stay off the daily list until marked due for that date (`POST .../due`). Incrementing a session log also sets `due=true`.

### Tracking kinds

| Kind | Example | Fields |
|------|---------|--------|
| `timed_attempts` | 10 attempts at 5s | `target_count=10`, `unit_size=5` |
| `sets_reps` | 5 sets of 5 | `target_count=5`, `unit_size=5` |

Done for the day when `completed_count` meets the tracking target (reps for `sets_reps`, attempts for timed holds). `skipped = true` hides a **daily** exercise from today's remaining list without changing `therapy_exercises.is_active` or `frequency`; it returns tomorrow. Use `frequency='session'` for exercises that only happen during a therapy visit so they are not skipped every other day.

### Increment endpoint

`POST /api/data/therapy-exercise-logs/increment` with `{ exercise_id, log_date, delta }` atomically upserts and applies delta (floored at 0) and clears `skipped`. Used by speech therapy page, dashboard, and morning check-in.

`POST /api/data/therapy-exercise-logs/skip` with `{ exercise_id, log_date, skipped }` marks or unmarks the exercise as not for today (e.g. waiting on nurse help).

`POST /api/data/therapy-exercise-logs/due` with `{ exercise_id, log_date, due }` puts a **session** exercise on (or off) today’s remaining list without changing `frequency`. Daily homework ignores `due`.

### Photo import

Two-step flow (like health-import ADR 011):

1. **Preview** — multipart `file` (JPEG/PNG/WebP; web UI sends PNG) → downscale/JPEG-compress in memory to stay under Anthropic's 10 MB vision limit → three-table AI audit (ADR 013) → Anthropic vision → `therapy_exercise_imports` draft linked by `exchange_id`
2. **Commit** — JSON `{ previewId, exercises }` (user-edited) → insert `therapy_exercises` rows, mark import committed, clear draft

Images are memory-only during preview; never persisted after commit.

### Anthropic client

`initializeManagedAnthropicClient()` at startup from `ANTHROPIC_API_KEY`. Preview returns 500 if client unavailable.

## Consequences

- Web stores exercises/logs in Redux dumps; derives today's progress client-side
- Photo import review keeps a local object URL in the browser during the wizard
- Future PT/OT can reuse tables with `discipline` values
