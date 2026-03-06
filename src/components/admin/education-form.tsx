'use client';

import { useState, useTransition } from 'react';
import { addEducationAction, updateEducationAction, deleteEducationAction } from '../../app/admin/actions';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { GraduationCap, Briefcase, Plus, Trash2, Edit, Save, X, Building2, Calendar, FileText } from 'lucide-react';

export function AdminEducationForm({ initialData }: { initialData: any[] }) {
    const [items, setItems] = useState(initialData || []);
    const [editingId, setEditingId] = useState<number | 'new' | null>(null);
    const [formData, setFormData] = useState<any>({});
    const [isPending, startTransition] = useTransition();

    const handleEdit = (item: any) => {
        setEditingId(item.id);
        setFormData(item);
    };

    const handleAddNew = () => {
        setEditingId('new');
        setFormData({ degree: '', institution: '', duration: '', description: '', icon: 'Briefcase' });
    };

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        startTransition(async () => {
            if (editingId === 'new') {
                await addEducationAction(formData);
            } else {
                await updateEducationAction(formData.id, formData);
            }
            setEditingId(null);
        });
    };

    const handleDelete = (id: number) => {
        if (!confirm('Are you sure you want to delete this career/education entry?')) return;
        startTransition(async () => {
            await deleteEducationAction(id);
        });
    };

    if (editingId) {
        return (
            <Card className="border-border/50 shadow-sm bg-background/50 backdrop-blur-sm animate-in zoom-in-95 duration-200">
                <CardHeader className="pb-4 border-b border-border/30 mb-6">
                    <CardTitle className="flex items-center gap-2 text-xl font-headline font-bold">
                        <GraduationCap className="h-5 w-5 text-primary" />
                        {editingId === 'new' ? 'Add Timeline Entry' : 'Edit Timeline Entry'}
                    </CardTitle>
                    <CardDescription>Update your experience and education history details.</CardDescription>
                </CardHeader>
                <form onSubmit={onSubmit}>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2"><GraduationCap className="h-4 w-4" /> Degree / Job Title</Label>
                            <Input className="bg-background/80 font-headline" value={formData.degree} onChange={e => setFormData({ ...formData, degree: e.target.value })} required />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="flex items-center gap-2"><Building2 className="h-4 w-4" /> Institution / Company</Label>
                                <Input className="bg-background/80" value={formData.institution} onChange={e => setFormData({ ...formData, institution: e.target.value })} required />
                            </div>
                            <div className="space-y-2">
                                <Label className="flex items-center gap-2"><Calendar className="h-4 w-4" /> Duration</Label>
                                <Input className="bg-background/80" placeholder="e.g. 2020 - 2024" value={formData.duration} onChange={e => setFormData({ ...formData, duration: e.target.value })} required />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2"><FileText className="h-4 w-4" /> Description</Label>
                            <Textarea className="bg-background/80 resize-none" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} required rows={3} />
                        </div>
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2">Entry Type</Label>
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, icon: 'GraduationCap' })}
                                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg border-2 text-sm font-semibold transition-all ${formData.icon !== 'Briefcase'
                                            ? 'border-primary bg-primary/10 text-primary'
                                            : 'border-border/50 bg-background/60 text-muted-foreground hover:border-primary/40'
                                        }`}
                                >
                                    <GraduationCap className="h-4 w-4" /> Education
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, icon: 'Briefcase' })}
                                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg border-2 text-sm font-semibold transition-all ${formData.icon === 'Briefcase'
                                            ? 'border-primary bg-primary/10 text-primary'
                                            : 'border-border/50 bg-background/60 text-muted-foreground hover:border-primary/40'
                                        }`}
                                >
                                    <Briefcase className="h-4 w-4" /> Work
                                </button>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="bg-muted/30 py-4 px-6 border-t border-border/30 rounded-b-xl flex justify-end gap-3">
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
        <Card className="border-border/50 shadow-sm bg-background/50 backdrop-blur-sm">
            <CardHeader className="pb-4 border-b border-border/30 mb-6 flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="flex items-center gap-2 text-xl font-headline font-bold">
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
                        <div key={item.id} className="border border-border/50 bg-card p-4 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:shadow-md transition-shadow">
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
                                <Button variant="destructive" size="sm" disabled={isPending} onClick={() => handleDelete(item.id)} className="flex-none">
                                    <Trash2 className="h-4 w-4" />
                                    <span className="sr-only">Delete</span>
                                </Button>
                            </div>
                        </div>
                    ))}
                    {items.length === 0 && (
                        <div className="text-center py-12 border-2 border-dashed rounded-xl border-border/50">
                            <GraduationCap className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
                            <p className="text-muted-foreground font-medium">No education or experience entries yet.</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
