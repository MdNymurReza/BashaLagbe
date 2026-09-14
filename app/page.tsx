import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';

export const metadata = {
  title: 'Seeking Flatmates - BashaLagbe',
  description: 'Find students seeking roommates or flats near UIU.',
};

export default async function SeekingPage() {
  const supabase = await createClient();

  // Check auth
  const { data: { user } } = await supabase.auth.getUser();
  const isLoggedIn = !!user;
  let isAdmin = false;
  if (isLoggedIn && user) {
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (profile?.role === 'admin') isAdmin = true;
  }

  // Fetch zones for filter
  const { data: zones } = await supabase.from('zones').select('*').order('zone_name');

  // Fetch seeking posts
  const { data: posts } = await supabase
    .from('seeking_posts')
    .select(`
      *,
      user:profiles!seeking_posts_user_id_fkey(name, gender),
      zone:zones(zone_name)
    `)
    .order('created_at', { ascending: false });

  return (
    <div className="container" style={{ padding: '40px 0', textAlign: 'center' }}>
      <h1>Seeking Flatmates</h1>
      <p>This page is currently under construction. Please check back later.</p>
    </div>
  );
}

