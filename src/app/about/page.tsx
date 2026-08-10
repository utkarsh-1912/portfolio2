import { getAbout, getSkills } from '@/db/queries';
import { getCodeforcesStats, getLeetCodeStats, getGitHubUserStats } from '@/lib/api-stats';
import { AboutPageClient } from '@/components/sections/about-page-client';

export const dynamic = 'force-dynamic';

export default async function AboutPage() {
  const [about, skills, cfStats, lcStats, ghStats] = await Promise.all([
    getAbout(),
    getSkills(),
    getCodeforcesStats('utkarsh191201'),
    getLeetCodeStats('user7883p'),
    getGitHubUserStats('utkarsh-1912')
  ]);

  return <AboutPageClient about={about} skills={skills} stats={{ cfStats, lcStats, ghStats }} />;
}
