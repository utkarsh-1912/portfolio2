import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, SearchX } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden font-mono border-t border-primary/20">
            {/* Background texture */}
            <div className="absolute inset-0 bg-dot-matrix opacity-20 pointer-events-none"></div>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10rem] sm:text-[30rem] font-black text-primary/5 select-none pointer-events-none -z-10 leading-none">
                404
            </div>

            <div className="flex flex-col items-center text-center space-y-6 max-w-2xl px-4 z-10">
                <div className="relative">
                    <div className="relative w-20 h-20 bg-background border-2 border-primary/50 rounded-none flex items-center justify-center z-10">
                        <SearchX className="w-10 h-10 text-primary" strokeWidth={1.5} />
                    </div>
                </div>

                <div className="space-y-4">
                    <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-primary uppercase">
                        &gt; 404: route_not_found
                    </h1>
                    <p className="text-sm md:text-base text-muted-foreground font-medium max-w-xl mx-auto">
                        The requested path could not be resolved. Please verify your URL or return to the index.
                    </p>
                </div>

                <div className="pt-8">
                    <Button asChild size="lg" className="h-12 px-8 text-sm rounded-none border border-primary hover:bg-primary/20 hover:text-primary transition-all duration-300 bg-primary/10 text-primary uppercase tracking-widest font-bold">
                        <Link href="/">
                            <Home className="mr-2 h-4 w-4" />
                            Return to Index
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
