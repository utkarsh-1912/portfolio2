import { cn } from '@/lib/utils';

/** Page header used at the top of every admin screen: mono eyebrow, display title, optional action. */
export function AdminPageHeader({
    eyebrow,
    title,
    description,
    action,
    className,
}: {
    eyebrow: string;
    title: string;
    description?: React.ReactNode;
    action?: React.ReactNode;
    className?: string;
}) {
    return (
        <header className={cn('flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between', className)}>
            <div>
                <p className="eyebrow">{eyebrow}</p>
                <h1 className="mt-3 font-headline text-4xl font-semibold tracking-tight md:text-5xl">{title}</h1>
                {description && <p className="mt-3 max-w-xl text-muted-foreground">{description}</p>}
            </div>
            {action && <div className="shrink-0">{action}</div>}
        </header>
    );
}
