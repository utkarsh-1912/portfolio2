/**
 * In-page loading state: the </> mark redraws on a loop in the content area,
 * so a slow page never shows an empty space between the header and footer.
 */
export function PageLoader({ label = 'Loading' }: { label?: string }) {
    return (
        <div role="status" aria-live="polite" className="flex min-h-[70svh] flex-col items-center justify-center gap-6">
            <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="h-14 w-14" aria-hidden="true">
                <path pathLength={1} d="m6 8-4 4 4 4" className="loader-draw stroke-foreground" />
                <path pathLength={1} d="m18 16 4-4-4-4" className="loader-draw stroke-foreground [animation-delay:150ms]" />
                <path pathLength={1} d="m14.5 4-5 16" className="loader-draw stroke-primary [animation-delay:300ms]" />
            </svg>
            <span className="eyebrow">{label}…</span>
        </div>
    );
}
