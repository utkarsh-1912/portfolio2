import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { skipOptimization } from '@/lib/images';
import { ArrowDown, ArrowRight, ArrowUpRight } from 'lucide-react';
import profileImage from '@/app/profile.jpg';
import { AnimatedText } from '../ui/animated-text';
import { SplitText } from '../ui/split-text';
import { FitText } from '../ui/fit-text';
import { LocalClock } from '../ui/local-clock';
import { SocialLinks } from '../ui/social-links';
import { ScrambleText } from '../ui/scramble-text';
import { RollText } from '../ui/roll-text';
import { getHero, getProjects } from '@/db/queries';

// Shown next to the live clock under the hero. Change to wherever you're based.
const CLOCK_TIME_ZONE = 'Asia/Kolkata';
const CLOCK_LABEL = 'India';

export async function HeroSection() {
  const [heroData, projects] = await Promise.all([getHero(), getProjects()]);
  const latest = projects[0];
  const name = heroData?.title || 'Utkarsh Gupta';
  const roles = heroData?.roles?.length ? heroData.roles : [name];

  // Use DB photo URL if set, fall back to bundled static image
  const photoSrc = heroData?.photoUrl || profileImage;

  return (
    <section id="hero" className="relative flex min-h-[calc(100svh-4.25rem)] w-full flex-col overflow-hidden pt-8 lg:pt-14">
      {/* Soft accent glow instead of the old grid */}
      <div aria-hidden="true" className="pointer-events-none absolute -right-32 top-24 h-[32rem] w-[32rem] rounded-full bg-primary/10 blur-3xl" />

      <div className="container relative z-10 flex flex-1 flex-col justify-center scroll-hero-out">
        <div className="grid grid-cols-1 items-end gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p data-reveal="up" className="eyebrow flex items-center gap-1.5 lg:gap-3">
              {/* Small portrait on phones, where the large one is hidden */}
              <span className="relative h-9 w-9 shrink-0 lg:hidden">
                <span aria-hidden="true" className="avatar-ring absolute -inset-0.5 rounded-full border border-primary/70" />
                <span className="absolute inset-0 overflow-hidden rounded-full bg-muted">
                  <Image src={photoSrc} alt="" fill sizes="36px" className="object-cover" unoptimized={skipOptimization(heroData?.photoUrl)} />
                </span>
                <span aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 rounded-full border border-primary" />
              </span>
              <span className="relative hidden h-2 w-2 lg:flex">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              <ScrambleText text="Sr.Software Engineer · Agentic AI" duration={900} />
            </p>

            <h1 className="mt-6 font-headline text-4xl font-semibold leading-[0.95] tracking-tight sm:text-5xl xl:text-6xl">
              <SplitText text="Hi, I'm" delay={1} className="block text-muted-foreground" />
              <span data-reveal="up" style={{ '--i': 3 } as React.CSSProperties} className="mt-1 block">
                <AnimatedText phrases={roles} className="text-foreground" />
              </span>
            </h1>

            {heroData?.description && (
              <p data-reveal="up" style={{ '--i': 5 } as React.CSSProperties} className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground sm:mt-8 md:text-xl">
                {heroData.description}
              </p>
            )}

            <div data-reveal="up" style={{ '--i': 6 } as React.CSSProperties} className="mt-8 flex flex-wrap items-center gap-3 sm:mt-10">
              <Button asChild size="lg" className="group h-12 rounded-full px-7 text-base">
                <Link href="/#projects" data-magnetic data-track="cta_view_work">
                  <RollText>View my work</RollText>
                  <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
                </Link>
              </Button>
              <div className="flex items-center gap-1.5 lg:gap-3">
                <Button asChild variant="outline" size="lg" className="group h-12 rounded-full border-foreground/20 bg-transparent px-7 text-base hover:bg-foreground/5">
                  <Link href="/#contact" data-magnetic data-track="cta_get_in_touch" data-track-label="hero"><RollText>Get in touch</RollText></Link>
                </Button>
                {heroData?.resumeUrl && (
                  <Button asChild variant="outline" size="lg" className="group h-12 rounded-full border-foreground/20 bg-transparent px-5 text-base hover:bg-foreground/5 lg:hidden">
                    <a href={heroData.resumeUrl} data-track="resume_open" data-track-label="hero" target="_blank" rel="noopener noreferrer">
                      Resume <ArrowUpRight className="ml-1 h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </a>
                  </Button>
                )}
              </div>
            </div>

            <div data-reveal="up" style={{ '--i': 7 } as React.CSSProperties}>
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 sm:mt-10">
                {heroData?.resumeUrl && (
                  <a
                    href={heroData.resumeUrl}
                    data-track="resume_open"
                    data-track-label="hero"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group hidden items-center gap-1.5 rounded-full border border-border px-3.5 py-1.5 font-mono text-xs uppercase tracking-widest transition-colors hover:border-foreground/40 lg:inline-flex"
                  >
                    Resume <ArrowUpRight className="h-3 w-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </a>
                )}
                <SocialLinks data={heroData} />
              </div>
            </div>
          </div>

          <div className="hidden lg:col-span-5 lg:block">
            <figure
              data-reveal="unclip"
              style={{ '--i': 3 } as React.CSSProperties}
              className="group relative ml-auto aspect-[4/5] w-full max-w-[420px] overflow-hidden rounded-[2rem] bg-muted"
            >
              <Image
                src={photoSrc}
                alt={`Portrait of ${name}`}
                fill
                sizes="420px"
                className="object-cover grayscale transition-[filter,transform] duration-1000 group-hover:scale-[1.02] group-hover:grayscale-0"
                priority
                unoptimized={skipOptimization(heroData?.photoUrl)}
              />
              <figcaption className="absolute inset-x-4 bottom-4 flex items-center justify-between rounded-full bg-background/75 px-4 py-2 font-mono text-[11px] uppercase tracking-widest backdrop-blur-md">
                <span className="text-muted-foreground">{name}</span>
                <LocalClock timeZone={CLOCK_TIME_ZONE} label="" />
              </figcaption>
            </figure>
          </div>
        </div>
      </div>

      {/* Meta row + full-bleed name wordmark */}
      <div className="container relative z-10 mt-14">
        <div data-reveal="up" style={{ '--i': 9 } as React.CSSProperties} className="flex items-center justify-between border-t border-border pt-3 eyebrow">
          <LocalClock timeZone={CLOCK_TIME_ZONE} label={CLOCK_LABEL} />
          <span className="hidden sm:inline">Portfolio — {new Date().getFullYear()}</span>
          <Link href="/#about" className="inline-flex items-center gap-1 transition-colors hover:text-foreground">
            Scroll <ArrowDown className="h-3 w-3" />
          </Link>
        </div>
        <div aria-hidden="true">
          <FitText className="select-none pb-4 pt-2 font-headline font-semibold uppercase leading-[0.85] tracking-tighter text-foreground">
            <SplitText text={name} delay={2} />
          </FitText>
        </div>
      </div>
    </section>
  );
}
