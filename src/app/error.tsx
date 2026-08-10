'use client';

import { useEffect, useState } from 'react';
import { ServerCrash, RotateCcw, Home, ChevronDown, ChevronUp, Terminal } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
        <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden font-mono border-t border-destructive/50">
            {/* Background texture */}
            <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none"></div>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10rem] sm:text-[20rem] font-black text-destructive/5 select-none pointer-events-none -z-10 leading-none tracking-widest">
                ERR
            </div>

            <div className="flex flex-col items-center text-center space-y-6 max-w-2xl px-4 z-10 bg-background/80 backdrop-blur-sm p-8 sm:p-12 border border-destructive/30 shadow-[0_0_50px_rgba(255,0,0,0.1)] rounded-none">
                <div className="relative">
                    <div className="relative w-20 h-20 bg-destructive/10 border border-destructive/50 flex items-center justify-center z-10 rounded-none">
                        <ServerCrash className="w-10 h-10 text-destructive" strokeWidth={1.5} />
                    </div>
                </div>

                <div className="space-y-4 w-full">
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-destructive uppercase">
                        &gt; System Error Detected
                    </h2>
                    <p className="text-sm md:text-base text-muted-foreground font-medium max-w-lg mx-auto leading-relaxed">
                        A critical failure occurred during execution.
                    </p>

                    <div className="mt-6 w-full text-left">
                        <button 
                            onClick={() => setShowDetails(!showDetails)}
                            className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors mx-auto mb-2"
                        >
                            {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            {showDetails ? 'Hide Error Log' : 'View Error Log'}
                        </button>
                        
                        {showDetails && (
                            <div className="bg-muted/30 border border-destructive/20 p-4 rounded-none w-full overflow-x-auto text-xs text-destructive/80 font-mono animate-in slide-in-from-top-2">
                                <div className="flex items-center gap-2 mb-2 text-destructive border-b border-destructive/20 pb-2">
                                    <Terminal className="w-4 h-4" />
                                    <span className="font-bold">Exception Stack Trace</span>
                                </div>
                                <div className="whitespace-pre-wrap break-all">
                                    {error.message || 'Unknown error occurred.'}
                                    {error.stack && (
                                        <div className="mt-2 opacity-70">
                                            {error.stack}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-6 w-full sm:w-auto">
                    <Button
                        onClick={() => reset()}
                        size="lg"
                        variant="destructive"
                        className="h-12 px-8 text-sm rounded-none border border-destructive hover:bg-destructive/90 transition-all duration-300 uppercase tracking-widest font-bold"
                    >
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Retry Execution
                    </Button>
                    <Button
                        onClick={() => window.location.href = '/'}
                        size="lg"
                        variant="outline"
                        className="h-12 px-8 text-sm rounded-none transition-all duration-300 bg-background border-border text-foreground hover:bg-muted uppercase tracking-widest font-bold"
                    >
                        <Home className="mr-2 h-4 w-4" />
                        Root Directory
                    </Button>
                </div>
            </div>
        </div>
    );
}
