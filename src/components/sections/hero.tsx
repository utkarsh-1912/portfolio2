import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export function HeroSection() {
  const heroImage = PlaceHolderImages.find((p) => p.id === 'hero');
  return (
    <section id="hero" className="container py-24 sm:py-32">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="flex flex-col gap-6 items-start text-left">
          <h1 className="text-4xl font-headline font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
            Hi, I&apos;m Utkarsh Gupta
          </h1>
          <p className="max-w-[600px] text-muted-foreground md:text-xl">
            A passionate front-end developer and UI/UX enthusiast from India, dedicated to creating beautiful, intuitive,
            and high-performance web experiences.
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
        <div className="flex justify-center items-center lg:justify-end">
          {heroImage && (
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-full blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
              <Image
                src={heroImage.imageUrl}
                alt={heroImage.description}
                width={450}
                height={450}
                className="rounded-full aspect-square object-cover border-4 border-background shadow-lg relative"
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
