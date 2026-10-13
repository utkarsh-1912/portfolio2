'use client';

import { useState, useTransition } from 'react';
import { addEducationAction, updateEducationAction, deleteEducationAction } from '../../app/admin/actions';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { GraduationCap, Briefcase, Plus, Trash2, Edit, Save, X, Building2, Calendar, FileText, ListOrdered } from 'lucide-react';
import { formatDuration, parseDuration } from '@/lib/timeline';
import { useAdminAction } from './use-admin-action';

// <input type="month"> works with "YYYY-MM"; the database stores "YYYY-MM-01".
const toMonth = (iso?: string | null) => (iso ? iso.slice(0, 7) : '');
const fromMonth = (month: string) => (month ? `${month}-01` : null);

export function AdminEducationForm({ initialData }: { initialData: any[] }) {
    // Read straight from props: revalidation after each save re-renders with fresh, sorted rows
    const items = initialData || [];
    const [editingId, setEditingId] = useState<number | 'new' | null>(null);
    const [formData, setFormData] = useState<any>({});
    const [isPending, startTransition] = useTransition();
    const run = useAdminAction();

    const handleEdit = (item: any) => {
        // Rows created before dates existed: prefill from the old free-text duration
        const dates = item.startDate ? { startDate: item.startDate, endDate: item.endDate } : parseDuration(item.duration || '');
        setEditingId(item.id);
        setFormData({
            ...item,
            startMonth: toMonth(dates.startDate),
            endMonth: toMonth(dates.endDate),
            current: !dates.endDate,
            sequence: item.sequence ?? 0,
        });
    };

    const handleAddNew = () => {
        setEditingId('new');
        setFormData({ degree: '', institution: '', description: '', icon: 'Briefcase', startMonth: '', endMonth: '', current: false, sequence: 0 });
    };

    const startDate = fromMonth(formData.startMonth || '');
    const endDate = formData.current ? null : fromMonth(formData.endMonth || '');
    const durationPreview = startDate ? formatDuration(startDate, endDate) : '';

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            degree: formData.degree,
            institution: formData.institution,
            description: formData.description,
            icon: formData.icon,
            startDate,
            endDate,
            sequence: formData.sequence,
        };
        startTransition(async () => {
            const { ok } = await run(
                editingId === 'new' ? addEducationAction(payload) : updateEducationAction(formData.id, payload),
                'Timeline entry saved.'
            );
            if (ok) setEditingId(null);
        });
    };

    const handleDelete = (id: number) => {
        if (!confirm('Are you sure you want to delete this career/education entry?')) return;
        startTransition(async () => {
            await run(deleteEducationAction(id), 'Timeline entry deleted.');
        });
    };

    if (editingId) {
        return (
            <Card className="rounded-3xl border-border bg-card shadow-none animate-in fade-in slide-in-from-bottom-2 duration-300">
                <CardHeader className="border-b border-border pb-6 mb-6">
                    <CardTitle className="flex items-center gap-2 font-headline text-2xl font-semibold tracking-tight">
                        <GraduationCap className="h-5 w-5 text-primary" />
                        {editingId === 'new' ? 'Add Timeline Entry' : 'Edit Timeline Entry'}
                    </CardTitle>
                    <CardDescription>Update your experience and education history details.</CardDescription>
                </CardHeader>
                <form onSubmit={onSubmit}>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2"><GraduationCap className="h-4 w-4" /> Degree / Job Title</Label>
                            <Input className="bg-background font-headline" value={formData.degree} onChange={e => setFormData({ ...formData, degree: e.target.value })} required />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="flex items-center gap-2"><Building2 className="h-4 w-4" /> Institution / Company</Label>
                                <Input className="bg-background" value={formData.institution} onChange={e => setFormData({ ...formData, institution: e.target.value })} required />
                            </div>
                            <div className="space-y-2">
                                <Label className="flex items-center gap-2"><ListOrdered className="h-4 w-4" /> Order override</Label>
                                <Input className="bg-background" type="number" value={formData.sequence ?? 0} onChange={e => setFormData({ ...formData, sequence: parseInt(e.target.value) || 0 })} />
                                <p className="text-xs text-muted-foreground">Leave 0 to sort newest first. Negative = pin to top.</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="edu-start" className="flex items-center gap-2"><Calendar className="h-4 w-4" /> Start</Label>
                                <Input id="edu-start" className="bg-background" type="month" value={formData.startMonth} onChange={e => setFormData({ ...formData, startMonth: e.target.value })} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edu-end" className="flex items-center gap-2"><Calendar className="h-4 w-4" /> End</Label>
                                <Input id="edu-end" className="bg-background" type="month" value={formData.current ? '' : formData.endMonth} min={formData.startMonth || undefined} disabled={formData.current} onChange={e => setFormData({ ...formData, endMonth: e.target.value })} required={!formData.current} />
                                <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                                    <Checkbox checked={!!formData.current} onCheckedChange={v => setFormData({ ...formData, current: v === true })} />
                                    I currently work / study here
                                </label>
                            </div>
                        </div>
                        {durationPreview && (
                            <p className="text-xs text-muted-foreground -mt-2">Shown on the site as <span className="text-primary font-bold">{durationPreview}</span></p>
                        )}
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2"><FileText className="h-4 w-4" /> Description</Label>
                            <Textarea className="bg-background resize-none" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} required rows={3} />
                        </div>
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2">Entry Type</Label>
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, icon: 'GraduationCap' })}
                                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-full border text-sm font-medium transition-colors ${formData.icon !== 'Briefcase'
                                            ? 'border-foreground bg-foreground text-background'
                                            : 'border-border bg-background text-muted-foreground hover:border-foreground/30 hover:text-foreground'
                                        }`}
                                >
                                    <GraduationCap className="h-4 w-4" /> Education
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, icon: 'Briefcase' })}
                                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-full border text-sm font-medium transition-colors ${formData.icon === 'Briefcase'
                                            ? 'border-foreground bg-foreground text-background'
                                            : 'border-border bg-background text-muted-foreground hover:border-foreground/30 hover:text-foreground'
                                        }`}
                                >
                                    <Briefcase className="h-4 w-4" /> Work
                                </button>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="border-t border-border px-6 py-5 flex justify-end gap-3">
                        <Button type="button" variant="outline" onClick={() => setEditingId(null)} className="gap-2">
                            <X className="h-4 w-4" /> Cancel
                        </Button>
                        <Button type="submit" disabled={isPending} className="gap-2">
                            <Save className="h-4 w-4" /> {isPending ? 'Saving...' : 'Save Entry'}
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
                        <GraduationCap className="h-5 w-5 text-primary" />
                        Career & Education
                    </CardTitle>
                    <CardDescription>Manage your timeline of experiences and academic degrees.</CardDescription>
                </div>
                <Button onClick={handleAddNew} className="gap-2 mt-4 sm:mt-0">
                    <Plus className="h-4 w-4" /> Add Entry
                </Button>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4">
                    {items.map((item) => (
                        <div key={item.id} className="rounded-2xl border border-border bg-background p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-colors hover:border-foreground/25">
                            <div className="flex-1">
                                <h4 className="font-bold font-headline text-lg">{item.degree}</h4>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                    <Building2 className="h-3.5 w-3.5" />
                                    <span>{item.institution}</span>
                                    <span className="text-border">•</span>
                                    <Calendar className="h-3.5 w-3.5" />
                                    <span>{item.duration}</span>
                                </div>
                            </div>
                            <div className="flex gap-2 w-full sm:w-auto mt-3 sm:mt-0">
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
                            <GraduationCap className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
                            <p className="text-muted-foreground font-medium">No education or experience entries yet.</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
