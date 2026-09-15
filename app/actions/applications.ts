'use server';

import { createClient } from '@/lib/supabase/server';

export async function submitApplication(listingId: number, ownerId: string, listingTitle: string, message: string) {
  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) return { success: false };

  const { error } = await supabase.from('applications').insert({
    listing_id: listingId,
    applicant_id: user.id,
    message,
    status: 'pending',
  });

  if (error) {
    console.error('Error submitting application:', error);
    return { success: false };
  }
  return { success: true };
}

export async function updateListingStatus(listingId: number, status: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('listings')
    .update({ status })
    .eq('listing_id', listingId);
  if (error) return { error: error.message };
  return { success: true };
}

export async function updateItemStatus(itemId: number, status: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('items')
    .update({ status })
    .eq('item_id', itemId);
  if (error) return { error: error.message };
  return { success: true };
}
