'use client';

import Link from 'next/link';
import { ThemeToggle } from '@/components/theme-toggle';
import { Menu } from 'lucide-react';
import { LogoMark } from '@/components/ui/logo-mark';
import { RollText } from '@/components/ui/roll-text';
import { OPEN_PALETTE_EVENT } from '@/components/ui/command-palette';
import { Search } from 'lucide-react';
import { Button } from '../ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet';
import { useScrollSpy } from '@/hooks/use-scroll-spy';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

const navItems = [
  { name: 'About', href: '/#about', page: '/about' },
  { name: 'Experience', href: '/#education' },
  { name: 'Work', href: '/#projects', page: '/projects' },
  { name: 'Writing', href: '/#blog', page: '/blog' },
];

const sectionIds = ['hero', 'about', 'education', 'certifications', 'projects', 'blog', 'contact'];

export function SiteHeader() {
  const activeId = useScrollSpy(sectionIds, { rootMargin: '0% 0% -50% 0%' });
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    let lastY = window.scrollY;
    const handleScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 10);
      // Tuck the header away while scrolling down, bring it back on any upward scroll
      setHidden(y > 200 && y > lastY);
      lastY = y;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (pathname.startsWith('/admin') || pathname.startsWith('/login')) {
    return null;
  }

  const isActive = (item: (typeof navItems)[number]) =>
    pathname === '/' ? item.href === `/#${activeId}` : !!item.page && pathname.startsWith(item.page);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full px-3 pt-3 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
        hidden && !isSheetOpen && '-translate-y-[120%]'
      )}
    >
      <div
        className={cn(
          'mx-auto flex h-14 max-w-screen-2xl items-center justify-between rounded-full px-4 pl-5 transition-[background-color,border-color,box-shadow] duration-500',
          scrolled
            ? 'border border-border bg-background/75 shadow-[0_8px_30px_-12px_hsl(var(--foreground)/0.15)] backdrop-blur-xl'
            : 'border border-transparent'
        )}
      >
        <Link href="/" className="group flex items-center gap-2" aria-label="Utkristi, home">
          <LogoMark className="transition-transform duration-500 group-hover:rotate-[-8deg]" />
          <span className="font-headline text-lg font-semibold tracking-tight">Utkristi</span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm md:flex">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              data-active={isActive(item)}
              className={cn(
                'link-draw pb-0.5 transition-colors hover:text-foreground',
                isActive(item) ? 'text-foreground' : 'text-muted-foreground'
              )}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event(OPEN_PALETTE_EVENT))}
            className="hidden h-9 items-center gap-2 rounded-full border border-border px-3 text-xs text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground sm:inline-flex"
          >
            <Search className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="sr-only">Search</span>
            <kbd className="font-mono text-[10px]">⌘K</kbd>
          </button>
          <ThemeToggle />
          <Button asChild size="sm" className="group ml-1 hidden rounded-full px-4 md:inline-flex">
            <Link href="/#contact" data-magnetic data-track="cta_get_in_touch" data-track-label="header"><RollText>Get in touch</RollText></Link>
          </Button>
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="flex flex-col">
              <SheetHeader>
                <SheetTitle className="eyebrow text-left">Menu</SheetTitle>
              </SheetHeader>
              <nav className="mt-8 flex flex-col gap-2">
                {[...navItems, { name: 'Contact', href: '/#contact' }].map((item, i) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsSheetOpen(false)}
                    className="flex items-baseline gap-3 py-1 font-headline text-4xl font-semibold tracking-tight transition-colors hover:text-primary"
                  >
                    <span className="font-mono text-xs text-muted-foreground">0{i + 1}</span>
                    {item.name}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
