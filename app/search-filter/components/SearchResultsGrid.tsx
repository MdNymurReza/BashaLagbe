'use client';

// ============================================================
// FEATURE: Search & Filter
// Component: SearchResultsGrid (listing grid + pagination)
// ============================================================

import type { Listing } from '@/types';
import ListingCard from '@/components/ListingCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

interface SearchResultsGridProps {
  listings: Listing[];
  totalPages: number;
  currentPage: number;
  /** Callback when the user wants to reset all filters (used in empty state) */
  onReset?: () => void;
  /** Whether any filters are currently active */
  hasFilters?: boolean;
}

export default function SearchResultsGrid({
  listings,
  totalPages,
  currentPage,
  onReset,
  hasFilters,
}: SearchResultsGridProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (newPage: number) => {
    const p = new URLSearchParams(searchParams.toString());
    p.set('page', newPage.toString());
    router.push(`?${p.toString()}`);
  };

  return (
    <>
      <div className="grid-2" id="listingsGrid">
        {listings.length === 0 ? (
          <p
            style={{
              color: 'var(--gray)',
              gridColumn: '1/-1',
              textAlign: 'center',
              padding: '40px 0',
            }}
          >
            No listings match your filters.
            {hasFilters && onReset && (
              <>
                {' '}
                <button
                  type="button"
                  className="link-button"
                  onClick={onReset}
                >
                  Clear filters
                </button>
              </>
            )}
          </p>
        ) : (
          listings.map(l => (
            <ListingCard key={l.listing_id || l.id} listing={l} />
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '16px',
            marginTop: '32px',
            alignItems: 'center',
          }}
        >
          <button
            className="btn btn-outline btn-sm"
            disabled={currentPage <= 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            <ChevronLeft size={16} /> Prev
          </button>
          <span style={{ fontSize: '14px', fontWeight: 500 }}>
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="btn btn-outline btn-sm"
            disabled={currentPage >= totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next <ChevronRight size={16} />
          </button>
        </div>
      )}
    </>
  );
}
