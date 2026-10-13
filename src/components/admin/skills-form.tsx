'use client';

import { useState, useTransition } from 'react';
import { addSkillCategoryAction, updateSkillCategoryAction, deleteSkillCategoryAction } from '../../app/admin/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Plus, Trash2, Save, Cpu, ChevronDown, ChevronUp, GripVertical } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAdminAction } from './use-admin-action';

type SkillItem = { name: string; icon: string };
type SkillCategory = { id: number; category: string; categoryIcon: string; items: SkillItem[] };

function SkillCategoryCard({ cat, onDelete }: { cat: SkillCategory; onDelete: (id: number) => void }) {
    const [category, setCategory] = useState(cat.category);
    const [categoryIcon, setCategoryIcon] = useState(cat.categoryIcon);
    const [items, setItems] = useState<SkillItem[]>(cat.items || []);
    const [isOpen, setIsOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const run = useAdminAction();

    const addItem = () => setItems([...items, { name: '', icon: 'Code' }]);
    const removeItem = (i: number) => setItems(items.filter((_, idx) => idx !== i));
    const updateItem = (i: number, field: keyof SkillItem, value: string) => {
        const updated = [...items];
        updated[i] = { ...updated[i], [field]: value };
        setItems(updated);
    };

    const handleSave = () => {
        startTransition(async () => {
            await run(updateSkillCategoryAction(cat.id, { category, categoryIcon, items }), `"${category}" updated.`);
        });
    };

    return (
        <Card className="rounded-2xl border border-border bg-card overflow-hidden">
            {/* Header */}
            <CardHeader
                className="flex flex-row items-center justify-between py-3 px-4 cursor-pointer border-b border-border bg-muted/40 hover:bg-muted transition-colors"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center gap-3">
                    <Cpu className="h-4 w-4 text-primary" />
                    <span className="font-bold uppercase tracking-wider text-sm text-foreground">{category}</span>
                    <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">{items.length} skills</span>
                </div>
                <div className="flex items-center gap-2">
                    {isOpen ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                </div>
            </CardHeader>

            {isOpen && (
                <>
                    <CardContent className="pt-5 space-y-5">
                        {/* Category meta */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <Label className="text-xs uppercase tracking-widest text-primary">Category Name</Label>
                                <Input
                                    value={category}
                                    onChange={e => setCategory(e.target.value)}
                                    className="bg-background border-border focus-visible:border-foreground/40 focus-visible:ring-0"
                                />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs uppercase tracking-widest text-primary">Category Icon (Lucide name)</Label>
                                <Input
                                    value={categoryIcon}
                                    onChange={e => setCategoryIcon(e.target.value)}
                                    placeholder="e.g. Code, Server, Database"
                                    className="bg-background border-border focus-visible:border-foreground/40 focus-visible:ring-0"
                                />
                            </div>
                        </div>

                        {/* Skill items */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label className="text-xs uppercase tracking-widest text-primary">Skills</Label>
                                <Button type="button" variant="outline" size="sm" onClick={addItem} className="text-xs border-border hover:bg-muted hover:text-primary gap-1">
                                    <Plus className="h-3 w-3" /> Add Skill
                                </Button>
                            </div>
                            <div className="space-y-2">
                                {items.map((item, i) => (
                                    <div key={i} className="flex gap-2 items-center group">
                                        <GripVertical className="h-4 w-4 text-muted-foreground/30 shrink-0" />
                                        <Input
                                            value={item.name}
                                            onChange={e => updateItem(i, 'name', e.target.value)}
                                            placeholder="Skill name"
                                            className="bg-background border-border focus-visible:border-foreground/40 focus-visible:ring-0"
                                        />
                                        <Input
                                            value={item.icon}
                                            onChange={e => updateItem(i, 'icon', e.target.value)}
                                            placeholder="Lucide icon"
                                            className="bg-background border-border focus-visible:border-foreground/40 focus-visible:ring-0 w-36 shrink-0"
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeItem(i)}
                                            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                                {items.length === 0 && (
                                    <p className="text-xs text-muted-foreground py-3 px-2 border border-dashed border-border text-center">No skills yet. Add one above.</p>
                                )}
                            </div>
                        </div>
                    </CardContent>

                    <CardFooter className="py-3 px-4 border-t border-border bg-muted/20 flex justify-between gap-2">
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => onDelete(cat.id)}
                            className="text-destructive hover:bg-destructive/10 text-xs gap-1"
                        >
                            <Trash2 className="h-3 w-3" /> Delete Category
                        </Button>
                        <Button
                            type="button"
                            size="sm"
                            onClick={handleSave}
                            disabled={isPending}
                            className="gap-1 text-xs bg-muted text-foreground hover:bg-foreground hover:text-background transition-colors"
                        >
                            <Save className="h-3 w-3" /> {isPending ? 'Saving...' : 'Save Category'}
                        </Button>
                    </CardFooter>
                </>
            )}
        </Card>
    );
}

export function AdminSkillsForm({ initialData }: { initialData: SkillCategory[] }) {
    const [categories, setCategories] = useState<SkillCategory[]>(initialData);
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();
    const run = useAdminAction();

    const handleAdd = () => {
        startTransition(async () => {
            const { data: newCat } = await run(addSkillCategoryAction({ category: 'New Category', categoryIcon: 'Code', items: [] }));
            if (newCat) {
                setCategories(prev => [...prev, newCat as SkillCategory]);
                toast({ title: 'Category Added', description: 'Edit the new category below.' });
            }
        });
    };

    const handleDelete = (id: number) => {
        startTransition(async () => {
            const { ok } = await run(deleteSkillCategoryAction(id), 'Skill category removed.');
            if (ok) setCategories(prev => prev.filter(c => c.id !== id));
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <span className="eyebrow">Skills</span>
                    <h2 className="text-2xl font-bold text-foreground mt-1">Manage skills</h2>
                    <p className="text-muted-foreground text-sm mt-1">Add, edit, or remove skill categories and individual skills.</p>
                </div>
                <Button
                    onClick={handleAdd}
                    disabled={isPending}
                    className="gap-2 bg-foreground text-background hover:bg-foreground/90 transition-colors"
                >
                    <Plus className="h-4 w-4" /> Add Category
                </Button>
            </div>

            <div className="space-y-3">
                {categories.map(cat => (
                    <SkillCategoryCard key={cat.id} cat={cat} onDelete={handleDelete} />
                ))}
                {categories.length === 0 && (
                    <div className="border border-dashed border-border py-16 text-center text-muted-foreground text-sm">
                        No skill categories yet. Click "Add Category" to get started.
                    </div>
                )}
            </div>
        </div>
    );
}
