# ADR 012: Therapy exercises & photo import

## Status

Accepted — 2026-09-05

## Context

Speech therapy homework has heterogeneous tracking: timed attempts (e.g. 10 × 5s) and sets/reps (e.g. 5 × 5). Users may receive paper instructions and need vision AI to extract exercises. Daily progress must be incrementable from multiple UI surfaces without race conditions.

## Decision

### Tables

- `therapy_exercises` — prescription (name, tracking_kind, target_count, unit_size, discipline, source)
- `therapy_exercise_logs` — one row per `(exercise_id, log_date)` with `completed_count`
- `therapy_exercise_imports` — preview/commit draft JSON (no long-term image storage)

### Tracking kinds

| Kind | Example | Fields |
|------|---------|--------|
| `timed_attempts` | 10 attempts at 5s | `target_count=10`, `unit_size=5` |
| `sets_reps` | 5 sets of 5 | `target_count=5`, `unit_size=5` |

Done for the day when `completed_count >= target_count`.

### Increment endpoint

`POST /api/data/therapy-exercise-logs/increment` with `{ exercise_id, log_date, delta }` atomically upserts and applies delta (floored at 0). Used by speech therapy page, dashboard, and morning check-in.

### Photo import

Two-step flow (like health-import ADR 011):

1. **Preview** — multipart `file` (JPEG/PNG/WebP only; reject HEIC with 400) → Anthropic vision → `therapy_exercise_imports` draft
2. **Commit** — JSON `{ previewId, exercises }` (user-edited) → insert `therapy_exercises` rows, mark import committed, clear draft

Images are memory-only during preview; never persisted after commit.

### Anthropic client

`initializeManagedAnthropicClient()` at startup from `ANTHROPIC_API_KEY`. Preview returns 500 if client unavailable.

## Consequences

- Web stores exercises/logs in Redux dumps; derives today's progress client-side
- Photo import review keeps a local object URL in the browser during the wizard
- Future PT/OT can reuse tables with `discipline` values
