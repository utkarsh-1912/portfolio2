import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { hasLink } from '@/lib/images';

type Socials = {
    githubUrl?: string | null;
    linkedinUrl?: string | null;
    twitterUrl?: string | null;
    youtubeUrl?: string | null;
} | null | undefined;

export function getSocialLinks(data: Socials) {
    return [
        { label: 'GitHub', href: data?.githubUrl },
        { label: 'LinkedIn', href: data?.linkedinUrl },
        { label: 'X', href: data?.twitterUrl },
        { label: 'YouTube', href: data?.youtubeUrl },
    ].filter((l): l is { label: string; href: string } => hasLink(l.href));
}

/** Inline list of text social links with a small arrow, used in the hero, contact and footer. */
export function SocialLinks({ data, className }: { data: Socials; className?: string }) {
    const links = getSocialLinks(data);
    if (links.length === 0) return null;

    return (
        <ul className={cn('flex flex-wrap gap-x-6 gap-y-2 font-mono text-xs uppercase tracking-widest', className)}>
            {links.map((link) => (
                <li key={link.label}>
                    <a
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                        className="group inline-flex items-center gap-1 text-muted-foreground transition-colors hover:text-foreground"
                    >
                        <span className="link-draw">{link.label}</span>
                        <ArrowUpRight className="h-3 w-3 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </a>
                </li>
            ))}
        </ul>
    );
}
