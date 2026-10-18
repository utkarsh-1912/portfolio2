'use client';

import { useEffect, useRef, useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Markdown } from '@/components/ui/markdown';
import { cn } from '@/lib/utils';

const PREFIX = 'utkristi-draft:';

/** Forget an autosaved draft, e.g. right after the form saved successfully. */
export function clearDraft(key: string) {
    try { localStorage.removeItem(PREFIX + key); } catch { /* storage unavailable */ }
}

/**
 * Markdown textarea with a live preview (tabs on small screens, side by side on wide ones)
 * and local autosave: unsaved text survives a closed tab, and is offered back on return.
 */
export function MarkdownEditor({
    id,
    value,
    onChange,
    draftKey,
    placeholder,
    minHeight = 220,
}: {
    id: string;
    value: string;
    onChange: (value: string) => void;
    /** Unique per item and field, e.g. "project-14-approach". */
    draftKey: string;
    placeholder?: string;
    minHeight?: number;
}) {
    const [tab, setTab] = useState<'write' | 'preview'>('write');
    const [draft, setDraft] = useState<string | null>(null);
    const initial = useRef(value);

    // Offer a draft that differs from what's saved
    useEffect(() => {
        try {
            const stored = localStorage.getItem(PREFIX + draftKey);
            if (stored !== null && stored !== initial.current) setDraft(stored);
        } catch { /* storage unavailable */ }
    }, [draftKey]);

    // Autosave a moment after typing stops
    useEffect(() => {
        if (value === initial.current) return;
        const t = setTimeout(() => {
            try { localStorage.setItem(PREFIX + draftKey, value); } catch { /* storage unavailable */ }
        }, 600);
        return () => clearTimeout(t);
    }, [value, draftKey]);

    const words = value.split(/\s+/).filter(Boolean).length;

    return (
        <div className="space-y-2">
            {draft !== null && (
                <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-primary/30 bg-primary/5 px-3 py-2 text-xs">
                    <span>An unsaved draft from earlier was found.</span>
                    <span className="flex gap-2">
                        <button type="button" className="font-medium text-primary hover:underline" onClick={() => { onChange(draft); setDraft(null); }}>Restore</button>
                        <button type="button" className="text-muted-foreground hover:underline" onClick={() => { clearDraft(draftKey); setDraft(null); }}>Discard</button>
                    </span>
                </div>
            )}

            <div className="flex items-center justify-between gap-2 lg:hidden" role="tablist">
                <div className="flex gap-1 rounded-full bg-muted p-1">
                    {(['write', 'preview'] as const).map((t) => (
                        <button
                            key={t}
                            type="button"
                            role="tab"
                            aria-selected={tab === t}
                            onClick={() => setTab(t)}
                            className={cn('rounded-full px-3 py-1 text-xs capitalize', tab === t ? 'bg-background shadow-sm' : 'text-muted-foreground')}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid gap-3 lg:grid-cols-2">
                <Textarea
                    id={id}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    style={{ minHeight }}
                    className={cn('bg-background font-mono text-sm', tab === 'preview' && 'hidden lg:flex')}
                />
                <div
                    aria-label="Preview"
                    style={{ minHeight }}
                    className={cn('overflow-auto rounded-xl border border-dashed border-border bg-background/50 p-4', tab === 'write' && 'hidden lg:block')}
                >
                    {value.trim() ? <Markdown className="text-sm md:text-base">{value}</Markdown> : <p className="text-sm text-muted-foreground">Preview appears here.</p>}
                </div>
            </div>
            <p className="text-xs text-muted-foreground">{words} words · Markdown supported · drafts autosave in this browser</p>
        </div>
    );
}
