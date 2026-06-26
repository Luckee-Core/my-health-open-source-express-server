-- My Health — seed data (Matthew / skull-base chondrosarcoma)
-- Run AFTER setup.sql:
--   psql "$DATABASE_URL" -f migrations/setup.sql
--   psql "$DATABASE_URL" -f migrations/seed.sql
-- Safe to re-run: skips rows that already exist (matched by title + date/name).

-- Extra specialties
INSERT INTO public.specialties (name)
SELECT v.name
FROM (VALUES ('Oncology'), ('Neurosurgery'), ('ENT / Skull Base')) AS v(name)
WHERE NOT EXISTS (
  SELECT 1 FROM public.specialties s WHERE lower(trim(s.name)) = lower(trim(v.name))
);

-- Care team placeholders (edit names/facility in the app later)
INSERT INTO public.hospitals (name, notes)
SELECT 'Skull Base Treatment Center', 'Placeholder — update with your actual facility'
WHERE NOT EXISTS (
  SELECT 1 FROM public.hospitals h WHERE lower(trim(h.name)) = lower(trim('Skull Base Treatment Center'))
);

INSERT INTO public.doctors (name, hospital_id, specialty_id, notes)
SELECT
  'Skull Base Surgeon (placeholder)',
  h.id,
  s.id,
  'Update with your neurosurgeon / ENT skull-base provider'
FROM public.hospitals h
CROSS JOIN public.specialties s
WHERE lower(trim(h.name)) = lower(trim('Skull Base Treatment Center'))
  AND lower(trim(s.name)) = lower(trim('Neurosurgery'))
  AND NOT EXISTS (
    SELECT 1 FROM public.doctors d
    WHERE lower(trim(d.name)) = lower(trim('Skull Base Surgeon (placeholder)'))
  );

-- Focus area for cranial nerve / swallowing symptoms
INSERT INTO public.focus_areas (name, description)
SELECT 'Skull base / cranial nerves', 'Tongue, swallowing, voice, ear pain — lower cranial nerve symptoms'
WHERE NOT EXISTS (
  SELECT 1 FROM public.focus_areas f
  WHERE lower(trim(f.name)) = lower(trim('Skull base / cranial nerves'))
);

-- ---------------------------------------------------------------------------
-- Medical history timeline
-- ---------------------------------------------------------------------------
INSERT INTO public.medical_history_events (
  event_date, title, category, description, focus_area_id
)
SELECT
  v.event_date,
  v.title,
  v.category,
  v.description,
  fa.id
FROM (
  VALUES
    (
      '2020-06-01'::date,
      'Skull base chondrosarcoma — endoscopic resection',
      'surgery',
      'Transnasal endoscopic surgery. Tumor near cranial nerves and internal carotid artery; majority resected. Residual disease intentionally left near critical structures.'
    ),
    (
      '2020-08-01'::date,
      'Proton therapy — residual skull base disease',
      'radiation',
      'Proton therapy for residual chondrosarcoma after surgery. Goal: control microscopic residual while sparing nerves and carotid.'
    ),
    (
      '2020-06-01'::date,
      'Initial diagnosis — skull base chondrosarcoma',
      'diagnosis',
      'Chondrosarcoma at skull base (clivus / petrous region). Slow-growing cartilage-origin tumor; location drives symptoms and treatment tradeoffs.'
    ),
    (
      '2025-05-10'::date,
      'MRI brain — stable, no recurrence',
      'imaging',
      'Follow-up MRI considered stable. No evidence of recurrence on imaging at that time.'
    ),
    (
      '2026-06-17'::date,
      'CT IAC — bone destruction with chondroid matrix',
      'imaging',
      'CT temporal bones showed bone destructive lesion with chondroid matrix calcification in left skull base, matching prior tumor region.'
    ),
    (
      '2026-06-01'::date,
      'MRI skull base (incomplete) — concerning for recurrence',
      'imaging',
      'Incomplete study (no contrast; terminated early). Bone marrow replacing process more extensive than 5/10/2025 MRI: clivus, left petrous apex, petro-occipital fissure, foramen magnum, left jugular foramen, hypoglossal canal. Concerning for chondrosarcoma recurrence. Brain parenchyma without mass effect. Repeat MRI with contrast recommended.'
    )
) AS v(event_date, title, category, description)
CROSS JOIN public.focus_areas fa
WHERE lower(trim(fa.name)) = lower(trim('Cancer'))
  AND NOT EXISTS (
    SELECT 1 FROM public.medical_history_events e
    WHERE e.event_date = v.event_date AND e.title = v.title
  );

-- Upcoming follow-up (adjust date if needed)
INSERT INTO public.appointments (
  doctor_id, scheduled_at, status, appointment_type, reason, notes
)
SELECT
  d.id,
  '2026-07-06 10:00:00-04'::timestamptz,
  'scheduled',
  'Follow-up',
  'Review repeat MRI and recurrence workup',
  'Bring symptom log: tongue weakness, swallowing, voice fatigue. Scans scheduled prior to visit.'
FROM public.doctors d
WHERE lower(trim(d.name)) = lower(trim('Skull Base Surgeon (placeholder)'))
  AND NOT EXISTS (
    SELECT 1 FROM public.appointments a
    WHERE a.reason = 'Review repeat MRI and recurrence workup'
      AND a.scheduled_at::date = '2026-07-06'::date
  );

-- ---------------------------------------------------------------------------
-- Symptom logs (recent episodes)
-- ---------------------------------------------------------------------------
INSERT INTO public.symptom_logs (
  recorded_at, name, severity, triggers, notes, focus_area_id
)
SELECT
  v.recorded_at::timestamptz,
  v.name,
  v.severity,
  v.triggers,
  v.notes,
  fa.id
FROM (
  VALUES
    (
      '2026-06-20 09:00:00',
      'Voice fatigue',
      6,
      'prolonged talking, eating',
      'Hoarse and weaker after ~15 minutes of conversation; new over the past week'
    ),
    (
      '2026-06-22 14:30:00',
      'Tongue weakness / feels tied',
      5,
      'clearing teeth, moving food in mouth',
      'Episodes of feeling tongue-tied; not constant'
    ),
    (
      '2026-06-18 08:00:00',
      'Swallowing difficulty',
      4,
      'solid food, some meals',
      'Intermittent — sometimes needs extra swallows; not always'
    ),
    (
      '2026-06-15 22:00:00',
      'Ear pain (otalgia)',
      5,
      'lying down',
      'Left ear / skull base discomfort; worse when lying down at times'
    )
) AS v(recorded_at, name, severity, triggers, notes)
CROSS JOIN public.focus_areas fa
WHERE lower(trim(fa.name)) = lower(trim('Skull base / cranial nerves'))
  AND NOT EXISTS (
    SELECT 1 FROM public.symptom_logs s
    WHERE s.name = v.name AND s.recorded_at::date = v.recorded_at::date
  );

-- ---------------------------------------------------------------------------
-- Research notes
-- ---------------------------------------------------------------------------
INSERT INTO public.research_notes (title, category, summary, content, focus_area_id)
SELECT
  v.title,
  v.category,
  v.summary,
  v.content,
  fa.id
FROM (
  VALUES
    (
      'MRI skull base report — Jun 2026 (raw)',
      'imaging',
      'Incomplete WO contrast study; concerning for chondrosarcoma recurrence at left skull base. Brain OK on limited scan.',
      E'INDICATION: otalgia. h/o chondrosarcoma\nCOMPARISON: CT IAC 6/17/2026, MRI brain 5/10/2025\n\nTECHNIQUE: Incomplete study. No contrast. Terminated early due to patient condition. Recommend repeat with contrast.\n\nKEY FINDINGS:\n- No acute infarct, hemorrhage, intra-axial mass, mass effect, or hydrocephalus\n- Bone marrow replacing process LEFT skull base: clivus, petrous apex, petro-occipital fissure, foramen magnum margin, left jugular foramen, hypoglossal canal\n- More extensive than 5/10/2025 MRI; matches CT bone destruction with chondroid matrix\n- IMPRESSION: concerning for chondrosarcoma recurrence\n\nSTRUCTURES OF INTEREST FOR SYMPTOMS:\n- Hypoglossal canal → tongue movement\n- Jugular foramen → swallowing, voice, vocal cords'
    ),
    (
      'Doctor visit prep — Jul 6',
      'doctor_prep',
      'Symptoms to report and questions for skull base team after repeat MRI.',
      E'SYMPTOMS TO REPORT:\n- Voice gets weaker with prolonged talking (~15 min)\n- Intermittent swallowing difficulty; occasional extra swallows\n- Tongue feels weak or tied at times; trouble clearing teeth\n- Left ear pain, sometimes worse lying down\n\nQUESTIONS:\n1. Does repeat contrast MRI confirm recurrence vs other explanation?\n2. How does this compare to original tumor and proton field?\n3. Vocal cord exam / scope needed given voice changes?\n4. Treatment options if confirmed recurrence (surgery vs re-irradiation vs observation)?\n5. What symptoms need urgent care vs routine follow-up?\n\nRED FLAGS (seek urgent care):\n- Repeated choking on liquids\n- Rapid speech decline\n- Trouble breathing\n- Cannot swallow saliva'
    ),
    (
      'Skull base chondrosarcoma — quick reference',
      'personal',
      'Notes on tumor biology, recurrence, and why symptoms map to anatomy.',
      E'Skull base chondrosarcoma:\n- Arises from cartilage-related cells at skull base (clivus, petrous)\n- Usually SLOW growing; replaces bone rather than exploding into brain\n- Recurrence years after surgery + proton therapy is possible (microscopic residual)\n- Location matters more than speed: carotid artery, cranial nerves\n\nMy treatment history: endoscopic resection ~2020 + proton therapy; stable through May 2025.\n\nSymptom ↔ anatomy:\n- Tongue tied / weak → hypoglossal nerve (hypoglossal canal)\n- Swallowing + voice → jugular foramen nerves\n- Ear pain → petrous / skull base region\n\nPaste full MRI chat export into a new research note if you want the long-form Q&A saved.'
    )
) AS v(title, category, summary, content)
CROSS JOIN public.focus_areas fa
WHERE lower(trim(fa.name)) = lower(trim('Cancer'))
  AND NOT EXISTS (
    SELECT 1 FROM public.research_notes r WHERE r.title = v.title
  );

-- Sample daily log entry (today-ish)
INSERT INTO public.daily_entries (entry_date, focus_area_id, notes)
SELECT
  '2026-06-26'::date,
  fa.id,
  'Voice tired after morning calls. Tongue felt less coordinated at lunch. Logging for Jul 6 appointment.'
FROM public.focus_areas fa
WHERE lower(trim(fa.name)) = lower(trim('Cancer'))
  AND NOT EXISTS (
    SELECT 1 FROM public.daily_entries d
    WHERE d.entry_date = '2026-06-26'::date AND d.focus_area_id = fa.id
  );
