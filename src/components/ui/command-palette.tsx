'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { usePathname, useRouter } from 'next/navigation';
import { ArrowRight, Copy, FileText, Hash, Moon, Search, Sun, Terminal, User } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';
import { articleHref } from '@/lib/site';
import { cn } from '@/lib/utils';
import { trackEvent } from '@/lib/analytics';

type Item = {
    id: string;
    group: 'Pages' | 'Sections' | 'Projects' | 'Writing' | 'Actions';
    label: string;
    hint?: string;
    keywords?: string;
    icon: React.ComponentType<{ className?: string }>;
    run: () => void;
};

export type PaletteData = {
    projects: { id: number; title: string; slug?: string | null; tags?: string[] }[];
    blogs: { id: number; title: string; url: string; slug?: string | null; hasBody?: boolean }[];
    pages: { name: string; href: string }[];
    resumeUrl?: string | null;
    email: string;
};

export const OPEN_PALETTE_EVENT = 'palette:open';

/** Scores how well `query` matches `text`: substring beats in-order letters; 0 means no match. */
function score(text: string, query: string) {
    const t = text.toLowerCase();
    const q = query.toLowerCase().trim();
    if (!q) return 1;
    const at = t.indexOf(q);
    if (at >= 0) return 100 - at;
    let i = 0;
    for (const ch of t) if (ch === q[i]) i++;
    return i === q.length ? 10 : 0;
}

/** ⌘K / Ctrl+K quick navigation across pages, sections, projects, articles and actions. */
export function CommandPalette({ data }: { data: PaletteData }) {
    const router = useRouter();
    const pathname = usePathname();
    const { theme, setTheme } = useTheme();
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [active, setActive] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLUListElement>(null);

    const close = useCallback(() => {
        setOpen(false);
        setQuery('');
        setActive(0);
    }, []);

    const go = useCallback(
        (href: string) => {
            close();
            if (href.startsWith('/#') && pathname === '/') {
                document.getElementById(href.slice(2))?.scrollIntoView({ behavior: 'smooth' });
            } else {
                router.push(href);
            }
        },
        [close, pathname, router]
    );

    const items: Item[] = useMemo(() => {
        const list: Item[] = [
            { id: 'home', group: 'Pages', label: 'Home', icon: FileText, run: () => go('/') },
            { id: 'about', group: 'Pages', label: 'About', icon: User, run: () => go('/about') },
            { id: 'projects', group: 'Pages', label: 'All projects', icon: FileText, run: () => go('/projects') },
            { id: 'blog', group: 'Pages', label: 'Writing', keywords: 'blog articles', icon: FileText, run: () => go('/blog') },
            ...data.pages.map((p) => ({ id: `page-${p.href}`, group: 'Pages' as const, label: p.name, icon: FileText, run: () => go(p.href) })),
            ...[
                ['about', 'About'],
                ['education', 'Experience', 'work timeline education'],
                ['certifications', 'Certifications'],
                ['projects', 'Selected work'],
                ['blog', 'Notes & articles'],
                ['contact', 'Contact', 'email hire message'],
            ].map(([id, label, keywords]) => ({ id: `section-${id}`, group: 'Sections' as const, label, keywords, hint: 'Home', icon: Hash, run: () => go(`/#${id}`) })),
            ...data.projects.map((p) => ({
                id: `project-${p.id}`,
                group: 'Projects' as const,
                label: p.title,
                keywords: p.tags?.join(' '),
                hint: p.slug ? 'Case study' : 'Projects',
                icon: ArrowRight,
                run: () => go(p.slug ? `/projects/${p.slug}` : '/projects'),
            })),
            ...data.blogs.map((b) => {
                const href = articleHref(b);
                return {
                    id: `blog-${b.id}`,
                    group: 'Writing' as const,
                    label: b.title,
                    hint: href.startsWith('/') ? undefined : 'External',
                    icon: FileText,
                    run: () => {
                        if (href.startsWith('/')) go(href);
                        else { close(); window.open(href, '_blank', 'noopener,noreferrer'); }
                    },
                };
            }),
            {
                id: 'theme',
                group: 'Actions',
                label: theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme',
                keywords: 'theme dark light mode',
                icon: theme === 'dark' ? Sun : Moon,
                run: () => { setTheme(theme === 'dark' ? 'light' : 'dark'); close(); },
            },
            {
                id: 'copy-email',
                group: 'Actions',
                label: 'Copy email address',
                hint: data.email,
                icon: Copy,
                run: () => { navigator.clipboard?.writeText(data.email); trackEvent('copy_email', { source: 'palette' }); close(); },
            },
            {
                id: 'terminal',
                group: 'Actions',
                label: 'Open terminal',
                hint: 'Ctrl + `',
                icon: Terminal,
                run: () => { close(); window.dispatchEvent(new KeyboardEvent('keydown', { key: '`', ctrlKey: true })); },
            },
        ];
        if (data.resumeUrl) {
            list.push({
                id: 'resume',
                group: 'Actions',
                label: 'Open resume',
                keywords: 'cv',
                icon: FileText,
                run: () => { trackEvent('resume_open', { source: 'palette' }); close(); window.open(data.resumeUrl!, '_blank', 'noopener,noreferrer'); },
            });
        }
        return list;
    }, [data, theme, setTheme, go, close]);

    const results = useMemo(() => {
        return items
            .map((item) => ({ item, s: Math.max(score(item.label, query), score(item.keywords ?? '', query) * 0.8, score(item.group, query) * 0.5) }))
            .filter((r) => r.s > 0)
            .sort((a, b) => (query ? b.s - a.s : 0))
            .map((r) => r.item);
    }, [items, query]);

    // Open with ⌘K / Ctrl+K, or from the header button via a custom event
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                setOpen((o) => !o);
            }
        };
        const onOpen = () => setOpen(true);
        window.addEventListener('keydown', onKey);
        window.addEventListener(OPEN_PALETTE_EVENT, onOpen);
        return () => {
            window.removeEventListener('keydown', onKey);
            window.removeEventListener(OPEN_PALETTE_EVENT, onOpen);
        };
    }, []);

    useEffect(() => {
        if (!open) return;
        trackEvent('palette_open');
        document.body.style.overflow = 'hidden';
        setTimeout(() => inputRef.current?.focus(), 10);
        return () => { document.body.style.overflow = ''; };
    }, [open]);

    useEffect(() => setActive(0), [query]);

    // Keep the highlighted row in view
    useEffect(() => {
        listRef.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: 'nearest' });
    }, [active]);

    if (!open || pathname.startsWith('/admin')) return null;

    const onKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(a + 1, results.length - 1)); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
        else if (e.key === 'Enter') { e.preventDefault(); results[active]?.run(); }
        else if (e.key === 'Escape') { e.preventDefault(); close(); }
    };

    let lastGroup = '';

    return createPortal(
        <div
            className="fixed inset-0 z-[250] flex items-start justify-center bg-background/60 px-4 pt-[12vh] backdrop-blur-md animate-in fade-in duration-200"
            onMouseDown={(e) => { if (e.target === e.currentTarget) close(); }}
        >
            <div role="dialog" aria-modal="true" aria-label="Command palette" className="w-full max-w-xl overflow-hidden rounded-2xl border border-border bg-card shadow-2xl animate-in slide-in-from-top-2 duration-300">
                <div className="flex items-center gap-3 border-b border-border px-4">
                    <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <input
                        ref={inputRef}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={onKeyDown}
                        placeholder="Search pages, projects, articles…"
                        aria-label="Search"
                        aria-controls="palette-results"
                        aria-activedescendant={results[active] ? `palette-${results[active].id}` : undefined}
                        className="h-14 flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
                    />
                    <kbd className="rounded-md border border-border px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">esc</kbd>
                </div>
                <ul ref={listRef} id="palette-results" role="listbox" className="max-h-[50vh] overflow-y-auto p-2">
                    {results.length === 0 && <li className="px-3 py-8 text-center text-sm text-muted-foreground">No results for “{query}”.</li>}
                    {results.map((item, i) => {
                        const header = item.group !== lastGroup ? item.group : null;
                        lastGroup = item.group;
                        return (
                            <li key={item.id} role="presentation">
                                {header && <p className="eyebrow px-3 pb-1 pt-3">{header}</p>}
                                <button
                                    type="button"
                                    id={`palette-${item.id}`}
                                    role="option"
                                    aria-selected={i === active}
                                    data-index={i}
                                    onMouseMove={() => setActive(i)}
                                    onClick={() => item.run()}
                                    className={cn('flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm', i === active ? 'bg-foreground text-background' : 'text-foreground')}
                                >
                                    <item.icon className="h-4 w-4 shrink-0 opacity-70" />
                                    <span className="min-w-0 flex-1 truncate">{item.label}</span>
                                    {item.hint && <span className={cn('shrink-0 text-xs', i === active ? 'text-background/70' : 'text-muted-foreground')}>{item.hint}</span>}
                                </button>
                            </li>
                        );
                    })}
                </ul>
                <div className="flex items-center justify-between border-t border-border px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    <span>↑↓ navigate · ↵ open</span>
                    <span>⌘K to toggle</span>
                </div>
            </div>
        </div>,
        document.body
    );
}
