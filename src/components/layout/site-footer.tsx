'use client';

import Link from 'next/link';
import { ArrowUp } from 'lucide-react';
import { usePathname } from 'next/navigation';

const NAV = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Projects', href: '/projects' },
  { name: 'Writing', href: '/blog' },
  { name: 'Contact', href: '/#contact' },
];

const SOCIAL = [
  { name: 'GitHub', href: 'https://github.com/utkarsh-1912' },
  { name: 'LinkedIn', href: 'https://www.linkedin.com/in/utkarsh-gupta-3a374119a/' },
  { name: 'X', href: 'https://x.com/Utkarsh191201' },
];

export function SiteFooter() {
  const pathname = usePathname();

  if (pathname.startsWith('/admin') || pathname.startsWith('/login')) {
    return null;
  }

  return (
    <footer className="relative z-10 border-t border-border bg-background">
      <div className="container grid gap-12 py-16 md:grid-cols-12">
        <div className="md:col-span-6">
          <p className="font-headline text-3xl font-semibold tracking-tight md:text-4xl">
            Have an idea?{' '}
            <Link href="/#contact" className="text-muted-foreground transition-colors hover:text-primary">
              Let&apos;s talk.
            </Link>
          </p>
        </div>

        <nav className="md:col-span-3" aria-label="Footer">
          <p className="eyebrow">Index</p>
          <ul className="mt-4 space-y-2">
            {NAV.map((item) => (
              <li key={item.name}>
                <Link href={item.href} className="link-draw text-foreground/80 transition-colors hover:text-foreground">
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-3">
          <p className="eyebrow">Social</p>
          <ul className="mt-4 space-y-2">
            {SOCIAL.map((item) => (
              <li key={item.name}>
                <a href={item.href} target="_blank" rel="noreferrer" className="link-draw text-foreground/80 transition-colors hover:text-foreground">
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="container flex flex-col items-start justify-between gap-4 border-t border-border py-6 pr-20 font-mono text-[11px] uppercase tracking-widest text-muted-foreground sm:flex-row sm:items-center">
        <span>© {new Date().getFullYear()} Utkarsh Gupta</span>
        <span className="hidden md:inline">Built with Next.js · Press Ctrl + ` for the terminal</span>
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
        >
          Back to top <ArrowUp className="h-3 w-3" />
        </button>
      </div>
    </footer>
  );
}
