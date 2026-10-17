'use client';

import { useState, useTransition } from 'react';
import { addCertificationAction, updateCertificationAction, deleteCertificationAction, reorderCertificationsAction } from '../../app/admin/actions';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { TagInput } from '@/components/ui/tag-input';
import { Award, Plus, Trash2, Edit, Save, X, ExternalLink, UploadCloud, ListOrdered, Eye, Tag, Calendar, KeyRound, Building2 } from 'lucide-react';
import { useAdminAction } from './use-admin-action';
import { useDragReorder } from './use-drag-reorder';
import { ChevronDown, ChevronUp, GripVertical } from 'lucide-react';
import { StatusToggle } from './status-toggle';

const EMPTY = {
    title: '',
    issuer: '',
    issueDate: '',
    expiryDate: '',
    credentialId: '',
    credentialUrl: '',
    imageUrl: '',
    skills: [] as string[],
    sequence: 0,
    status: 'active',
};

export function AdminCertificationsForm({ initialData }: { initialData: any[] }) {
    // Read straight from props: revalidation after each save re-renders with fresh rows
    const items = initialData || [];
    const [editingId, setEditingId] = useState<number | 'new' | null>(null);
    const [formData, setFormData] = useState<any>(EMPTY);
    const [isPending, startTransition] = useTransition();
    const [isUploading, setIsUploading] = useState(false);
    const run = useAdminAction();
    const { ordered, rowProps, move } = useDragReorder(items, (ids) => run(reorderCertificationsAction(ids), 'Order saved.'));

    const handleEdit = (item: any) => {
        setEditingId(item.id);
        setFormData({ ...EMPTY, ...item, issueDate: item.issueDate ?? '', expiryDate: item.expiryDate ?? '' });
    };

    const handleAddNew = () => {
        setEditingId('new');
        setFormData(EMPTY);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setIsUploading(true);
        const form = new FormData();
        form.append('image', file);
        try {
            const res = await fetch('/api/upload', { method: 'POST', body: form });
            const data = await res.json();
            if (data.url) setFormData((prev: any) => ({ ...prev, imageUrl: data.url }));
            else alert(data.error || 'Upload failed');
        } catch {
            alert('Upload error');
        } finally {
            setIsUploading(false);
        }
    };

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        startTransition(async () => {
            const { ok } = await run(
                editingId === 'new' ? addCertificationAction(formData) : updateCertificationAction(formData.id, formData),
                'Certification saved.'
            );
            if (ok) setEditingId(null);
        });
    };

    const handleDelete = (id: number) => {
        if (!confirm('Are you sure you want to delete this certification?')) return;
        startTransition(async () => {
            await run(deleteCertificationAction(id), 'Certification deleted.');
        });
    };

    if (editingId) {
        return (
            <Card className="rounded-3xl border-border bg-card shadow-none animate-in fade-in slide-in-from-bottom-2 duration-300">
                <CardHeader className="border-b border-border pb-6 mb-6">
                    <CardTitle className="flex items-center gap-2 font-headline text-2xl font-semibold tracking-tight">
                        <Award className="h-5 w-5 text-primary" />
                        {editingId === 'new' ? 'Add Certification' : 'Edit Certification'}
                    </CardTitle>
                    <CardDescription>Credentials shown in the Certifications section of your site.</CardDescription>
                </CardHeader>
                <form onSubmit={onSubmit}>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="md:col-span-2 space-y-2">
                                <Label htmlFor="cert-title" className="flex items-center gap-2"><Award className="h-4 w-4" /> Certification name</Label>
                                <Input id="cert-title" className="bg-background font-headline" placeholder="e.g. Generative AI Leader" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="cert-issuer" className="flex items-center gap-2"><Building2 className="h-4 w-4" /> Issuer</Label>
                                <Input id="cert-issuer" className="bg-background" placeholder="e.g. Google Cloud" value={formData.issuer} onChange={e => setFormData({ ...formData, issuer: e.target.value })} required />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="cert-issued" className="flex items-center gap-2"><Calendar className="h-4 w-4" /> Issued</Label>
                                <Input id="cert-issued" className="bg-background" type="date" value={formData.issueDate || ''} onChange={e => setFormData({ ...formData, issueDate: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="cert-expires" className="flex items-center gap-2"><Calendar className="h-4 w-4" /> Expires</Label>
                                <Input id="cert-expires" className="bg-background" type="date" value={formData.expiryDate || ''} min={formData.issueDate || undefined} onChange={e => setFormData({ ...formData, expiryDate: e.target.value })} />
                                <p className="text-xs text-muted-foreground">Leave empty if it doesn&apos;t expire.</p>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="cert-order" className="flex items-center gap-2"><ListOrdered className="h-4 w-4" /> Display order</Label>
                                <Input id="cert-order" className="bg-background" type="number" value={formData.sequence ?? 0} onChange={e => setFormData({ ...formData, sequence: parseInt(e.target.value) || 0 })} />
                                <p className="text-xs text-muted-foreground">Leave 0 to sort newest first.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="md:col-span-2 space-y-2">
                                <Label htmlFor="cert-url" className="flex items-center gap-2"><ExternalLink className="h-4 w-4" /> Verification URL</Label>
                                <Input id="cert-url" className="bg-background" type="url" placeholder="https://www.credly.com/badges/..." value={formData.credentialUrl || ''} onChange={e => setFormData({ ...formData, credentialUrl: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="cert-id" className="flex items-center gap-2"><KeyRound className="h-4 w-4" /> Credential ID</Label>
                                <Input id="cert-id" className="bg-background" value={formData.credentialId || ''} onChange={e => setFormData({ ...formData, credentialId: e.target.value })} />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="md:col-span-2 space-y-2">
                                <Label className="flex items-center gap-2"><Tag className="h-4 w-4" /> Skills covered</Label>
                                <TagInput value={formData.skills || []} onChange={(skills) => setFormData({ ...formData, skills })} placeholder="Type a skill..." />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="cert-status" className="flex items-center gap-2"><Eye className="h-4 w-4" /> Visibility</Label>
                                <select
                                    id="cert-status"
                                    className="flex h-11 w-full rounded-xl border border-input bg-background px-3 text-sm"
                                    value={formData.status || 'active'}
                                    onChange={e => setFormData({ ...formData, status: e.target.value })}
                                >
                                    <option value="active">Published</option>
                                    <option value="draft">Draft (hidden)</option>
                                    <option value="archived">Archived (hidden)</option>
                                </select>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-5 space-y-4">
                            <Label className="flex items-center gap-2 font-semibold"><UploadCloud className="h-4 w-4 text-primary" /> Badge image (optional)</Label>
                            <div className="flex flex-col sm:flex-row items-center gap-4">
                                <Input type="file" accept="image/*" onChange={handleImageUpload} disabled={isUploading} className="bg-background" />
                                {isUploading && <span className="text-sm font-medium text-primary animate-pulse flex-shrink-0">Uploading...</span>}
                            </div>
                            {formData.imageUrl && (
                                <div className="p-3 bg-background rounded-md border flex items-center justify-between gap-3">
                                    <img src={formData.imageUrl} alt="" className="h-10 w-10 object-contain" />
                                    <span className="flex-1 text-xs truncate text-muted-foreground font-mono">{formData.imageUrl}</span>
                                    <button type="button" onClick={() => setFormData({ ...formData, imageUrl: '' })} className="text-xs text-destructive hover:underline">Remove</button>
                                </div>
                            )}
                        </div>
                    </CardContent>
                    <CardFooter className="border-t border-border px-6 py-5 flex justify-end gap-3">
                        <Button type="button" variant="outline" onClick={() => setEditingId(null)} className="gap-2">
                            <X className="h-4 w-4" /> Cancel
                        </Button>
                        <Button type="submit" disabled={isPending || isUploading} className="gap-2">
                            <Save className="h-4 w-4" /> {isPending ? 'Saving...' : 'Save Certification'}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        );
    }

    return (
        <Card className="rounded-3xl border-border bg-card shadow-none">
            <CardHeader className="border-b border-border pb-6 mb-6 flex flex-col sm:flex-row items-center justify-between">
                <div>
                    <CardTitle className="flex items-center gap-2 font-headline text-2xl font-semibold tracking-tight">
                        <Award className="h-5 w-5 text-primary" />
                        Certifications
                    </CardTitle>
                    <CardDescription>Manage the credentials listed on your portfolio.</CardDescription>
                </div>
                <Button onClick={handleAddNew} className="gap-2 mt-4 sm:mt-0">
                    <Plus className="h-4 w-4" /> Add Certification
                </Button>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4">
                    {ordered.map((item) => (
                        <div key={item.id} {...rowProps(item.id)} className="rounded-2xl border border-border bg-background p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-colors hover:border-foreground/25 data-[drag-over]:border-primary data-[drag-over]:bg-primary/5">
                            <div className="hidden flex-col items-center sm:flex">
                                <button type="button" aria-label="Move up" onClick={() => move(item.id, -1)} className="rounded p-0.5 text-muted-foreground hover:text-foreground"><ChevronUp className="h-3.5 w-3.5" /></button>
                                <GripVertical className="h-4 w-4 cursor-grab text-muted-foreground/60 active:cursor-grabbing" aria-hidden="true" />
                                <button type="button" aria-label="Move down" onClick={() => move(item.id, 1)} className="rounded p-0.5 text-muted-foreground hover:text-foreground"><ChevronDown className="h-3.5 w-3.5" /></button>
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-bold font-headline text-lg truncate mb-1">
                                    {item.title}
                                    {item.status && item.status !== 'active' && (
                                        <span className="ml-2 align-middle px-1.5 py-0.5 text-[10px] uppercase tracking-widest border border-border text-muted-foreground">{item.status}</span>
                                    )}
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                    {item.issuer}
                                    {item.issueDate ? ` · ${item.issueDate}` : ' · no date set'}
                                    {!item.credentialUrl && ' · no verification link'}
                                </p>
                            </div>
                            <div className="flex items-center gap-2 w-full sm:w-auto mt-3 sm:mt-0">
                                <StatusToggle item={item} save={updateCertificationAction} />
                                <Button variant="outline" size="sm" onClick={() => handleEdit(item)} className="flex-1 sm:flex-none gap-2">
                                    <Edit className="h-4 w-4 text-muted-foreground" /> Edit
                                </Button>
                                <Button variant="ghost" size="sm" disabled={isPending} onClick={() => handleDelete(item.id)} className="flex-none text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
                                    <Trash2 className="h-4 w-4" />
                                    <span className="sr-only">Delete</span>
                                </Button>
                            </div>
                        </div>
                    ))}
                    {items.length === 0 && (
                        <div className="text-center py-12 border border-dashed rounded-2xl border-border">
                            <Award className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
                            <p className="text-muted-foreground font-medium">No certifications yet. Add your first one!</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
