'use client';

import Link from 'next/link';
import { ThemeToggle } from '@/components/theme-toggle';
import { Code2, Menu } from 'lucide-react';
import { Button } from '../ui/button';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import { useScrollSpy } from '@/hooks/use-scroll-spy';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'About', href: '/#about' },
  { name: 'Experience', href: '/#education' },
  { name: 'Projects', href: '/#projects' },
  { name: 'Blog', href: '/blog' },
  { name: 'Contact', href: '/#contact' },
];

const sectionIds = ['hero', 'about', 'education', 'projects', 'contact'];

export function SiteHeader() {
  const activeId = useScrollSpy(sectionIds, { rootMargin: '0% 0% -50% 0%' });

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Code2 className="h-6 w-6 text-primary" />
          <span className="font-bold font-headline">Utkristi</span>
        </Link>
        <nav className="hidden flex-1 md:flex items-center gap-6 text-sm font-medium">
          {navItems.map((item) => {
            const isActive = item.href === `/#${activeId}`;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'transition-colors hover:text-primary',
                  isActive && activeId !== 'hero' ? 'text-primary' : 'text-foreground/60'
                )}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <ThemeToggle />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col gap-6 pt-12">
                <Link href="/" className="mr-6 flex items-center space-x-2">
                  <Code2 className="h-6 w-6 text-primary" />
                  <span className="font-bold font-headline">Utkristi</span>
                </Link>
                {navItems.map((item) => {
                  const isActive = item.href === `/#${activeId}`;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        'text-lg font-medium transition-colors hover:text-primary',
                        isActive && activeId !== 'hero' ? 'text-primary' : 'text-foreground'
                      )}
                    >
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
