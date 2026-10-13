'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedTextProps {
  phrases: string[];
  className?: string;
}

const TYPING_MS = 90;
const DELETING_MS = 45;
const HOLD_MS = 2200;

/** Types each phrase out, holds, deletes it, then moves on, with a blinking block caret. */
export function AnimatedText({ phrases = [], className }: AnimatedTextProps) {
  const validPhrases = phrases?.length ? phrases : ['...'];
  const [index, setIndex] = useState(0);
  const [length, setLength] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const current = validPhrases[index % validPhrases.length];

  useEffect(() => {
    if (!isDeleting && length === current.length) {
      const t = setTimeout(() => setIsDeleting(true), HOLD_MS);
      return () => clearTimeout(t);
    }
    if (isDeleting && length === 0) {
      setIsDeleting(false);
      setIndex((prev) => (prev + 1) % validPhrases.length);
      return;
    }
    const t = setTimeout(() => setLength((l) => l + (isDeleting ? -1 : 1)), isDeleting ? DELETING_MS : TYPING_MS);
    return () => clearTimeout(t);
  }, [length, isDeleting, current, validPhrases.length]);

  return (
    <span className={cn(className)}>
      {/* Screen readers get the full list once instead of every keystroke */}
      <span className="sr-only">{validPhrases.join(', ')}</span>
      <span aria-hidden="true">
        {current.slice(0, length)}
        <span className="ml-1 inline-block h-[0.8em] w-[0.4em] translate-y-[0.08em] animate-blink bg-primary" />
      </span>
    </span>
  );
}
