import { createClient } from '@/lib/supabase/server';
import SeekingBoard from '@/app/seeking-roommate/components/SeekingBoard';

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

  // Fetch seeking posts with user info and zone name
  const { data: postsRaw } = await supabase
    .from('seeking_posts')
    .select(`
      *,
      user:profiles!seeking_posts_user_id_fkey(name, gender),
      zone:zones(zone_name)
    `)
    .order('created_at', { ascending: false });

  // Flatten joined fields
  const posts = (postsRaw || []).map((p: any) => ({
    ...p,
    user_name: p.user?.name,
    user_gender: p.user?.gender,
    zone: p.zone?.zone_name,
  }));

  return (
    <SeekingBoard
      posts={posts}
      zones={zones || []}
      isLoggedIn={isLoggedIn}
      isAdmin={isAdmin}
    />
  );
}
