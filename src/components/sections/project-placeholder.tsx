import { cn } from '@/lib/utils';

/**
 * Typographic tile shown when a project has no screenshot yet:
 * the title set large over a soft accent wash, with the stack in mono.
 */
export function ProjectPlaceholder({ title, tags, className }: { title: string; tags: string[]; className?: string }) {
    return (
        <div aria-hidden="true" className={cn('absolute inset-0 flex flex-col justify-between overflow-hidden bg-muted p-6 sm:p-8', className)}>
            <span aria-hidden="true" className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-primary/15 blur-3xl" />
            <span aria-hidden="true" className="pointer-events-none absolute -bottom-24 -left-10 h-56 w-56 rounded-full bg-foreground/5 blur-2xl" />
            <p className="relative font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                {tags.slice(0, 3).join(' · ')}
            </p>
            <p className="relative font-headline text-4xl font-semibold leading-[0.95] tracking-tight text-foreground/90 sm:text-5xl">
                {title}
            </p>
        </div>
    );
}
