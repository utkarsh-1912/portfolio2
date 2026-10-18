import { cn } from '@/lib/utils';

/**
 * Splits a paragraph into words that fade up out of a slight blur one after another
 * when revealed. Screen readers get the plain text.
 */
export function SplitWords({ text, className, as: Tag = 'p' }: { text: string; className?: string; as?: 'p' | 'span' }) {
    const words = text.split(/\s+/);
    return (
        <Tag className={cn(className)} data-reveal="words">
            <span className="sr-only">{text}</span>
            {words.map((word, i) => (
                <span key={i} aria-hidden="true">
                    <span className="split-word" style={{ '--w': i } as React.CSSProperties}>{word}</span>
                    {i < words.length - 1 && ' '}
                </span>
            ))}
        </Tag>
    );
}
