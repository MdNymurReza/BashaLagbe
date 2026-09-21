'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import type { Listing, Zone } from '@/types';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { FilterSidebar, SearchResultsGrid } from '@/app/search-filter';

const MapView = dynamic(() => import('@/components/MapComponent'), { ssr: false, loading: () => <div style={{height: '360px', width: '100%', background: '#eee'}} /> });

export default function ListingsClient({
  initialListings,
  zones,
  currentPage,
  totalPages,
  isLoggedIn,
  isAdmin,
}: {
  initialListings: Listing[];
  zones: Zone[];
  currentPage: number;
  totalPages: number;
  isLoggedIn: boolean;
  isAdmin?: boolean;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [zoneId, setZoneId] = useState(searchParams.get('zone') || '');
  
  // Create a mock saved search state for now as it needs backend support
  const savedSearch = { enabled: false, id: null };

  const handleZoneSelect = (id: number) => {
    setZoneId(id.toString());
  };

  const hasFilters = Array.from(searchParams.keys()).some(k => k !== 'page');

  const handleReset = () => {
    router.push('/listings');
  };

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h1 className="page-title" style={{ margin: 0 }}>Browse Listings</h1>
        {isLoggedIn && !isAdmin && (
          <Link href="/listings/create" className="btn btn-primary">+ Create Listing</Link>
        )}
      </div>

      <div className="listings-layout">
        <FilterSidebar
          zones={zones}
          savedSearch={savedSearch}
          isLoggedIn={isLoggedIn}
          isAdmin={isAdmin}
          totalCount={initialListings.length}
          totalPages={totalPages}
          currentPage={currentPage}
          onFocusZone={handleZoneSelect}
        >
          <SearchResultsGrid
            listings={initialListings}
            totalPages={totalPages}
            currentPage={currentPage}
            hasFilters={hasFilters}
            onReset={handleReset}
          />
          
          <div id="map" style={{ marginTop: '40px' }}>
            <MapView
              zones={zones}
              listings={initialListings}
              selectedZoneId={zoneId ? parseInt(zoneId) : undefined}
              onZoneSelect={id => handleZoneSelect(id)}
            />
          </div>
        </FilterSidebar>
      </div>
    </div>
  );
}
