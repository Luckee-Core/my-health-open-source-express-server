import { XMLParser } from 'fast-xml-parser';
import { computeSourceEntryKey } from './compute-source-entry-key';
import { isSymptomLabel } from './is-symptom-label';
import type {
  DraftAllergy,
  DraftAppointment,
  DraftClinicalNote,
  DraftClinicalResult,
  DraftCondition,
  DraftDoctor,
  DraftHospital,
  DraftInsuranceCoverage,
  DraftMedicalHistoryEvent,
  DraftMedication,
  DraftReferral,
  DraftSpecialty,
  DraftSymptomLog,
  DraftVitalSign,
  HealthImportFullDraft,
  ParsedCcdaDocument,
} from '../types';

type XmlNode = Record<string, unknown>;

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

const asArray = <T>(value: T | T[] | undefined | null): T[] => {
  if (value == null) return [];
  return Array.isArray(value) ? value : [value];
};

const isObject = (value: unknown): value is XmlNode =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

/**
 * Collects concatenated text content from nested CDA narrative nodes.
 */
export const flattenText = (node: unknown): string => {
  if (node == null) return '';
  if (typeof node === 'string' || typeof node === 'number' || typeof node === 'boolean') {
    return String(node);
  }
  if (Array.isArray(node)) {
    return node.map(flattenText).filter(Boolean).join(' ');
  }
  if (!isObject(node)) return '';

  const parts: string[] = [];
  for (const [key, value] of Object.entries(node)) {
    if (key.startsWith('@_')) continue;
    if (key === '#text' || key === 'br') {
      parts.push(flattenText(value));
      continue;
    }
    parts.push(flattenText(value));
  }
  return parts.join(' ').replace(/\s+/g, ' ').trim();
};

const attr = (node: unknown, name: string): string | undefined => {
  if (!isObject(node)) return undefined;
  const value = node[`@_${name}`];
  return typeof value === 'string' ? value : undefined;
};

const parseUsDateToIso = (raw: string | null | undefined): string | null => {
  if (!raw) return null;
  const cleaned = raw.trim();
  if (!cleaned || cleaned === '-' || /^null$/i.test(cleaned)) return null;

  // HL7 TS: YYYYMMDD[HHMMSS][.sss][+/-ZZZZ]
  const hl7 = cleaned.match(
    /^(\d{4})(\d{2})(\d{2})(?:(\d{2})(\d{2})(\d{2})(?:\.\d+)?)?(?:([+-]\d{2})(\d{2}))?/,
  );
  if (hl7) {
    const [, y, mo, d, h = '12', mi = '00', s = '00', tzh, tzm] = hl7;
    const offset = tzh && tzm ? `${tzh}:${tzm}` : 'Z';
    return `${y}-${mo}-${d}T${h}:${mi}:${s}${offset}`;
  }

  // MM/DD/YYYY [h:mm AM/PM TZ]
  const mdy = cleaned.match(
    /^(\d{1,2})\/(\d{1,2})\/(\d{2,4})(?:\s+(\d{1,2}):(\d{2})\s*(AM|PM)?(?:\s+[A-Z]{2,4})?)?/i,
  );
  if (mdy) {
    let year = Number(mdy[3]);
    if (year < 100) year += 2000;
    const month = Number(mdy[1]);
    const day = Number(mdy[2]);
    let hour = mdy[4] != null ? Number(mdy[4]) : 12;
    const minute = mdy[5] != null ? Number(mdy[5]) : 0;
    const ampm = mdy[6]?.toUpperCase();
    if (ampm === 'PM' && hour < 12) hour += 12;
    if (ampm === 'AM' && hour === 12) hour = 0;
    const dateOnly = mdy[4] == null;
    if (dateOnly) {
      return `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    }
    return new Date(
      Date.UTC(year, month - 1, day, hour, minute, 0),
    ).toISOString();
  }

  // Range start: take left side before " - "
  if (cleaned.includes(' - ')) {
    return parseUsDateToIso(cleaned.split(' - ')[0]);
  }

  const asDate = new Date(cleaned);
  if (!Number.isNaN(asDate.getTime())) return asDate.toISOString();
  return null;
};

const toDateOnly = (isoOrDate: string | null): string | null => {
  if (!isoOrDate) return null;
  const m = isoOrDate.match(/^(\d{4}-\d{2}-\d{2})/);
  return m ? m[1] : null;
};

const mapVitalMetric = (label: string): string => {
  const t = label.toLowerCase();
  if (t.includes('blood pressure')) return 'blood_pressure';
  if (t.includes('pulse') || t.includes('heart rate')) return 'pulse';
  if (t.includes('temperature')) return 'temperature';
  if (t.includes('respiratory')) return 'respiratory_rate';
  if (t.includes('oxygen saturation') || t.includes('spo2')) return 'oxygen_saturation';
  if (t.includes('weight')) return 'weight';
  if (t.includes('height')) return 'height';
  if (t.includes('body mass') || t === 'bmi') return 'bmi';
  return 'other';
};

const parseNumeric = (valueText: string): number | null => {
  const m = valueText.replace(/,/g, '').match(/-?\d+(\.\d+)?/);
  return m ? Number(m[0]) : null;
};

const tableRows = (textNode: unknown): string[][] => {
  if (!isObject(textNode)) return [];
  const tables = asArray(textNode.table);
  const rows: string[][] = [];
  for (const table of tables) {
    if (!isObject(table)) continue;
    const body = isObject(table.tbody) ? table.tbody : table;
    for (const tr of asArray((body as XmlNode).tr)) {
      if (!isObject(tr)) continue;
      const cells = asArray(tr.td).map((td) => flattenText(td));
      if (cells.some((c) => c.length > 0)) rows.push(cells);
    }
  }
  return rows;
};

const listItems = (textNode: unknown): XmlNode[] => {
  if (!isObject(textNode)) return [];
  const lists = asArray(textNode.list);
  const items: XmlNode[] = [];
  for (const list of lists) {
    if (!isObject(list)) continue;
    for (const item of asArray(list.item)) {
      if (isObject(item)) items.push(item);
    }
  }
  return items;
};

const collectSections = (node: unknown, out: XmlNode[] = []): XmlNode[] => {
  if (Array.isArray(node)) {
    for (const child of node) collectSections(child, out);
    return out;
  }
  if (!isObject(node)) return out;
  if (node.section) {
    for (const section of asArray(node.section)) {
      if (isObject(section)) {
        out.push(section);
        collectSections(section, out);
      }
    }
  }
  for (const [key, value] of Object.entries(node)) {
    if (key.startsWith('@_') || key === 'section') continue;
    collectSections(value, out);
  }
  return out;
};

const sectionTitle = (section: XmlNode): string => flattenText(section.title);

const findSectionsByTitle = (sections: XmlNode[], ...titles: string[]): XmlNode[] => {
  const wanted = new Set(titles.map((t) => t.toLowerCase()));
  return sections.filter((section) => wanted.has(sectionTitle(section).toLowerCase()));
};

const personName = (nameNode: unknown): string => {
  if (!nameNode) return '';
  if (typeof nameNode === 'string') return nameNode.trim();
  if (!isObject(nameNode)) return flattenText(nameNode);
  const given = asArray(nameNode.given).map(flattenText).filter(Boolean).join(' ');
  const family = flattenText(nameNode.family);
  const suffix = flattenText(nameNode.suffix);
  return [given, family, suffix].filter(Boolean).join(' ').replace(/\s+/g, ' ').trim();
};

const telecomValue = (telecom: unknown, prefix: 'tel:' | 'fax:'): string | null => {
  for (const node of asArray(telecom)) {
    const value = attr(node, 'value') ?? '';
    if (value.toLowerCase().startsWith(prefix)) {
      return value.slice(prefix.length).replace(/^\+1-?/, '');
    }
  }
  return null;
};

const addressLines = (addr: unknown): string | null => {
  if (!addr) return null;
  const node = asArray(addr)[0];
  if (!isObject(node)) return flattenText(addr) || null;
  const street = asArray(node.streetAddressLine).map(flattenText).filter(Boolean).join(', ');
  const city = flattenText(node.city);
  const state = flattenText(node.state);
  const zip = flattenText(node.postalCode);
  const line = [street, [city, state].filter(Boolean).join(', '), zip].filter(Boolean).join(', ');
  return line || null;
};

const ensureHospital = (
  draft: HealthImportFullDraft,
  documentId: string,
  name: string,
  address?: string | null,
  phone?: string | null,
): void => {
  const trimmed = name.trim();
  if (!trimmed) return;
  const key = computeSourceEntryKey('hospital', trimmed);
  if (draft.hospitals.some((h) => h.source_entry_key === key)) {
    const existing = draft.hospitals.find((h) => h.source_entry_key === key)!;
    if (!existing.address && address) existing.address = address;
    if (!existing.phone && phone) existing.phone = phone;
    return;
  }
  const hospital: DraftHospital = {
    source_entry_key: key,
    source_document_id: documentId,
    name: trimmed,
    address: address ?? null,
    phone: phone ?? null,
  };
  draft.hospitals.push(hospital);
};

const ensureSpecialty = (draft: HealthImportFullDraft, documentId: string, name: string): void => {
  const trimmed = name.trim() || 'Unspecified';
  const key = computeSourceEntryKey('specialty', trimmed);
  if (draft.specialties.some((s) => s.source_entry_key === key)) return;
  const specialty: DraftSpecialty = {
    source_entry_key: key,
    source_document_id: documentId,
    name: trimmed,
  };
  draft.specialties.push(specialty);
};

const ensureDoctor = (
  draft: HealthImportFullDraft,
  documentId: string,
  doctor: Omit<DraftDoctor, 'source_entry_key' | 'source_document_id'> & {
    source_entry_key?: string;
  },
): void => {
  const name = doctor.name.trim();
  if (!name || /^no pcp$/i.test(name)) return;
  const hospitalName = doctor.hospitalName.trim() || 'Unknown Hospital';
  const specialtyName = doctor.specialtyName.trim() || 'Unspecified';
  ensureHospital(draft, documentId, hospitalName, doctor.hospitalAddress);
  ensureSpecialty(draft, documentId, specialtyName);
  const key =
    doctor.source_entry_key ??
    computeSourceEntryKey('doctor', doctor.npi || name, specialtyName);
  if (draft.doctors.some((d) => d.source_entry_key === key)) return;
  draft.doctors.push({
    source_entry_key: key,
    source_document_id: documentId,
    name,
    hospitalName,
    specialtyName,
    npi: doctor.npi ?? null,
    phone: doctor.phone ?? null,
    fax: doctor.fax ?? null,
    hospitalAddress: doctor.hospitalAddress ?? null,
  });
};

const parseAllergies = (sections: XmlNode[], documentId: string): DraftAllergy[] => {
  const out: DraftAllergy[] = [];
  for (const section of findSectionsByTitle(sections, 'Allergies')) {
    for (const item of listItems(section.text)) {
      const contents = asArray(item.content);
      const substance =
        flattenText(contents[0] ?? contents) || flattenText(item).split('(')[0];
      const reaction = flattenText(contents[1]) || null;
      const criticality = flattenText(contents[2]) || null;
      const substanceClean = substance.trim();
      if (!substanceClean) continue;
      out.push({
        source_entry_key: computeSourceEntryKey('allergy', substanceClean),
        source_document_id: documentId,
        substance: substanceClean,
        reaction: reaction || null,
        criticality: criticality || null,
        status: 'active',
      });
    }
  }
  return out;
};

const parseMedications = (sections: XmlNode[], documentId: string): DraftMedication[] => {
  const out: DraftMedication[] = [];
  const titles = ['Medications', 'Medications at Time of Discharge', 'Ordered Prescriptions', 'Administered Medications'];
  for (const section of findSectionsByTitle(sections, ...titles)) {
    for (const item of listItems(section.text)) {
      const name = flattenText(asArray(item.content)[0] ?? item.content);
      if (!name) continue;
      const full = flattenText(item);
      const started = full.match(/\(Started\s+([^)]+)\)/i)?.[1] ?? null;
      const instructions = flattenText(item.paragraph) || null;
      out.push({
        source_entry_key: computeSourceEntryKey('medication', name, started ?? ''),
        source_document_id: documentId,
        name,
        instructions,
        started_on: toDateOnly(parseUsDateToIso(started)),
        status: 'active',
      });
    }
  }
  return out;
};

const parseConditions = (sections: XmlNode[], documentId: string): DraftCondition[] => {
  const out: DraftCondition[] = [];
  for (const section of findSectionsByTitle(sections, 'Active Problems')) {
    for (const row of tableRows(section.text)) {
      const name = row[0]?.trim();
      if (!name) continue;
      out.push({
        source_entry_key: computeSourceEntryKey('condition', name),
        source_document_id: documentId,
        name,
        status: 'active',
        noted_on: toDateOnly(parseUsDateToIso(row[1])),
        diagnosed_on: toDateOnly(parseUsDateToIso(row[2])),
      });
    }
  }
  return out;
};

const normalizeVitalValue = (label: string, value: string): string => {
  if (/blood pressure/i.test(label)) {
    const nums = value.match(/\d+/g);
    if (nums && nums.length >= 2) return `${nums[0]}/${nums[1]}`;
  }
  return value.replace(/\s+/g, ' ').trim();
};

const parseVitals = (sections: XmlNode[], documentId: string): DraftVitalSign[] => {
  const out: DraftVitalSign[] = [];
  for (const section of findSectionsByTitle(sections, 'Last Filed Vital Signs')) {
    for (const row of tableRows(section.text)) {
      const label = row[0]?.trim();
      const rawValue = row[1]?.trim();
      const when = row[2]?.trim();
      if (!label || !rawValue || rawValue === '-') continue;
      const value = normalizeVitalValue(label, rawValue);
      const recorded = parseUsDateToIso(when) ?? new Date().toISOString();
      const metric = mapVitalMetric(label);
      out.push({
        source_entry_key: computeSourceEntryKey('vital', metric, recorded, value),
        source_document_id: documentId,
        recorded_at: recorded,
        metric,
        value_text: value,
        numeric_value: metric === 'blood_pressure' ? null : parseNumeric(value),
        unit: value.match(/[a-zA-Z%°/[\]]+/)?.[0] ?? null,
      });
    }
  }
  return out;
};

const parseResults = (
  sections: XmlNode[],
  documentId: string,
): { results: DraftClinicalResult[]; history: DraftMedicalHistoryEvent[] } => {
  const results: DraftClinicalResult[] = [];
  const history: DraftMedicalHistoryEvent[] = [];
  for (const section of findSectionsByTitle(sections, 'Results')) {
    if (!isObject(section.text)) continue;
    for (const item of listItems(section.text)) {
      const caption = flattenText(item.caption);
      if (!caption) continue;
      const dateMatch = caption.match(/\(([^)]+)\)\s*$/);
      const observed = parseUsDateToIso(dateMatch?.[1] ?? null);
      const name = caption.replace(/\s*\([^)]*\)\s*$/, '').trim();
      const lower = name.toLowerCase();
      const category: 'lab' | 'imaging' | 'other' =
        /mri|ct |x-ray|ultrasound|imaging|pet /i.test(lower) ? 'imaging' : 'lab';
      const impression = flattenText(
        (isObject(item) &&
          asArray(item.table)
            .map((table) => {
              if (!isObject(table)) return '';
              const header = flattenText(table.thead);
              if (/impression/i.test(header)) return flattenText(table.tbody);
              return '';
            })
            .find((t) => t)) ||
          '',
      );
      results.push({
        source_entry_key: computeSourceEntryKey('result', name, observed ?? ''),
        source_document_id: documentId,
        name,
        observed_at: observed,
        value_text: impression || null,
        category,
        interpretation: null,
      });
      if (category === 'imaging' && observed) {
        history.push({
          source_entry_key: computeSourceEntryKey('history-imaging', name, observed),
          source_document_id: documentId,
          event_date: toDateOnly(observed) ?? observed.slice(0, 10),
          title: name,
          category: 'imaging',
          description: impression || null,
        });
      }
    }
  }
  return { results, history };
};

const cellParagraphs = (td: unknown): string[] => {
  if (!isObject(td)) {
    const text = flattenText(td);
    return text ? [text] : [];
  }
  const paragraphs = asArray(td.paragraph).map(flattenText).filter(Boolean);
  if (paragraphs.length > 0) return paragraphs;
  const text = flattenText(td);
  return text ? [text] : [];
};

const parseCareTeamIntoDraft = (
  draft: HealthImportFullDraft,
  sections: XmlNode[],
  documentId: string,
  defaultHospital: string,
): void => {
  for (const section of findSectionsByTitle(sections, 'Care Teams')) {
    if (!isObject(section.text)) continue;
    for (const table of asArray(section.text.table)) {
      if (!isObject(table)) continue;
      const body = isObject(table.tbody) ? table.tbody : table;
      for (const tr of asArray((body as XmlNode).tr)) {
        if (!isObject(tr)) continue;
        const tds = asArray(tr.td);
        const memberParas = cellParagraphs(tds[0]);
        const specialty = flattenText(tds[2]).trim() || 'Unspecified';
        const name = (memberParas[0] ?? '').trim();
        if (!name || /^no pcp$/i.test(name)) continue;
        const rest = memberParas.slice(1).join(' ');
        const npi = rest.match(/NPI:\s*(\d+)/i)?.[1] ?? null;
        const phone = rest.match(/(\d{3}[-.]?\d{3}[-.]?\d{4})\s*\(Work\)/i)?.[1] ?? null;
        const fax = rest.match(/(\d{3}[-.]?\d{3}[-.]?\d{4})\s*\(Fax\)/i)?.[1] ?? null;
        const hospitalAddress =
          memberParas
            .slice(1)
            .filter((p) => !/^NPI:/i.test(p) && !/\(Work\)|\(Fax\)/i.test(p))
            .join(', ') || null;
        ensureDoctor(draft, documentId, {
          name,
          hospitalName: defaultHospital,
          specialtyName: specialty,
          npi,
          phone,
          fax,
          hospitalAddress,
        });
      }
    }
  }
};

const parseEncounters = (
  draft: HealthImportFullDraft,
  sections: XmlNode[],
  documentId: string,
): void => {
  for (const section of findSectionsByTitle(sections, 'Encounters', 'Encounter Details')) {
    if (!isObject(section.text)) continue;
    for (const table of asArray(section.text.table)) {
      if (!isObject(table)) continue;
      const body = isObject(table.tbody) ? table.tbody : table;
      for (const tr of asArray((body as XmlNode).tr)) {
        if (!isObject(tr)) continue;
        const tds = asArray(tr.td);
        const whenRaw = flattenText(tds[0]).trim();
        const type = flattenText(tds[1]).trim() || null;
        const deptParas = cellParagraphs(tds[2]);
        const careParas = cellParagraphs(tds[3]);
        const description = flattenText(tds[4]).trim() || null;
        const scheduledAt = parseUsDateToIso(whenRaw);
        if (!scheduledAt) continue;

        const hospitalName = (deptParas[0] ?? '').trim() || 'Unknown Hospital';
        const phone =
          deptParas.map((p) => p.match(/(\d{3}[-.]?\d{3}[-.]?\d{4})/)?.[1]).find(Boolean) ?? null;
        const address = deptParas.slice(1).filter((p) => !/^\d{3}[-.]?\d{3}/.test(p)).join(', ') || null;
        ensureHospital(draft, documentId, hospitalName, address, phone);

        const doctorName = (careParas[0] ?? '').trim() || null;
        if (doctorName) {
          const careRest = careParas.slice(1).join(' ');
          ensureDoctor(draft, documentId, {
            name: doctorName,
            hospitalName,
            specialtyName: 'Unspecified',
            phone: careRest.match(/(\d{3}[-.]?\d{3}[-.]?\d{4})\s*\(Work\)/i)?.[1] ?? null,
            fax: careRest.match(/(\d{3}[-.]?\d{3}[-.]?\d{4})\s*\(Fax\)/i)?.[1] ?? null,
          });
        }

        const status: DraftAppointment['status'] =
          new Date(scheduledAt).getTime() < Date.now() ? 'completed' : 'scheduled';

        draft.appointments.push({
          source_entry_key: computeSourceEntryKey(
            'appointment',
            scheduledAt,
            type ?? '',
            doctorName ?? 'unknown',
            hospitalName,
          ),
          source_document_id: documentId,
          scheduledAt,
          status,
          appointmentType: type,
          reason: description && description !== '-' ? description : null,
          notes: null,
          doctorName,
          hospitalName,
          specialtyName: 'Unspecified',
        });
      }
    }
  }
};

const parseProgressNotes = (sections: XmlNode[], documentId: string): DraftClinicalNote[] => {
  const out: DraftClinicalNote[] = [];
  for (const section of findSectionsByTitle(sections, 'Progress Notes', 'Miscellaneous Notes')) {
    for (const item of listItems(section.text)) {
      const caption = flattenText(item.caption);
      const body = flattenText(item.content ?? item).trim();
      if (!body && !caption) continue;
      const authorMatch = caption.match(/^(.+?)\s+-\s+(.+)$/);
      const author = authorMatch?.[1]?.trim() ?? null;
      const noteAt = parseUsDateToIso(authorMatch?.[2] ?? null) ?? new Date().toISOString();
      const title = caption || 'Clinical Note';
      out.push({
        source_entry_key: computeSourceEntryKey('note', title, noteAt),
        source_document_id: documentId,
        note_at: noteAt,
        title,
        author_name: author,
        body: body || title,
      });
    }
  }
  return out;
};

const parseReferrals = (sections: XmlNode[], documentId: string): DraftReferral[] => {
  const out: DraftReferral[] = [];
  for (const section of findSectionsByTitle(sections, 'Reason for Referral')) {
    for (const item of listItems(section.text)) {
      const caption = flattenText(item.caption);
      const rows = tableRows(item);
      const specialty = rows[0]?.[0]?.trim() || null;
      const reason =
        flattenText(
          asArray(isObject(item) ? item.paragraph : null).find(() => true),
        ) ||
        caption ||
        null;
      let status: string | null = null;
      let referredOn: string | null = null;
      for (const row of rows) {
        if (row.length >= 4 && /\d{1,2}\/\d{1,2}\/\d{2,4}/.test(row[3] ?? '')) {
          status = row[1]?.trim() || null;
          referredOn = toDateOnly(parseUsDateToIso(row[3]));
          if (!reason && row[2]) {
            // keep specialty/reason from first table
          }
        }
      }
      const diagnoses = rows
        .flat()
        .filter((c) => c && !/specialty|diagnoses|procedures|referral/i.test(c))
        .slice(0, 3)
        .join('; ');
      out.push({
        source_entry_key: computeSourceEntryKey('referral', specialty ?? '', caption, referredOn ?? ''),
        source_document_id: documentId,
        specialty,
        reason: reason || diagnoses || null,
        status: status || (caption.includes('Pending') ? 'Pending Review' : null),
        referred_on: referredOn,
        notes: caption || null,
      });
    }
  }
  return out;
};

const parseInsurance = (sections: XmlNode[], documentId: string): DraftInsuranceCoverage[] => {
  const out: DraftInsuranceCoverage[] = [];
  for (const section of findSectionsByTitle(sections, 'Insurance')) {
    if (!isObject(section.text)) continue;
    for (const item of listItems(section.text)) {
      const tables = asArray(item.table);
      for (const table of tables) {
        if (!isObject(table)) continue;
        const planName = flattenText(table.caption);
        if (!planName) continue;
        const bodyText = flattenText(table.tbody ?? table);
        const memberId = bodyText.match(/Member ID:\s*(\S+)/i)?.[1] ?? null;
        const groupNumber = bodyText.match(/Group ID:\s*(\S+)/i)?.[1] ?? null;
        out.push({
          source_entry_key: computeSourceEntryKey('insurance', planName, memberId ?? ''),
          source_document_id: documentId,
          payer_name: planName,
          plan_name: planName,
          member_id: memberId,
          group_number: groupNumber,
          status: 'active',
        });
      }
    }
  }
  return out;
};

const parseSymptoms = (
  sections: XmlNode[],
  documentId: string,
): { symptoms: DraftSymptomLog[]; history: DraftMedicalHistoryEvent[] } => {
  const symptoms: DraftSymptomLog[] = [];
  const history: DraftMedicalHistoryEvent[] = [];

  for (const section of findSectionsByTitle(sections, 'Visit Diagnoses')) {
    for (const row of tableRows(section.text)) {
      const name = row[0]?.trim();
      if (!name) continue;
      const recorded = parseUsDateToIso(row[1]) ?? undefined;
      if (isSymptomLabel(name)) {
        symptoms.push({
          source_entry_key: computeSourceEntryKey('symptom', name, recorded ?? ''),
          source_document_id: documentId,
          name,
          recorded_at: recorded,
          notes: 'From visit diagnoses',
        });
      } else {
        history.push({
          source_entry_key: computeSourceEntryKey('history-dx', name, recorded ?? ''),
          source_document_id: documentId,
          event_date: toDateOnly(recorded ?? null) ?? new Date().toISOString().slice(0, 10),
          title: name,
          category: 'diagnosis',
        });
      }
    }
  }

  for (const section of findSectionsByTitle(sections, 'Reason for Visit')) {
    const reason = flattenText(section.text).replace(/^Reason\s*/i, '').trim();
    if (!reason) continue;
    if (isSymptomLabel(reason)) {
      symptoms.push({
        source_entry_key: computeSourceEntryKey('symptom-rfv', reason),
        source_document_id: documentId,
        name: reason,
        notes: 'Reason for visit',
      });
    } else {
      history.push({
        source_entry_key: computeSourceEntryKey('history-rfv', reason),
        source_document_id: documentId,
        event_date: new Date().toISOString().slice(0, 10),
        title: reason,
        category: 'milestone',
        description: 'Reason for visit',
      });
    }
  }

  return { symptoms, history };
};

const extractDefaultHospital = (clinicalDocument: XmlNode): string => {
  const recordTarget = asArray(clinicalDocument.recordTarget)[0];
  const patientRole = isObject(recordTarget) ? recordTarget.patientRole : null;
  const org = isObject(patientRole) ? patientRole.providerOrganization : null;
  const name = isObject(org) ? flattenText(org.name) : '';
  return name || 'Thomas Jefferson University Hospital';
};

const extractDocumentId = (clinicalDocument: XmlNode, fallbackName: string): string => {
  const idNode = asArray(clinicalDocument.id)[0];
  const extension = attr(idNode, 'extension');
  const root = attr(idNode, 'root');
  return extension || root || fallbackName;
};

/**
 * Parses one C-CDA XML document into a partial import draft.
 */
export const parseCcdaDocument = (xml: string, fileName = 'document.xml'): ParsedCcdaDocument => {
  console.log(`🚀 parseCcdaDocument: ${fileName}`);
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
    removeNSPrefix: true,
    trimValues: true,
    textNodeName: '#text',
    isArray: (name) =>
      [
        'component',
        'section',
        'entry',
        'item',
        'tr',
        'td',
        'th',
        'table',
        'content',
        'paragraph',
        'telecom',
        'addr',
        'streetAddressLine',
        'given',
        'performer',
        'id',
      ].includes(name),
  });

  const parsed = parser.parse(xml) as XmlNode;
  const clinicalDocument = (parsed.ClinicalDocument ?? parsed) as XmlNode;
  if (!isObject(clinicalDocument)) {
    throw new Error(`Invalid C-CDA document: ${fileName}`);
  }

  const documentId = extractDocumentId(clinicalDocument, fileName);
  const defaultHospital = extractDefaultHospital(clinicalDocument);
  const draft = emptyDraft();
  ensureHospital(draft, documentId, defaultHospital);

  const sections = collectSections(clinicalDocument.component);

  draft.allergies.push(...parseAllergies(sections, documentId));
  draft.medications.push(...parseMedications(sections, documentId));
  draft.conditions.push(...parseConditions(sections, documentId));
  draft.vitalSigns.push(...parseVitals(sections, documentId));

  const { results, history: imagingHistory } = parseResults(sections, documentId);
  draft.clinicalResults.push(...results);
  draft.medicalHistoryEvents.push(...imagingHistory);

  parseCareTeamIntoDraft(draft, sections, documentId, defaultHospital);
  parseEncounters(draft, sections, documentId);
  draft.clinicalNotes.push(...parseProgressNotes(sections, documentId));
  draft.referrals.push(...parseReferrals(sections, documentId));
  draft.insuranceCoverages.push(...parseInsurance(sections, documentId));

  const { symptoms, history: dxHistory } = parseSymptoms(sections, documentId);
  draft.symptomLogs.push(...symptoms);
  draft.medicalHistoryEvents.push(...dxHistory);

  // Structured performer care team from documentationOf (extra doctors)
  const documentationOf = asArray(clinicalDocument.documentationOf)[0];
  const serviceEvent = isObject(documentationOf) ? documentationOf.serviceEvent : null;
  if (isObject(serviceEvent)) {
    for (const performer of asArray(serviceEvent.performer)) {
      if (!isObject(performer)) continue;
      const assigned = performer.assignedEntity;
      if (!isObject(assigned)) continue;
      const name = personName(isObject(assigned.assignedPerson) ? assigned.assignedPerson.name : null);
      if (!name || /^no pcp$/i.test(name)) continue;
      const specialty =
        flattenText(isObject(assigned.code) ? assigned.code.originalText : null) ||
        attr(assigned.code, 'displayName') ||
        'Unspecified';
      const npi =
        asArray(assigned.id)
          .map((id) => (attr(id, 'root') === '2.16.840.1.113883.4.6' ? attr(id, 'extension') : null))
          .find(Boolean) ?? null;
      const orgName =
        flattenText(
          isObject(assigned.representedOrganization)
            ? assigned.representedOrganization.name
            : null,
        ) || defaultHospital;
      ensureDoctor(draft, documentId, {
        name,
        hospitalName: orgName,
        specialtyName: specialty,
        npi,
        phone: telecomValue(assigned.telecom, 'tel:'),
        fax: telecomValue(assigned.telecom, 'fax:'),
        hospitalAddress: addressLines(assigned.addr),
      });
    }
  }

  console.log(`✅ parseCcdaDocument: ${fileName}`);
  return { documentId, draft };
};
