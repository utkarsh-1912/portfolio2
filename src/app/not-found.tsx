import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, SearchX } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
            {/* Massive background text that adds texture */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[30rem] font-black text-muted/10 select-none pointer-events-none -z-10 leading-none">
                404
            </div>

            {/* Glowing orbs */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] -z-10" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[100px] -z-10" />

            <div className="flex flex-col items-center text-center space-y-8 max-w-2xl px-4 z-10">
                <div className="relative">
                    <div className="absolute -inset-4 bg-primary/20 blur-2xl rounded-full z-0" />
                    <div className="relative w-32 h-32 bg-background border-2 border-primary/20 rounded-full flex items-center justify-center shadow-2xl z-10">
                        <SearchX className="w-16 h-16 text-primary" strokeWidth={1.5} />
                    </div>
                </div>

                <div className="space-y-4">
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground">
                        Page Not Found
                    </h1>
                    <p className="text-xl md:text-2xl text-muted-foreground font-medium max-w-xl mx-auto">
                        We searched the entire portfolio, but couldn't find the page you were looking for.
                    </p>
                </div>

                <div className="pt-8">
                    <Button asChild size="lg" className="h-14 px-8 text-lg rounded-full shadow-xl hover:shadow-primary/25 hover:-translate-y-1 transition-all duration-300">
                        <Link href="/">
                            <Home className="mr-2 h-5 w-5" />
                            Return Home
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
