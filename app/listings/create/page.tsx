import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import CreateListingForm from './CreateListingForm';
import type { Zone } from '@/components/types';

export const metadata = {
  title: 'Create Listing - UIUNest',
  description: 'Add a new listing to UIUNest',
};

export default async function CreateListingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?next=/listings/create');
  }

  // Fetch zones for the dropdown
  const { data: zones } = await supabase
    .from('zones')
    .select('*')
    .order('zone_name');

  return (
    <div className="container" style={{ padding: '60px 5%' }}>
      <CreateListingForm zones={(zones || []) as Zone[]} />
    </div>
  );
}
