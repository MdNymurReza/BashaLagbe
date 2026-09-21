// ============================================================
// FEATURE: Seeking Room / Flatmate
// Helper & Formatting Utilities
// ============================================================

/**
 * Formats a number to Bangladeshi Taka currency representation
 */
export function fmt(val: number | string): string {
  const n = typeof val === 'string' ? parseFloat(val) : val;
  return '৳' + n.toLocaleString('en-BD');
}

/**
 * Formats an ISO date string into readable English date
 */
export function fmtDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  } catch {
    return iso;
  }
}

/**
 * Returns human-readable label for property types
 */
export function propertyTypeLabel(type: string): string {
  const map: Record<string, string> = {
    single_room: 'Single Room',
    shared_room: 'Shared Room',
    full_mess: 'Full Mess',
    sublet: 'Sub-let',
    any: 'Any Type'
  };
  return map[type] || type;
}

/**
 * Calculates roommate lifestyle compatibility score between two profiles (0-100%)
 */
export function calcCompatScore(
  userPrefs: {
    sleep?: string; diet?: string; guest?: string;
    smoking?: number | boolean | string; noise?: string; cleanliness?: number | string;
  },
  otherPrefs: {
    sleep?: string; diet?: string; guest?: string;
    smoking?: number | boolean | string; noise?: string; cleanliness?: number | string;
  }
): number {
  if (!userPrefs || !otherPrefs) return 0;
  let score = 0;
  let total = 0;

  const check = (a: unknown, b: unknown) => {
    total++;
    if (a === b) score++;
  };

  if (otherPrefs.sleep) check(userPrefs.sleep, otherPrefs.sleep);
  if (otherPrefs.diet) check(userPrefs.diet, otherPrefs.diet);
  if (otherPrefs.guest) check(userPrefs.guest, otherPrefs.guest);
  if (otherPrefs.noise) check(userPrefs.noise, otherPrefs.noise);
  if (otherPrefs.smoking !== undefined) {
    total++;
    if (String(userPrefs.smoking) === String(otherPrefs.smoking)) score++;
  }
  if (otherPrefs.cleanliness !== undefined && userPrefs.cleanliness !== undefined) {
    total++;
    if (userPrefs.cleanliness === otherPrefs.cleanliness) score++;
  }

  return total > 0 ? Math.round((score / total) * 100) : 0;
}
