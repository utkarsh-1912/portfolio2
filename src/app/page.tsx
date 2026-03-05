import { HeroSection } from '@/components/sections/hero';
import { AboutSection } from '@/components/sections/about';
import { ProjectsSection } from '@/components/sections/projects';
import { ContactSection } from '@/components/sections/contact';
import { EducationSection } from '@/components/sections/education';
import { BlogSection } from '@/components/sections/blog';
import { Suspense } from 'react';

export default function Home() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <EducationSection />
      <ProjectsSection />
      <Suspense fallback={<div>Loading blog...</div>}>
        <BlogSection />
      </Suspense>
      <ContactSection />
    </>
  );
}
