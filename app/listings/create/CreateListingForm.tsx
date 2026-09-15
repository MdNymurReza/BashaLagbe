'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createListing } from '@/app/actions/listings';
import type { Zone } from '@/types';
import styles from '@/app/page.module.css';

export default function CreateListingForm({ zones }: { zones: Zone[] }) {
  const router = useRouter();
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const result = await createListing(formData);

    if (result.success) {
      router.push(`/listings/${result.listingId}`);
    } else {
      setError(result.error || 'Something went wrong');
      setLoading(false);
    }
  };

  return (
    <div className={styles.card} style={{ padding: '40px', maxWidth: '800px', margin: '0 auto', background: 'var(--surface-0)' }}>
      <h2 style={{ marginBottom: '24px', fontSize: '24px' }}>Add a New Listing</h2>
      {error && (
        <div style={{ padding: '12px', background: '#fef2f2', color: '#dc2626', borderRadius: '8px', marginBottom: '20px' }}>
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Basic Info */}
        <section>
          <h3 style={{ fontSize: '18px', marginBottom: '16px', color: 'var(--ink)' }}>Basic Info</h3>
          <div style={{ display: 'grid', gap: '16px' }}>
            <input type="text" name="title" className={styles.input} placeholder="Listing Title (e.g. Spacious Master Bed)" required />
            <textarea name="description" className={styles.input} placeholder="Description" rows={4} required></textarea>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <select name="property_type" className={styles.input} required>
                <option value="">Select Property Type</option>
                <option value="single_room">Single Room</option>
                <option value="shared_room">Shared Room</option>
                <option value="full_mess">Full Mess</option>
                <option value="sublet">Sublet</option>
              </select>
              <select name="listing_type" className={styles.input} required>
                <option value="">Select Listing Type</option>
                <option value="full_property">Full Property</option>
                <option value="peer_listing">Peer Listing</option>
              </select>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
              <input type="number" name="total_rooms" className={styles.input} placeholder="Total Rooms" min="1" required />
              <input type="number" name="current_occupancy" className={styles.input} placeholder="Current Occupants" min="0" required />
              <select name="gender_pref" className={styles.input} required>
                <option value="any">Gender Preference (Any)</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>
        </section>

        {/* Location */}
        <section>
          <h3 style={{ fontSize: '18px', marginBottom: '16px', color: 'var(--ink)' }}>Location</h3>
          <div style={{ display: 'grid', gap: '16px' }}>
            <input type="text" name="address" className={styles.input} placeholder="Full Address" required />
            <select name="zone_id" className={styles.input} required>
              <option value="">Select Zone</option>
              {zones.map(z => (
                <option key={z.id || z.zone_id} value={z.id || z.zone_id}>{z.zone_name}</option>
              ))}
            </select>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <input type="number" name="lat" step="any" className={styles.input} placeholder="Latitude (optional)" />
              <input type="number" name="lng" step="any" className={styles.input} placeholder="Longitude (optional)" />
            </div>
          </div>
        </section>

        {/* Costs */}
        <section>
          <h3 style={{ fontSize: '18px', marginBottom: '16px', color: 'var(--ink)' }}>Costs & Rent (Monthly)</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <input type="number" name="base_rent" className={styles.input} placeholder="Base Rent (Tk)" min="0" required />
            <div style={{ display: 'flex', gap: '8px' }}>
              <input type="number" name="electricity_amount" className={styles.input} placeholder="Electricity" min="0" />
              <select name="electricity_type" className={styles.input} style={{ width: '120px' }}>
                <option value="individual">Individual</option>
                <option value="shared">Shared</option>
              </select>
            </div>
            <input type="number" name="gas_bill" className={styles.input} placeholder="Gas Bill" min="0" />
            <input type="number" name="water_bill" className={styles.input} placeholder="Water Bill" min="0" />
            <input type="number" name="internet_cost" className={styles.input} placeholder="Internet Cost" min="0" />
            <input type="number" name="maintenance_fee" className={styles.input} placeholder="Maintenance Fee" min="0" />
            <input type="number" name="caretaker_fee" className={styles.input} placeholder="Caretaker Fee" min="0" />
            <input type="number" name="other_fees" className={styles.input} placeholder="Other Fees" min="0" />
          </div>
        </section>

        {/* Amenities */}
        <section>
          <h3 style={{ fontSize: '18px', marginBottom: '16px', color: 'var(--ink)' }}>Amenities</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input type="checkbox" name="attached_bathroom" value="true" /> Attached Bathroom
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input type="checkbox" name="attached_kitchen" value="true" /> Attached Kitchen
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input type="checkbox" name="is_furnished" value="true" /> Fully Furnished
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input type="checkbox" name="rooftop_access" value="true" /> Rooftop Access
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input type="checkbox" name="parking" value="true" /> Parking
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input type="checkbox" name="power_backup" value="true" /> Power Backup
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input type="checkbox" name="lift_access" value="true" /> Lift
            </label>
          </div>
        </section>

        <button type="submit" className={styles.btnPrimary} style={{ padding: '16px', fontSize: '16px', marginTop: '16px' }} disabled={loading}>
          {loading ? 'Creating...' : 'Create Listing'}
        </button>

      </form>
    </div>
  );
}
