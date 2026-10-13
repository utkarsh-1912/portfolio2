import { cn } from '@/lib/utils';
import { SplitText } from './split-text';
import { ScrambleText } from './scramble-text';

interface SectionHeadingProps {
    /** Two-digit section number shown in the mono eyebrow, e.g. "02". */
    index?: string;
    label: string;
    title: string;
    intro?: React.ReactNode;
    /** Use "h1" for page headers on sub-pages. */
    as?: 'h1' | 'h2';
    className?: string;
    children?: React.ReactNode;
}

/**
 * Editorial section header: a mono eyebrow with a rule, a large display title that
 * rises in per character, and an optional intro set to the right on wide screens.
 */
export function SectionHeading({ index, label, title, intro, as = 'h2', className, children }: SectionHeadingProps) {
    return (
        <header className={cn('mb-14 md:mb-20', className)}>
            <div data-reveal="up" className="eyebrow flex items-center gap-4">
                {index && <span className="text-primary">({index})</span>}
                <ScrambleText text={label} />
                <span className="rule-draw h-px flex-1 bg-border" />
            </div>
            <div className="mt-6 grid gap-6 md:grid-cols-12 md:items-end">
                <SplitText
                    as={as}
                    text={title}
                    className="md:col-span-8 font-headline text-4xl font-semibold leading-[0.95] tracking-tight text-foreground sm:text-5xl lg:text-7xl"
                />
                {intro && (
                    <div
                        data-reveal="up"
                        style={{ '--i': 2 } as React.CSSProperties}
                        className="md:col-span-4 text-base text-muted-foreground md:text-lg md:pb-2"
                    >
                        {intro}
                    </div>
                )}
            </div>
            {children}
        </header>
    );
}
