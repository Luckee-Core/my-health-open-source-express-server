# ADR 013: Three-table AI audit and costs

## Status

Accepted — 2026-09-07

## Context

Speech therapy photo import calls Anthropic vision. Token usage must be auditable so the web AI Costs page can estimate spend. Personal Finances uses a three-table pattern (`*_requests`, `*_responses`, `*_exchanges`) plus `llm_models` and `exchange_table_registry`.

## Decision

Every AI round-trip for therapy homework import persists:

1. **`therapy_exercise_import_ai_requests`** — pending input (model, mime, filename, system prompt)
2. **`therapy_exercise_import_ai_exchanges`** — meter row (`input_tokens`, `output_tokens`, `model_used`, `status`)
3. **`therapy_exercise_import_ai_responses`** — raw/parsed output and usage copies

Process order: insert request → insert exchange → link `request.exchange_id` → call the model → insert response → update exchange (tokens, `completed` or `failed`) → update request. Then create `therapy_exercise_imports` and set `import_id` / `exchange_id` FKs.

**Pricing:** `llm_models` stores USD per million input/output tokens, keyed by `model`.

**Registry:** `exchange_table_registry` catalogs which `*_exchanges` tables the AI Costs UI (and future rollups) should read. Seed `logical_key = therapy_exercise_import`.

The web bootstrap loads completed exchanges and `llm_models`. Cost = tokens × rates from `llm_models`.

## Consequences

- Do not call Anthropic from handlers without this audit trail
- Prompt versioning (`ai_prompts`) is out of scope for v1; the system prompt lives in process code
- Additional AI features add a new trio + a registry row
