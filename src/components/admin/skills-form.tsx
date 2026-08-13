'use client';

import { useState, useTransition } from 'react';
import { addSkillCategoryAction, updateSkillCategoryAction, deleteSkillCategoryAction } from '../../app/admin/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Plus, Trash2, Save, Cpu, ChevronDown, ChevronUp, GripVertical } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type SkillItem = { name: string; icon: string };
type SkillCategory = { id: number; category: string; categoryIcon: string; items: SkillItem[] };

function SkillCategoryCard({ cat, onDelete }: { cat: SkillCategory; onDelete: (id: number) => void }) {
    const [category, setCategory] = useState(cat.category);
    const [categoryIcon, setCategoryIcon] = useState(cat.categoryIcon);
    const [items, setItems] = useState<SkillItem[]>(cat.items || []);
    const [isOpen, setIsOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();

    const addItem = () => setItems([...items, { name: '', icon: 'Code' }]);
    const removeItem = (i: number) => setItems(items.filter((_, idx) => idx !== i));
    const updateItem = (i: number, field: keyof SkillItem, value: string) => {
        const updated = [...items];
        updated[i] = { ...updated[i], [field]: value };
        setItems(updated);
    };

    const handleSave = () => {
        startTransition(async () => {
            await updateSkillCategoryAction(cat.id, { category, categoryIcon, items });
            toast({ title: 'Saved!', description: `"${category}" updated.` });
        });
    };

    return (
        <Card className="rounded-none border border-primary/20 bg-card/80 font-mono">
            {/* Header */}
            <CardHeader
                className="flex flex-row items-center justify-between py-3 px-4 cursor-pointer border-b border-primary/10 bg-primary/5 hover:bg-primary/10 transition-colors"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center gap-3">
                    <Cpu className="h-4 w-4 text-primary" />
                    <span className="font-bold uppercase tracking-wider text-sm text-foreground">{category}</span>
                    <span className="text-xs text-muted-foreground bg-primary/10 border border-primary/20 px-2 py-0.5">{items.length} skills</span>
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
                                    className="rounded-none bg-background/50 border-primary/20 focus-visible:border-primary focus-visible:ring-0"
                                />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs uppercase tracking-widest text-primary">Category Icon (Lucide name)</Label>
                                <Input
                                    value={categoryIcon}
                                    onChange={e => setCategoryIcon(e.target.value)}
                                    placeholder="e.g. Code, Server, Database"
                                    className="rounded-none bg-background/50 border-primary/20 focus-visible:border-primary focus-visible:ring-0"
                                />
                            </div>
                        </div>

                        {/* Skill items */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label className="text-xs uppercase tracking-widest text-primary">Skills</Label>
                                <Button type="button" variant="outline" size="sm" onClick={addItem} className="rounded-none text-xs border-primary/30 hover:bg-primary/10 hover:text-primary gap-1">
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
                                            className="rounded-none bg-background/50 border-primary/20 focus-visible:border-primary focus-visible:ring-0"
                                        />
                                        <Input
                                            value={item.icon}
                                            onChange={e => updateItem(i, 'icon', e.target.value)}
                                            placeholder="Lucide icon"
                                            className="rounded-none bg-background/50 border-primary/20 focus-visible:border-primary focus-visible:ring-0 w-36 shrink-0"
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeItem(i)}
                                            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-none shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                                {items.length === 0 && (
                                    <p className="text-xs text-muted-foreground py-3 px-2 border border-dashed border-primary/20 text-center">No skills yet. Add one above.</p>
                                )}
                            </div>
                        </div>
                    </CardContent>

                    <CardFooter className="py-3 px-4 border-t border-primary/10 bg-muted/20 flex justify-between gap-2">
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => onDelete(cat.id)}
                            className="text-destructive hover:bg-destructive/10 rounded-none text-xs gap-1"
                        >
                            <Trash2 className="h-3 w-3" /> Delete Category
                        </Button>
                        <Button
                            type="button"
                            size="sm"
                            onClick={handleSave}
                            disabled={isPending}
                            className="rounded-none gap-1 font-mono text-xs bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground border border-primary/30 transition-colors"
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

    const handleAdd = () => {
        startTransition(async () => {
            const newCat = await addSkillCategoryAction({ category: 'New Category', categoryIcon: 'Code', items: [] });
            if (newCat) {
                setCategories(prev => [...prev, newCat as SkillCategory]);
                toast({ title: 'Category Added', description: 'Edit the new category below.' });
            }
        });
    };

    const handleDelete = (id: number) => {
        startTransition(async () => {
            await deleteSkillCategoryAction(id);
            setCategories(prev => prev.filter(c => c.id !== id));
            toast({ title: 'Deleted', description: 'Skill category removed.' });
        });
    };

    return (
        <div className="space-y-6 font-mono">
            <div className="flex items-center justify-between">
                <div>
                    <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-primary mb-1 bg-primary/10 px-3 py-0.5 border border-primary/30">./skills.json</span>
                    <h2 className="text-2xl font-bold text-foreground mt-1">&gt; Manage Skills</h2>
                    <p className="text-muted-foreground text-sm mt-1">Add, edit, or remove skill categories and individual skills.</p>
                </div>
                <Button
                    onClick={handleAdd}
                    disabled={isPending}
                    className="rounded-none gap-2 border border-primary bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                    <Plus className="h-4 w-4" /> Add Category
                </Button>
            </div>

            <div className="space-y-3">
                {categories.map(cat => (
                    <SkillCategoryCard key={cat.id} cat={cat} onDelete={handleDelete} />
                ))}
                {categories.length === 0 && (
                    <div className="border border-dashed border-primary/20 py-16 text-center text-muted-foreground text-sm">
                        No skill categories yet. Click "Add Category" to get started.
                    </div>
                )}
            </div>
        </div>
    );
}
