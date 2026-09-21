// ============================================================
// FEATURE: Search & Filter
// Supabase Queries & Data Access Layer
// ============================================================

import { createClient } from '@/lib/supabase/server';
import type { Listing, Zone } from '@/types';
import type { SearchFilters } from './types';
import { NO_BUDGET_LIMIT, AMENITY_COLUMNS } from './constants';

/**
 * Builds a filtered, paginated Supabase query for listings
 * based on the parsed SearchFilters.
 *
 * Returns the query builder — the caller decides whether to
 * `.range()` (paginated page) or `.limit()` (map pins).
 */
export function buildListingsQuery(
  supabase: Awaited<ReturnType<typeof createClient>>,
  filters: SearchFilters,
  columns: { base: string; costs: string; amenities: string }
) {
  const budgetActive = filters.budget > 0 && filters.budget < NO_BUDGET_LIMIT;

  // Inner-join embedded resources only when filtering on them
  const select =
    `${columns.base}, zone:zones(zone_name)` +
    `, costs:utility_costs${budgetActive ? '!inner' : ''}(${columns.costs})` +
    `, amenities:listing_amenities${filters.amenities.length > 0 ? '!inner' : ''}(${columns.amenities})`;

  let query = supabase
    .from('listings')
    .select(select, { count: 'exact' })
    .neq('status', 'occupied');

  // Zone filter
  if (filters.zoneIds.length === 1) query = query.eq('zone_id', filters.zoneIds[0]);
  else if (filters.zoneIds.length > 1) query = query.in('zone_id', filters.zoneIds);

  // Property type
  if (filters.propertyType && filters.propertyType !== 'any')
    query = query.eq('property_type', filters.propertyType);

  // Free-text search (title or address)
  if (filters.q)
    query = query.or(`title.ilike.%${filters.q}%,address.ilike.%${filters.q}%`);

  // Budget ceiling on the embedded costs row
  if (budgetActive)
    query = query.lte('costs.total_monthly', filters.budget);

  // Amenity boolean checks (allowlisted columns only)
  for (const a of filters.amenities) {
    if ((AMENITY_COLUMNS as readonly string[]).includes(a)) {
      query = query.eq(`amenities.${a}`, true);
    }
  }

  return query;
}

/** Full-column set for the main listings grid. */
export const FULL_COLUMNS = { base: '*', costs: '*', amenities: '*' };

/** Minimal-column set for the map pins overlay (lower payload). */
export const PIN_COLUMNS = {
  base: 'listing_id, title, lat, lng',
  costs: 'total_monthly',
  amenities: 'listing_id',
};

/**
 * Fetches a single page of filtered listings + map pins.
 * Handles cost-based sorting (which requires client-side sort of the full set)
 * vs. simple database-ordered pagination.
 */
export async function fetchFilteredListings(
  supabase: Awaited<ReturnType<typeof createClient>>,
  filters: SearchFilters,
  pageSize: number
): Promise<{
  listings: Listing[];
  mapPins: Listing[];
  totalCount: number;
  totalPages: number;
}> {
  const offset = (filters.page - 1) * pageSize;
  const costSort = filters.sort === 'cost_asc' || filters.sort === 'cost_desc';

  if (costSort) {
    // PostgREST can't order parent rows by an embedded column, so we
    // fetch the whole filtered set and sort in memory.
    const { data } = await buildListingsQuery(supabase, filters, FULL_COLUMNS)
      .order('created_at', { ascending: false });

    const all = (data as unknown as Listing[]) || [];
    all.sort((a, b) =>
      filters.sort === 'cost_asc'
        ? (a.costs?.total_monthly || 0) - (b.costs?.total_monthly || 0)
        : (b.costs?.total_monthly || 0) - (a.costs?.total_monthly || 0)
    );

    return {
      listings: all.slice(offset, offset + pageSize),
      mapPins: all,
      totalCount: all.length,
      totalPages: Math.max(1, Math.ceil(all.length / pageSize)),
    };
  }

  // Normal paginated query + separate map-pin query in parallel
  const [{ data, count }, { data: pins }] = await Promise.all([
    buildListingsQuery(supabase, filters, FULL_COLUMNS)
      .order('created_at', { ascending: false })
      .range(offset, offset + pageSize - 1),
    buildListingsQuery(supabase, filters, PIN_COLUMNS).limit(500),
  ]);

  return {
    listings: (data as unknown as Listing[]) || [],
    mapPins: (pins as unknown as Listing[]) || [],
    totalCount: count || 0,
    totalPages: count ? Math.max(1, Math.ceil(count / pageSize)) : 1,
  };
}

/**
 * Fetches all zones ordered by name.
 */
export async function fetchZones(
  supabase: Awaited<ReturnType<typeof createClient>>
): Promise<Zone[]> {
  const { data } = await supabase.from('zones').select('*').order('zone_name');
  return (data as Zone[]) || [];
}

/**
 * Flattens the joined `zone` object on listings into a plain zone_name string.
 */
export function flattenZoneNames(listings: Listing[]): Listing[] {
  return listings.map(l => ({
    ...l,
    zone: (l as any).zone?.zone_name ?? undefined,
  }));
}
