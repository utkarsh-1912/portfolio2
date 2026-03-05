'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedTextProps {
  phrases: string[];
  className?: string;
}

export function AnimatedText({ phrases = [], className }: AnimatedTextProps) {
  const validPhrases = phrases?.length ? phrases : ['...'];
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [text, setText] = useState('');
  const typingSpeed = 150;
  const deletingSpeed = 75;
  const delay = 2000;

  useEffect(() => {
    if (subIndex === validPhrases[index].length + 1 && !isDeleting) {
      setTimeout(() => setIsDeleting(true), delay);
      return;
    }

    if (subIndex === 0 && isDeleting) {
      setIsDeleting(false);
      setIndex((prev) => (prev + 1) % validPhrases.length);
      return;
    }

    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (isDeleting ? -1 : 1));
    }, isDeleting ? deletingSpeed : typingSpeed);

    return () => clearTimeout(timeout);
  }, [subIndex, index, isDeleting, validPhrases, typingSpeed, deletingSpeed, delay]);

  useEffect(() => {
    const nextText = validPhrases[index].substring(0, subIndex);
    setText(nextText);
  }, [subIndex, index, validPhrases]);

  return (
    <span className={cn('text-primary', className)}>
      {text}
      <span className="inline-block animate-pulse ml-[2px]">_</span>
    </span>
  );
}
