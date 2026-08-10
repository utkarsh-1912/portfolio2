import { HeroSection } from '@/components/sections/hero';
import { AboutSection } from '@/components/sections/about';
import { ProjectsSection } from '@/components/sections/projects';
import { ContactSection } from '@/components/sections/contact';
import { EducationSection } from '@/components/sections/education';
import { BlogSection } from '@/components/sections/blog';
import { Suspense } from 'react';
import { getHero } from '@/db/queries';
import { ScrollSnapper } from '@/components/ui/scroll-snapper';

export default async function Home() {
  const heroData = await getHero();

  return (
    <>
      <ScrollSnapper />
      <HeroSection />
      <AboutSection />
      <EducationSection />
      <ProjectsSection />
      <Suspense fallback={<div>Loading blog...</div>}>
        <BlogSection />
      </Suspense>
      <ContactSection heroData={heroData} />
    </>
  );
}
