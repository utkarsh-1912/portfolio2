'use client';

import { useState, useTransition } from 'react';
import { addTestimonialAction, updateTestimonialAction, deleteTestimonialAction, reorderTestimonialsAction } from '../../app/admin/actions';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { ChevronDown, ChevronUp, Edit, Eye, GripVertical, ExternalLink, MessageSquareQuote, Plus, Save, Trash2, X } from 'lucide-react';
import { useAdminAction } from './use-admin-action';
import { useDragReorder } from './use-drag-reorder';
import { StatusToggle } from './status-toggle';

const EMPTY = { quote: '', name: '', role: '', company: '', avatarUrl: '', linkUrl: '', sequence: 0, status: 'active' };

export function AdminTestimonialsForm({ initialData }: { initialData: any[] }) {
    // Read straight from props: revalidation after each save re-renders with fresh rows
    const items = initialData || [];
    const [editingId, setEditingId] = useState<number | 'new' | null>(null);
    const [formData, setFormData] = useState<any>(EMPTY);
    const [isPending, startTransition] = useTransition();
    const run = useAdminAction();
    const { ordered, rowProps, move } = useDragReorder(items, (ids) => run(reorderTestimonialsAction(ids), 'Order saved.'));

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        startTransition(async () => {
            const { ok } = await run(
                editingId === 'new' ? addTestimonialAction(formData) : updateTestimonialAction(formData.id, formData),
                'Testimonial saved.'
            );
            if (ok) setEditingId(null);
        });
    };

    const handleDelete = (id: number) => {
        if (!confirm('Delete this testimonial?')) return;
        startTransition(async () => {
            await run(deleteTestimonialAction(id), 'Testimonial deleted.');
        });
    };

    if (editingId) {
        return (
            <Card className="rounded-3xl border-border bg-card shadow-none animate-in fade-in slide-in-from-bottom-2 duration-300">
                <CardHeader className="border-b border-border pb-6 mb-6">
                    <CardTitle className="flex items-center gap-2 font-headline text-2xl font-semibold tracking-tight">
                        <MessageSquareQuote className="h-5 w-5 text-primary" />
                        {editingId === 'new' ? 'Add Testimonial' : 'Edit Testimonial'}
                    </CardTitle>
                    <CardDescription>A recommendation from a manager, colleague or client.</CardDescription>
                </CardHeader>
                <form onSubmit={onSubmit}>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="t-quote">Quote</Label>
                            <Textarea id="t-quote" className="min-h-[140px] bg-background" value={formData.quote} onChange={(e) => setFormData({ ...formData, quote: e.target.value })} required />
                        </div>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                            <div className="space-y-2">
                                <Label htmlFor="t-name">Name</Label>
                                <Input id="t-name" className="bg-background" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="t-role">Role</Label>
                                <Input id="t-role" className="bg-background" placeholder="Engineering Manager" value={formData.role || ''} onChange={(e) => setFormData({ ...formData, role: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="t-company">Company</Label>
                                <Input id="t-company" className="bg-background" value={formData.company || ''} onChange={(e) => setFormData({ ...formData, company: e.target.value })} />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                            <div className="space-y-2">
                                <Label htmlFor="t-avatar">Photo URL (optional)</Label>
                                <Input id="t-avatar" className="bg-background" type="url" value={formData.avatarUrl || ''} onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="t-link">Source link (optional)</Label>
                                <Input id="t-link" className="bg-background" type="url" placeholder="LinkedIn recommendation URL" value={formData.linkUrl || ''} onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="t-status" className="flex items-center gap-2"><Eye className="h-4 w-4" /> Visibility</Label>
                                <select id="t-status" className="flex h-11 w-full rounded-xl border border-input bg-background px-3 text-sm" value={formData.status || 'active'} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                                    <option value="active">Published</option>
                                    <option value="draft">Draft (hidden)</option>
                                    <option value="archived">Archived (hidden)</option>
                                </select>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-3 border-t border-border px-6 py-5">
                        <Button type="button" variant="outline" onClick={() => setEditingId(null)} className="gap-2"><X className="h-4 w-4" /> Cancel</Button>
                        <Button type="submit" disabled={isPending} className="gap-2"><Save className="h-4 w-4" /> {isPending ? 'Saving...' : 'Save Testimonial'}</Button>
                    </CardFooter>
                </form>
            </Card>
        );
    }

    return (
        <Card className="rounded-3xl border-border bg-card shadow-none">
            <CardHeader className="mb-6 flex flex-col items-center justify-between border-b border-border pb-6 sm:flex-row">
                <div>
                    <CardTitle className="flex items-center gap-2 font-headline text-2xl font-semibold tracking-tight">
                        <MessageSquareQuote className="h-5 w-5 text-primary" /> Testimonials
                    </CardTitle>
                    <CardDescription>Recommendations shown on the home page.</CardDescription>
                </div>
                <Button onClick={() => { setEditingId('new'); setFormData(EMPTY); }} className="mt-4 gap-2 sm:mt-0"><Plus className="h-4 w-4" /> Add Testimonial</Button>
            </CardHeader>
            <CardContent>
                {items.length > 1 && <p className="mb-3 text-xs text-muted-foreground">Drag rows (or use the arrows) to change the order on your site.</p>}
                <div className="grid gap-4">
                    {ordered.map((item) => (
                        <div key={item.id} {...rowProps(item.id)} className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-border bg-background p-4 transition-colors hover:border-foreground/25 data-[drag-over]:border-primary data-[drag-over]:bg-primary/5 sm:flex-row sm:items-center">
                            <div className="hidden flex-col items-center sm:flex">
                                <button type="button" aria-label="Move up" onClick={() => move(item.id, -1)} className="rounded p-0.5 text-muted-foreground hover:text-foreground"><ChevronUp className="h-3.5 w-3.5" /></button>
                                <GripVertical className="h-4 w-4 cursor-grab text-muted-foreground/60" aria-hidden="true" />
                                <button type="button" aria-label="Move down" onClick={() => move(item.id, 1)} className="rounded p-0.5 text-muted-foreground hover:text-foreground"><ChevronDown className="h-3.5 w-3.5" /></button>
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="line-clamp-2 text-sm">&ldquo;{item.quote}&rdquo;</p>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    {item.name}{item.role ? ` · ${item.role}` : ''}{item.company ? `, ${item.company}` : ''}
                                    {item.linkUrl && <a href={item.linkUrl} target="_blank" rel="noreferrer" className="ml-2 inline-flex items-center gap-0.5 text-primary hover:underline">source <ExternalLink className="h-3 w-3" /></a>}
                                </p>
                            </div>
                            <div className="flex w-full items-center gap-2 sm:w-auto">
                                <StatusToggle item={{ ...item, title: item.name }} save={updateTestimonialAction} />
                                <Button variant="outline" size="sm" onClick={() => { setEditingId(item.id); setFormData({ ...EMPTY, ...item }); }} className="flex-1 gap-2 sm:flex-none"><Edit className="h-4 w-4 text-muted-foreground" /> Edit</Button>
                                <Button variant="ghost" size="sm" disabled={isPending} onClick={() => handleDelete(item.id)} className="flex-none text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
                                    <Trash2 className="h-4 w-4" /><span className="sr-only">Delete</span>
                                </Button>
                            </div>
                        </div>
                    ))}
                    {items.length === 0 && (
                        <div className="rounded-2xl border border-dashed border-border py-12 text-center">
                            <MessageSquareQuote className="mx-auto mb-3 h-12 w-12 text-muted-foreground/30" />
                            <p className="font-medium text-muted-foreground">No testimonials yet. The section stays hidden until you add one.</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
