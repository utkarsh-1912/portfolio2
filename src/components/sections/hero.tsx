import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { AnimatedBackground } from '../ui/animated-background';
import profileImage from '@/app/profile.jpg';
import { Github, Linkedin, Youtube } from 'lucide-react';
import { XLogo } from '@/components/ui/x-logo';
import { AnimatedText } from '../ui/animated-text';
import { getHero } from '@/db/queries';

export async function HeroSection() {
  const heroData = await getHero();

  // Use DB photo URL if set, fall back to bundled static image
  const photoSrc = heroData?.photoUrl || profileImage;

  return (
    <section id="hero" className="container mx-auto w-full min-h-screen py-4 sm:pt-10 sm:pb-10 md:pt-16 lg:pt-20 relative overflow-hidden bg-background snap-start flex flex-col justify-center">
      <AnimatedBackground />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative z-10">
        <div className="flex flex-col gap-6 items-center lg:items-start text-center lg:text-left font-mono">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-primary/30 bg-primary/5 text-primary text-sm mb-4">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            System Online
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tight text-foreground">
            &gt; Hello, World.
            <br />
            <span className="text-muted-foreground">&gt; I am </span>
            <span className="text-primary">{heroData?.title || 'Utkarsh Gupta'}</span>
          </h1>
          <div className="text-md sm:text-2xl text-foreground/80 h-10 flex items-center">
             <span className="text-primary mr-2">const</span> role = "<AnimatedText phrases={heroData?.roles || ['Developer']} />";
          </div>
          <p className="max-w-[600px] text-muted-foreground md:text-lg relative z-20 font-sans mt-4">
            {heroData?.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 relative z-20 mt-4">
            <Button asChild size="lg" className="rounded-none tech-border font-mono uppercase tracking-wider">
              <Link href="/#projects">cd ./projects</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-none border-primary/50 text-primary hover:bg-primary/10 font-mono uppercase tracking-wider">
              <Link href="/#contact">contact --init</Link>
            </Button>
          </div>
        </div>
        <div className="hidden lg:flex justify-center items-center pointer-events-none">
          <div className="relative group w-[300px] h-[300px] sm:w-[450px] sm:h-[450px]">
            {/* Tech grid frame for image */}
            <div className="absolute inset-0 border-2 border-primary/20 bg-card/50 rotate-3 transition-transform group-hover:rotate-6"></div>
            <div className="absolute inset-0 border-2 border-primary/40 -rotate-3 transition-transform group-hover:-rotate-6 bg-grid"></div>
            <Image
              src={photoSrc}
              alt={`Portrait of ${heroData?.title || 'Utkarsh Gupta'}`}
              fill
              className="object-cover relative z-10 border-2 border-primary filter grayscale group-hover:grayscale-0 transition-all duration-500"
              priority
              unoptimized={!!heroData?.photoUrl} 
            />
          </div>
        </div>
      </div>
      
      {/* Scroll Down Control */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <span className="text-xs font-mono tracking-widest text-muted-foreground uppercase">Scroll</span>
        <div className="w-[1px] h-8 bg-gradient-to-b from-primary to-transparent"></div>
      </div>
    </section>
  );
}
