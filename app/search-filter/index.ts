// ============================================================
// FEATURE: Search & Filter
// Public Module API
// ============================================================

// Core Types
export * from './types';

// Constants & Label Maps
export * from './constants';

// Zod Validation Schemas
export * from './validation';

// Server Actions
export {
  saveSearch,
  deleteSavedSearch,
  notifySavedSearchMatches,
  savedSearchesAvailable,
} from './actions';

// Supabase Data Queries
export {
  buildListingsQuery,
  fetchFilteredListings,
  fetchZones,
  flattenZoneNames,
  FULL_COLUMNS,
  PIN_COLUMNS,
} from './queries';

// Pure Utilities
export {
  parseFiltersFromParams,
  listParam,
  canonicalSearch,
  describeSearch,
  listingMatchesSearch,
  buildFilterQuery,
  toggleInSet,
} from './utils';

// UI Components
export { default as FilterSidebar } from './components/FilterSidebar';
export { default as SearchBar } from './components/SearchBar';
export { default as SearchResultsGrid } from './components/SearchResultsGrid';
