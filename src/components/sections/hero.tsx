import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { AnimatedBackground } from '../ui/animated-background';
import profileImage from '@/app/profile.jpg';
import { Github, Linkedin, Twitter } from 'lucide-react';
import { AnimatedText } from '../ui/animated-text';

const roles = [
  'Utkarsh Gupta',
  'a Software Developer',
  'a Problem Solver',
  'a Tech Enthusiast',
];

export function HeroSection() {
  return (
    <section id="hero" className="container py-20 sm:py-32 relative overflow-hidden">
      <AnimatedBackground />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative z-10">
        <div className="flex flex-col gap-6 items-center lg:items-start text-center lg:text-left">
          <h1 className="text-4xl font-headline font-bold tracking-tighter sm:text-5xl xl:text-7xl/none">
            Hi, I&apos;m <AnimatedText phrases={roles} />
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
          <div className="flex items-center gap-2 mt-4">
              <Button asChild variant="ghost" size="icon">
                <Link href="https://github.com/utkarsh-1912" target="_blank" rel="noreferrer">
                  <Github className="h-6 w-6" />
                  <span className="sr-only">GitHub</span>
                </Link>
              </Button>
              <Button asChild variant="ghost" size="icon">
                <Link href="https://www.linkedin.com/in/utkarsh-gupta-3a374119a/" target="_blank" rel="noreferrer">
                  <Linkedin className="h-6 w-6" />
                  <span className="sr-only">LinkedIn</span>
                </Link>
              </Button>
              <Button asChild variant="ghost" size="icon">
                <Link href="https://x.com/Utkarsh191201" target="_blank" rel="noreferrer">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-5 w-5"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  <span className="sr-only">X</span>
                </Link>
              </Button>
            </div>
        </div>
        <div className="hidden lg:flex justify-center items-center">
          <div className="relative group w-[300px] h-[300px] sm:w-[450px] sm:h-[450px] animate-float">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse-slow"></div>
            <Image
              src={profileImage}
              alt="Portrait of Utkarsh Gupta"
              width={450}
              height={450}
              className="rounded-full aspect-square object-cover border-4 border-background shadow-lg relative w-full h-full"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
