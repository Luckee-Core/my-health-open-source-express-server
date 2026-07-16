import type { Pool } from 'pg';
import { upsertAllergyBySourceKey } from '../../data/allergies';
import { upsertAppointmentBySourceKey } from '../../data/appointments';
import { upsertClinicalNoteBySourceKey } from '../../data/clinical-notes';
import { upsertClinicalResultBySourceKey } from '../../data/clinical-results';
import { upsertConditionBySourceKey } from '../../data/conditions';
import { upsertDoctorBySourceKey } from '../../data/doctors';
import {
  clearHealthImportDraft,
  getHealthImportDraftJson,
  markHealthImportCommitted,
  updateHealthImportById,
  type HealthImport,
} from '../../data/health-imports';
import { upsertHospitalBySourceKey } from '../../data/hospitals';
import { upsertInsuranceCoverageBySourceKey } from '../../data/insurance-coverages';
import { upsertMedicalHistoryEventBySourceKey } from '../../data/medical-history-events';
import { upsertMedicationBySourceKey } from '../../data/medications';
import { upsertReferralBySourceKey } from '../../data/referrals';
import { upsertSpecialtyBySourceKey } from '../../data/specialties';
import { upsertSymptomLogBySourceKey } from '../../data/symptom-logs';
import { upsertVitalSignBySourceKey } from '../../data/vital-signs';
import { buildHealthImportSummary } from './parse';
import { SOURCE_SYSTEM, type HealthImportFullDraft } from './types';

export type CommitHealthImportResult = {
  import: HealthImport;
  counts: Record<string, number>;
};

const isFullDraft = (value: unknown): value is HealthImportFullDraft => {
  if (!value || typeof value !== 'object') return false;
  const draft = value as HealthImportFullDraft;
  return Array.isArray(draft.hospitals) && Array.isArray(draft.allergies);
};

/**
 * Commits a previewed health import draft into clinical tables inside one transaction.
 */
export const processCommitHealthImport = async (
  pool: Pool,
  previewId: string,
): Promise<CommitHealthImportResult> => {
  console.log(`🚀 processCommitHealthImport: ${previewId}`);
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const draftJson = await getHealthImportDraftJson(client, previewId);
    if (!isFullDraft(draftJson)) {
      throw new Error('already committed or not found');
    }

    const summary = buildHealthImportSummary(draftJson);
    const marked = await markHealthImportCommitted(
      client,
      previewId,
      summary as unknown as Record<string, unknown>,
    );
    if (!marked) {
      throw new Error('already committed or not found');
    }

    const hospitalIdByName = new Map<string, string>();
    const specialtyIdByName = new Map<string, string>();
    const doctorIdByName = new Map<string, string>();

    for (const hospital of draftJson.hospitals) {
      const row = await upsertHospitalBySourceKey(client, {
        name: hospital.name,
        address: hospital.address,
        phone: hospital.phone,
        notes: hospital.notes,
        source_system: SOURCE_SYSTEM,
        source_document_id: hospital.source_document_id,
        source_entry_key: hospital.source_entry_key,
      });
      hospitalIdByName.set(hospital.name.trim().toLowerCase(), row.id);
    }

    for (const specialty of draftJson.specialties) {
      const row = await upsertSpecialtyBySourceKey(client, {
        name: specialty.name,
        source_system: SOURCE_SYSTEM,
        source_document_id: specialty.source_document_id,
        source_entry_key: specialty.source_entry_key,
      });
      specialtyIdByName.set(specialty.name.trim().toLowerCase(), row.id);
    }

    // Ensure fallbacks for appointments missing doctor/specialty/hospital
    const unknownHospital = await upsertHospitalBySourceKey(client, {
      name: 'Unknown Hospital',
      source_system: SOURCE_SYSTEM,
      source_document_id: previewId,
      source_entry_key: 'hospital:unknown-hospital',
    });
    hospitalIdByName.set('unknown hospital', unknownHospital.id);

    const unspecifiedSpecialty = await upsertSpecialtyBySourceKey(client, {
      name: 'Unspecified',
      source_system: SOURCE_SYSTEM,
      source_document_id: previewId,
      source_entry_key: 'specialty:unspecified',
    });
    specialtyIdByName.set('unspecified', unspecifiedSpecialty.id);

    const unknownProvider = await upsertDoctorBySourceKey(client, {
      name: 'Unknown Provider',
      hospital_id: unknownHospital.id,
      specialty_id: unspecifiedSpecialty.id,
      source_system: SOURCE_SYSTEM,
      source_document_id: previewId,
      source_entry_key: 'doctor:unknown-provider',
    });
    doctorIdByName.set('unknown provider', unknownProvider.id);

    for (const doctor of draftJson.doctors) {
      const hospitalId =
        hospitalIdByName.get(doctor.hospitalName.trim().toLowerCase()) ??
        unknownHospital.id;
      const specialtyId =
        specialtyIdByName.get(doctor.specialtyName.trim().toLowerCase()) ??
        unspecifiedSpecialty.id;
      const row = await upsertDoctorBySourceKey(client, {
        name: doctor.name,
        hospital_id: hospitalId,
        specialty_id: specialtyId,
        npi: doctor.npi,
        phone: doctor.phone,
        fax: doctor.fax,
        source_system: SOURCE_SYSTEM,
        source_document_id: doctor.source_document_id,
        source_entry_key: doctor.source_entry_key,
      });
      doctorIdByName.set(doctor.name.trim().toLowerCase(), row.id);
    }

    for (const appointment of draftJson.appointments) {
      const doctorName = appointment.doctorName?.trim().toLowerCase();
      const doctorId =
        (doctorName ? doctorIdByName.get(doctorName) : undefined) ?? unknownProvider.id;
      await upsertAppointmentBySourceKey(client, {
        doctor_id: doctorId,
        scheduled_at: appointment.scheduledAt,
        status: appointment.status,
        appointment_type: appointment.appointmentType,
        reason: appointment.reason,
        notes: appointment.notes,
        source_system: SOURCE_SYSTEM,
        source_document_id: appointment.source_document_id,
        source_entry_key: appointment.source_entry_key,
      });
    }

    for (const allergy of draftJson.allergies) {
      await upsertAllergyBySourceKey(client, {
        substance: allergy.substance,
        reaction: allergy.reaction,
        criticality: allergy.criticality,
        status: allergy.status,
        notes: allergy.notes,
        source_system: SOURCE_SYSTEM,
        source_document_id: allergy.source_document_id,
        source_entry_key: allergy.source_entry_key,
      });
    }

    for (const medication of draftJson.medications) {
      await upsertMedicationBySourceKey(client, {
        name: medication.name,
        instructions: medication.instructions,
        started_on: medication.started_on,
        status: medication.status,
        notes: medication.notes,
        source_system: SOURCE_SYSTEM,
        source_document_id: medication.source_document_id,
        source_entry_key: medication.source_entry_key,
      });
    }

    for (const condition of draftJson.conditions) {
      await upsertConditionBySourceKey(client, {
        name: condition.name,
        status: condition.status,
        noted_on: condition.noted_on,
        diagnosed_on: condition.diagnosed_on,
        notes: condition.notes,
        source_system: SOURCE_SYSTEM,
        source_document_id: condition.source_document_id,
        source_entry_key: condition.source_entry_key,
      });
    }

    for (const vital of draftJson.vitalSigns) {
      await upsertVitalSignBySourceKey(client, {
        recorded_at: vital.recorded_at,
        metric: vital.metric,
        value_text: vital.value_text,
        numeric_value: vital.numeric_value,
        unit: vital.unit,
        source_system: SOURCE_SYSTEM,
        source_document_id: vital.source_document_id,
        source_entry_key: vital.source_entry_key,
      });
    }

    for (const result of draftJson.clinicalResults) {
      await upsertClinicalResultBySourceKey(client, {
        observed_at: result.observed_at,
        name: result.name,
        value_text: result.value_text,
        unit: result.unit,
        interpretation: result.interpretation,
        category: result.category,
        source_system: SOURCE_SYSTEM,
        source_document_id: result.source_document_id,
        source_entry_key: result.source_entry_key,
      });
    }

    for (const note of draftJson.clinicalNotes) {
      await upsertClinicalNoteBySourceKey(client, {
        note_at: note.note_at,
        title: note.title,
        author_name: note.author_name,
        body: note.body,
        source_system: SOURCE_SYSTEM,
        source_document_id: note.source_document_id,
        source_entry_key: note.source_entry_key,
      });
    }

    for (const referral of draftJson.referrals) {
      await upsertReferralBySourceKey(client, {
        referred_on: referral.referred_on,
        specialty: referral.specialty,
        reason: referral.reason,
        status: referral.status,
        notes: referral.notes,
        source_system: SOURCE_SYSTEM,
        source_document_id: referral.source_document_id,
        source_entry_key: referral.source_entry_key,
      });
    }

    for (const coverage of draftJson.insuranceCoverages) {
      await upsertInsuranceCoverageBySourceKey(client, {
        payer_name: coverage.payer_name,
        member_id: coverage.member_id,
        group_number: coverage.group_number,
        plan_name: coverage.plan_name,
        status: coverage.status,
        source_system: SOURCE_SYSTEM,
        source_document_id: coverage.source_document_id,
        source_entry_key: coverage.source_entry_key,
      });
    }

    for (const event of draftJson.medicalHistoryEvents) {
      await upsertMedicalHistoryEventBySourceKey(client, {
        event_date: event.event_date,
        title: event.title,
        category: event.category,
        description: event.description,
        source_system: SOURCE_SYSTEM,
        source_document_id: event.source_document_id,
        source_entry_key: event.source_entry_key,
      });
    }

    for (const symptom of draftJson.symptomLogs) {
      await upsertSymptomLogBySourceKey(client, {
        recorded_at: symptom.recorded_at,
        name: symptom.name,
        notes: symptom.notes,
        source_system: SOURCE_SYSTEM,
        source_document_id: symptom.source_document_id,
        source_entry_key: symptom.source_entry_key,
      });
    }

    await clearHealthImportDraft(client, previewId);
    await client.query('COMMIT');

    console.log(`✅ processCommitHealthImport: ${previewId}`);
    return {
      import: marked,
      counts: summary.counts,
    };
  } catch (error) {
    await client.query('ROLLBACK');
    const message = error instanceof Error ? error.message : String(error);
    try {
      await updateHealthImportById(pool, previewId, {
        status: 'failed',
        error: message,
      });
    } catch (updateError) {
      console.error('❌ Failed to mark health import as failed:', updateError);
    }
    throw error;
  } finally {
    client.release();
  }
};
