import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Redirect to the user's own profile slug page
  const { data: profile } = await supabase
    .from('profiles')
    .select('profile_slug')
    .eq('id', user.id)
    .single();

  if (profile?.profile_slug) {
    redirect(`/profiles/${profile.profile_slug}`);
  }

  redirect('/dashboard');
}
