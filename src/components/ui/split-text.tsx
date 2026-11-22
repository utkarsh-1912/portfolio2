import { cn } from '@/lib/utils';

interface SplitTextProps {
  text: string;
  className?: string;
  /** Stagger offset (in steps of 90ms) added before the per-character delay. */
  delay?: number;
  as?: 'span' | 'h1' | 'h2' | 'h3' | 'p';
  /** The parent provides the accessible text (e.g. an `aria-label` on the heading), so add none here. */
  decorative?: boolean;
}

/**
 * Splits text into words and characters that rise into place when revealed.
 * The letters appear once in the page (no hidden duplicate for copy-paste or crawlers to pick up).
 * Screen readers get the whole text instead of single letters: headings carry it as their label,
 * other tags as a visually hidden copy unless `decorative` says the parent already names it.
 */
export function SplitText({ text, className, delay = 0, as: Tag = 'span', decorative = false }: SplitTextProps) {
  let charIndex = 0;
  const heading = Tag === 'h1' || Tag === 'h2' || Tag === 'h3';

  return (
    <Tag
      className={cn(className)}
      data-reveal="chars"
      style={{ '--i': delay } as React.CSSProperties}
      aria-label={heading && !decorative ? text : undefined}
    >
      {!heading && !decorative && <span className="sr-only">{text}</span>}
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
