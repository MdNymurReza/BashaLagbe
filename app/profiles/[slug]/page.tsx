import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export default async function ProfileSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('profile_slug', slug)
    .single();

  if (!profile) {
    notFound();
  }

  return (
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '40px', maxWidth: '700px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '32px' }}>
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: 'var(--primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '28px',
          fontWeight: 700,
          color: '#fff',
          flexShrink: 0,
          overflow: 'hidden',
        }}>
          {profile.profile_pic
            ? <img src={profile.profile_pic} alt={profile.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : profile.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
          }
        </div>
        <div>
          <h1 style={{ margin: 0, fontSize: '26px', fontWeight: 700 }}>{profile.name}</h1>
          <p style={{ margin: '4px 0 0', color: 'var(--gray)', textTransform: 'capitalize' }}>{profile.role}</p>
        </div>
      </div>

      {profile.bio && (
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ marginBottom: '8px' }}>About</h3>
          <p style={{ color: 'var(--ink-muted)', lineHeight: 1.6 }}>{profile.bio}</p>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {profile.university_id && (
          <div>
            <span style={{ fontSize: '12px', color: 'var(--gray)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>University ID</span>
            <p style={{ margin: '4px 0 0', fontWeight: 500 }}>{profile.university_id}</p>
          </div>
        )}
        {profile.gender && (
          <div>
            <span style={{ fontSize: '12px', color: 'var(--gray)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Gender</span>
            <p style={{ margin: '4px 0 0', fontWeight: 500, textTransform: 'capitalize' }}>{profile.gender}</p>
          </div>
        )}
      </div>
    </div>
  );
}
