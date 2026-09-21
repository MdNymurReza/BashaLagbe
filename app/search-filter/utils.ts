// ============================================================
// FEATURE: Search & Filter
// Pure Utility Functions
// ============================================================

import type { SearchFilters, MatchableListing } from './types';
import {
  NO_BUDGET_LIMIT,
  SEARCH_KEYS,
  LIST_KEYS,
  AMENITY_FILTER_LABELS,
  PROPERTY_TYPE_LABELS,
  AMENITY_COLUMNS,
} from './constants';

// ── URL ↔ Filter parsing ────────────────────────────────────

/** Strip characters that are grammar in a PostgREST `or` filter. */
const cleanQuery = (q: string) => q.replace(/[,()\\\"]/g, '').trim();

/**
 * Parse a URLSearchParams (or plain object) into a typed SearchFilters struct.
 */
export function parseFiltersFromParams(
  params: Record<string, string | string[] | undefined>
): SearchFilters {
  const zoneIds = (params.zone ? String(params.zone).split(',') : [])
    .map(z => parseInt(z))
    .filter(z => Number.isInteger(z) && z > 0);

  const amenities = (params.amenities ? String(params.amenities).split(',') : [])
    .filter(a => (AMENITY_COLUMNS as readonly string[]).includes(a));

  return {
    q: cleanQuery(String(params.q || '')),
    zoneIds,
    propertyType: String(params.type || ''),
    budget: parseInt(String(params.budget || String(NO_BUDGET_LIMIT))),
    sort: (params.sort as SearchFilters['sort']) || 'newest',
    amenities,
    page: parseInt(String(params.page || '1')),
  };
}

/**
 * Convert a comma-separated string (or null) into a Set of strings.
 * Used by the client sidebar to sync state from URL search params.
 */
export function listParam(value: string | null): Set<string> {
  return new Set((value || '').split(',').filter(Boolean));
}

// ── Canonical search strings ─────────────────────────────────

/**
 * Normalises a /listings query so equivalent searches produce the same string.
 * Fixed key order, sorted + de-duplicated list values, and defaults dropped.
 * This string is what's stored in saved_searches and used for comparison.
 */
export function canonicalSearch(input: string | URLSearchParams): string {
  const src =
    typeof input === 'string'
      ? new URLSearchParams(input.replace(/^\?/, ''))
      : input;
  const out = new URLSearchParams();

  for (const key of SEARCH_KEYS) {
    const raw = src.get(key);
    if (!raw) continue;
    let value = key === 'q' ? cleanQuery(raw) : raw.trim();
    if (LIST_KEYS.has(key)) {
      value = [...new Set(value.split(',').map(v => v.trim()).filter(Boolean))]
        .sort()
        .join(',');
    }
    if (key === 'budget' && !(Number(value) > 0 && Number(value) < NO_BUDGET_LIMIT))
      continue;
    if (key === 'type' && value === 'any') continue;
    if (value) out.set(key, value);
  }
  return out.toString();
}

/**
 * Produces a human-readable label for a saved search query string,
 * e.g. `"studio" · Badda Campus Area · Single Room · up to ৳12,000 · Furnished`.
 */
export function describeSearch(
  query: string,
  zones: { zone_id: number; zone_name: string }[]
): string {
  const p = new URLSearchParams(query);
  const parts: string[] = [];

  const q = p.get('q');
  if (q) parts.push(`"${q}"`);

  const zoneIds = (p.get('zone') || '').split(',').filter(Boolean);
  const zoneNames = zoneIds
    .map(id => zones.find(z => String(z.zone_id) === id)?.zone_name)
    .filter(Boolean);
  if (zoneNames.length) parts.push(zoneNames.join(' / '));

  const type = p.get('type');
  if (type) parts.push(PROPERTY_TYPE_LABELS[type] || type);

  const budget = Number(p.get('budget'));
  if (budget) parts.push(`up to ৳${budget.toLocaleString('en-BD')}`);

  const amenities = (p.get('amenities') || '').split(',').filter(Boolean);
  if (amenities.length)
    parts.push(amenities.map(a => AMENITY_FILTER_LABELS[a] || a).join(', '));

  return (parts.join(' · ') || 'All listings').slice(0, 200);
}

// ── Listing matcher ──────────────────────────────────────────

/**
 * Tests whether a listing matches a saved search query.
 * Same semantics as the filters in app/listings/page.tsx — keep the two in step.
 */
export function listingMatchesSearch(
  listing: MatchableListing,
  query: string
): boolean {
  const p = new URLSearchParams(query);
  if (listing.status === 'occupied') return false;

  const zones = p.get('zone');
  if (zones && !zones.split(',').includes(String(listing.zone_id))) return false;

  const type = p.get('type');
  if (type && type !== listing.property_type) return false;

  const budget = Number(p.get('budget'));
  if (budget > 0 && budget < NO_BUDGET_LIMIT) {
    const total = Number(listing.costs?.total_monthly);
    if (!total || total > budget) return false;
  }

  const amenities = p.get('amenities');
  if (amenities) {
    for (const a of amenities.split(',')) {
      if (listing.amenities?.[a] !== true) return false;
    }
  }

  const q = p.get('q');
  if (
    q &&
    !`${listing.title} ${listing.address}`.toLowerCase().includes(q.toLowerCase())
  )
    return false;

  return true;
}

// ── URL builder ──────────────────────────────────────────────

/**
 * Builds a URLSearchParams from the current sidebar draft state,
 * suitable for pushing to the router.
 */
export function buildFilterQuery(opts: {
  searchParams: URLSearchParams;
  zoneIds: Set<string>;
  type: string;
  budget: string;
  sort: string;
  q: string;
  amenities: Set<string>;
  overrides?: { q?: string };
}): URLSearchParams {
  const p = new URLSearchParams(opts.searchParams.toString());
  const nextQ = opts.overrides?.q !== undefined ? opts.overrides.q : opts.q;

  if (opts.zoneIds.size > 0) p.set('zone', [...opts.zoneIds].join(','));
  else p.delete('zone');

  if (opts.type) p.set('type', opts.type);
  else p.delete('type');

  if (opts.budget && opts.budget !== String(NO_BUDGET_LIMIT))
    p.set('budget', opts.budget);
  else p.delete('budget');

  if (opts.sort && opts.sort !== 'newest') p.set('sort', opts.sort);
  else p.delete('sort');

  if (nextQ.trim()) p.set('q', nextQ.trim());
  else p.delete('q');

  if (opts.amenities.size > 0) p.set('amenities', [...opts.amenities].join(','));
  else p.delete('amenities');

  p.set('page', '1');
  return p;
}

/**
 * Toggle a value in/out of a Set (returns a new Set).
 */
export function toggleInSet(prev: Set<string>, key: string): Set<string> {
  const next = new Set(prev);
  next.has(key) ? next.delete(key) : next.add(key);
  return next;
}
