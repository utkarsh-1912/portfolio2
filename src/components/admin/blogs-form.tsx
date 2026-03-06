'use client';

import { useState, useTransition } from 'react';
import { addBlogAction, updateBlogAction, deleteBlogAction } from '../../app/admin/actions';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { FileText, Plus, Trash2, Edit, Save, X, ExternalLink, UploadCloud, MessageSquare, ListOrdered } from 'lucide-react';

export function AdminBlogsForm({ initialData }: { initialData: any[] }) {
    const [items, setItems] = useState(initialData || []);
    const [editingId, setEditingId] = useState<number | 'new' | null>(null);
    const [formData, setFormData] = useState<any>({});
    const [isPending, startTransition] = useTransition();
    const [isUploading, setIsUploading] = useState(false);

    const handleEdit = (item: any) => {
        setEditingId(item.id);
        setFormData(item);
    };

    const handleAddNew = () => {
        setEditingId('new');
        setFormData({ title: '', description: '', url: '', imageUrl: '', imageHint: '', sequence: 0 });
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
            if (editingId === 'new') {
                await addBlogAction(formData);
            } else {
                await updateBlogAction(formData.id, formData);
            }
            setEditingId(null);
        });
    };

    const handleDelete = (id: number) => {
        if (!confirm('Are you sure you want to delete this blog post?')) return;
        startTransition(async () => {
            await deleteBlogAction(id);
        });
    };

    if (editingId) {
        return (
            <Card className="border-border/50 shadow-sm bg-background/50 backdrop-blur-sm animate-in zoom-in-95 duration-200">
                <CardHeader className="pb-4 border-b border-border/30 mb-6">
                    <CardTitle className="flex items-center gap-2 text-xl font-headline font-bold">
                        <FileText className="h-5 w-5 text-primary" />
                        {editingId === 'new' ? 'Draft New Blog Post' : 'Edit Blog Post'}
                    </CardTitle>
                    <CardDescription>{editingId === 'new' ? 'Link a new article to your portfolio.' : 'Modify the details of this linked article.'}</CardDescription>
                </CardHeader>
                <form onSubmit={onSubmit}>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2">Article Title</Label>
                            <Input className="bg-background/80 font-headline" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                        </div>
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2">Short Description / Excerpt</Label>
                            <Textarea className="bg-background/80 resize-none min-h-[100px]" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} required />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="md:col-span-2 space-y-2">
                                <Label className="flex items-center gap-2"><ExternalLink className="h-4 w-4" /> Original Article URL</Label>
                                <Input className="bg-background/80" type="url" placeholder="https://medium.com/..." value={formData.url} onChange={e => setFormData({ ...formData, url: e.target.value })} required />
                            </div>
                            <div className="space-y-2">
                                <Label className="flex items-center gap-2"><ListOrdered className="h-4 w-4" /> Display Order</Label>
                                <Input className="bg-background/80" type="number" min={0} value={formData.sequence ?? 0} onChange={e => setFormData({ ...formData, sequence: parseInt(e.target.value) || 0 })} />
                                <p className="text-xs text-muted-foreground">Lower = shown first (0 = top)</p>
                            </div>
                        </div>

                        <div className="border border-primary/20 bg-primary/5 p-4 rounded-xl space-y-4">
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
                            <Input className="bg-background/80" value={formData.imageHint || ''} onChange={e => setFormData({ ...formData, imageHint: e.target.value })} />
                            <p className="text-xs text-muted-foreground mt-1">If no image is uploaded, this prompt is used to generate a placeholder.</p>
                        </div>
                    </CardContent>
                    <CardFooter className="bg-muted/30 py-4 px-6 border-t border-border/30 rounded-b-xl flex justify-end gap-3">
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
        <Card className="border-border/50 shadow-sm bg-background/50 backdrop-blur-sm">
            <CardHeader className="pb-4 border-b border-border/30 mb-6 flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="flex items-center gap-2 text-xl font-headline font-bold">
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
                        <div key={item.id} className="border border-border/50 bg-card p-4 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:shadow-md transition-shadow">
                            <div className="flex-1 min-w-0">
                                <h4 className="font-bold font-headline text-lg truncate mb-1">{item.title}</h4>
                                <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                            </div>
                            <div className="flex gap-2 w-full sm:w-auto mt-3 sm:mt-0">
                                <Button variant="outline" size="sm" onClick={() => handleEdit(item)} className="flex-1 sm:flex-none gap-2">
                                    <Edit className="h-4 w-4 text-muted-foreground" /> Edit
                                </Button>
                                <Button variant="destructive" size="sm" disabled={isPending} onClick={() => handleDelete(item.id)} className="flex-none">
                                    <Trash2 className="h-4 w-4" />
                                    <span className="sr-only">Delete</span>
                                </Button>
                            </div>
                        </div>
                    ))}
                    {items.length === 0 && (
                        <div className="text-center py-12 border-2 border-dashed rounded-xl border-border/50">
                            <FileText className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
                            <p className="text-muted-foreground font-medium">No blog posts found. Link your first article!</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
