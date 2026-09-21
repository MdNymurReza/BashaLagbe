'use client';

// ============================================================
// FEATURE: Search & Filter
// Component: FilterSidebar (Zone, Type, Budget, Amenities, Sort)
// ============================================================

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { Zone } from '@/types';
import type { SavedSearchState, FilterChip } from '../types';
import {
  NO_BUDGET_LIMIT,
  PROPERTY_TYPE_LABELS,
  AMENITY_OPTIONS,
  SORT_OPTIONS,
} from '../constants';
import { listParam, buildFilterQuery, toggleInSet } from '../utils';
import CustomSelect from '@/components/CustomSelect';
import { LAST_RESULTS_KEY } from '@/components/ListingBreadcrumb';
import {
  SlidersHorizontal,
  ChevronDown,
  MapPin,
  Search,
  X,
  BellPlus,
  BellRing,
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { saveSearch, deleteSavedSearch } from '../actions';

const PROPERTY_TYPES = {
  single_room: 'Single Room',
  shared_room: 'Shared Room',
  full_mess: 'Full Mess',
  sublet: 'Sub-let',
} as const;

interface FilterSidebarProps {
  zones: Zone[];
  savedSearch: SavedSearchState;
  isLoggedIn: boolean;
  isAdmin?: boolean;
  totalCount: number;
  totalPages: number;
  currentPage: number;
  /** Callback to focus a zone on the map component */
  onFocusZone?: (zoneId: number) => void;
  /** Extra content rendered after the filter chips (e.g. grid) */
  children?: React.ReactNode;
}

export default function FilterSidebar({
  zones,
  savedSearch,
  isLoggedIn,
  isAdmin,
  totalCount,
  totalPages,
  currentPage,
  onFocusZone,
  children,
}: FilterSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // ── Draft sidebar state (only applied on "Apply Filters") ──
  const [zoneIds, setZoneIds] = useState<Set<string>>(() =>
    listParam(searchParams.get('zone'))
  );
  const [type, setType] = useState(searchParams.get('type') || '');
  const [budget, setBudget] = useState(
    searchParams.get('budget') || String(NO_BUDGET_LIMIT)
  );
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');
  const [q, setQ] = useState(searchParams.get('q') || '');
  const [amenities, setAmenities] = useState<Set<string>>(() =>
    listParam(searchParams.get('amenities'))
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [savingSearch, setSavingSearch] = useState(false);

  // Re-sync controls when URL changes (back/forward, chip removal, etc.)
  useEffect(() => {
    setZoneIds(listParam(searchParams.get('zone')));
    setType(searchParams.get('type') || '');
    setBudget(searchParams.get('budget') || String(NO_BUDGET_LIMIT));
    setSort(searchParams.get('sort') || 'newest');
    setQ(searchParams.get('q') || '');
    setAmenities(listParam(searchParams.get('amenities')));

    try {
      const qs = searchParams.toString();
      if (qs) sessionStorage.setItem(LAST_RESULTS_KEY, `?${qs}`);
      else sessionStorage.removeItem(LAST_RESULTS_KEY);
    } catch {
      // storage unavailable
    }
  }, [searchParams]);

  // ── Helpers ────────────────────────────────────────────────
  const buildQuery = (overrides?: { q?: string }) =>
    buildFilterQuery({
      searchParams: new URLSearchParams(searchParams.toString()),
      zoneIds,
      type,
      budget,
      sort,
      q,
      amenities,
      overrides,
    });

  const applyFilters = () => router.push(`?${buildQuery().toString()}`);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`?${buildQuery().toString()}`);
  };

  const clearSearch = () => {
    setQ('');
    router.push(`?${buildQuery({ q: '' }).toString()}`);
  };

  const resetFilters = () => {
    setZoneIds(new Set());
    setType('');
    setBudget(String(NO_BUDGET_LIMIT));
    setSort('newest');
    setQ('');
    setAmenities(new Set());
    router.push('/listings');
  };

  // ── Active-filter chips (built from URL, not draft) ────────
  const removeFromUrl = (key: string, value?: string) => {
    const p = new URLSearchParams(searchParams.toString());
    if (value !== undefined) {
      const rest = [...listParam(p.get(key))].filter(v => v !== value);
      if (rest.length) p.set(key, rest.join(','));
      else p.delete(key);
    } else {
      p.delete(key);
    }
    p.set('page', '1');
    router.push(`?${p.toString()}`);
  };

  const chips: FilterChip[] = [];
  const appliedQ = searchParams.get('q');
  if (appliedQ)
    chips.push({ label: `"${appliedQ}"`, onRemove: () => removeFromUrl('q') });

  for (const id of listParam(searchParams.get('zone'))) {
    const zone = zones.find(z => z.zone_id.toString() === id);
    if (zone)
      chips.push({
        label: zone.zone_name,
        onRemove: () => removeFromUrl('zone', id),
      });
  }

  const appliedType = searchParams.get('type') as
    | keyof typeof PROPERTY_TYPES
    | null;
  if (appliedType && PROPERTY_TYPES[appliedType]) {
    chips.push({
      label: PROPERTY_TYPES[appliedType],
      onRemove: () => removeFromUrl('type'),
    });
  }

  const appliedBudget = searchParams.get('budget');
  if (appliedBudget && appliedBudget !== String(NO_BUDGET_LIMIT)) {
    chips.push({
      label: `Up to ৳${parseInt(appliedBudget).toLocaleString()}`,
      onRemove: () => removeFromUrl('budget'),
    });
  }

  for (const key of listParam(searchParams.get('amenities'))) {
    const opt = AMENITY_OPTIONS.find(a => a.key === key);
    if (opt)
      chips.push({
        label: opt.label,
        onRemove: () => removeFromUrl('amenities', key),
      });
  }

  // ── Saved search toggle ────────────────────────────────────
  const toggleSavedSearch = async () => {
    setSavingSearch(true);
    const res = savedSearch.id
      ? await deleteSavedSearch(savedSearch.id)
      : await saveSearch(searchParams.toString());
    setSavingSearch(false);
    if (res.error) {
      toast.error(res.error);
      return;
    }
    toast.success(
      savedSearch.id
        ? 'Saved search removed.'
        : "Search saved — you'll be notified when a new listing matches."
    );
    router.refresh();
  };

  // ── Render ─────────────────────────────────────────────────
  return (
    <>
      <button
        className={`mobile-filter-btn ${sidebarOpen ? 'active' : ''}`}
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-expanded={sidebarOpen}
      >
        <SlidersHorizontal style={{ width: '16px', height: '16px' }} />
        <span>Filters &amp; Sort</span>
        <ChevronDown
          className="filter-chevron"
          style={{
            width: '16px',
            height: '16px',
            marginLeft: 'auto',
            transition: 'transform 0.3s ease',
            transform: sidebarOpen ? 'rotate(180deg)' : 'none',
          }}
        />
      </button>

      <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <h4>Zones</h4>
        <div id="zoneFilters">
          {zones.map(z => (
            <div
              key={z.zone_id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '8px',
              }}
            >
              <label style={{ margin: 0 }}>
                <input
                  type="checkbox"
                  className="zone"
                  value={z.zone_id}
                  checked={zoneIds.has(z.zone_id.toString())}
                  onChange={() =>
                    setZoneIds(prev => toggleInSet(prev, z.zone_id.toString()))
                  }
                />{' '}
                {z.zone_name}
              </label>
              {onFocusZone && (
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  style={{ padding: '2px 6px', border: 'none' }}
                  onClick={() => onFocusZone(z.zone_id)}
                  title={`Show ${z.zone_name} on the map`}
                  aria-label={`Show ${z.zone_name} on the map`}
                >
                  <MapPin
                    style={{
                      width: '14px',
                      height: '14px',
                      color: 'var(--primary)',
                    }}
                  />
                </button>
              )}
            </div>
          ))}
        </div>

        <h4>Property Type</h4>
        {(Object.keys(PROPERTY_TYPES) as (keyof typeof PROPERTY_TYPES)[]).map(
          val => (
            <label key={val}>
              <input
                type="checkbox"
                value={val}
                checked={type === val}
                onChange={() => setType(type === val ? '' : val)}
              />{' '}
              {PROPERTY_TYPES[val]}
            </label>
          )
        )}

        <h4>
          Max Monthly Cost:{' '}
          <span style={{ color: 'var(--primary)', fontWeight: 600 }}>
            ৳{parseInt(budget).toLocaleString()}
          </span>
        </h4>
        <input
          type="range"
          min="1000"
          max="50000"
          step="500"
          value={budget}
          onChange={e => setBudget(e.target.value)}
        />

        <h4>Amenities</h4>
        {AMENITY_OPTIONS.map(({ key, label }) => (
          <label key={key}>
            <input
              type="checkbox"
              checked={amenities.has(key)}
              onChange={() =>
                setAmenities(prev => toggleInSet(prev, key))
              }
            />{' '}
            {label}
          </label>
        ))}

        <h4>Sort By</h4>
        <CustomSelect
          name="sort"
          value={sort}
          onChange={val => setSort(val)}
          options={SORT_OPTIONS.map(o => ({
            value: o.value,
            label: o.label,
          }))}
        />

        <div style={{ marginTop: '18px', display: 'flex', gap: '8px' }}>
          <button
            className="btn btn-primary btn-sm"
            onClick={applyFilters}
          >
            Apply Filters
          </button>
          <button
            className="btn btn-outline btn-sm"
            onClick={resetFilters}
          >
            Reset
          </button>
        </div>
      </aside>

      <main>
        {/* Search bar */}
        <form
          onSubmit={submitSearch}
          style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}
        >
          <div style={{ position: 'relative', flex: 1 }}>
            <Search
              size={16}
              style={{
                position: 'absolute',
                left: 14,
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--ink-muted)',
                pointerEvents: 'none',
              }}
            />
            <input
              type="search"
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder="Search by title or address…"
              aria-label="Search listings"
              style={{
                paddingLeft: '40px',
                paddingRight: q ? '40px' : '14px',
              }}
            />
            {q && (
              <button
                type="button"
                onClick={clearSearch}
                aria-label="Clear search"
                style={{
                  position: 'absolute',
                  right: 10,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--ink-muted)',
                  display: 'flex',
                  padding: 4,
                }}
              >
                <X size={15} />
              </button>
            )}
          </div>
          <button type="submit" className="btn btn-primary">
            Search
          </button>
        </form>

        {/* Result count + saved search toggle */}
        <div
          style={{
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            flexWrap: 'wrap',
          }}
        >
          <span style={{ color: 'var(--gray)', fontSize: '14px' }}>
            {totalCount} listing{totalCount !== 1 ? 's' : ''} found
            {totalPages > 1 && ` — page ${currentPage} of ${totalPages}`}
          </span>
          {savedSearch.enabled && chips.length > 0 && !isAdmin && (
            isLoggedIn ? (
              <button
                type="button"
                className={`btn btn-sm ${
                  savedSearch.id ? 'btn-primary' : 'btn-outline'
                }`}
                onClick={toggleSavedSearch}
                disabled={savingSearch}
                title={
                  savedSearch.id
                    ? 'Stop alerts for this search'
                    : 'Get notified when a new listing matches'
                }
              >
                {savedSearch.id ? (
                  <BellRing size={15} />
                ) : (
                  <BellPlus size={15} />
                )}
                {savedSearch.id ? 'Alerts on' : 'Save search'}
              </button>
            ) : (
              <Link href="/login" className="btn btn-outline btn-sm">
                <BellPlus size={15} /> Save search
              </Link>
            )
          )}
        </div>

        {/* Filter chips */}
        {chips.length > 0 && (
          <div className="filter-chips" aria-label="Active filters">
            {chips.map(chip => (
              <button
                key={chip.label}
                type="button"
                className="filter-chip"
                onClick={chip.onRemove}
                aria-label={`Remove filter: ${chip.label}`}
              >
                {chip.label}
                <X size={13} />
              </button>
            ))}
            {chips.length > 1 && (
              <button
                type="button"
                className="filter-chip-clear"
                onClick={resetFilters}
              >
                Clear all
              </button>
            )}
          </div>
        )}

        {/* Slot for the listing grid, pagination, and map */}
        {children}
      </main>
    </>
  );
}
