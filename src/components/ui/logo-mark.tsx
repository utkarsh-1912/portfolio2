import { cn } from '@/lib/utils';

/** The </> mark: angle brackets follow the text colour, the slash is the brand purple. */
export function LogoMark({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            strokeWidth={2.25}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className={cn('h-5 w-5', className)}
        >
            <path d="m18 16 4-4-4-4" className="stroke-foreground" />
            <path d="m6 8-4 4 4 4" className="stroke-foreground" />
            <path d="m14.5 4-5 16" className="stroke-primary" />
        </svg>
    );
}
