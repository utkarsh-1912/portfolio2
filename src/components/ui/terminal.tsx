'use client';

import { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, ExternalLink, Github } from 'lucide-react';
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

export function TerminalUI({ data }: { data?: TerminalData }) {
    const [isOpen, setIsOpen] = useState(false);
    const [history, setHistory] = useState<{ command: string; output: string | React.ReactNode; type: 'input' | 'output' }[]>([
        {
            command: '',
            output: 'Welcome to Utkristi OS Terminal v2.0.0\nType "help" to see available commands.',
            type: 'output'
        }
    ]);
    const [input, setInput] = useState('');
    const [commandHistory, setCommandHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const endOfMessagesRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        if (isOpen) {
            endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
            inputRef.current?.focus();
        }
    }, [history, isOpen]);

    // Handle Keyboard shortcut (Ctrl+` or similar)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.key === '`') {
                e.preventDefault();
                setIsOpen((prev) => !prev);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const processCommand = (cmd: string) => {
        const args = cmd.trim().split(' ');
        const mainCmd = args[0].toLowerCase();
        let output: string | React.ReactNode = '';

        if (!mainCmd) return;

        switch (mainCmd) {
            case 'help':
                output = `Available Portfolio Commands:
  help                    - Show this message
  clear                   - Clear terminal output
  about                   - Read my about description
  contact                 - Get my direct contact info
  projects                - List all portfolio projects
  project <id>            - View details of a specific project
  blogs                   - List all published articles
  blog <id>               - Read a specific article summary
  education               - View my timeline & education
  skills                  - View my technical skills
  all                     - Load full portfolio data dump
  exit                    - Close the terminal interface`;
                break;
            case 'clear':
                setHistory([]);
                return;
            case 'exit':
                setHistory((prev) => [
                    ...prev,
                    { command: cmd, output: '', type: 'input' },
                    { command: '', output: 'Terminating session... Goodbye.', type: 'output' }
                ]);
                setTimeout(() => setIsOpen(false), 800);
                return;
            case 'about':
                if (data?.about?.paragraphs) {
                    output = (
                        <div className="mt-4 mb-2 space-y-4 max-w-3xl border-l-2 border-primary/30 pl-4 py-2">
                            {data.about.paragraphs.map((p: string, i: number) => (
                                <p key={i} className="text-foreground/90 leading-relaxed text-sm sm:text-base">{p}</p>
                            ))}
                        </div>
                    );
                } else {
                    output = 'About information not found.';
                }
                break;
            case 'contact':
                output = (
                    <div className="mt-4 mb-2 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
                        <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 flex flex-col">
                            <span className="text-xs text-muted-foreground uppercase tracking-widest font-bold mb-1">Email</span>
                            <a href="mailto:utkarshofficial1912@gmail.com" className="text-primary hover:underline font-medium text-lg truncate">utkarshofficial1912@gmail.com</a>
                        </div>
                        <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 flex flex-col">
                            <span className="text-xs text-muted-foreground uppercase tracking-widest font-bold mb-1">Phone</span>
                            <a href="tel:+916394948921" className="text-primary hover:underline font-medium text-lg">(+91) 639-494-8921</a>
                        </div>
                    </div>
                );
                break;
            case 'projects':
                if (data?.projects?.length) {
                    output = (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 mb-2">
                            {data.projects.map(p => (
                                <div key={p.id} className="p-5 flex flex-col h-full rounded-xl bg-card border border-primary/20 hover:border-primary/50 shadow-sm hover:shadow-md transition-all">
                                    <div className="flex justify-between items-start mb-3">
                                        <h3 className="font-bold text-lg leading-tight text-foreground">{p.title}</h3>
                                        <Badge variant="outline" className="text-[10px] text-primary border-primary/30">ID: {p.id}</Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-1">{p.description}</p>
                                    <div className="flex flex-wrap gap-1 mt-auto">
                                        {p.tags.slice(0, 3).map((tag: string, i: number) => (
                                            <Badge key={i} variant="secondary" className="text-[10px] bg-primary/10 text-primary hover:bg-primary/20">{tag}</Badge>
                                        ))}
                                        {p.tags.length > 3 && <Badge variant="secondary" className="text-[10px] bg-primary/10 text-primary">+{p.tags.length - 3}</Badge>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    );
                } else {
                    output = 'No projects found inside the database.';
                }
                break;
            case 'project':
                if (args[1]) {
                    const pId = parseInt(args[1]);
                    const p = data?.projects?.find((proj: any) => proj.id === pId);
                    if (p) {
                        output = (
                            <div className="mt-4 mb-2 max-w-3xl rounded-xl border border-primary/30 bg-card overflow-hidden shadow-lg">
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-2xl font-bold font-headline text-primary">{p.title}</h2>
                                        <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">Project ID: {p.id}</span>
                                    </div>
                                    <p className="text-base text-foreground/90 leading-relaxed mb-6">{p.description}</p>

                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {p.tags.map((tag: string, i: number) => (
                                            <Badge key={i} className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">{tag}</Badge>
                                        ))}
                                    </div>

                                    <div className="flex gap-4 pt-4 border-t border-border/50">
                                        {p.liveUrl && (
                                            <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-primary hover:underline inline-flex items-center">
                                                <ExternalLink className="mr-1.5 h-4 w-4" /> Live Demo
                                            </a>
                                        )}
                                        {p.githubUrl && (
                                            <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-foreground hover:text-primary transition-colors inline-flex items-center">
                                                <Github className="mr-1.5 h-4 w-4" /> Source Code
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    } else {
                        output = `project: No project found with ID '${args[1]}'`;
                    }
                } else {
                    output = `project: missing operand. Usage: project <id>`;
                }
                break;
            case 'blogs':
                if (data?.blogs?.length) {
                    output = (
                        <div className="flex flex-col gap-3 mt-4 mb-2 max-w-4xl">
                            {data.blogs.map(b => (
                                <a key={b.id} href={b.url} target="_blank" rel="noopener noreferrer" className="group flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-xl bg-card border border-primary/20 hover:border-primary/50 shadow-sm hover:shadow-md transition-all gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <Badge variant="outline" className="text-[10px] text-primary border-primary/30">ID: {b.id}</Badge>
                                            <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">{b.title}</h3>
                                        </div>
                                        <p className="text-sm text-muted-foreground line-clamp-2">{b.description}</p>
                                    </div>
                                    <div className="ext-primary/50 group-hover:text-primary transition-colors">
                                        <ExternalLink className="w-5 h-5" />
                                    </div>
                                </a>
                            ))}
                        </div>
                    );
                } else {
                    output = 'No articles found inside the database.';
                }
                break;
            case 'blog':
                if (args[1]) {
                    const bId = parseInt(args[1]);
                    const b = data?.blogs?.find((blog: any) => blog.id === bId);
                    if (b) {
                        output = (
                            <div className="mt-4 mb-2 max-w-3xl rounded-xl border border-primary/30 bg-card overflow-hidden shadow-lg p-6">
                                <Badge className="mb-4 bg-primary/10 text-primary border-transparent">Article #{b.id}</Badge>
                                <h2 className="text-2xl font-bold font-headline mb-4 text-foreground">{b.title}</h2>
                                <p className="text-base text-muted-foreground leading-relaxed mb-6">{b.description}</p>
                                <a href={b.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-6 py-2.5 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors">
                                    Read Full Article <ExternalLink className="ml-2 h-4 w-4" />
                                </a>
                            </div>
                        );
                    } else {
                        output = `blog: No article found with ID '${args[1]}'`;
                    }
                } else {
                    output = `blog: missing operand. Usage: blog <id>`;
                }
                break;
            case 'education':
                if (data?.education?.length) {
                    output = (
                        <div className="space-y-6 mt-6 mb-2 max-w-3xl border-l-2 border-primary/20 pl-6 ml-4">
                            {data.education.map((e, idx) => (
                                <div key={idx} className="relative">
                                    <div className="absolute -left-[35px] top-1.5 w-4 h-4 rounded-full border-2 border-primary bg-background shadow-[0_0_0_4px_var(--background)]" />
                                    <div className="bg-card border border-primary/10 p-5 rounded-xl shadow-sm hover:border-primary/30 transition-colors">
                                        <span className="text-xs font-bold text-primary tracking-wider uppercase mb-1 block">{e.duration}</span>
                                        <h3 className="font-bold text-lg text-foreground">{e.degree}</h3>
                                        <h4 className="text-sm font-medium text-muted-foreground mb-3">{e.institution}</h4>
                                        <p className="text-sm text-foreground/80 leading-relaxed">{e.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    );
                } else {
                    output = 'No timeline entries found.';
                }
                break;
            case 'skills':
                if (data?.skills?.length) {
                    output = (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6 mb-2">
                            {data.skills.map((s, idx) => (
                                <div key={idx} className="bg-card border border-border/50 p-5 rounded-xl">
                                    <h4 className="font-bold text-primary flex items-center gap-2 border-b border-border/50 pb-3 mb-4 text-sm tracking-widest uppercase">
                                        {s.category}
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {s.items.map((i: any, iIdx: number) => (
                                            <Badge key={iIdx} variant="outline" className="bg-primary/5 border-primary/20 hover:bg-primary/10 text-foreground py-1">
                                                {i.name}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    );
                } else {
                    output = 'No skills loaded.';
                }
                break;
            case 'all':
                output = `FULL PORTFOLIO DUMP\n===================\n` +
                    `HERO:\n${data?.hero?.title}\n${data?.hero?.description}\n\n` +
                    `PROJECTS COUNT: ${data?.projects?.length || 0}\n` +
                    `ARTICLES COUNT: ${data?.blogs?.length || 0}\n` +
                    `Use specific commands for detailed views.`;
                break;
            default:
                if (mainCmd === 'ls') {
                    output = `root/\n  ├─ about\n  ├─ contact\n  ├─ projects\n  ├─ blogs\n  └─ education`;
                } else if (mainCmd === 'whoami') {
                    output = `guest@utkristi-os`;
                } else if (mainCmd === 'echo') {
                    output = args.slice(1).join(' ');
                } else {
                    output = `Command not found: ${mainCmd}. Type "help" for a list of commands.`;
                }
                break;
        }

        setHistory((prev) => [
            ...prev,
            { command: cmd, output: '', type: 'input' },
            { command: '', output, type: 'output' }
        ]);
    };

    const handleInputSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim()) {
            setCommandHistory(prev => [...prev, input]);
        }
        processCommand(input);
        setInput('');
        setHistoryIndex(-1);
    };

    const handleButtonCommand = (cmd: string) => {
        processCommand(cmd);
        setInput('');
        setHistoryIndex(-1);
    };

    return (
        <>
            {/* Draggable/Toggle Button */}
            {!isOpen && (
                <div className="fixed bottom-4 right-4 z-[100] animate-in fade-in zoom-in duration-300">
                    <Button
                        onClick={() => setIsOpen(true)}
                        size="icon"
                        title="Open Terminal Portfolio (Ctrl+`)"
                        className="h-12 w-12 rounded-full shadow-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-transform hover:scale-105"
                    >
                        <TerminalIcon className="h-5 w-5" />
                    </Button>
                </div>
            )}

            {/* Full-Screen Terminal UI */}
            {isOpen && (
                <div className="fixed inset-0 z-[100] bg-background flex flex-col font-mono text-sm sm:text-base animate-in slide-in-from-bottom-5 fade-in duration-300">
                    {/* Terminal Header */}
                    <div className="flex items-center justify-between px-6 py-3 border-b border-primary/20 bg-primary/5">
                        <span className="text-primary/70 text-xs font-semibold tracking-wider font-headline">
                            utkristi_os ~ portfolio/terminal_mode
                        </span>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => handleButtonCommand('help')}
                                aria-label="Help Command"
                                className="hidden sm:inline-flex text-[10px] uppercase font-bold tracking-wider text-primary hover:text-primary-foreground hover:bg-primary border border-primary/30 bg-primary/10 px-3 py-1.5 rounded transition-all active:scale-95"
                            >
                                Help
                            </button>
                            <button
                                onClick={() => handleButtonCommand('exit')}
                                aria-label="Exit Terminal"
                                className="hidden sm:inline-flex text-[10px] uppercase font-bold tracking-wider text-destructive hover:text-destructive-foreground hover:bg-destructive border border-destructive/30 bg-destructive/10 px-3 py-1.5 rounded transition-all active:scale-95"
                            >
                                Exit
                            </button>
                        </div>
                    </div>

                    {/* Terminal Body */}
                    <div className="flex-1 p-6 md:p-10 overflow-y-auto cursor-text text-primary/90" onClick={() => inputRef.current?.focus()}>
                        {history.map((entry, index) => (
                            <div key={index} className="mb-4">
                                {entry.type === 'input' && (
                                    <div className="flex items-start">
                                        <span className="text-primary font-bold mr-3 mt-0.5 whitespace-nowrap">portfolio ➜</span>
                                        <span className="text-foreground">{entry.command}</span>
                                    </div>
                                )}
                                {entry.type === 'output' && (
                                    <div className="whitespace-pre-wrap mt-2 pl-4 border-l border-primary/20 ml-1 text-primary/80">
                                        {entry.output}
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Current Input */}
                        <div className="flex items-center mt-4">
                            <span className="text-primary font-bold mr-3 whitespace-nowrap">portfolio ➜</span>
                            <form onSubmit={handleInputSubmit} className="flex-1 relative flex items-center">
                                {/* Fake blinking block cursor for extra terminal aesthetics when empty */}
                                {input.length === 0 && (
                                    <span className="absolute left-[1px] top-1/2 -translate-y-1/2 text-primary font-bold animate-pulse pointer-events-none">|</span>
                                )}
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={input}
                                    onChange={(e) => {
                                        setInput(e.target.value);
                                        setHistoryIndex(-1);
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === 'ArrowUp') {
                                            e.preventDefault();
                                            if (commandHistory.length > 0) {
                                                const nextIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : historyIndex;
                                                setHistoryIndex(nextIndex);
                                                setInput(commandHistory[commandHistory.length - 1 - nextIndex]);
                                            }
                                        } else if (e.key === 'ArrowDown') {
                                            e.preventDefault();
                                            if (historyIndex > 0) {
                                                const nextIndex = historyIndex - 1;
                                                setHistoryIndex(nextIndex);
                                                setInput(commandHistory[commandHistory.length - 1 - nextIndex]);
                                            } else if (historyIndex === 0) {
                                                setHistoryIndex(-1);
                                                setInput('');
                                            }
                                        }
                                    }}
                                    className={`w-full bg-transparent outline-none border-none text-foreground caret-primary font-mono text-base placeholder:text-primary/30 relative z-10 ${input.length === 0 ? 'text-transparent caret-transparent' : ''}`}
                                    spellCheck="false"
                                    autoComplete="off"
                                    autoFocus
                                />
                            </form>
                        </div>
                        <div ref={endOfMessagesRef} />
                    </div>
                </div>
            )}
        </>
    );
}
