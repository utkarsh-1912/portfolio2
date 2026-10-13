'use client';

import { useEffect, useState } from 'react';
import { RotateCcw, ChevronDown } from 'lucide-react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    const [showDetails, setShowDetails] = useState(false);

    useEffect(() => {
        console.error(error)
    }, [error]);

    return (
        <div className="container flex min-h-[80svh] flex-col justify-center py-24">
            <p className="eyebrow text-destructive">Something broke</p>
            <h1 className="mt-6 font-headline text-6xl font-semibold leading-[0.9] tracking-tight md:text-8xl">
                That didn&apos;t work.
            </h1>
            <p className="mt-6 max-w-md text-lg text-muted-foreground">
                An unexpected error occurred while loading this page. Trying again usually fixes it.
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
                <button
                    onClick={() => reset()}
                    className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background"
                >
                    <RotateCcw className="h-4 w-4" /> Try again
                </button>
                <a href="/" className="inline-flex items-center rounded-full border border-foreground/20 px-6 py-3 text-sm font-medium transition-colors hover:bg-foreground/5">
                    Back home
                </a>
            </div>

            <div className="mt-12 max-w-2xl">
                <button
                    onClick={() => setShowDetails(!showDetails)}
                    className="eyebrow inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
                    aria-expanded={showDetails}
                >
                    Technical details
                    <ChevronDown className={`h-3 w-3 transition-transform ${showDetails ? 'rotate-180' : ''}`} />
                </button>
                {showDetails && (
                    <pre className="mt-4 max-h-64 overflow-auto whitespace-pre-wrap break-all rounded-2xl border border-border bg-muted/40 p-4 font-mono text-xs text-muted-foreground">
                        {error.message || 'Unknown error.'}
                        {error.digest && `\n\ndigest: ${error.digest}`}
                    </pre>
                )}
            </div>
        </div>
    );
}
