'use client';

import { useState, useTransition } from 'react';
import { addProjectAction, updateProjectAction, deleteProjectAction } from '../../app/admin/actions';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Code, Plus, Trash2, Edit, Save, X, ExternalLink, Github, UploadCloud, Tag } from 'lucide-react';

export function AdminProjectsForm({ initialData }: { initialData: any[] }) {
    const [projects, setProjects] = useState(initialData || []);
    const [editingId, setEditingId] = useState<number | 'new' | null>(null);
    const [formData, setFormData] = useState<any>({});
    const [isPending, startTransition] = useTransition();
    const [isUploading, setIsUploading] = useState(false);

    const handleEdit = (proj: any) => {
        setEditingId(proj.id);
        setFormData(proj);
    };

    const handleAddNew = () => {
        setEditingId('new');
        setFormData({ title: '', description: '', tags: [], imageUrl: '', liveUrl: '', githubUrl: '' });
    };

    const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const tagsArray = e.target.value.split(',').map(t => t.trim());
        setFormData({ ...formData, tags: tagsArray });
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
                await addProjectAction(formData);
            } else {
                await updateProjectAction(formData.id, formData);
            }
            setEditingId(null);
        });
    };

    const handleDelete = (id: number) => {
        if (!confirm('Area you sure you want to delete this project?')) return;
        startTransition(async () => {
            await deleteProjectAction(id);
        });
    };

    if (editingId) {
        return (
            <Card className="border-border/50 shadow-sm bg-background/50 backdrop-blur-sm animate-in zoom-in-95 duration-200">
                <CardHeader className="pb-4 border-b border-border/30 mb-6">
                    <CardTitle className="flex items-center gap-2 text-xl font-headline font-bold">
                        <Code className="h-5 w-5 text-primary" />
                        {editingId === 'new' ? 'Create New Project' : 'Edit Project Entry'}
                    </CardTitle>
                    <CardDescription>{editingId === 'new' ? 'Add a new showcase piece to your portfolio.' : 'Modify the details of this existing project.'}</CardDescription>
                </CardHeader>
                <form onSubmit={onSubmit}>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2">Project Title</Label>
                            <Input className="bg-background/80 font-headline" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                        </div>
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2">Description</Label>
                            <Textarea className="bg-background/80 resize-none min-h-[100px]" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} required />
                        </div>
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2"><Tag className="h-4 w-4" /> Tech Stack / Tags (comma separated)</Label>
                            <Input className="bg-background/80" value={formData.tags?.join(', ')} onChange={handleTagsChange} required />
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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border/30">
                            <div className="space-y-2">
                                <Label className="flex items-center gap-2"><ExternalLink className="h-4 w-4" /> Live Demo URL</Label>
                                <Input className="bg-background/80" type="url" value={formData.liveUrl || ''} onChange={e => setFormData({ ...formData, liveUrl: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label className="flex items-center gap-2"><Github className="h-4 w-4" /> Repository URL</Label>
                                <Input className="bg-background/80" type="url" value={formData.githubUrl || ''} onChange={e => setFormData({ ...formData, githubUrl: e.target.value })} />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="bg-muted/30 py-4 px-6 border-t border-border/30 rounded-b-xl flex justify-end gap-3">
                        <Button type="button" variant="outline" onClick={() => setEditingId(null)} className="gap-2">
                            <X className="h-4 w-4" /> Cancel
                        </Button>
                        <Button type="submit" disabled={isPending || isUploading} className="gap-2">
                            <Save className="h-4 w-4" /> {isPending ? 'Saving...' : 'Save Project'}
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
                        <Code className="h-5 w-5 text-primary" />
                        Projects Portfolio
                    </CardTitle>
                    <CardDescription>Manage the projects showcased on your site.</CardDescription>
                </div>
                <Button onClick={handleAddNew} className="gap-2">
                    <Plus className="h-4 w-4" /> Add Project
                </Button>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4">
                    {projects.map((proj) => (
                        <div key={proj.id} className="border border-border/50 bg-card p-4 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:shadow-md transition-shadow">
                            <div className="flex-1 min-w-0">
                                <h4 className="font-bold font-headline text-lg truncate mb-1">{proj.title}</h4>
                                <p className="text-sm text-muted-foreground line-clamp-2">{proj.description}</p>
                                <div className="flex gap-2 mt-3 overflow-hidden">
                                    {proj.tags?.slice(0, 3).map((t: string) => (
                                        <span key={t} className="px-2 py-0.5 bg-secondary text-secondary-foreground text-xs rounded-md whitespace-nowrap">{t}</span>
                                    ))}
                                    {(proj.tags?.length || 0) > 3 && <span className="px-2 py-0.5 bg-secondary/50 text-muted-foreground text-xs rounded-md">+{proj.tags.length - 3}</span>}
                                </div>
                            </div>
                            <div className="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                                <Button variant="outline" size="sm" onClick={() => handleEdit(proj)} className="flex-1 sm:flex-none gap-2">
                                    <Edit className="h-4 w-4 text-muted-foreground" /> Edit
                                </Button>
                                <Button variant="destructive" size="sm" disabled={isPending} onClick={() => handleDelete(proj.id)} className="flex-none">
                                    <Trash2 className="h-4 w-4" />
                                    <span className="sr-only">Delete</span>
                                </Button>
                            </div>
                        </div>
                    ))}
                    {projects.length === 0 && (
                        <div className="text-center py-12 border-2 border-dashed rounded-xl">
                            <Code className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
                            <p className="text-muted-foreground font-medium">No projects found. Add your first showcase!</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
