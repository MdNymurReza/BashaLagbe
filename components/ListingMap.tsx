'use client';

import dynamic from 'next/dynamic';

const ListingMap = dynamic(() => import('./ListingMapClient'), {
  ssr: false,
  loading: () => (
    <div style={{ width: '100%', height: '360px', borderRadius: '12px', background: 'var(--surface-1, #f3f4f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gray)', fontSize: '14px' }}>
      Loading map…
    </div>
  ),
});

export default ListingMap;
