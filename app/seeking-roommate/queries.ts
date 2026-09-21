// ============================================================
// FEATURE: Seeking Room / Flatmate
// Supabase Queries & Data Access Layer
// ============================================================

import { createClient } from '@/lib/supabase/server';
import type { SeekingPost, SeekingResponse } from './types';

/**
 * Fetches all seeking posts with poster information and zone details
 */
export async function getSeekingPosts(): Promise<SeekingPost[]> {
  const supabase = await createClient();
  const { data: posts, error } = await supabase
    .from('seeking_posts')
    .select(`
      *,
      user:profiles!seeking_posts_user_id_fkey(name, gender),
      zone:zones(zone_name)
    `)
    .order('created_at', { ascending: false });

  if (error || !posts) return [];

  return posts.map((p: any) => ({
    ...p,
    user_name: p.user?.name,
    user_gender: p.user?.gender,
    zone: p.zone?.zone_name
  }));
}

/**
 * Fetches seeking posts submitted by a specific user
 */
export async function getUserSeekingPosts(userId: string): Promise<SeekingPost[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('seeking_posts')
    .select(`
      *,
      zone:zones(zone_name)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error || !data) return [];

  return data.map((p: any) => ({
    ...p,
    zone: p.zone?.zone_name
  }));
}

/**
 * Fetches responses sent by a user to other seeking posts
 */
export async function getUserSentResponses(userId: string): Promise<SeekingResponse[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('seeking_responses')
    .select('*, owner:profiles!seeking_responses_post_owner_id_fkey(name, email)')
    .eq('responder_id', userId)
    .order('created_at', { ascending: false });

  if (error || !data) return [];

  return data.map((r: any) => ({
    ...r,
    owner_name: r.owner?.name,
    owner_email: r.owner?.email
  }));
}

/**
 * Fetches responses received on the user's seeking posts
 */
export async function getUserReceivedResponses(userId: string): Promise<SeekingResponse[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('seeking_responses')
    .select('*, responder:profiles!seeking_responses_responder_id_fkey(name, email), post:seeking_posts!inner(user_id, requirements)')
    .eq('post.user_id', userId)
    .order('created_at', { ascending: false });

  if (error || !data) return [];

  return data.map((r: any) => ({
    ...r,
    responder_name: r.responder?.name,
    responder_email: r.responder?.email,
    requirements: r.post?.requirements
  }));
}

/**
 * Fetches seeking post counts grouped by zone for demand analysis
 */
export async function getSeekingDemandCounts(): Promise<Record<number, number>> {
  const supabase = await createClient();
  const { data: seekingPosts } = await supabase
    .from('seeking_posts')
    .select('zone_id');

  const counts: Record<number, number> = {};
  (seekingPosts || []).forEach((p: any) => {
    if (p.zone_id) {
      counts[p.zone_id] = (counts[p.zone_id] || 0) + 1;
    }
  });

  return counts;
}
