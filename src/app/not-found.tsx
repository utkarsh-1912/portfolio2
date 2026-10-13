import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="container flex min-h-[80svh] flex-col justify-center py-24">
            <p className="eyebrow">Error 404</p>
            <h1 className="mt-6 font-headline text-[22vw] font-semibold leading-[0.8] tracking-tighter text-foreground md:text-[14rem]">
                Lost<span className="text-primary">.</span>
            </h1>
            <p className="mt-8 max-w-md text-lg text-muted-foreground">
                This page doesn&apos;t exist, or it moved somewhere else.
            </p>
            <Link
                href="/"
                className="group mt-10 inline-flex w-fit items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background"
            >
                <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
                Back home
            </Link>
        </div>
    );
}
