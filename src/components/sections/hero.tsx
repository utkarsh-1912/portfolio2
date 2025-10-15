import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { AnimatedBackground } from '../ui/animated-background';

export function HeroSection() {
  const heroImage = PlaceHolderImages.find((p) => p.id === 'hero');
  return (
    <section id="hero" className="container py-20 sm:py-32 relative overflow-hidden">
      <AnimatedBackground />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        <div className="flex flex-col gap-6 items-center lg:items-start text-center lg:text-left">
          <h1 className="text-4xl font-headline font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
            Hi, I&apos;m Utkarsh Gupta
          </h1>
          <p className="max-w-[600px] text-muted-foreground md:text-xl">
            A software engineer with a passion for debugging complex codebases and developing
            containerized workflows with Docker. Experienced in both front-end and back-end
            technologies.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg">
              <Link href="/#projects">View My Work</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/#contact">Get In Touch</Link>
            </Button>
          </div>
        </div>
        <div className="hidden lg:flex justify-center items-center lg:justify-end">
          {heroImage && (
            <div className="relative group w-[300px] h-[300px] sm:w-[450px] sm:h-[450px] animate-float">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse-slow"></div>
              <Image
                src={heroImage.imageUrl}
                alt={heroImage.description}
                width={450}
                height={450}
                className="rounded-full aspect-square object-cover border-4 border-background shadow-lg relative w-full h-full"
                data-ai-hint={heroImage.imageHint}
                priority
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
