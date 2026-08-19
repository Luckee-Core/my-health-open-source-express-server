# Data model direction

Relational Postgres only. **No JSONB on clinical entity tables.** Provenance, uploads, and cross-source linkage use **normalized tables and junction tables**.

> **Note:** `health_imports` / `health_import_drafts` today use `JSONB` for C-CDA import drafts (migration 004). New work should not add JSONB to domain tables; long-term, import staging should move to relational staging tables or files on disk referenced by upload rows.

---

## Goals

1. Every structured clinical row (medication, condition, lab result, etc.) can be tied to **where it came from** (e.g. MyChart) and **which organization** (e.g. Jefferson).
2. Every **upload** (file or paste batch) is tracked once; re-uploading the same report is detected before creating duplicate structured rows.
3. **Duplicate labs** from different uploads merge into one canonical result row when they represent the same test.
4. Entity tables hold **only structured fields** — no raw paste blob columns on `medications`, `conditions`, etc.

---

## Core entities (conceptual)

### Source systems

Catalog of *kinds* of systems data can come from.

| Column (example) | Purpose |
|------------------|---------|
| `id` | UUID PK |
| `code` | Stable slug: `mychart`, `manual`, `insurance_portal`, `ccd_import`, … |
| `name` | Display: “MyChart”, “Manual entry”, … |

### Organizations (facilities)

**Reuse / extend `hospitals`** (or rename conceptually to “organizations”) for Jefferson, Penn, etc. A source system is not the same as a facility: **MyChart at Jefferson** = source system + organization.

Optional: `organization_aliases` if the same facility appears under different names in exports.

### Source instances (optional but useful)

A row meaning “this person’s MyChart at Jefferson” — links `source_system_id` + `hospital_id` (+ optional label). Imports reference a **source instance**, not just a string.

### Document uploads (ingest registry)

One row per **upload attempt** — file or paste batch.

| Column (example) | Purpose |
|------------------|---------|
| `id` | UUID PK |
| `source_instance_id` | FK — e.g. MyChart + Jefferson |
| `ingest_kind` | `file`, `paste`, `photo`, `ccd_zip`, … |
| `report_type` | `lab_results`, `clinical_note`, `medications_list`, `visit_summary`, … |
| `original_filename` | For files; nullable for paste |
| `content_sha256` | Hash of raw bytes / normalized paste text |
| `report_date` | Clinical date if known (visit date, note date) |
| `provider_name` | Optional — “Dr. Smith note on 2024-03-01” |
| `storage_path` | Path on **local disk** (Express-managed), not DB blob |
| `status` | `pending`, `processing`, `review`, `committed`, `failed`, `duplicate_rejected` |
| `created_at` | |

**Dedup before ingest:** On new upload, check for existing row with same:

- `content_sha256`, **or**
- (`source_instance_id`, `report_type`, `original_filename`, `report_date`) when filename + type + date uniquely identify a report in your workflow

If match → reject or surface “already imported” with link to prior upload.

### AI processing runs (optional)

Track each Express AI call against an `upload_id`: model, endpoint, timestamps, status. Keeps audit without storing prompts in JSONB on clinical rows (prompt/response can live in files under `storage_path` if needed).

---

## Junction tables (provenance linkage)

Do **not** rely only on nullable `source_system`, `source_document_id`, `source_entry_key` columns on every table (migration 004 pattern). **Add explicit junction tables** so one clinical row can cite multiple uploads over time (e.g. merged lab) and queries stay clear.

### Pattern: `clinical_record_sources`

Generic junction (or per-entity junctions if you prefer stricter FKs):

| Column | Purpose |
|--------|---------|
| `id` | UUID PK |
| `entity_table` | e.g. `medications`, `clinical_results` |
| `entity_id` | UUID FK to that row |
| `upload_id` | FK → `document_uploads` |
| `source_instance_id` | FK — MyChart + Jefferson |
| `source_entry_key` | Stable key inside that upload (line id, LOINC+date, etc.) |
| `is_primary` | Which upload “owns” the row for display |
| `created_at` | |

Every AI-extracted or imported row gets at least one junction row at commit time. Manual form entry uses `source_instance_id` → `manual` (no upload) or a synthetic “manual” upload row if you want uniform queries.

### Why junctions + uploads

- User selects **“this file is from MyChart Jefferson”** at upload time → `source_instance_id` on `document_uploads`.
- Structured fields land on `medications` / `clinical_results` / etc.
- Junction ties **each field row** to **that upload** and **that source instance**.
- Re-upload check consults `document_uploads` (+ hash/filename rules), not entity tables directly.

---

## Lab deduplication & merge

When two uploads contain the “same” lab (e.g. same test name + value + date + unit, or same LOINC + effective date):

1. **Merge** into one `clinical_results` row (canonical structured fields).
2. Add **second junction row** pointing at the other `upload_id` (both uploads contributed evidence).
3. Do not create duplicate result rows.

Merge rules (to refine in implementation):

- Match key: `(loinc_or_test_code, effective_date, value, unit)` or normalized test name + date
- On conflict in field values → flag for user review instead of silent overwrite

---

## Entity tables (structured fields only)

Existing tables (`allergies`, `medications`, `conditions`, `vital_signs`, `clinical_results`, `clinical_notes`, `referrals`, `insurance_coverages`, `medical_history_events`, `daily_entries`, `focus_areas`, …) keep **typed columns only**.

Deprioritized for new UX: **`symptom_logs`** (see [vision doc](./vision-and-phasing.md)).

Migration 004 provenance columns may remain during transition; new code should prefer junction + upload tables.

---

## AI & storage (Express only)

- **All AI** exposed as Express routes (e.g. `/api/ai/extract-medications`, `/api/ai/extract-conditions`, …). Web app never calls model providers directly.
- **File storage**: Express writes uploads to **local on-device** paths (`storage_path`); handlers read from disk for AI. No Supabase requirement; if Postgres is remote, files still live on the machine running Express.
- Handler code should be written so storage backend can swap later without changing web clients.

---

## Likely new tables (checklist)

| Table | Role |
|-------|------|
| `source_systems` | MyChart, manual, insurance portal, … |
| `source_instances` | MyChart @ Jefferson, … |
| `document_uploads` | Ingest registry + dedup |
| `clinical_record_sources` (or per-entity `*_sources`) | Junction: entity ↔ upload ↔ source instance |
| `ai_processing_runs` | Optional audit of Express AI jobs |
| `clinical_result_merge_log` | Optional — audit when two results merged |

Extend **`hospitals`** for multi-facility tracking; avoid parallel “facility” tables unless rename migration is planned.

---

## Open implementation details (later)

- Exact dedup key: filename-only vs. content hash vs. both
- Whether paste batches get a generated `original_filename` (e.g. `paste-2026-08-19T12:00:00.txt`)
- Retiring `health_import_drafts.draft_json` in favor of relational staging or on-disk JSON files referenced by `document_uploads`
- Symptom log table: freeze, migrate to journal, or drop in a future migration
