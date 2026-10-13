import type { Metadata } from 'next';
import { getAbout, getSkills, getCertifications } from '@/db/queries';
import { getCodeforcesStats, getLeetCodeStats, getGitHubUserStats } from '@/lib/api-stats';
import { AboutPageClient } from '@/components/sections/about-page-client';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'About',
  description: 'Background, skills, certifications and live coding stats of Utkarsh Gupta.',
  alternates: { canonical: '/about' },
};

export default async function AboutPage() {
  const [about, skills, certifications, cfStats, lcStats, ghStats] = await Promise.all([
    getAbout(),
    getSkills(),
    getCertifications(),
    getCodeforcesStats('utkarsh191201'),
    getLeetCodeStats('user7883p'),
    getGitHubUserStats('utkarsh-1912')
  ]);

  return <AboutPageClient about={about} skills={skills} certifications={certifications} stats={{ cfStats, lcStats, ghStats }} />;
}
