'use client';

import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Terminal as TerminalIcon, ArrowUpRight, CornerDownLeft } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';
import { LogoMark } from '@/components/ui/logo-mark';
import { cn } from '@/lib/utils';

type TerminalData = {
    hero: any;
    about: any;
    projects: any[];
    blogs: any[];
    education: any[];
    skills: any[];
    certifications?: any[];
};

type Entry = { id: number; kind: 'input' | 'output'; content: React.ReactNode };

type Command = {
    name: string;
    aliases?: string[];
    usage?: string;
    description: string;
    /** Values offered by Tab-completion for the first argument. */
    complete?: () => string[];
    run: (args: string[]) => React.ReactNode | void;
};

const EMAIL = 'utkarshofficial1912@gmail.com';
const PHONE = '(+91) 639-494-8921';
const HISTORY_KEY = 'utkristi-terminal-history';
const SECTIONS = ['about', 'experience', 'certifications', 'projects', 'blog', 'contact'] as const;
const SECTION_IDS: Record<string, string> = { experience: 'education', blog: 'blog' };
const QUICK = ['help', 'whoami', 'projects', 'skills', 'experience', 'certs', 'blogs', 'contact'];

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

/** Levenshtein distance, for "did you mean" suggestions. */
function distance(a: string, b: string) {
    const dp = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
    for (let j = 1; j <= b.length; j++) dp[0][j] = j;
    for (let i = 1; i <= a.length; i++)
        for (let j = 1; j <= b.length; j++)
            dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    return dp[a.length][b.length];
}

// ── Small output building blocks ────────────────────────────────
const Muted = ({ children }: { children: React.ReactNode }) => <span className="text-muted-foreground">{children}</span>;
const Accent = ({ children }: { children: React.ReactNode }) => <span className="text-primary">{children}</span>;
const Row = ({ k, v }: { k: string; v: React.ReactNode }) => (
    <div className="flex gap-3">
        <span className="w-24 shrink-0 text-primary">{k}</span>
        <span className="min-w-0 text-foreground/90">{v}</span>
    </div>
);
const ExtLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-0.5 text-foreground underline decoration-border underline-offset-4 hover:decoration-primary">
        {children}
        <ArrowUpRight className="h-3 w-3" />
    </a>
);

export function TerminalUI({ data }: { data?: TerminalData }) {
    const router = useRouter();
    const pathname = usePathname();
    const { theme, setTheme } = useTheme();
    const [isOpen, setIsOpen] = useState(false);
    const [entries, setEntries] = useState<Entry[]>([]);
    const [input, setInput] = useState('');
    const [past, setPast] = useState<string[]>([]);
    const [pastIndex, setPastIndex] = useState(-1);
    const [booted, setBooted] = useState(false);
    const idRef = useRef(0);
    const bodyRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const projects = data?.projects ?? [];
    const blogs = data?.blogs ?? [];
    const name = data?.hero?.title || 'Utkarsh Gupta';

    const push = useCallback((kind: Entry['kind'], content: React.ReactNode) => {
        setEntries((prev) => [...prev, { id: idRef.current++, kind, content }]);
    }, []);

    const findProject = (q: string) =>
        /^\d+$/.test(q) ? projects[Number(q) - 1] : projects.find((p) => slug(p.title).startsWith(slug(q)));
    const findBlog = (q: string) =>
        /^\d+$/.test(q) ? blogs[Number(q) - 1] : blogs.find((b) => slug(b.title).startsWith(slug(q)));

    const neofetch = (
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl border border-border bg-muted/50">
                <LogoMark className="h-12 w-12" />
            </div>
            <div className="space-y-0.5 text-[13px]">
                <div><Accent>guest</Accent>@<Accent>utkristi</Accent></div>
                <div className="text-muted-foreground">────────────────</div>
                <Row k="name" v={name} />
                <Row k="role" v="Software Engineer · Trading Systems · Agentic AI" />
                <Row k="projects" v={`${projects.length} published`} />
                <Row k="writing" v={`${blogs.length} articles`} />
                <Row k="certs" v={`${data?.certifications?.length ?? 0}`} />
                <Row k="shell" v="utkristi-sh 2.0" />
                <div className="flex gap-1.5 pt-2">
                    {['bg-foreground', 'bg-primary', 'bg-primary/60', 'bg-primary/30', 'bg-muted-foreground', 'bg-border'].map((c) => (
                        <span key={c} className={cn('h-3 w-5 rounded-sm', c)} />
                    ))}
                </div>
            </div>
        </div>
    );

    const commands: Command[] = useMemo(() => {
        const list: Command[] = [
            {
                name: 'help',
                description: 'List available commands',
                run: () => (
                    <div className="grid gap-x-6 gap-y-1 sm:grid-cols-2">
                        {list.filter((c) => !c.name.startsWith('_')).map((c) => (
                            <div key={c.name} className="flex gap-3">
                                <button type="button" onClick={() => runRef.current(c.name)} className="w-28 shrink-0 text-left text-primary hover:underline">
                                    {c.usage ?? c.name}
                                </button>
                                <Muted>{c.description}</Muted>
                            </div>
                        ))}
                        <div className="pt-2 text-muted-foreground sm:col-span-2">Tip: press <Accent>Tab</Accent> to autocomplete, <Accent>↑ ↓</Accent> for history.</div>
                    </div>
                ),
            },
            { name: 'whoami', aliases: ['neofetch'], description: 'Who is behind this site', run: () => neofetch },
            {
                name: 'about',
                description: 'Short bio',
                run: () =>
                    data?.about?.paragraphs?.length ? (
                        <div className="max-w-2xl space-y-2 border-l border-border pl-4">
                            {data.about.paragraphs.map((p: string, i: number) => <p key={i} className="leading-relaxed text-foreground/90">{p}</p>)}
                        </div>
                    ) : 'No bio found.',
            },
            {
                name: 'projects',
                aliases: ['ls'],
                description: 'List projects',
                run: () =>
                    projects.length ? (
                        <div className="space-y-1">
                            {projects.map((p, i) => (
                                <button key={p.id} type="button" onClick={() => runRef.current(`open ${i + 1}`)} className="group flex w-full gap-3 text-left">
                                    <Muted>{String(i + 1).padStart(2, '0')}</Muted>
                                    <span className="text-foreground group-hover:text-primary">{p.title}</span>
                                    <span className="hidden truncate text-muted-foreground sm:inline">— {p.tags?.slice(0, 3).join(', ')}</span>
                                </button>
                            ))}
                            <div className="pt-1 text-muted-foreground">Run <Accent>open &lt;number|name&gt;</Accent> for details.</div>
                        </div>
                    ) : 'No projects found.',
            },
            {
                name: 'open',
                usage: 'open <project>',
                description: 'Project details',
                complete: () => projects.map((p) => slug(p.title)),
                run: (args) => {
                    if (!args[0]) return 'Usage: open <number|name>';
                    const p = findProject(args.join(' '));
                    if (!p) return `open: no project matching "${args.join(' ')}". Try "projects".`;
                    return (
                        <div className="max-w-2xl rounded-2xl border border-border bg-card p-5">
                            <p className="text-xs uppercase tracking-widest text-muted-foreground">{p.tags?.join(' · ')}</p>
                            <p className="mt-2 font-headline text-xl font-semibold text-foreground">{p.title}</p>
                            <p className="mt-2 leading-relaxed text-foreground/80">{p.description}</p>
                            <div className="mt-4 flex gap-5">
                                {p.liveUrl && p.liveUrl !== '#' && <ExtLink href={p.liveUrl}>live</ExtLink>}
                                {p.githubUrl && p.githubUrl !== '#' && <ExtLink href={p.githubUrl}>source</ExtLink>}
                            </div>
                        </div>
                    );
                },
            },
            {
                name: 'blogs',
                description: 'List articles',
                run: () =>
                    blogs.length ? (
                        <div className="space-y-1">
                            {blogs.map((b, i) => (
                                <div key={b.id} className="flex gap-3">
                                    <Muted>{String(i + 1).padStart(2, '0')}</Muted>
                                    <ExtLink href={b.url}>{b.title}</ExtLink>
                                </div>
                            ))}
                            <div className="pt-1 text-muted-foreground">Run <Accent>read &lt;number&gt;</Accent> to open one.</div>
                        </div>
                    ) : 'No articles found.',
            },
            {
                name: 'read',
                usage: 'read <article>',
                description: 'Open an article',
                complete: () => blogs.map((b) => slug(b.title)),
                run: (args) => {
                    const b = args[0] && findBlog(args.join(' '));
                    if (!b) return 'Usage: read <number|name>';
                    window.open(b.url, '_blank', 'noopener,noreferrer');
                    return <>Opening <Accent>{b.title}</Accent> in a new tab…</>;
                },
            },
            {
                name: 'experience',
                aliases: ['education', 'timeline'],
                description: 'Work & education',
                run: () =>
                    data?.education?.length ? (
                        <div className="space-y-3 border-l border-border pl-4">
                            {data.education.map((e: any) => (
                                <div key={e.id}>
                                    <Muted>{e.duration}</Muted>
                                    <div className="text-foreground">{e.degree} <Muted>@ {e.institution}</Muted></div>
                                </div>
                            ))}
                        </div>
                    ) : 'No timeline entries found.',
            },
            {
                name: 'skills',
                aliases: ['stack'],
                description: 'Tech stack',
                run: () =>
                    data?.skills?.length ? (
                        <div className="space-y-1">
                            {data.skills.map((s: any) => (
                                <Row key={s.id ?? s.category} k={s.category.split(' ')[0].toLowerCase()} v={s.items.map((i: any) => i.name).join(', ')} />
                            ))}
                        </div>
                    ) : 'No skills loaded.',
            },
            {
                name: 'certs',
                aliases: ['certifications'],
                description: 'Certifications',
                run: () => {
                    const certs = data?.certifications ?? [];
                    if (!certs.length) return 'No certifications listed yet.';
                    return (
                        <div className="space-y-1">
                            {certs.map((c: any) => (
                                <div key={c.id} className="flex flex-wrap gap-x-3">
                                    <Accent>✓</Accent>
                                    <span className="text-foreground">{c.title}</span>
                                    <Muted>{c.issuer}{c.issueDate ? ` · ${c.issueDate.slice(0, 7)}` : ''}</Muted>
                                    {c.credentialUrl && <ExtLink href={c.credentialUrl}>verify</ExtLink>}
                                </div>
                            ))}
                        </div>
                    );
                },
            },
            {
                name: 'contact',
                aliases: ['email'],
                description: 'How to reach me',
                run: () => (
                    <div className="space-y-1">
                        <Row k="email" v={<a href={`mailto:${EMAIL}`} className="underline decoration-border underline-offset-4 hover:decoration-primary">{EMAIL}</a>} />
                        <Row k="phone" v={<a href="tel:+916394948921">{PHONE}</a>} />
                        <Row k="form" v={<button type="button" onClick={() => runRef.current('goto contact')} className="underline decoration-border underline-offset-4 hover:decoration-primary">goto contact</button>} />
                    </div>
                ),
            },
            {
                name: 'socials',
                description: 'Profiles elsewhere',
                run: () => {
                    const links = [
                        ['github', data?.hero?.githubUrl],
                        ['linkedin', data?.hero?.linkedinUrl],
                        ['x', data?.hero?.twitterUrl],
                        ['youtube', data?.hero?.youtubeUrl],
                    ].filter(([, href]) => href && href !== '#');
                    return <div className="space-y-1">{links.map(([k, href]) => <Row key={k} k={k} v={<ExtLink href={href}>{href.replace(/^https?:\/\/(www\.)?/, '')}</ExtLink>} />)}</div>;
                },
            },
            {
                name: 'goto',
                usage: 'goto <section>',
                description: 'Jump to a section',
                complete: () => [...SECTIONS],
                run: (args) => {
                    const target = args[0]?.toLowerCase();
                    if (!target || !SECTIONS.includes(target as any)) return `Usage: goto <${SECTIONS.join('|')}>`;
                    const id = SECTION_IDS[target] ?? target;
                    setTimeout(() => {
                        setIsOpen(false);
                        if (pathname === '/') document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
                        else router.push(`/#${id}`);
                    }, 250);
                    return <>Navigating to <Accent>{target}</Accent>…</>;
                },
            },
            {
                name: 'theme',
                usage: 'theme [light|dark]',
                description: 'Switch colour theme',
                complete: () => ['light', 'dark'],
                run: (args) => {
                    const next = args[0] === 'light' || args[0] === 'dark' ? args[0] : theme === 'light' ? 'dark' : 'light';
                    setTheme(next);
                    return <>Theme set to <Accent>{next}</Accent>.</>;
                },
            },
            {
                name: 'history',
                description: 'Previous commands',
                run: () => (past.length ? <div>{past.map((c, i) => <div key={i}><Muted>{String(i + 1).padStart(3, ' ')}</Muted>  {c}</div>)}</div> : 'No history yet.'),
            },
            { name: 'date', description: 'Current date & time', run: () => new Date().toString() },
            { name: 'echo', usage: 'echo <text>', description: 'Print text', run: (args) => args.join(' ') },
            { name: 'clear', aliases: ['cls'], description: 'Clear the screen', run: () => { setEntries([]); } },
            { name: 'exit', aliases: ['quit', 'q'], description: 'Close the terminal', run: () => { setTimeout(() => setIsOpen(false), 200); return 'Bye 👋'; } },
            // Easter eggs, hidden from help
            { name: '_sudo', aliases: ['sudo'], description: '', run: () => <>Nice try. This incident will be reported to <Accent>/dev/null</Accent>.</> },
            { name: '_rm', aliases: ['rm'], description: '', run: () => 'rm: permission denied (and please don\'t).' },
            { name: '_coffee', aliases: ['coffee'], description: '', run: () => '☕  Brewing… done. Back to shipping.' },
        ];
        return list;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, theme, past, pathname]);

    const lookup = useCallback(
        (name: string) => commands.find((c) => c.name === name || c.aliases?.includes(name)),
        [commands]
    );

    const run = useCallback(
        (raw: string) => {
            const line = raw.trim();
            if (!line) return;
            const [cmdName, ...args] = line.split(/\s+/);
            const cmd = lookup(cmdName.toLowerCase());
            push('input', line);
            setPast((prev) => {
                const next = [...prev.filter((p) => p !== line), line].slice(-50);
                try { sessionStorage.setItem(HISTORY_KEY, JSON.stringify(next)); } catch { /* storage unavailable */ }
                return next;
            });
            setPastIndex(-1);

            if (!cmd) {
                const names = commands.filter((c) => !c.name.startsWith('_')).map((c) => c.name);
                const best = names.map((n) => [n, distance(cmdName, n)] as const).sort((a, b) => a[1] - b[1])[0];
                push(
                    'output',
                    <>
                        <span className="text-destructive">command not found:</span> {cmdName}
                        {best && best[1] <= 2 && (
                            <> — did you mean <button type="button" onClick={() => runRef.current([best[0], ...args].join(' '))} className="text-primary underline underline-offset-4">{best[0]}</button>?</>
                        )}
                    </>
                );
                return;
            }
            const out = cmd.run(args);
            if (out !== undefined && cmd.name !== 'clear') push('output', out);
        },
        [commands, lookup, push]
    );

    // Lets clickable output (e.g. project rows) run commands without stale closures
    const runRef = useRef(run);
    runRef.current = run;

    // Restore session history
    useEffect(() => {
        try {
            const saved = JSON.parse(sessionStorage.getItem(HISTORY_KEY) || '[]');
            if (Array.isArray(saved)) setPast(saved);
        } catch { /* ignore */ }
    }, []);

    // Ctrl+` toggles from anywhere
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.key === '`') { e.preventDefault(); setIsOpen((p) => !p); }
            if (e.key === 'Escape') setIsOpen(false);
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, []);

    // Boot sequence on first open
    useEffect(() => {
        if (!isOpen || booted) return;
        setBooted(true);
        const lines = ['Booting utkristi-sh 2.0…', `Loaded ${projects.length} projects, ${blogs.length} articles.`];
        lines.forEach((l, i) => setTimeout(() => push('output', <Muted>{l}</Muted>), i * 180));
        setTimeout(() => {
            push('output', neofetch);
            push('output', <>Type <Accent>help</Accent> to see what I can do.</>);
        }, lines.length * 180 + 120);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            setTimeout(() => inputRef.current?.focus(), 50);
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    useEffect(() => {
        bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: 'smooth' });
    }, [entries]);

    // ── Autocomplete ──
    const [head, ...rest] = input.split(' ');
    const typingArg = input.includes(' ');
    const candidates = useMemo(() => {
        if (!input) return [];
        if (!typingArg) {
            const names = commands.filter((c) => !c.name.startsWith('_')).flatMap((c) => [c.name, ...(c.aliases ?? [])]);
            return [...new Set(names)].filter((n) => n.startsWith(head.toLowerCase()) && n !== head.toLowerCase()).slice(0, 6);
        }
        const cmd = lookup(head.toLowerCase());
        const partial = rest.join(' ').toLowerCase();
        return (cmd?.complete?.() ?? []).filter((v) => v.startsWith(partial) && v !== partial).slice(0, 6).map((v) => `${head} ${v}`);
    }, [input, head, rest, typingArg, commands, lookup]);
    const ghost = candidates[0]?.startsWith(input) ? candidates[0].slice(input.length) : '';

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            if (candidates[0]) setInput(candidates[0] + (typingArg ? '' : ' '));
        } else if (e.key === 'ArrowRight' && ghost && e.currentTarget.selectionStart === input.length) {
            setInput(input + ghost);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (!past.length) return;
            const next = Math.min(pastIndex + 1, past.length - 1);
            setPastIndex(next);
            setInput(past[past.length - 1 - next]);
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            const next = pastIndex - 1;
            setPastIndex(Math.max(next, -1));
            setInput(next >= 0 ? past[past.length - 1 - next] : '');
        } else if (e.key === 'l' && e.ctrlKey) {
            e.preventDefault();
            setEntries([]);
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        run(input);
        setInput('');
    };

    if (pathname.startsWith('/admin') || pathname.startsWith('/login')) return null;

    return (
        <>
            {/* Launcher */}
            {!isOpen && (
                <button
                    type="button"
                    onClick={() => setIsOpen(true)}
                    title="Open terminal (Ctrl + `)"
                    data-magnetic
                    className="group fixed bottom-6 right-6 z-[100] flex h-12 items-center gap-2 rounded-full border border-border bg-foreground pl-3.5 pr-3.5 text-background shadow-lg transition-[padding] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] animate-in fade-in zoom-in hover:pr-5"
                >
                    <TerminalIcon className="h-5 w-5" />
                    <span className="max-w-0 overflow-hidden whitespace-nowrap font-mono text-xs transition-[max-width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:max-w-[8rem]">
                        Terminal <span className="opacity-60">⌃`</span>
                    </span>
                    <span className="sr-only">Open terminal</span>
                </button>
            )}

            {isOpen && (
                <div
                    className="fixed inset-0 z-[150] flex items-end justify-center bg-background/60 backdrop-blur-md animate-in fade-in duration-300 sm:items-center sm:p-6"
                    onClick={(e) => { if (e.target === e.currentTarget) setIsOpen(false); }}
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-label="Terminal"
                        className="flex h-[100svh] w-full flex-col overflow-hidden border border-border bg-card font-mono text-[13px] shadow-2xl animate-in slide-in-from-bottom-6 duration-500 sm:h-[min(640px,85svh)] sm:max-w-3xl sm:rounded-2xl"
                    >
                        {/* Title bar */}
                        <div className="flex shrink-0 items-center gap-3 border-b border-border px-4 py-3">
                            <div className="flex gap-1.5">
                                <button type="button" aria-label="Close terminal" onClick={() => setIsOpen(false)} className="h-3 w-3 rounded-full bg-[#ff5f57] transition-opacity hover:opacity-80" />
                                <button type="button" aria-label="Clear terminal" onClick={() => setEntries([])} className="h-3 w-3 rounded-full bg-[#febc2e] transition-opacity hover:opacity-80" />
                                <span className="h-3 w-3 rounded-full bg-[#28c840]" />
                            </div>
                            <span className="flex-1 truncate text-center text-xs text-muted-foreground">guest@utkristi: ~</span>
                            <span className="hidden text-[11px] text-muted-foreground sm:inline">esc to close</span>
                        </div>

                        {/* Output */}
                        <div ref={bodyRef} className="flex-1 overflow-y-auto px-4 py-5 sm:px-6" onClick={() => inputRef.current?.focus()}>
                            {entries.map((entry) => (
                                <div key={entry.id} className="mb-3 animate-in fade-in slide-in-from-bottom-1 duration-300">
                                    {entry.kind === 'input' ? (
                                        <div className="flex gap-2">
                                            <span className="text-primary">❯</span>
                                            <span className="break-all text-foreground">{entry.content}</span>
                                        </div>
                                    ) : (
                                        <div className="whitespace-pre-wrap text-foreground/80">{entry.content}</div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Suggestions + quick commands */}
                        <div className="flex shrink-0 gap-2 overflow-x-auto border-t border-border px-4 py-2.5 [scrollbar-width:none] sm:px-6">
                            {(candidates.length ? candidates : QUICK).map((c) => (
                                <button
                                    key={c}
                                    type="button"
                                    onClick={() => {
                                        // Commands that take an argument get pre-filled; everything else runs straight away
                                        if (!c.includes(' ') && lookup(c)?.complete) { setInput(c + ' '); inputRef.current?.focus(); }
                                        else { run(c); setInput(''); }
                                    }}
                                    className="shrink-0 rounded-full border border-border px-3 py-1 text-[11px] text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground"
                                >
                                    {c}
                                </button>
                            ))}
                        </div>

                        {/* Prompt */}
                        <form onSubmit={submit} className="flex shrink-0 items-center gap-2 border-t border-border px-4 py-3.5 sm:px-6">
                            <span className="text-primary">❯</span>
                            <div className="relative flex-1">
                                {/* Inline ghost completion */}
                                <span aria-hidden="true" className="pointer-events-none absolute inset-0 whitespace-pre text-muted-foreground/50">
                                    <span className="invisible">{input}</span>
                                    {ghost}
                                </span>
                                <input
                                    ref={inputRef}
                                    value={input}
                                    onChange={(e) => { setInput(e.target.value); setPastIndex(-1); }}
                                    onKeyDown={onKeyDown}
                                    aria-label="Terminal command"
                                    placeholder={entries.length ? '' : 'type a command…'}
                                    className="relative w-full bg-transparent text-foreground caret-primary outline-none placeholder:text-muted-foreground/50"
                                    spellCheck={false}
                                    autoComplete="off"
                                    autoCapitalize="off"
                                    autoCorrect="off"
                                    enterKeyHint="send"
                                />
                            </div>
                            <button type="submit" disabled={!input.trim()} aria-label="Run command" className="rounded-full p-1.5 text-muted-foreground transition-colors hover:text-foreground disabled:opacity-30">
                                <CornerDownLeft className="h-4 w-4" />
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
