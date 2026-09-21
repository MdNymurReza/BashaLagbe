import { createClient } from '@/lib/supabase/server';
import ListingsClient from './ListingsClient';
import type { Zone, Listing } from '@/types';
import { Suspense } from 'react';
import { fetchFilteredListings, fetchZones } from '@/app/search-filter/queries';
import { parseFiltersFromParams } from '@/app/search-filter/utils';

export const metadata = {
  title: 'Browse Listings - BashaLagbe',
  description: 'Find your next home near UIU.',
};

export default async function ListingsPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const params = await searchParams;
  const filters = parseFiltersFromParams(params);
  
  const supabase = await createClient();

  // Fetch zones for map
  const zones = await fetchZones(supabase);

  // Use the search-filter queries
  const { listings, totalCount, totalPages } = await fetchFilteredListings(supabase, filters, 10);

  const { data: { user } } = await supabase.auth.getUser();
  const isLoggedIn = !!user;

  let isAdmin = false;
  if (isLoggedIn && user) {
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (profile?.role === 'admin') isAdmin = true;
  }

  return (
    <Suspense fallback={<div style={{ padding: '60px', textAlign: 'center' }}>Loading Listings...</div>}>
      <ListingsClient
        initialListings={listings as unknown as Listing[]}
        zones={zones}
        currentPage={filters.page}
        totalPages={totalPages}
        isLoggedIn={isLoggedIn}
        isAdmin={isAdmin}
      />
    </Suspense>
  );
}
