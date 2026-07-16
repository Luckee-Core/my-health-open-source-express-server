export const SOURCE_SYSTEM = 'jefferson_ccda' as const;

type DraftProvenance = {
  source_entry_key: string;
  source_document_id: string;
};

export type DraftHospital = DraftProvenance & {
  name: string;
  address?: string | null;
  phone?: string | null;
  notes?: string | null;
};

export type DraftSpecialty = DraftProvenance & {
  name: string;
};

export type DraftDoctor = DraftProvenance & {
  name: string;
  hospitalName: string;
  specialtyName: string;
  npi?: string | null;
  phone?: string | null;
  fax?: string | null;
  hospitalAddress?: string | null;
};

export type DraftAppointment = DraftProvenance & {
  scheduledAt: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  appointmentType?: string | null;
  reason?: string | null;
  notes?: string | null;
  doctorName?: string | null;
  hospitalName?: string | null;
  specialtyName?: string | null;
};

export type DraftAllergy = DraftProvenance & {
  substance: string;
  reaction?: string | null;
  criticality?: string | null;
  status?: 'active' | 'inactive';
  notes?: string | null;
};

export type DraftMedication = DraftProvenance & {
  name: string;
  instructions?: string | null;
  started_on?: string | null;
  status?: 'active' | 'stopped';
  notes?: string | null;
};

export type DraftCondition = DraftProvenance & {
  name: string;
  status?: 'active' | 'resolved';
  noted_on?: string | null;
  diagnosed_on?: string | null;
  notes?: string | null;
};

export type DraftVitalSign = DraftProvenance & {
  recorded_at: string;
  metric: string;
  value_text: string;
  numeric_value?: number | null;
  unit?: string | null;
};

export type DraftClinicalResult = DraftProvenance & {
  observed_at?: string | null;
  name: string;
  value_text?: string | null;
  unit?: string | null;
  interpretation?: string | null;
  category?: 'lab' | 'imaging' | 'other';
};

export type DraftClinicalNote = DraftProvenance & {
  note_at: string;
  title: string;
  author_name?: string | null;
  body: string;
};

export type DraftReferral = DraftProvenance & {
  referred_on?: string | null;
  specialty?: string | null;
  reason?: string | null;
  status?: string | null;
  notes?: string | null;
};

export type DraftInsuranceCoverage = DraftProvenance & {
  payer_name: string;
  member_id?: string | null;
  group_number?: string | null;
  plan_name?: string | null;
  status?: string | null;
};

export type DraftMedicalHistoryEvent = DraftProvenance & {
  event_date: string;
  title: string;
  category?: 'diagnosis' | 'surgery' | 'radiation' | 'imaging' | 'milestone' | 'other';
  description?: string | null;
};

export type DraftSymptomLog = DraftProvenance & {
  recorded_at?: string;
  name: string;
  notes?: string | null;
};

export type HealthImportFullDraft = {
  hospitals: DraftHospital[];
  specialties: DraftSpecialty[];
  doctors: DraftDoctor[];
  appointments: DraftAppointment[];
  allergies: DraftAllergy[];
  medications: DraftMedication[];
  conditions: DraftCondition[];
  vitalSigns: DraftVitalSign[];
  clinicalResults: DraftClinicalResult[];
  clinicalNotes: DraftClinicalNote[];
  referrals: DraftReferral[];
  insuranceCoverages: DraftInsuranceCoverage[];
  medicalHistoryEvents: DraftMedicalHistoryEvent[];
  symptomLogs: DraftSymptomLog[];
};

export type HealthImportSummary = {
  counts: {
    hospitals: number;
    specialties: number;
    doctors: number;
    appointments: number;
    allergies: number;
    medications: number;
    conditions: number;
    vitalSigns: number;
    clinicalResults: number;
    clinicalNotes: number;
    referrals: number;
    insuranceCoverages: number;
    medicalHistoryEvents: number;
    symptomLogs: number;
  };
  samples: {
    allergies: Array<{ substance: string; reaction?: string | null }>;
    medications: Array<{ name: string; started_on?: string | null }>;
    conditions: Array<{ name: string; noted_on?: string | null }>;
    doctors: Array<{ name: string; specialtyName: string }>;
    appointments: Array<{ scheduledAt: string; appointmentType?: string | null; doctorName?: string | null }>;
    vitalSigns: Array<{ metric: string; value_text: string; recorded_at: string }>;
    clinicalResults: Array<{ name: string; observed_at?: string | null; category?: string }>;
    clinicalNoteTitles: string[];
    referrals: Array<{ specialty?: string | null; status?: string | null }>;
    insuranceCoverages: Array<{ payer_name: string; plan_name?: string | null }>;
    medicalHistoryEvents: Array<{ title: string; category?: string; event_date: string }>;
    symptomLogs: Array<{ name: string; recorded_at?: string }>;
  };
};

export type ParsedCcdaDocument = {
  documentId: string;
  draft: HealthImportFullDraft;
};

export type ParseCcdaPackageResult = {
  fullDraft: HealthImportFullDraft;
  summary: HealthImportSummary;
  documentCount: number;
  contentSha256: string;
};
