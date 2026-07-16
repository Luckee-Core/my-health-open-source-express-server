/**
 * Heuristic: visit-diagnosis / reason labels that look like symptoms (not disease/imaging).
 */
export const isSymptomLabel = (label: string): boolean => {
  const text = label.trim().toLowerCase();
  if (!text) return false;

  const exclude = [
    'cancer',
    'carcinoma',
    'sarcoma',
    'tumor',
    'tumour',
    'mass',
    'mri',
    'ct ',
    'referral',
    'chondrosarcoma',
    'neoplasm',
    'fracture',
    'surgery',
  ];
  if (exclude.some((word) => text.includes(word))) return false;

  const keywords = [
    'pain',
    'headache',
    'tinnitus',
    'diplopia',
    'nausea',
    'vomiting',
    'dizziness',
    'hearing loss',
    'dysphagia',
    'numbness',
    'weakness',
    'fatigue',
    'fever',
    'ear pain',
  ];
  return keywords.some((word) => text.includes(word));
};
