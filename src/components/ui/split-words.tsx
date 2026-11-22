import { cn } from '@/lib/utils';

/**
 * Splits a paragraph into words that fade up out of a slight blur one after another
 * when revealed. The text appears once in the page, for screen readers and copy-paste alike.
 */
export function SplitWords({ text, className, as: Tag = 'p' }: { text: string; className?: string; as?: 'p' | 'span' }) {
    const words = text.split(/\s+/);
    return (
        <Tag className={cn(className)} data-reveal="words">
            {/* Words stay readable as-is, so there's no hidden duplicate copy */}
            {words.map((word, i) => (
                <span key={i}>
                    <span className="split-word" style={{ '--w': i } as React.CSSProperties}>{word}</span>
                    {i < words.length - 1 && ' '}
                </span>
            ))}
        </Tag>
    );
}
