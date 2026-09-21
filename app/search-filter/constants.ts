// ============================================================
// FEATURE: Search & Filter
// Shared Constants & Label Maps
// ============================================================

/** Budget slider / URL default — treated as "no limit". */
export const NO_BUDGET_LIMIT = 50000;

/** Number of listings per page. */
export const PAGE_SIZE = 10;

/** Property-type enum → human-readable label. */
export const PROPERTY_TYPE_LABELS: Record<string, string> = {
  single_room: 'Single Room',
  shared_room: 'Shared Room',
  full_mess: 'Full Mess',
  sublet: 'Sub-let',
  any: 'Any',
} as const;

/** Amenity column → filter/chip label. */
export const AMENITY_FILTER_LABELS: Record<string, string> = {
  attached_bathroom: 'Attached Bathroom',
  attached_kitchen: 'Kitchen',
  is_furnished: 'Furnished',
  rooftop_access: 'Rooftop',
  parking: 'Parking',
  power_backup: 'Power Backup',
  lift_access: 'Lift',
} as const;

/**
 * Allowlist of amenity columns that may be interpolated into a PostgREST
 * filter path. Never use raw user input for this — only values in this set.
 */
export const AMENITY_COLUMNS = [
  'attached_bathroom',
  'attached_kitchen',
  'is_furnished',
  'rooftop_access',
  'parking',
  'power_backup',
  'lift_access',
] as const;

/** Convenience array of { key, label } for rendering checkboxes. */
export const AMENITY_OPTIONS = Object.entries(AMENITY_FILTER_LABELS).map(
  ([key, label]) => ({ key, label })
);

/** Sort options for the listings sidebar. */
export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'cost_asc', label: 'Total Cost ↑' },
  { value: 'cost_desc', label: 'Total Cost ↓' },
] as const;

/** The URL search-param keys that define *what* is being searched for.
 *  `page` and `sort` are excluded — they change how results are shown, not which. */
export const SEARCH_KEYS = ['q', 'zone', 'type', 'budget', 'amenities'] as const;

/** Keys whose URL values are comma-separated lists. */
export const LIST_KEYS = new Set(['zone', 'amenities']);
