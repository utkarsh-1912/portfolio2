import { HeroSection } from '@/components/sections/hero';
import { AboutSection } from '@/components/sections/about';
import { ProjectsSection } from '@/components/sections/projects';
import { ContactSection } from '@/components/sections/contact';
import { EducationSection } from '@/components/sections/education';
import { BlogSection } from '@/components/sections/blog';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getHero } from '@/db/queries';
import { RevealObserver } from '@/components/ui/reveal-observer';
import { SkillsMarquee } from '@/components/sections/skills-marquee';
import { CertificationsSection } from '@/components/sections/certifications';
import { GitHubActivitySection } from '@/components/sections/github-activity';

export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

export default async function Home() {
  const heroData = await getHero();

  return (
    <>
      <HeroSection />
      <SkillsMarquee />
      <AboutSection />
      <EducationSection />
      <CertificationsSection />
      <ProjectsSection />
      <GitHubActivitySection />
      <Suspense fallback={<div className="min-h-[60vh] border-t border-border" aria-hidden="true" />}>
        <BlogSection />
      </Suspense>
      <ContactSection heroData={heroData} />
      {/* Last child, so its effect runs after the sections above have hydrated */}
      <RevealObserver />
    </>
  );
}
