'use client';

import { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, ExternalLink, Github, Send, X, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

type TerminalData = {
    hero: any;
    about: any;
    projects: any[];
    blogs: any[];
    education: any[];
    skills: any[];
};

// Quick commands shown as tap-able chips on mobile
const QUICK_COMMANDS = ['help', 'about', 'projects', 'skills', 'education', 'blogs', 'contact', 'clear'];

export function TerminalUI({ data }: { data?: TerminalData }) {
    const [isOpen, setIsOpen] = useState(false);
    const [history, setHistory] = useState<{ command: string; output: string | React.ReactNode; type: 'input' | 'output' }[]>([
        {
            command: '',
            output: 'Welcome to Utkristi OS  v2.0\nType a command or tap a chip below.',
            type: 'output'
        }
    ]);
    const [input, setInput] = useState('');
    const [commandHistory, setCommandHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const bodyRef = useRef<HTMLDivElement>(null);
    const endRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Scroll to bottom whenever history changes or terminal first opens
    useEffect(() => {
        if (isOpen) {
            // Small timeout so the DOM has rendered before scrolling
            setTimeout(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
        }
    }, [history, isOpen]);

    // Focus input when terminal opens
    useEffect(() => {
        if (isOpen) inputRef.current?.focus();
    }, [isOpen]);

    // Ctrl+` keyboard shortcut
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.key === '`') { e.preventDefault(); setIsOpen(p => !p); }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, []);

    const processCommand = (cmd: string) => {
        const args = cmd.trim().split(' ');
        const mainCmd = args[0].toLowerCase();
        let output: string | React.ReactNode = '';

        if (!mainCmd) return;

        switch (mainCmd) {
            case 'help':
                output = (
                    <div className="mt-2 mb-1 grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-w-lg">
                        {[
                            ['about', 'My bio'],
                            ['contact', 'Contact details'],
                            ['projects', 'All projects'],
                            ['project <id>', 'Project detail'],
                            ['blogs', 'All articles'],
                            ['blog <id>', 'Article detail'],
                            ['education', 'Timeline'],
                            ['skills', 'Tech skills'],
                            ['clear', 'Clear screen'],
                            ['exit', 'Close terminal'],
                        ].map(([cmd, desc]) => (
                            <div key={cmd} className="flex items-center gap-2 text-xs">
                                <code className="text-primary font-bold bg-primary/10 px-1.5 py-0.5 rounded shrink-0">{cmd}</code>
                                <span className="text-muted-foreground">{desc}</span>
                            </div>
                        ))}
                    </div>
                );
                break;
            case 'clear':
                setHistory([]);
                return;
            case 'exit':
                setHistory(prev => [
                    ...prev,
                    { command: cmd, output: '', type: 'input' },
                    { command: '', output: 'Terminating session... Goodbye.', type: 'output' }
                ]);
                setTimeout(() => setIsOpen(false), 600);
                return;
            case 'about':
                if (data?.about?.paragraphs) {
                    output = (
                        <div className="mt-3 mb-1 space-y-3 max-w-2xl border-l-2 border-primary/30 pl-4 py-1">
                            {data.about.paragraphs.map((p: string, i: number) => (
                                <p key={i} className="text-foreground/90 leading-relaxed text-sm">{p}</p>
                            ))}
                        </div>
                    );
                } else { output = 'About information not found.'; }
                break;
            case 'contact':
                output = (
                    <div className="mt-3 mb-1 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl">
                        <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                            <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold block mb-1">Email</span>
                            <a href="mailto:utkarshofficial1912@gmail.com" className="text-primary hover:underline font-medium text-sm break-all">utkarshofficial1912@gmail.com</a>
                        </div>
                        <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                            <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold block mb-1">Phone</span>
                            <a href="tel:+916394948921" className="text-primary hover:underline font-medium text-sm">(+91) 639-494-8921</a>
                        </div>
                    </div>
                );
                break;
            case 'projects':
                if (data?.projects?.length) {
                    output = (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-3 mb-1">
                            {data.projects.map(p => (
                                <div key={p.id} className="p-4 flex flex-col rounded-xl bg-card border border-primary/20 hover:border-primary/50 transition-colors">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-sm leading-tight text-foreground">{p.title}</h3>
                                        <Badge variant="outline" className="text-[10px] text-primary border-primary/30 shrink-0 ml-2">#{p.id}</Badge>
                                    </div>
                                    <p className="text-xs text-muted-foreground line-clamp-2 mb-3 flex-1">{p.description}</p>
                                    <div className="flex flex-wrap gap-1">
                                        {p.tags.slice(0, 3).map((tag: string, i: number) => (
                                            <Badge key={i} variant="secondary" className="text-[10px] bg-primary/10 text-primary">{tag}</Badge>
                                        ))}
                                        {p.tags.length > 3 && <Badge variant="secondary" className="text-[10px] bg-primary/10 text-primary">+{p.tags.length - 3}</Badge>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    );
                } else { output = 'No projects found.'; }
                break;
            case 'project':
                if (args[1]) {
                    const p = data?.projects?.find((proj: any) => proj.id === parseInt(args[1]));
                    if (p) {
                        output = (
                            <div className="mt-3 mb-1 max-w-2xl rounded-xl border border-primary/30 bg-card shadow-md p-4">
                                <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                                    <h2 className="text-lg font-bold text-primary">{p.title}</h2>
                                    <span className="text-[10px] text-muted-foreground bg-muted px-2 py-1 rounded">ID: {p.id}</span>
                                </div>
                                <p className="text-sm text-foreground/90 leading-relaxed mb-4">{p.description}</p>
                                <div className="flex flex-wrap gap-1.5 mb-4">
                                    {p.tags.map((tag: string, i: number) => (
                                        <Badge key={i} className="bg-primary/10 text-primary border-primary/20 text-xs">{tag}</Badge>
                                    ))}
                                </div>
                                <div className="flex gap-4 pt-3 border-t border-border/50 flex-wrap">
                                    {p.liveUrl && <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-primary hover:underline inline-flex items-center gap-1"><ExternalLink className="h-3.5 w-3.5" /> Live Demo</a>}
                                    {p.githubUrl && <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-foreground hover:text-primary inline-flex items-center gap-1"><Github className="h-3.5 w-3.5" /> Source Code</a>}
                                </div>
                            </div>
                        );
                    } else { output = `project: No project with ID '${args[1]}'.`; }
                } else { output = 'Usage: project <id>'; }
                break;
            case 'blogs':
                if (data?.blogs?.length) {
                    output = (
                        <div className="flex flex-col gap-2 mt-3 mb-1 max-w-2xl">
                            {data.blogs.map(b => (
                                <a key={b.id} href={b.url} target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between p-3 rounded-xl bg-card border border-primary/20 hover:border-primary/50 transition-colors gap-3">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <Badge variant="outline" className="text-[10px] text-primary border-primary/30 shrink-0">#{b.id}</Badge>
                                            <span className="font-bold text-sm truncate group-hover:text-primary transition-colors">{b.title}</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground line-clamp-1">{b.description}</p>
                                    </div>
                                    <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                                </a>
                            ))}
                        </div>
                    );
                } else { output = 'No articles found.'; }
                break;
            case 'blog':
                if (args[1]) {
                    const b = data?.blogs?.find((blog: any) => blog.id === parseInt(args[1]));
                    if (b) {
                        output = (
                            <div className="mt-3 mb-1 max-w-2xl rounded-xl border border-primary/30 bg-card shadow-md p-4">
                                <Badge className="mb-3 bg-primary/10 text-primary border-transparent text-xs">Article #{b.id}</Badge>
                                <h2 className="text-lg font-bold mb-3 text-foreground">{b.title}</h2>
                                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{b.description}</p>
                                <a href={b.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 text-sm">
                                    Read Article <ExternalLink className="h-3.5 w-3.5" />
                                </a>
                            </div>
                        );
                    } else { output = `blog: No article with ID '${args[1]}'.`; }
                } else { output = 'Usage: blog <id>'; }
                break;
            case 'education': {
                if (data?.education?.length) {
                    const workEntries = data.education.filter((e: any) => e.icon === 'Briefcase');
                    const eduEntries = data.education.filter((e: any) => e.icon !== 'Briefcase');

                    const renderGroup = (entries: any[]) => (
                        <div className="space-y-3 border-l-2 border-primary/20 pl-5 ml-2">
                            {entries.map((e: any, idx: number) => (
                                <div key={idx} className="relative">
                                    <div className="absolute -left-[27px] top-1.5 w-3 h-3 rounded-full border-2 border-primary bg-background" />
                                    <div className="bg-card border border-primary/10 p-4 rounded-xl">
                                        <span className="text-[10px] font-bold text-primary tracking-wider uppercase block mb-0.5">{e.duration}</span>
                                        <h3 className="font-bold text-sm text-foreground">{e.degree}</h3>
                                        <h4 className="text-xs text-muted-foreground mb-2">{e.institution}</h4>
                                        <p className="text-xs text-foreground/80 leading-relaxed">{e.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    );

                    output = (
                        <div className="space-y-6 mt-3 mb-1 max-w-2xl">
                            {workEntries.length > 0 && (
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-3 flex items-center gap-1.5">💼 Work Experience</p>
                                    {renderGroup(workEntries)}
                                </div>
                            )}
                            {eduEntries.length > 0 && (
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-3 flex items-center gap-1.5">🎓 Education</p>
                                    {renderGroup(eduEntries)}
                                </div>
                            )}
                        </div>
                    );
                } else { output = 'No timeline entries found.'; }
                break;
            }
            case 'skills':
                if (data?.skills?.length) {
                    output = (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 mb-1">
                            {data.skills.map((s, idx) => (
                                <div key={idx} className="bg-card border border-border/50 p-4 rounded-xl">
                                    <h4 className="font-bold text-primary text-xs tracking-widest uppercase border-b border-border/50 pb-2 mb-3">{s.category}</h4>
                                    <div className="flex flex-wrap gap-1.5">
                                        {s.items.map((i: any, iIdx: number) => (
                                            <Badge key={iIdx} variant="outline" className="bg-primary/5 border-primary/20 text-foreground text-xs py-0.5">{i.name}</Badge>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    );
                } else { output = 'No skills loaded.'; }
                break;
            case 'ls':
                output = `root/\n  ├─ about\n  ├─ contact\n  ├─ projects\n  ├─ blogs\n  └─ education`;
                break;
            case 'whoami':
                output = `guest@utkristi-os`;
                break;
            case 'echo':
                output = args.slice(1).join(' ');
                break;
            default:
                output = `Command not found: ${mainCmd}. Type "help" for commands.`;
                break;
        }

        setHistory(prev => [
            ...prev,
            { command: cmd, output: '', type: 'input' },
            { command: '', output, type: 'output' }
        ]);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim()) setCommandHistory(prev => [...prev, input]);
        processCommand(input);
        setInput('');
        setHistoryIndex(-1);
    };

    const handleChip = (cmd: string) => {
        processCommand(cmd);
        setInput('');
        setHistoryIndex(-1);
        inputRef.current?.focus();
    };

    return (
        <>
            {/* FAB — floating action button */}
            {!isOpen && (
                <div className="fixed bottom-6 right-4 z-[100] animate-in fade-in zoom-in duration-300">
                    <Button
                        onClick={() => setIsOpen(true)}
                        size="icon"
                        title="Open Terminal (Ctrl+`)"
                        className="h-12 w-12 rounded-full shadow-xl bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 transition-transform"
                    >
                        <TerminalIcon className="h-5 w-5" />
                    </Button>
                </div>
            )}

            {/* Terminal overlay */}
            {isOpen && (
                <div className="fixed inset-0 z-[100] bg-background flex flex-col font-mono text-sm animate-in slide-in-from-bottom-4 fade-in duration-200">

                    {/* ── Header ── */}
                    <div className="flex items-center justify-between px-4 py-2.5 border-b border-primary/20 bg-primary/5 shrink-0">
                        {/* Left: path label */}
                        <span className="text-primary/60 text-[10px] sm:text-xs font-semibold tracking-wider font-headline truncate mr-3">
                            utkristi_os ~ terminal
                        </span>
                        {/* Right: action buttons — now visible at ALL sizes */}
                        <div className="flex items-center gap-2 shrink-0">
                            <button
                                onClick={() => handleChip('help')}
                                className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider text-primary bg-primary/10 border border-primary/20 hover:bg-primary hover:text-primary-foreground px-2.5 py-1 rounded transition-all active:scale-95"
                            >
                                <HelpCircle className="h-3 w-3" />
                                <span className="hidden sm:inline">Help</span>
                            </button>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider text-destructive bg-destructive/10 border border-destructive/20 hover:bg-destructive hover:text-destructive-foreground px-2.5 py-1 rounded transition-all active:scale-95"
                                aria-label="Close terminal"
                            >
                                <X className="h-3 w-3" />
                                <span className="hidden sm:inline">Close</span>
                            </button>
                        </div>
                    </div>

                    {/* ── Quick-command chips (mobile-friendly tap targets) ── */}
                    <div className="flex items-center gap-2 px-4 py-2 border-b border-border/30 overflow-x-auto scrollbar-none shrink-0 bg-background/60">
                        {QUICK_COMMANDS.map(cmd => (
                            <button
                                key={cmd}
                                onClick={() => handleChip(cmd)}
                                className="shrink-0 px-3 py-1 rounded-full text-[11px] font-semibold border border-primary/20 bg-primary/5 text-primary hover:bg-primary hover:text-primary-foreground transition-all active:scale-95"
                            >
                                {cmd}
                            </button>
                        ))}
                    </div>

                    {/* ── Scrollable body ── */}
                    <div
                        ref={bodyRef}
                        className="flex-1 overflow-y-auto p-4 sm:p-6 cursor-text text-primary/90"
                        onClick={() => inputRef.current?.focus()}
                    >
                        {history.map((entry, i) => (
                            <div key={i} className="mb-3">
                                {entry.type === 'input' && (
                                    <div className="flex items-start gap-2 text-xs sm:text-sm">
                                        <span className="text-primary font-bold whitespace-nowrap shrink-0">❯</span>
                                        <span className="text-foreground break-all">{entry.command}</span>
                                    </div>
                                )}
                                {entry.type === 'output' && (
                                    <div className="whitespace-pre-wrap mt-1 pl-3 border-l border-primary/20 text-primary/80 text-xs sm:text-sm">
                                        {entry.output}
                                    </div>
                                )}
                            </div>
                        ))}
                        <div ref={endRef} />
                    </div>

                    {/* ── Input bar — fixed at bottom, sits above virtual keyboard ── */}
                    <form
                        onSubmit={handleSubmit}
                        className="shrink-0 flex items-center gap-2 px-4 py-3 border-t border-primary/20 bg-primary/5"
                    >
                        <span className="text-primary font-bold text-sm shrink-0">❯</span>
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={e => { setInput(e.target.value); setHistoryIndex(-1); }}
                            onKeyDown={e => {
                                if (e.key === 'ArrowUp') {
                                    e.preventDefault();
                                    if (commandHistory.length > 0) {
                                        const next = Math.min(historyIndex + 1, commandHistory.length - 1);
                                        setHistoryIndex(next);
                                        setInput(commandHistory[commandHistory.length - 1 - next]);
                                    }
                                } else if (e.key === 'ArrowDown') {
                                    e.preventDefault();
                                    if (historyIndex > 0) {
                                        const next = historyIndex - 1;
                                        setHistoryIndex(next);
                                        setInput(commandHistory[commandHistory.length - 1 - next]);
                                    } else {
                                        setHistoryIndex(-1);
                                        setInput('');
                                    }
                                }
                            }}
                            placeholder="type a command…"
                            className="flex-1 bg-transparent outline-none border-none text-foreground caret-primary font-mono text-sm placeholder:text-muted-foreground/50"
                            spellCheck={false}
                            autoComplete="off"
                            autoCapitalize="off"
                            autoCorrect="off"
                            enterKeyHint="send"
                        />
                        {/* Send button — key for mobile since Enter key is often off-screen */}
                        <button
                            type="submit"
                            className="shrink-0 p-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95 transition-all disabled:opacity-40"
                            disabled={!input.trim()}
                        >
                            <Send className="h-4 w-4" />
                        </button>
                    </form>
                </div>
            )}
        </>
    );
}
