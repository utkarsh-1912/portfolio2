import { cn } from '@/lib/utils';

interface SplitTextProps {
  text: string;
  className?: string;
  /** Stagger offset (in steps of 90ms) added before the per-character delay. */
  delay?: number;
  as?: 'span' | 'h1' | 'h2' | 'h3' | 'p';
}

/**
 * Splits text into words and characters that rise into place when revealed.
 * Screen readers get the plain text from a visually hidden copy; the split spans are hidden.
 */
export function SplitText({ text, className, delay = 0, as: Tag = 'span' }: SplitTextProps) {
  let charIndex = 0;

  return (
    <Tag
      className={cn(className)}
      data-reveal="chars"
      style={{ '--i': delay } as React.CSSProperties}
    >
      <span className="sr-only">{text}</span>
      {text.split(' ').map((word, w, words) => (
        <span key={w} aria-hidden="true">
          <span className="split-line">
            {Array.from(word).map((char) => (
              <span
                key={charIndex}
                className="split-char"
                style={{ '--c': charIndex++ } as React.CSSProperties}
              >
                {char}
              </span>
            ))}
          </span>
          {w < words.length - 1 && ' '}
        </span>
      ))}
    </Tag>
  );
}
