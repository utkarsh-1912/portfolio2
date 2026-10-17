import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getAbout, getSkills, getCertifications } from '@/db/queries';
import { AboutPageClient } from '@/components/sections/about-page-client';
import { LiveStats, LiveStatsSkeleton } from '@/components/sections/live-stats';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'About',
  description: 'Background, skills, certifications and live coding stats of Utkarsh Gupta.',
  alternates: { canonical: '/about' },
};

export default async function AboutPage() {
  // Only the fast database reads block the page; third-party stats stream in afterwards
  const [about, skills, certifications] = await Promise.all([getAbout(), getSkills(), getCertifications()]);

  return (
    <AboutPageClient
      about={about}
      skills={skills}
      certifications={certifications}
      liveStats={
        <Suspense fallback={<LiveStatsSkeleton />}>
          <LiveStats />
        </Suspense>
      }
    />
  );
}
