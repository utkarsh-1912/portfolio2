'use client';

import { useState, useTransition } from 'react';
import { addBlogAction, updateBlogAction, deleteBlogAction } from '../../app/admin/actions';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { TagInput } from '@/components/ui/tag-input';
import { FileText, Plus, Trash2, Edit, Save, X, ExternalLink, UploadCloud, MessageSquare, ListOrdered, Eye, Tag, Calendar } from 'lucide-react';
import { useAdminAction } from './use-admin-action';
import { StatusToggle } from './status-toggle';

export function AdminBlogsForm({ initialData }: { initialData: any[] }) {
    // Read straight from props: revalidation after each save re-renders with fresh rows
    const items = initialData || [];
    const [editingId, setEditingId] = useState<number | 'new' | null>(null);
    const [formData, setFormData] = useState<any>({});
    const [isPending, startTransition] = useTransition();
    const [isUploading, setIsUploading] = useState(false);
    const run = useAdminAction();

    const handleEdit = (item: any) => {
        setEditingId(item.id);
        setFormData(item);
    };

    const handleAddNew = () => {
        setEditingId('new');
        setFormData({ title: '', description: '', url: '', imageUrl: '', imageHint: '', sequence: 0, status: 'active', tags: [], publishedAt: '' });
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
            if (data.url) {
                setFormData({ ...formData, imageUrl: data.url });
            } else {
                alert(data.error || 'Upload failed');
            }
        } catch (error) {
            alert('Upload error');
        } finally {
            setIsUploading(false);
        }
    };

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        startTransition(async () => {
            const { ok } = await run(
                editingId === 'new' ? addBlogAction(formData) : updateBlogAction(formData.id, formData),
                'Post saved.'
            );
            if (ok) setEditingId(null);
        });
    };

    const handleDelete = (id: number) => {
        if (!confirm('Are you sure you want to delete this blog post?')) return;
        startTransition(async () => {
            await run(deleteBlogAction(id), 'Post deleted.');
        });
    };

    if (editingId) {
        return (
            <Card className="rounded-3xl border-border bg-card shadow-none animate-in fade-in slide-in-from-bottom-2 duration-300">
                <CardHeader className="border-b border-border pb-6 mb-6">
                    <CardTitle className="flex items-center gap-2 font-headline text-2xl font-semibold tracking-tight">
                        <FileText className="h-5 w-5 text-primary" />
                        {editingId === 'new' ? 'Draft New Blog Post' : 'Edit Blog Post'}
                    </CardTitle>
                    <CardDescription>{editingId === 'new' ? 'Link a new article to your portfolio.' : 'Modify the details of this linked article.'}</CardDescription>
                </CardHeader>
                <form onSubmit={onSubmit}>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2">Article Title</Label>
                            <Input className="bg-background font-headline" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                        </div>
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2">Short Description / Excerpt</Label>
                            <Textarea className="bg-background resize-none min-h-[100px]" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} required />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="md:col-span-2 space-y-2">
                                <Label className="flex items-center gap-2"><ExternalLink className="h-4 w-4" /> Original Article URL</Label>
                                <Input className="bg-background" type="url" placeholder="https://medium.com/..." value={formData.url} onChange={e => setFormData({ ...formData, url: e.target.value })} required />
                            </div>
                            <div className="space-y-2">
                                <Label className="flex items-center gap-2"><ListOrdered className="h-4 w-4" /> Display Order</Label>
                                <Input className="bg-background" type="number" min={0} value={formData.sequence ?? 0} onChange={e => setFormData({ ...formData, sequence: parseInt(e.target.value) || 0 })} />
                                <p className="text-xs text-muted-foreground">Lower = shown first (0 = top)</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="md:col-span-2 space-y-2">
                                <Label className="flex items-center gap-2"><Tag className="h-4 w-4" /> Tags</Label>
                                <TagInput value={formData.tags || []} onChange={(tags) => setFormData({ ...formData, tags })} placeholder="Type a tag..." />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="blog-published" className="flex items-center gap-2"><Calendar className="h-4 w-4" /> Published on</Label>
                                <Input id="blog-published" className="bg-background" type="date" value={formData.publishedAt || ''} onChange={e => setFormData({ ...formData, publishedAt: e.target.value })} />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="blog-status" className="flex items-center gap-2"><Eye className="h-4 w-4" /> Visibility</Label>
                                <select
                                    id="blog-status"
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
                            <Label className="flex items-center gap-2 font-semibold"><UploadCloud className="h-4 w-4 text-primary" /> Cover Image (ImgBB)</Label>
                            <div className="flex flex-col sm:flex-row items-center gap-4">
                                <Input type="file" accept="image/*" onChange={handleImageUpload} disabled={isUploading} className="bg-background" />
                                {isUploading && <span className="text-sm font-medium text-primary animate-pulse flex-shrink-0">Uploading to ImgBB...</span>}
                            </div>
                            {formData.imageUrl && (
                                <div className="p-3 bg-background rounded-md border flex items-center justify-between">
                                    <span className="text-xs truncate max-w-[250px] text-muted-foreground font-mono">{formData.imageUrl}</span>
                                    <a href={formData.imageUrl} target="_blank" rel="noreferrer" className="text-xs font-medium text-primary hover:underline flex items-center gap-1">
                                        View Image <ExternalLink className="h-3 w-3" />
                                    </a>
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label className="flex items-center gap-2"><MessageSquare className="h-4 w-4" /> AI Image Generation Hint Text (Optional fallback)</Label>
                            <Input className="bg-background" value={formData.imageHint || ''} onChange={e => setFormData({ ...formData, imageHint: e.target.value })} />
                            <p className="text-xs text-muted-foreground mt-1">If no image is uploaded, this prompt is used to generate a placeholder.</p>
                        </div>
                    </CardContent>
                    <CardFooter className="border-t border-border px-6 py-5 flex justify-end gap-3">
                        <Button type="button" variant="outline" onClick={() => setEditingId(null)} className="gap-2">
                            <X className="h-4 w-4" /> Cancel
                        </Button>
                        <Button type="submit" disabled={isPending || isUploading} className="gap-2">
                            <Save className="h-4 w-4" /> {isPending ? 'Saving...' : 'Save Post'}
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
                        <FileText className="h-5 w-5 text-primary" />
                        Blog & Writing
                    </CardTitle>
                    <CardDescription>Manage articles linked on your portfolio.</CardDescription>
                </div>
                <Button onClick={handleAddNew} className="gap-2 mt-4 sm:mt-0">
                    <Plus className="h-4 w-4" /> Draft Post
                </Button>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4">
                    {items.map((item) => (
                        <div key={item.id} className="rounded-2xl border border-border bg-background p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-colors hover:border-foreground/25">
                            <div className="flex-1 min-w-0">
                                <h4 className="font-bold font-headline text-lg truncate mb-1">
                                    {item.title}
                                    {item.status && item.status !== 'active' && (
                                        <span className="ml-2 align-middle px-1.5 py-0.5 text-[10px] uppercase tracking-widest border border-border text-muted-foreground">{item.status}</span>
                                    )}
                                </h4>
                                <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                            </div>
                            <div className="flex items-center gap-2 w-full sm:w-auto mt-3 sm:mt-0">
                                <StatusToggle item={item} save={updateBlogAction} />
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
                            <FileText className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
                            <p className="text-muted-foreground font-medium">No blog posts found. Link your first article!</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
