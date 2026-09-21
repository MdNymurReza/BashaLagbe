'use server';

// ============================================================
// FEATURE: Search & Filter
// Server Actions for Saved Searches & Notifications
// ============================================================

import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';
import { canonicalSearch, describeSearch, listingMatchesSearch } from './utils';
import { createUserNotification } from '@/app/actions/notifications';

/**
 * Saves the current filter combination as a saved search for the
 * authenticated user. Upserts so re-saving the same filters is idempotent.
 */
export async function saveSearch(rawQuery: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Log in to save searches.' };

  const query = canonicalSearch(rawQuery);
  if (!query) return { error: 'Add at least one filter before saving a search.' };

  const { data: zones } = await supabase.from('zones').select('zone_id, zone_name');
  const label = describeSearch(query, zones || []);

  const { data, error } = await supabase
    .from('saved_searches')
    .upsert({ user_id: user.id, query, label }, { onConflict: 'user_id,query' })
    .select('id')
    .single();

  if (error) return { error: error.message };
  revalidatePath('/listings');
  revalidatePath('/dashboard');
  return { success: true, id: data.id as number };
}

/**
 * Deletes a saved search by ID, scoped to the current user.
 */
export async function deleteSavedSearch(id: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized' };

  const { error } = await supabase
    .from('saved_searches')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) return { error: error.message };
  revalidatePath('/listings');
  revalidatePath('/dashboard');
  return { success: true };
}

// How long after creation a listing can still trigger alerts.
const ALERT_WINDOW_MS = 30 * 60 * 1000;

/**
 * Called right after a listing is published; notifies users whose
 * saved searches match the new listing.
 */
export async function notifySavedSearchMatches(listingId: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized' };

  const admin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: listingRaw } = await admin
    .from('listings')
    .select(
      'listing_id, user_id, title, address, zone_id, property_type, status, created_at, ' +
      'costs:utility_costs(total_monthly), amenities:listing_amenities(*)'
    )
    .eq('listing_id', listingId)
    .single();

  const listing = listingRaw as any;
  if (!listing || listing.user_id !== user.id) return { error: 'Not found' };
  if (Date.now() - new Date(listing.created_at).getTime() > ALERT_WINDOW_MS)
    return { success: true, notified: 0 };

  const { data: searches, error: searchError } = await admin
    .from('saved_searches')
    .select('id, user_id, query, label')
    .neq('user_id', user.id);

  if (searchError || !searches?.length) return { success: true, notified: 0 };

  const matches = searches.filter(s =>
    listingMatchesSearch(listing as any, s.query)
  );
  if (!matches.length) return { success: true, notified: 0 };

  const { data: fresh } = await admin
    .from('saved_search_alerts')
    .upsert(
      matches.map(s => ({
        saved_search_id: s.id,
        listing_id: listing.listing_id,
      })),
      { onConflict: 'saved_search_id,listing_id', ignoreDuplicates: true }
    )
    .select('saved_search_id');

  const freshIds = new Set((fresh || []).map(r => r.saved_search_id));
  const byUser = new Map<string, string>();
  for (const s of matches) {
    if (freshIds.has(s.id) && !byUser.has(s.user_id))
      byUser.set(s.user_id, s.label);
  }

  await Promise.all(
    [...byUser].map(([recipient, label]) =>
      createUserNotification(
        recipient,
        'saved_search_match',
        `New listing for your saved search "${label}": ${listing.title}`,
        `/listings/${listing.listing_id}`
      )
    )
  );

  return { success: true, notified: byUser.size };
}

/**
 * True once migration 0006 has been applied. Lets the feature ship before
 * the table exists: until then the UI simply doesn't offer it.
 */
export async function savedSearchesAvailable(
  supabase: Awaited<ReturnType<typeof createClient>>
): Promise<boolean> {
  const { error } = await supabase
    .from('saved_searches')
    .select('id')
    .limit(1);
  return !error;
}
