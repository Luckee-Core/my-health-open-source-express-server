# Vision & phasing

## What this product is

**My Health** is a **self-hosted personal health command center** — not a live connection to a hospital patient portal (Epic MyChart, Cerner, etc.), but a place **you** aggregate information from many systems so you can walk into any hospital or specialist prepared to answer questions about your history, medications, and care.

You are the integrator: copy/paste from MyChart, upload visit PDFs, photograph a pill bottle, or type into a form. AI (via Express) helps turn messy inputs into **structured rows** you review before saving.

### PHR (Personal Health Record)

A **PHR** is a health record **controlled by the patient** (you), as opposed to an **EHR** (Electronic Health Record) owned by a hospital or clinic.

This product is a PHR in spirit: your Postgres database, your machine, your data. It is **not** trying to replace MyChart login or sync in real time with Jefferson, Penn, etc. It **complements** those portals by giving you one consolidated view across all of them.

### “19 identical CRUD grids” (current app vs. target UX)

Today the web app exposes many health-record entities (allergies, medications, conditions, vitals, …) as **separate pages with the same pattern**: a table, an “add” button, and a simple form. That is fine for early scaffolding but **not** the long-term UX.

The target is **different entry experiences per feature**, matched to how often you touch that data:

| Pattern | Best for |
|---------|----------|
| **Simple form** | Allergies, weight you track yourself, quick manual adds |
| **Paste / upload → AI extract → review** | MyChart exports, visit summaries, lab PDFs, clinical notes |
| **Conversational intake** (later) | Medical history onboarding, reconciling gaps across imports |

So we are moving from “every entity looks the same” toward **input modality + frequency** driving the UI.

---

## Feature direction (by area)

### Allergies

Manual form is enough. User-known, low volume, high confidence.

### Medications

**Multi-modal entry** (Phase 2+ for photo/AI):

1. **Form** — name, dose, frequency, prescriber, quantity, etc.
2. **Paste** — block from MyChart med list → AI parses → user reviews structured fields.
3. **Photo** (Phase 3) — pill bottle / label → AI reads label → user reviews.

Always **human-in-the-loop**: AI proposes structured fields; user confirms before commit.

### Conditions / problems / diagnoses

Primary: **paste** visit summary, problem list, or discharge note → AI proposes conditions (status, dates, etc.).

Secondary: quick manual add for things you already know.

### Vitals

Split by what you actually track:

| Vital | Approach |
|-------|----------|
| **Weight** | User logs over time (simple time series + form). |
| **BP, SpO₂, temp, etc.** | Usually from a visit — paste from MyChart or import from an upload; not daily manual entry. |

Default vitals UX should emphasize **timeline from imports**, not empty daily BP forms.

### Lab & imaging results

**Episodic**, not active tracking. After a visit: upload PDF, paste text, or MyChart export → AI extracts structured result rows → user reviews.

Duplicate labs from multiple imports should **merge** into one canonical row (see [data model direction](./data-model-direction.md)).

### Clinical notes & referrals

Same episodic import pattern as labs. Infrequent; sourced from MyChart paste/upload. Structured fields after AI extraction (date, provider, specialty, reason, status).

### Insurance & coverage

TBD on exact sources (MyChart coverage section vs. insurance portal messages/EOBs). v1 can be manual form + paste; file upload later.

### Medical history

**Different UX** from a CRUD table:

- **New users:** guided intake — paste/upload MyChart or insurance exports, or narrative chat; AI drafts a timeline; user corrects.
- **Existing users:** reconcile — AI reads data already in the system, flags conflicts and gaps, user confirms.

This is the **source-of-truth builder**, not a daily screen.

### Symptom logs vs. daily journal

**Both are first-class.** They solve different problems and should stay separate.

#### Symptom logs — structured, high-frequency clinical Q&A

**Why it matters:** During inpatient care (or intense outpatient periods), multiple teams ask the **same kinds of questions on a schedule** — often every morning:

- Neurosurgery: head pain, facial pressure, how was last night?
- Medicine team: nausea yesterday and overnight, pain scale, etc.
- Other specialties: overlapping questions plus their own focus

You need a **fast, repeatable way to answer** those questions with structured data (symptom name, severity 1–10, time window, notes) — not a long narrative every time.

**Target UX (Phase 1 priority):**

- **Morning check-in** — one screen to log today’s answers for your active symptom set (head pain, facial pressure, nausea, …).
- **Time context** — distinguish *right now*, *last night*, *yesterday* (schema/UX TBD; may need `recorded_at` + period label or separate rows per window).
- **Reusable symptom list** — teams keep asking the same things; don’t re-type symptom names daily.
- Optional link to a **focus area** (already in schema via `focus_area_id`).
- Later: “rounds summary” export — what every team asked this week, trend lines for severity.

Current schema (`symptom_logs`): `recorded_at`, `name`, `severity` (1–10), `triggers`, `duration_minutes`, `notes`, `focus_area_id`.

#### Daily journal — narrative, throughout the day

**Why it matters:** Between (or in addition to) those clinical check-ins, you want a **running log** of what happened — appointments, how you felt at different times, questions for doctors, things to remember. Longer form, less structured, more “what happened today.”

Works with **focus areas** for themes you’re tracking over weeks/months.

#### How they work together

| | Symptom logs | Daily journal |
|---|--------------|---------------|
| **Cadence** | Often daily (e.g. before rounds) | Anytime during the day |
| **Shape** | Structured (symptom, severity, window) | Narrative text |
| **Audience** | You → answering clinical teams | You → future you |
| **Example** | “Head pain: 4/10, worse last night” | “PT came at 2pm; asked about discharge timeline” |

Do not merge these into one feature. Dashboard can show **both**: “today’s symptom check-in” + “recent journal entries.”

### Research (deferred)

Concept: chat grounded in **your** stored data — pick a scope (a condition, med, date range), ask questions, get summaries and suggested questions for your next visit.

**Out of scope for near-term build.** Documented here for later; no implementation commitment in Phase 1–2.

---

## Cross-cutting principles

1. **Multi-hospital** — tag provenance so “Jefferson MyChart” vs. “Penn MyChart” stays visible.
2. **Structured fields only on entity tables** — no JSONB blobs on clinical rows; provenance via **relational** source/upload/junction tables.
3. **Import is first-class** — paste and upload as prominent as “Add row.”
4. **Human review before commit** — especially meds and diagnoses.
5. **AI via Express** — all AI calls go through Express HTTP endpoints; local file storage also via Express (on-device), not Supabase or browser-side secrets. Same handler patterns whether storage is local disk or cloud later.
6. **Visit prep** — long-term north star: “I have an appointment Thursday — what should I bring up?”

---

## Phasing

### Phase 1 — Structure + manual (agreed)

- Care team: hospitals, specialties, doctors
- Appointments
- Allergies, medications, conditions — **manual forms**
- **Symptom logs** — structured daily/rounds check-in (high priority for inpatient-style tracking)
- **Daily journal** + focus areas — narrative log throughout the day
- Basic paste → structure for **medications and conditions** (AI via Express, review step)
- Provenance tables + junction design started (see data model doc)

### Phase 2 — Import pipeline (agreed)

- Unified **upload / paste** flow for episodic data: labs, clinical notes, referrals, vitals snapshots
- Upload registry + dedup (reject or warn on duplicate file/report)
- Source linkage: MyChart + facility (e.g. Jefferson) on every imported row
- Lab dedup/merge across imports

### Phase 3 — Deferred

- Medication **photo** → AI label read
- Medical history **chat / reconcile** flows
- **Research** chat over corpus
- Visit prep export

Phase 3 concepts stay in this doc; implementation waits until Phase 1–2 are solid.
