// ============================================================
// FEATURE: Search & Filter
// TypeScript Types & Interfaces
// ============================================================

export type PropertyType = 'single_room' | 'shared_room' | 'full_mess' | 'sublet';
export type SortOption = 'newest' | 'cost_asc' | 'cost_desc';

/**
 * The parsed filter state derived from URL search params.
 * Used by both the server page (to build Supabase queries) and
 * the client sidebar (to render controls).
 */
export interface SearchFilters {
  /** Free-text search term (title / address) */
  q: string;
  /** Selected zone IDs (comma-separated in URL, Set in client state) */
  zoneIds: number[];
  /** Property type filter — empty string means "any" */
  propertyType: string;
  /** Maximum monthly budget; defaults to NO_BUDGET_LIMIT when unset */
  budget: number;
  /** Sort key */
  sort: SortOption;
  /** Required amenity columns */
  amenities: string[];
  /** Current page (1-indexed) */
  page: number;
}

/**
 * The shape of a saved search row returned from Supabase.
 */
export interface SavedSearchRow {
  id: number;
  user_id: string;
  query: string;
  label: string;
  created_at: string;
}

/**
 * Saved-search feature state passed from the server page
 * to the client component.
 */
export interface SavedSearchState {
  /** Whether the saved_searches table exists (migration applied) */
  enabled: boolean;
  /** The ID of the current user's saved search matching the current filters, or null */
  id: number | null;
}

/**
 * A filter chip displayed above the results grid.
 */
export interface FilterChip {
  label: string;
  onRemove: () => void;
}

/**
 * A listing that can be tested against a saved search query.
 * Intentionally minimal — only the fields the matcher needs.
 */
export interface MatchableListing {
  zone_id: number;
  property_type: string;
  status: string;
  title: string;
  address: string;
  costs?: { total_monthly?: number | string | null } | null;
  amenities?: Record<string, unknown> | null;
}
