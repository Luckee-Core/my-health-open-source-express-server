import type {
  HealthImportFullDraft,
  HealthImportSummary,
} from '../types';

const emptyDraft = (): HealthImportFullDraft => ({
  hospitals: [],
  specialties: [],
  doctors: [],
  appointments: [],
  allergies: [],
  medications: [],
  conditions: [],
  vitalSigns: [],
  clinicalResults: [],
  clinicalNotes: [],
  referrals: [],
  insuranceCoverages: [],
  medicalHistoryEvents: [],
  symptomLogs: [],
});

const mergeByKey = <T extends { source_entry_key: string }>(target: T[], incoming: T[]): void => {
  const index = new Map(target.map((item, i) => [item.source_entry_key, i]));
  for (const item of incoming) {
    const existing = index.get(item.source_entry_key);
    if (existing == null) {
      index.set(item.source_entry_key, target.length);
      target.push(item);
    } else {
      target[existing] = item;
    }
  }
};

/**
 * Builds a client-facing summary (counts + bounded samples) from a full draft.
 */
export const buildHealthImportSummary = (draft: HealthImportFullDraft): HealthImportSummary => {
  const sample = <T>(items: T[], n = 10): T[] => items.slice(0, n);
  return {
    counts: {
      hospitals: draft.hospitals.length,
      specialties: draft.specialties.length,
      doctors: draft.doctors.length,
      appointments: draft.appointments.length,
      allergies: draft.allergies.length,
      medications: draft.medications.length,
      conditions: draft.conditions.length,
      vitalSigns: draft.vitalSigns.length,
      clinicalResults: draft.clinicalResults.length,
      clinicalNotes: draft.clinicalNotes.length,
      referrals: draft.referrals.length,
      insuranceCoverages: draft.insuranceCoverages.length,
      medicalHistoryEvents: draft.medicalHistoryEvents.length,
      symptomLogs: draft.symptomLogs.length,
    },
    samples: {
      allergies: sample(draft.allergies).map((a) => ({
        substance: a.substance,
        reaction: a.reaction,
      })),
      medications: sample(draft.medications).map((m) => ({
        name: m.name,
        started_on: m.started_on,
      })),
      conditions: sample(draft.conditions).map((c) => ({
        name: c.name,
        noted_on: c.noted_on,
      })),
      doctors: sample(draft.doctors).map((d) => ({
        name: d.name,
        specialtyName: d.specialtyName,
      })),
      appointments: sample(draft.appointments).map((a) => ({
        scheduledAt: a.scheduledAt,
        appointmentType: a.appointmentType,
        doctorName: a.doctorName,
      })),
      vitalSigns: sample(draft.vitalSigns, 10).map((v) => ({
        metric: v.metric,
        value_text: v.value_text,
        recorded_at: v.recorded_at,
      })),
      clinicalResults: sample(draft.clinicalResults, 10).map((r) => ({
        name: r.name,
        observed_at: r.observed_at,
        category: r.category,
      })),
      clinicalNoteTitles: sample(draft.clinicalNotes, 10).map((n) => n.title),
      referrals: sample(draft.referrals).map((r) => ({
        specialty: r.specialty,
        status: r.status,
      })),
      insuranceCoverages: sample(draft.insuranceCoverages).map((i) => ({
        payer_name: i.payer_name,
        plan_name: i.plan_name,
      })),
      medicalHistoryEvents: sample(draft.medicalHistoryEvents).map((e) => ({
        title: e.title,
        category: e.category,
        event_date: e.event_date,
      })),
      symptomLogs: sample(draft.symptomLogs).map((s) => ({
        name: s.name,
        recorded_at: s.recorded_at,
      })),
    },
  };
};

/**
 * Merges per-document drafts (DOC0001 + DOC0002 + …); last write wins on source_entry_key.
 */
export const buildImportDraft = (
  drafts: HealthImportFullDraft[],
): { fullDraft: HealthImportFullDraft; summary: HealthImportSummary } => {
  console.log(`🚀 buildImportDraft: ${drafts.length} document draft(s)`);
  const fullDraft = emptyDraft();
  for (const draft of drafts) {
    mergeByKey(fullDraft.hospitals, draft.hospitals);
    mergeByKey(fullDraft.specialties, draft.specialties);
    mergeByKey(fullDraft.doctors, draft.doctors);
    mergeByKey(fullDraft.appointments, draft.appointments);
    mergeByKey(fullDraft.allergies, draft.allergies);
    mergeByKey(fullDraft.medications, draft.medications);
    mergeByKey(fullDraft.conditions, draft.conditions);
    mergeByKey(fullDraft.vitalSigns, draft.vitalSigns);
    mergeByKey(fullDraft.clinicalResults, draft.clinicalResults);
    mergeByKey(fullDraft.clinicalNotes, draft.clinicalNotes);
    mergeByKey(fullDraft.referrals, draft.referrals);
    mergeByKey(fullDraft.insuranceCoverages, draft.insuranceCoverages);
    mergeByKey(fullDraft.medicalHistoryEvents, draft.medicalHistoryEvents);
    mergeByKey(fullDraft.symptomLogs, draft.symptomLogs);
  }
  const summary = buildHealthImportSummary(fullDraft);
  console.log('✅ buildImportDraft');
  return { fullDraft, summary };
};
