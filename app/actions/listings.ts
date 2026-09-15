'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createListing(formData: FormData) {
  const supabase = await createClient();

  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    return { success: false, error: 'You must be logged in to create a listing.' };
  }

  // 1. Insert main listing
  const listingData = {
    user_id: user.id,
    title: formData.get('title') as string,
    description: formData.get('description') as string,
    property_type: formData.get('property_type') as string,
    listing_type: formData.get('listing_type') as string,
    zone_id: parseInt(formData.get('zone_id') as string, 10),
    address: formData.get('address') as string,
    lat: parseFloat((formData.get('lat') as string) || '23.7949'), // Default coords roughly near UIU if not provided
    lng: parseFloat((formData.get('lng') as string) || '90.4493'),
    gender_pref: formData.get('gender_pref') as string,
    total_rooms: parseInt(formData.get('total_rooms') as string, 10) || 1,
    current_occupancy: parseInt(formData.get('current_occupancy') as string, 10) || 0,
    status: 'available' as const,
    is_verified: false,
  };

  const { data: newListing, error: listingError } = await supabase
    .from('listings')
    .insert(listingData)
    .select('listing_id')
    .single();

  if (listingError) {
    console.error('Error creating listing:', listingError);
    return { success: false, error: 'Failed to create listing. Please try again.' };
  }

  const listingId = newListing.listing_id;

  // 2. Insert Utility Costs
  const utilityCosts = {
    listing_id: listingId,
    base_rent: parseInt(formData.get('base_rent') as string, 10) || 0,
    electricity_amount: parseInt(formData.get('electricity_amount') as string, 10) || 0,
    electricity_type: formData.get('electricity_type') as string,
    gas_bill: parseInt(formData.get('gas_bill') as string, 10) || 0,
    water_bill: parseInt(formData.get('water_bill') as string, 10) || 0,
    internet_cost: parseInt(formData.get('internet_cost') as string, 10) || 0,
    maintenance_fee: parseInt(formData.get('maintenance_fee') as string, 10) || 0,
    caretaker_fee: parseInt(formData.get('caretaker_fee') as string, 10) || 0,
    other_fees: parseInt(formData.get('other_fees') as string, 10) || 0,
  };
  
  // Calculate total monthly
  // @ts-ignore
  utilityCosts.total_monthly = utilityCosts.base_rent + utilityCosts.electricity_amount + utilityCosts.gas_bill + utilityCosts.water_bill + utilityCosts.internet_cost + utilityCosts.maintenance_fee + utilityCosts.caretaker_fee + utilityCosts.other_fees;

  const { error: costsError } = await supabase
    .from('utility_costs')
    .insert(utilityCosts);

  if (costsError) {
    console.error('Error creating utility costs:', costsError);
  }

  // 3. Insert Amenities
  const amenities = {
    listing_id: listingId,
    attached_bathroom: formData.get('attached_bathroom') === 'true',
    attached_kitchen: formData.get('attached_kitchen') === 'true',
    is_furnished: formData.get('is_furnished') === 'true',
    rooftop_access: formData.get('rooftop_access') === 'true',
    parking: formData.get('parking') === 'true',
    power_backup: formData.get('power_backup') === 'true',
    lift_access: formData.get('lift_access') === 'true',
  };

  const { error: amenitiesError } = await supabase
    .from('listing_amenities')
    .insert(amenities);

  if (amenitiesError) {
    console.error('Error creating amenities:', amenitiesError);
  }

  revalidatePath('/listings');
  
  return { success: true, listingId };
}
