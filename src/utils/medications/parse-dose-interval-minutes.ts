/**
 * Parses a dosing interval (minutes) from free-text medication instructions.
 * Examples: "Take 1 pill every 3 hours", "q4h", "every 30 minutes".
 */
export const parseDoseIntervalMinutes = (
  instructions: string | null | undefined,
): number | null => {
  const text = instructions?.trim().toLowerCase();
  if (!text) return null;

  const qHours = text.match(/\bq\s*(\d+(?:\.\d+)?)\s*(?:hours?|h)\b/i);
  if (qHours) {
    const hours = Number(qHours[1]);
    return Number.isFinite(hours) && hours > 0 ? Math.round(hours * 60) : null;
  }

  const everyHours = text.match(/\bevery\s+(\d+(?:\.\d+)?)\s*(?:hours?|hrs?|h)\b/i);
  if (everyHours) {
    const hours = Number(everyHours[1]);
    return Number.isFinite(hours) && hours > 0 ? Math.round(hours * 60) : null;
  }

  const everyMinutes = text.match(/\bevery\s+(\d+)\s*(?:minutes?|mins?|m)\b/i);
  if (everyMinutes) {
    const minutes = Number(everyMinutes[1]);
    return Number.isFinite(minutes) && minutes > 0 ? minutes : null;
  }

  return null;
};

/**
 * Human-readable label for a parsed interval.
 */
export const formatDoseIntervalMinutes = (minutes: number): string => {
  if (minutes % 60 === 0) {
    const hours = minutes / 60;
    return `every ${hours} hour${hours === 1 ? '' : 's'}`;
  }
  return `every ${minutes} minutes`;
};
