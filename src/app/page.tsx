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

/** Placeholder with the section's anchor id, so /#projects still scrolls there while it loads. */
function SectionSkeleton({ id }: { id: string }) {
  return (
    <section id={id} aria-busy="true" className="w-full border-t border-border py-24 md:py-36">
      <div className="container">
        <div className="h-4 w-40 animate-pulse rounded bg-muted" />
        <div className="mt-6 h-16 w-2/3 animate-pulse rounded-2xl bg-muted" />
        <div className="mt-14 aspect-[16/7] w-full animate-pulse rounded-3xl bg-muted" />
      </div>
    </section>
  );
}

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
      {/* Sections that call GitHub stream in after the rest of the page */}
      <Suspense fallback={<SectionSkeleton id="projects" />}>
        <ProjectsSection />
      </Suspense>
      <Suspense fallback={<div className="min-h-[70vh] bg-[#0d0c0b]" aria-hidden="true" />}>
        <GitHubActivitySection />
      </Suspense>
      <Suspense fallback={<div className="min-h-[60vh] border-t border-border" aria-hidden="true" />}>
        <BlogSection />
      </Suspense>
      <ContactSection heroData={heroData} />
      {/* Last child, so its effect runs after the sections above have hydrated */}
      <RevealObserver />
    </>
  );
}
