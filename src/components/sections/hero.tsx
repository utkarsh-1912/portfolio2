import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
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
            <p data-reveal="up" className="eyebrow flex items-center gap-3">
              {/* Small portrait on phones, where the large one is hidden */}
              <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full bg-muted lg:hidden">
                <Image src={photoSrc} alt="" fill sizes="36px" className="object-cover" unoptimized={!!heroData?.photoUrl} />
              </span>
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              <ScrambleText text="Software Engineer · Agentic AI" duration={900} />
            </p>

            <h1 className="mt-8 font-headline text-5xl font-semibold leading-[0.95] tracking-tight sm:text-6xl xl:text-8xl">
              <SplitText text="Hi, I'm" delay={1} className="block text-muted-foreground" />
              <span data-reveal="up" style={{ '--i': 3 } as React.CSSProperties} className="mt-1 block min-h-[2em] sm:min-h-[1em]">
                <AnimatedText phrases={roles} className="text-foreground" />
              </span>
            </h1>

            {heroData?.description && (
              <p data-reveal="up" style={{ '--i': 5 } as React.CSSProperties} className="mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground md:text-xl">
                {heroData.description}
              </p>
            )}

            <div data-reveal="up" style={{ '--i': 6 } as React.CSSProperties} className="mt-10 flex flex-wrap items-center gap-3">
              <Button asChild size="lg" className="group h-12 rounded-full px-7 text-base">
                <Link href="/#projects" data-magnetic>
                  <RollText>View my work</RollText>
                  <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="group h-12 rounded-full border-foreground/20 bg-transparent px-7 text-base hover:bg-foreground/5">
                <Link href="/#contact" data-magnetic><RollText>Get in touch</RollText></Link>
              </Button>
            </div>

            <div data-reveal="up" style={{ '--i': 7 } as React.CSSProperties}>
              <SocialLinks data={heroData} className="mt-10" />
            </div>

            {/* Latest work, like the "Latest research" card on eddyrlora.com */}
            {latest && (
              <Link
                href="/projects"
                data-reveal="up"
                style={{ '--i': 8 } as React.CSSProperties}
                data-spotlight
                className="lift group mt-10 flex max-w-md items-center gap-4 rounded-2xl border border-border bg-card/70 p-4 backdrop-blur hover:border-foreground/25"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 font-headline text-lg font-semibold text-primary">
                  {latest.title[0]}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="eyebrow block">Latest project</span>
                  <span className="mt-1 block truncate font-medium">{latest.title}</span>
                </span>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
              </Link>
            )}
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
                unoptimized={!!heroData?.photoUrl}
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
