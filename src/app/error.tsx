'use client';

import { useEffect } from 'react';
import { ServerCrash, RotateCcw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error(error)
    }, [error]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
            {/* Massive background text that adds texture */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20rem] font-black text-destructive/5 select-none pointer-events-none -z-10 leading-none">
                ERROR
            </div>

            {/* Glowing orbs */}
            <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-destructive/10 rounded-full blur-[120px] -z-10" />
            <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[120px] -z-10" />

            <div className="flex flex-col items-center text-center space-y-8 max-w-2xl px-4 z-10 bg-background/40 backdrop-blur-sm p-12 rounded-3xl border border-border/50 shadow-2xl">
                <div className="relative">
                    <div className="absolute -inset-4 bg-destructive/20 blur-2xl rounded-full z-0 animate-pulse" />
                    <div className="relative w-28 h-28 bg-background border border-destructive/30 rounded-full flex items-center justify-center shadow-xl z-10">
                        <ServerCrash className="w-14 h-14 text-destructive" strokeWidth={1.5} />
                    </div>
                </div>

                <div className="space-y-4">
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
                        Unexpected Error
                    </h2>
                    <p className="text-lg md:text-xl text-muted-foreground font-medium max-w-lg mx-auto leading-relaxed">
                        Something went fundamentally wrong while loading this page. We've recorded the error and will look into it.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-6 w-full sm:w-auto">
                    <Button
                        onClick={() => reset()}
                        size="lg"
                        variant="default"
                        className="h-14 px-8 text-lg rounded-full shadow-lg hover:shadow-destructive/25 transition-all duration-300"
                    >
                        <RotateCcw className="mr-2 h-5 w-5" />
                        Try Again
                    </Button>
                    <Button
                        onClick={() => window.location.href = '/'}
                        size="lg"
                        variant="outline"
                        className="h-14 px-8 text-lg rounded-full transition-all duration-300 bg-background border-border/80"
                    >
                        <Home className="mr-2 h-5 w-5" />
                        Return Home
                    </Button>
                </div>
            </div>
        </div>
    );
}
