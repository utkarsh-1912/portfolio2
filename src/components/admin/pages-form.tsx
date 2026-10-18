'use client';

import { useState, useTransition } from 'react';
import { updatePageAction } from '../../app/admin/actions';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink, FileText, Save } from 'lucide-react';
import { useAdminAction } from './use-admin-action';
import { MarkdownEditor, clearDraft } from './markdown-editor';

type Page = { id: number; slug: string; title: string; intro: string | null; content: string | null; status: string | null; updatedAt: string | Date | null };

function PageEditor({ page }: { page: Page }) {
    const [form, setForm] = useState({ title: page.title, intro: page.intro ?? '', content: page.content ?? '', status: page.status ?? 'active' });
    const [isPending, startTransition] = useTransition();
    const run = useAdminAction();
    const draftKey = `page-${page.id}-content`;

    const save = (e: React.FormEvent) => {
        e.preventDefault();
        startTransition(async () => {
            const { ok } = await run(updatePageAction(page.id, form), `/${page.slug} saved.`);
            if (ok) clearDraft(draftKey);
        });
    };

    return (
        <Card className="rounded-3xl border-border bg-card shadow-none">
            <form onSubmit={save}>
                <CardHeader className="mb-6 flex flex-col gap-3 border-b border-border pb-6 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2 font-headline text-2xl font-semibold tracking-tight">
                            <FileText className="h-5 w-5 text-primary" /> /{page.slug}
                        </CardTitle>
                        <CardDescription>
                            {page.slug === 'now' ? 'What you are focused on right now. Update it every month or two.' : 'Your tools, hardware, software and setup.'}
                        </CardDescription>
                    </div>
                    <a href={`/${page.slug}?preview=1`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
                        Preview page <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        <div className="space-y-2">
                            <Label htmlFor={`${page.slug}-title`}>Title</Label>
                            <Input id={`${page.slug}-title`} className="bg-background" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor={`${page.slug}-intro`}>Intro line</Label>
                            <Input id={`${page.slug}-intro`} className="bg-background" value={form.intro} onChange={(e) => setForm({ ...form, intro: e.target.value })} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor={`${page.slug}-content`}>Content</Label>
                        <MarkdownEditor
                            id={`${page.slug}-content`}
                            draftKey={draftKey}
                            value={form.content}
                            onChange={(content) => setForm((f) => ({ ...f, content }))}
                            minHeight={320}
                            placeholder={page.slug === 'now' ? '## Work\n\n- …\n\n## Learning\n\n- …' : '## Hardware\n\n- …\n\n## Editor & terminal\n\n- …'}
                        />
                    </div>
                </CardContent>
                <CardFooter className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-6 py-5">
                    <select
                        aria-label="Visibility"
                        className="h-10 rounded-xl border border-input bg-background px-3 text-sm"
                        value={form.status}
                        onChange={(e) => setForm({ ...form, status: e.target.value })}
                    >
                        <option value="active">Published</option>
                        <option value="draft">Draft (hidden)</option>
                    </select>
                    <Button type="submit" disabled={isPending} className="gap-2"><Save className="h-4 w-4" /> {isPending ? 'Saving…' : 'Save page'}</Button>
                </CardFooter>
            </form>
        </Card>
    );
}

export function AdminPagesForm({ initialData }: { initialData: Page[] }) {
    return (
        <div className="space-y-8">
            {initialData.map((page) => <PageEditor key={page.id} page={page} />)}
            {initialData.length === 0 && <p className="text-muted-foreground">No pages found. Run <code>npm run db:migrate</code> to create /now and /uses.</p>}
        </div>
    );
}
