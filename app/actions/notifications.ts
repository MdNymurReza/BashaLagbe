'use server';

import { createClient } from '@/lib/supabase/server';

/**
 * Creates a notification for a specific user.
 * Used by search-filter (saved search alerts) and seeking-roommate features.
 */
export async function createUserNotification(
  recipientId: string,
  type: string,
  message: string,
  link?: string
) {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from('notifications').insert({
      user_id: recipientId,
      type,
      message,
      link: link || null,
      is_read: false,
    });
    if (error) {
      // Gracefully handle if notifications table doesn't exist yet
      console.warn('[notifications] insert failed:', error.message);
    }
  } catch (e) {
    console.warn('[notifications] unexpected error:', e);
  }
}
