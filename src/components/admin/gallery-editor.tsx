'use client';

import { useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ImagePlus, Link2, Loader2, Star, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { resolveImage } from '@/lib/images';

export type GalleryItem = { url: string; caption?: string | null };

const MAX_IMAGES = 20;

/**
 * Manages a project's extra carousel images: multi-file upload (to ImgBB via /api/upload),
 * adding by URL, captions, reordering, removing, and promoting an image to the cover.
 */
export function GalleryEditor({
    value,
    onChange,
    onMakeCover,
}: {
    value: GalleryItem[];
    onChange: (next: GalleryItem[]) => void;
    /** Swap this image with the current cover. */
    onMakeCover: (index: number) => void;
}) {
    const [uploading, setUploading] = useState<{ done: number; total: number } | null>(null);
    const [error, setError] = useState('');
    const [urlDraft, setUrlDraft] = useState('');
    const fileRef = useRef<HTMLInputElement>(null);
    const items = value ?? [];
    const room = MAX_IMAGES - items.length;

    const upload = async (files: FileList | null) => {
        if (!files?.length) return;
        setError('');
        const list = Array.from(files).filter((f) => f.type.startsWith('image/')).slice(0, room);
        if (list.length === 0) return;
        setUploading({ done: 0, total: list.length });
        const added: GalleryItem[] = [];
        // One at a time keeps ImgBB happy and shows steady progress
        for (const file of list) {
            const form = new FormData();
            form.append('image', file);
            try {
                const res = await fetch('/api/upload', { method: 'POST', body: form });
                const data = await res.json();
                if (data.url) added.push({ url: data.url, caption: null });
                else setError(data.error || `Couldn't upload ${file.name}`);
            } catch {
                setError(`Couldn't upload ${file.name}`);
            }
            setUploading((u) => (u ? { ...u, done: u.done + 1 } : u));
        }
        onChange([...items, ...added]);
        setUploading(null);
        if (fileRef.current) fileRef.current.value = '';
    };

    const addUrl = () => {
        const url = urlDraft.trim();
        if (!/^https?:\/\//i.test(url)) {
            setError('Paste a full image URL starting with https://');
            return;
        }
        setError('');
        onChange([...items, { url, caption: null }]);
        setUrlDraft('');
    };

    const update = (i: number, patch: Partial<GalleryItem>) => onChange(items.map((it, j) => (j === i ? { ...it, ...patch } : it)));
    const move = (i: number, dir: -1 | 1) => {
        const j = i + dir;
        if (j < 0 || j >= items.length) return;
        const next = [...items];
        [next[i], next[j]] = [next[j], next[i]];
        onChange(next);
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-2 sm:flex-row">
                <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="sr-only"
                    id="gallery-upload"
                    onChange={(e) => upload(e.target.files)}
                    disabled={!!uploading || room <= 0}
                />
                <Button type="button" variant="outline" className="gap-2" disabled={!!uploading || room <= 0} onClick={() => fileRef.current?.click()}>
                    {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
                    {uploading ? `Uploading ${uploading.done + 1} of ${uploading.total}…` : 'Upload images'}
                </Button>
                <div className="flex flex-1 gap-2">
                    <Input
                        className="bg-background"
                        placeholder="…or paste an image URL"
                        value={urlDraft}
                        onChange={(e) => setUrlDraft(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addUrl(); } }}
                        aria-label="Image URL"
                    />
                    <Button type="button" variant="outline" className="shrink-0 gap-2" onClick={addUrl} disabled={!urlDraft.trim() || room <= 0}>
                        <Link2 className="h-4 w-4" /> Add
                    </Button>
                </div>
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <p className="text-xs text-muted-foreground">
                {items.length} of {MAX_IMAGES} extra images · shown after the cover in the project carousel
            </p>

            {items.length > 0 && (
                <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {items.map((item, i) => {
                        const src = resolveImage(item.url);
                        return (
                            <li key={`${item.url}-${i}`} className="overflow-hidden rounded-2xl border border-border bg-background">
                                <div className="relative aspect-[16/10] bg-muted">
                                    {src && (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={src} alt="" className="h-full w-full object-cover" loading="lazy" />
                                    )}
                                    <span className="absolute left-2 top-2 rounded-full bg-background/85 px-2 py-0.5 font-mono text-[10px]">{i + 2}</span>
                                </div>
                                <div className="space-y-2 p-3">
                                    <Input
                                        className="h-9 bg-background text-sm"
                                        placeholder="Caption (optional)"
                                        value={item.caption ?? ''}
                                        onChange={(e) => update(i, { caption: e.target.value })}
                                        aria-label={`Caption for image ${i + 2}`}
                                    />
                                    <div className="flex items-center justify-between">
                                        <div className="flex gap-1">
                                            <Button type="button" size="icon" variant="ghost" className="h-8 w-8" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move earlier">
                                                <ArrowLeft className="h-4 w-4" />
                                            </Button>
                                            <Button type="button" size="icon" variant="ghost" className="h-8 w-8" onClick={() => move(i, 1)} disabled={i === items.length - 1} aria-label="Move later">
                                                <ArrowRight className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <div className="flex gap-1">
                                            <Button type="button" size="sm" variant="ghost" className="h-8 gap-1 text-xs" onClick={() => onMakeCover(i)}>
                                                <Star className="h-3.5 w-3.5" /> Make cover
                                            </Button>
                                            <Button
                                                type="button"
                                                size="icon"
                                                variant="ghost"
                                                className="h-8 w-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                                                onClick={() => onChange(items.filter((_, j) => j !== i))}
                                                aria-label={`Remove image ${i + 2}`}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}
