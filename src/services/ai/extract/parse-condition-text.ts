export type ParsedConditionLine = {
  name: string;
  notes: string | null;
};

const SKIP_LINE =
  /^(active\s+)?(problems?|conditions?|diagnoses|diagnosis\s+list|problem\s+list)$/i;
const BULLET = /^[-•*]\s*/;
const NUMBERED = /^\d+[.)]\s*/;

/**
 * Parses pasted MyChart-style problem/condition text into structured lines.
 */
export const parseConditionText = (text: string): ParsedConditionLine[] => {
  const lines = text
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .filter((line) => !SKIP_LINE.test(line));

  const results: ParsedConditionLine[] = [];

  for (const raw of lines) {
    let line = raw.replace(BULLET, '').replace(NUMBERED, '').trim();
    if (!line) continue;

    const parenNote = line.match(/^(.+?)\s*\((.+)\)\s*$/);
    if (parenNote) {
      results.push({ name: parenNote[1].trim(), notes: parenNote[2].trim() });
      continue;
    }

    results.push({ name: line, notes: null });
  }

  return results;
};
