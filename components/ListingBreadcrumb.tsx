'use client';

// ============================================================
// Component: ListingBreadcrumb
// Provides LAST_RESULTS_KEY constant and optional breadcrumb UI
// ============================================================

import Link from 'next/link';

/** sessionStorage key for remembering the last /listings search query */
export const LAST_RESULTS_KEY = 'bashalagbe_last_listings_query';

interface ListingBreadcrumbProps {
  label?: string;
}

/**
 * Shows a "← Back to results" link that restores the user's last search.
 */
export default function ListingBreadcrumb({ label = 'Back to results' }: ListingBreadcrumbProps) {
  let href = '/listings';
  try {
    const last = sessionStorage.getItem(LAST_RESULTS_KEY);
    if (last) href = `/listings${last}`;
  } catch {
    // sessionStorage unavailable (SSR / private mode)
  }

  return (
    <Link
      href={href}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: '14px',
        color: 'var(--ink-muted)',
        textDecoration: 'none',
        marginBottom: '16px',
      }}
    >
      ← {label}
    </Link>
  );
}
