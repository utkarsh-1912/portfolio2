'use client';

import React, { useState, useTransition, useMemo } from 'react';
import { addProjectAction, updateProjectAction, deleteProjectAction, reorderProjectsAction, importFromGitHubAction } from '../../app/admin/actions';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { TagInput } from '@/components/ui/tag-input';
import { Checkbox } from '@/components/ui/checkbox';
import { Code, Plus, Trash2, Edit, Save, X, ExternalLink, Github, UploadCloud, Tag, ListOrdered, Eye, Star } from 'lucide-react';
import { useAdminAction } from './use-admin-action';
import { useDragReorder } from './use-drag-reorder';
import { ChevronDown, ChevronUp, Download, FileText, GripVertical, Link2 } from 'lucide-react';
import { StatusToggle } from './status-toggle';

export function AdminProjectsForm({ initialData }: { initialData: any[] }) {
    // Read straight from props: revalidation after each save re-renders with fresh rows
    const projects = initialData || [];
    const [editingId, setEditingId] = useState<number | 'new' | null>(null);
    const [formData, setFormData] = useState<any>({});
    const [isPending, startTransition] = useTransition();
    const [isUploading, setIsUploading] = useState(false);
    const run = useAdminAction();
    const { ordered, rowProps, move } = useDragReorder(projects, (ids) => run(reorderProjectsAction(ids), 'Order saved.'));
    const [repoUrl, setRepoUrl] = useState('');
    const [isImporting, startImport] = useTransition();

    const handleImport = () => {
        startImport(async () => {
            const { ok, data } = await run(importFromGitHubAction(repoUrl), 'Imported from GitHub. Review and save.');
            if (ok && data) setFormData((prev: any) => ({ ...prev, ...data, tags: data.tags?.length ? data.tags : prev.tags }));
        });
    };

    // Calculate tag frequencies from initialData and sort descending
    const sortedTags = React.useMemo(() => {
        const tagFrequencies = (initialData || []).reduce((acc: Record<string, number>, proj: any) => {
            proj.tags?.forEach((tag: string) => {
                acc[tag] = (acc[tag] || 0) + 1;
            });
            return acc;
        }, {});
        return Object.entries(tagFrequencies)
            .sort((a, b) => b[1] - a[1])
            .map(([tag]) => tag);
    }, [initialData]);

    const handleEdit = (proj: any) => {
        setEditingId(proj.id);
        setFormData(proj);
    };

    const handleAddNew = () => {
        setEditingId('new');
        setFormData({ title: '', description: '', tags: [], imageUrl: '', liveUrl: '', githubUrl: '', sequence: 0, status: 'active', featured: false });
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
            const { ok } = await run(
                editingId === 'new' ? addProjectAction(formData) : updateProjectAction(formData.id, formData),
                'Project saved.'
            );
            if (ok) setEditingId(null);
        });
    };

    const handleDelete = (id: number) => {
        if (!confirm('Are you sure you want to delete this project?')) return;
        startTransition(async () => {
            await run(deleteProjectAction(id), 'Project deleted.');
        });
    };

    if (editingId) {
        return (
            <Card className="rounded-3xl border-border bg-card shadow-none animate-in fade-in slide-in-from-bottom-2 duration-300">
                <CardHeader className="border-b border-border pb-6 mb-6">
                    <CardTitle className="flex items-center gap-2 font-headline text-2xl font-semibold tracking-tight">
                        <Code className="h-5 w-5 text-primary" />
                        {editingId === 'new' ? 'Create New Project' : 'Edit Project Entry'}
                    </CardTitle>
                    <CardDescription>{editingId === 'new' ? 'Add a new showcase piece to your portfolio.' : 'Modify the details of this existing project.'}</CardDescription>
                </CardHeader>
                <form onSubmit={onSubmit}>
                    <CardContent className="space-y-6">
                        {editingId === 'new' && (
                            <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-5">
                                <Label htmlFor="import-repo" className="flex items-center gap-2 font-semibold"><Github className="h-4 w-4" /> Start from a GitHub repo</Label>
                                <p className="mt-1 text-xs text-muted-foreground">Fills in the name, description, tags and links. You can edit everything before saving.</p>
                                <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                                    <Input id="import-repo" className="bg-background" placeholder="https://github.com/utkarsh-1912/geocore" value={repoUrl} onChange={e => setRepoUrl(e.target.value)} />
                                    <Button type="button" variant="outline" onClick={handleImport} disabled={!repoUrl.trim() || isImporting} className="gap-2 shrink-0">
                                        <Download className="h-4 w-4" /> {isImporting ? 'Importing…' : 'Import'}
                                    </Button>
                                </div>
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2">Project Title</Label>
                            <Input className="bg-background font-headline" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                        </div>
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2">Description</Label>
                            <Textarea className="bg-background resize-none min-h-[100px]" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} required />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="md:col-span-2 space-y-2">
                                <Label className="flex items-center gap-2"><Tag className="h-4 w-4" /> Tech Stack / Tags</Label>
                                <TagInput 
                                    value={formData.tags || []} 
                                    onChange={(tags) => setFormData({ ...formData, tags })} 
                                    suggestions={sortedTags} 
                                    placeholder="Type a tag..." 
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="flex items-center gap-2"><ListOrdered className="h-4 w-4" /> Display Order</Label>
                                <Input className="bg-background" type="number" min={0} value={formData.sequence ?? 0} onChange={e => setFormData({ ...formData, sequence: parseInt(e.target.value) || 0 })} />
                                <p className="text-xs text-muted-foreground">Lower = shown first (0 = top)</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="project-status" className="flex items-center gap-2"><Eye className="h-4 w-4" /> Visibility</Label>
                                <select
                                    id="project-status"
                                    className="flex h-11 w-full rounded-xl border border-input bg-background px-3 text-sm"
                                    value={formData.status || 'active'}
                                    onChange={e => setFormData({ ...formData, status: e.target.value })}
                                >
                                    <option value="active">Published</option>
                                    <option value="draft">Draft (hidden)</option>
                                    <option value="archived">Archived (hidden)</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label className="flex items-center gap-2"><Star className="h-4 w-4" /> Featured</Label>
                                <label className="flex h-10 items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                                    <Checkbox checked={!!formData.featured} onCheckedChange={v => setFormData({ ...formData, featured: v === true })} />
                                    Show first in the home page showcase
                                </label>
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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border">
                            <div className="space-y-2">
                                <Label className="flex items-center gap-2"><ExternalLink className="h-4 w-4" /> Live Demo URL</Label>
                                <Input className="bg-background" type="url" value={formData.liveUrl || ''} onChange={e => setFormData({ ...formData, liveUrl: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label className="flex items-center gap-2"><Github className="h-4 w-4" /> Repository URL</Label>
                                <Input className="bg-background" type="url" value={formData.githubUrl || ''} onChange={e => setFormData({ ...formData, githubUrl: e.target.value })} />
                            </div>
                        </div>

                        {/* Case study page */}
                        <div className="space-y-6 border-t border-border pt-6">
                            <div className="flex flex-wrap items-end justify-between gap-3">
                                <div>
                                    <p className="flex items-center gap-2 font-semibold"><FileText className="h-4 w-4 text-primary" /> Case study page</p>
                                    <p className="text-xs text-muted-foreground">Optional Markdown sections shown on the project&apos;s own page. Empty sections are hidden.</p>
                                </div>
                                {editingId !== 'new' && formData.slug && (
                                    <a href={`/projects/${formData.slug}?preview=1`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
                                        Preview page <ExternalLink className="h-3.5 w-3.5" />
                                    </a>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="project-slug" className="flex items-center gap-2"><Link2 className="h-4 w-4" /> URL name</Label>
                                <div className="flex items-center gap-2">
                                    <span className="shrink-0 text-sm text-muted-foreground">/projects/</span>
                                    <Input id="project-slug" className="bg-background font-mono" placeholder="auto from title" value={formData.slug || ''} onChange={e => setFormData({ ...formData, slug: e.target.value.toLowerCase() })} />
                                </div>
                            </div>
                            {[
                                ['problem', 'The problem', 'What was broken, slow or missing? Who had the problem?'],
                                ['approach', 'Approach', 'Key decisions and trade-offs.'],
                                ['architecture', 'Architecture', 'Components, data flow, stack. Lists and code blocks work.'],
                                ['results', 'Results', 'Outcomes, numbers, what you learned.'],
                            ].map(([key, label, hint]) => (
                                <div key={key} className="space-y-2">
                                    <Label htmlFor={`project-${key}`}>{label}</Label>
                                    <Textarea id={`project-${key}`} className="bg-background min-h-[110px] font-mono text-sm" placeholder={hint} value={formData[key] || ''} onChange={e => setFormData({ ...formData, [key]: e.target.value })} />
                                </div>
                            ))}
                        </div>
                    </CardContent>
                    <CardFooter className="border-t border-border px-6 py-5 flex justify-end gap-3">
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
        <Card className="rounded-3xl border-border bg-card shadow-none">
            <CardHeader className="border-b border-border pb-6 mb-6 flex flex-col sm:flex-row items-center justify-between">
                <div>
                    <CardTitle className="flex items-center gap-2 font-headline text-2xl font-semibold tracking-tight">
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
                {projects.length > 1 && <p className="mb-3 text-xs text-muted-foreground">Drag rows (or use the arrows) to change the order on your site.</p>}
                <div className="grid gap-4">
                    {ordered.map((proj) => (
                        <div key={proj.id} {...rowProps(proj.id)} className="rounded-2xl border border-border bg-background p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-colors hover:border-foreground/25 data-[drag-over]:border-primary data-[drag-over]:bg-primary/5">
                            <div className="hidden flex-col items-center sm:flex">
                                <button type="button" aria-label="Move up" onClick={() => move(proj.id, -1)} className="rounded p-0.5 text-muted-foreground hover:text-foreground"><ChevronUp className="h-3.5 w-3.5" /></button>
                                <GripVertical className="h-4 w-4 cursor-grab text-muted-foreground/60 active:cursor-grabbing" aria-hidden="true" />
                                <button type="button" aria-label="Move down" onClick={() => move(proj.id, 1)} className="rounded p-0.5 text-muted-foreground hover:text-foreground"><ChevronDown className="h-3.5 w-3.5" /></button>
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-bold font-headline text-lg truncate mb-1">
                                    {proj.featured && <Star className="inline h-4 w-4 mr-1.5 text-primary fill-primary align-[-2px]" />}
                                    {proj.title}
                                    {proj.status && proj.status !== 'active' && (
                                        <span className="ml-2 align-middle px-1.5 py-0.5 text-[10px] uppercase tracking-widest border border-border text-muted-foreground">{proj.status}</span>
                                    )}
                                </h4>
                                <p className="text-sm text-muted-foreground line-clamp-2">{proj.description}</p>
                                <div className="flex flex-wrap gap-1.5 mt-3 min-w-0 max-w-full overflow-hidden">
                                    {proj.tags?.slice(0, 3).map((t: string) => (
                                        <span key={t} className="inline-flex max-w-full items-center px-2 py-0.5 bg-secondary text-secondary-foreground text-xs rounded-md whitespace-nowrap">{t}</span>
                                    ))}
                                    {(proj.tags?.length || 0) > 3 && <span className="px-2 py-0.5 bg-secondary/50 text-muted-foreground text-xs rounded-md">+{proj.tags.length - 3}</span>}
                                </div>
                            </div>
                            <div className="flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                                <StatusToggle item={proj} save={updateProjectAction} />
                                {proj.slug && (
                                    <Button asChild variant="ghost" size="sm" className="text-muted-foreground">
                                        <a href={`/projects/${proj.slug}?preview=1`} target="_blank" rel="noreferrer" aria-label={`Preview ${proj.title}`}><ExternalLink className="h-4 w-4" /></a>
                                    </Button>
                                )}
                                <Button variant="outline" size="sm" onClick={() => handleEdit(proj)} className="flex-1 sm:flex-none gap-2">
                                    <Edit className="h-4 w-4 text-muted-foreground" /> Edit
                                </Button>
                                <Button variant="ghost" size="sm" disabled={isPending} onClick={() => handleDelete(proj.id)} className="flex-none text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
                                    <Trash2 className="h-4 w-4" />
                                    <span className="sr-only">Delete</span>
                                </Button>
                            </div>
                        </div>
                    ))}
                    {projects.length === 0 && (
                        <div className="text-center py-12 border border-dashed rounded-2xl border-border">
                            <Code className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
                            <p className="text-muted-foreground font-medium">No projects found. Add your first showcase!</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
