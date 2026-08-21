export type ParsedMedicationLine = {
  name: string;
  instructions: string | null;
  notes: string | null;
};

const SKIP_LINE = /^(active\s+)?medications?$/i;
const BULLET = /^[-•*]\s*/;

/**
 * Parses pasted MyChart-style medication text into structured lines.
 */
export const parseMedicationText = (text: string): ParsedMedicationLine[] => {
  const lines = text
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .filter((line) => !SKIP_LINE.test(line));

  const results: ParsedMedicationLine[] = [];

  for (const raw of lines) {
    const line = raw.replace(BULLET, '').trim();
    if (!line) continue;

    const dashSplit = line.split(/\s+[-–—]\s+/);
    if (dashSplit.length >= 2) {
      results.push({
        name: dashSplit[0].trim(),
        instructions: dashSplit.slice(1).join(' - ').trim(),
        notes: null,
      });
      continue;
    }

    results.push({ name: line, instructions: null, notes: null });
  }

  return results;
};
