'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';
import { Button } from '@/components/ui/button';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button variant="ghost" size="icon" className="relative rounded-full" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      <Sun className="h-[1.1rem] w-[1.1rem] rotate-0 scale-100 transition-all duration-500 dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.1rem] w-[1.1rem] rotate-90 scale-0 transition-all duration-500 dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
