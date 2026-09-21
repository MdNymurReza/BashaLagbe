'use server';

// ============================================================
// FEATURE: Seeking Room / Flatmate
// Server Actions for Managing Seeking Posts & Responses
// ============================================================

import { createClient } from '@/lib/supabase/server';
import { createUserNotification } from '@/app/actions/notifications';
import { revalidatePath } from 'next/cache';
import { createSeekingSchema, seekResponseSchema } from './validation';

/**
 * Creates a new Seeking Room / Flatmate advertisement
 */
export async function createSeekingPost(formData: {
  zone_id: string;
  budget_min: number;
  budget_max: number;
  property_type: 'single_room' | 'shared_room' | 'full_mess' | 'sublet' | 'any';
  preferred_gender: 'male' | 'female' | 'any';
  move_in_date?: string;
  requirements?: string;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized' };

  const validation = createSeekingSchema.safeParse(formData);
  if (!validation.success) {
    return { error: validation.error.issues[0].message };
  }

  const { data, error } = await supabase.from('seeking_posts').insert({
    user_id: user.id,
    zone_id: parseInt(validation.data.zone_id),
    budget_min: validation.data.budget_min,
    budget_max: validation.data.budget_max,
    property_type: validation.data.property_type,
    preferred_gender: validation.data.preferred_gender,
    move_in_date: validation.data.move_in_date || null,
    requirements: validation.data.requirements || null,
    status: 'active'
  }).select().single();

  if (error) return { error: error.message };

  revalidatePath('/seeking');
  revalidatePath('/dashboard');
  return { success: true, post: data };
}

/**
 * Submits a response / offer to an active seeking post
 */
export async function submitSeekResponse(postId: number, message: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized' };

  const validation = seekResponseSchema.safeParse({ message });
  if (!validation.success) {
    return { error: validation.error.issues[0].message };
  }

  // Prevent duplicate response from the same user on the same post
  const { data: existing } = await supabase
    .from('seeking_responses')
    .select('response_id')
    .eq('post_id', postId)
    .eq('responder_id', user.id)
    .maybeSingle();

  if (existing) {
    return { error: 'You have already responded to this post.' };
  }

  // Fetch post owner to send notification
  const { data: post } = await supabase
    .from('seeking_posts')
    .select('user_id')
    .eq('post_id', postId)
    .single();

  const { error } = await supabase.from('seeking_responses').insert({
    post_id: postId,
    responder_id: user.id,
    message: validation.data.message,
    status: 'pending'
  });

  if (error) return { error: error.message };

  // Notify post owner
  if (post && post.user_id !== user.id) {
    const { data: sender } = await supabase.from('profiles').select('name').eq('id', user.id).single();
    const senderName = sender?.name || 'Someone';
    await createUserNotification(
      post.user_id,
      'seek_response_received',
      `${senderName} sent a response to your flatmate/room request.`,
      `/dashboard?tab=seeking`
    );
  }

  revalidatePath('/dashboard');
  return { success: true };
}

/**
 * Accepts a responder's offer for a seeking post
 */
export async function acceptSeekResponse(responseId: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized' };

  const { data: resp } = await supabase
    .from('seeking_responses')
    .select('*, post:seeking_posts!inner(user_id, requirements), responder:profiles!seeking_responses_responder_id_fkey(name)')
    .eq('response_id', responseId)
    .single();

  if (!resp || (resp.post as any).user_id !== user.id) return { error: 'Unauthorized' };

  const { error } = await supabase
    .from('seeking_responses')
    .update({ status: 'accepted' })
    .eq('response_id', responseId);

  if (error) return { error: error.message };

  await createUserNotification(
    resp.responder_id,
    'seek_response_accepted',
    `Your response to a housing request was accepted! Check the seeking board for details.`,
    `/seeking`
  );

  revalidatePath('/dashboard');
  return { success: true };
}

/**
 * Rejects a responder's offer for a seeking post
 */
export async function rejectSeekResponse(responseId: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized' };

  const { data: resp } = await supabase
    .from('seeking_responses')
    .select('*, post:seeking_posts!inner(user_id)')
    .eq('response_id', responseId)
    .single();

  if (!resp || (resp.post as any).user_id !== user.id) return { error: 'Unauthorized' };

  const { error } = await supabase
    .from('seeking_responses')
    .update({ status: 'rejected' })
    .eq('response_id', responseId);

  if (error) return { error: error.message };

  revalidatePath('/dashboard');
  return { success: true };
}

/**
 * Marks a seeking post as fulfilled
 */
export async function markSeekingPostFulfilled(postId: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized' };

  const { error } = await supabase
    .from('seeking_posts')
    .update({ status: 'fulfilled' })
    .eq('post_id', postId)
    .eq('user_id', user.id);

  if (error) return { error: error.message };

  revalidatePath('/seeking');
  revalidatePath('/dashboard');
  return { success: true };
}
