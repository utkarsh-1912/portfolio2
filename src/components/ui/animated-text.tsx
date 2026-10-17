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

const Caret = () => <span className="ml-1 inline-block h-[0.8em] w-[0.35em] translate-y-[0.08em] animate-blink bg-primary" />;

/**
 * Types each phrase out, holds, deletes it, then moves on, with a blinking block caret.
 * An invisible copy of the longest phrase reserves the final height, so the layout below
 * never jumps while typing, and the caret stays glued to the last word instead of wrapping.
 */
export function AnimatedText({ phrases = [], className }: AnimatedTextProps) {
  const validPhrases = phrases?.length ? phrases : ['...'];
  const [index, setIndex] = useState(0);
  const [length, setLength] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const current = validPhrases[index % validPhrases.length];
  const longest = validPhrases.reduce((a, b) => (b.length > a.length ? b : a), '');

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

  const typed = current.slice(0, length);
  const cut = typed.lastIndexOf(' ') + 1;

  return (
    <span className={cn('inline-grid', className)}>
      {/* Screen readers get the full list once instead of every keystroke */}
      <span className="sr-only">{validPhrases.join(', ')}</span>
      {/* Height reservation: same text box as the longest phrase, never visible */}
      <span aria-hidden="true" className="invisible col-start-1 row-start-1">
        {longest}
        <Caret />
      </span>
      <span aria-hidden="true" className="col-start-1 row-start-1">
        {typed.slice(0, cut)}
        <span className="whitespace-nowrap">
          {typed.slice(cut)}
          <Caret />
        </span>
      </span>
    </span>
  );
}
