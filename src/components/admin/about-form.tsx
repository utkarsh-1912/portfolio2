'use client';

import { useState, useTransition, useRef } from 'react';
import { updateAboutAction } from '../../app/admin/actions';
import { addSkillCategoryAction, updateSkillCategoryAction, deleteSkillCategoryAction, reorderSkillsAction } from '../../app/admin/actions';
import { Textarea } from '../../components/ui/textarea';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { UserCircle, Plus, Trash2, Save, AlignLeft, Cpu, ChevronDown, ChevronUp, GripVertical, ArrowUpDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { IconPicker, LucideIcon } from './icon-picker';

// ─── Skill Types ──────────────────────────────────────────────
type SkillItem = { name: string; icon: string };
type SkillCategory = { id: number; category: string; categoryIcon: string; items: SkillItem[] };

// ─── Skill Category Card ──────────────────────────────────────
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
        <div className="border border-primary/20 rounded-none bg-card/50 font-mono">
            {/* Header */}
            <div
                className="flex items-center justify-between py-3 px-4 cursor-pointer bg-primary/5 hover:bg-primary/10 transition-colors"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center gap-3">
                    <LucideIcon name={categoryIcon} className="h-4 w-4 text-primary shrink-0" />
                    <span className="font-bold uppercase tracking-wider text-sm text-foreground">{category}</span>
                    <span className="text-xs text-muted-foreground bg-primary/10 border border-primary/20 px-2 py-0.5">{items.length} skills</span>
                </div>
                {isOpen ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
            </div>

            {isOpen && (
                <div className="border-t border-primary/10">
                    <div className="p-4 space-y-4">
                        {/* Category meta */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <Label className="text-xs uppercase tracking-widest text-primary">Category Name</Label>
                                <Input
                                    value={category}
                                    onChange={e => setCategory(e.target.value)}
                                    className="rounded-none bg-background/50 border-primary/20 focus-visible:border-primary focus-visible:ring-0 h-8 text-sm"
                                />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs uppercase tracking-widest text-primary">Category Icon</Label>
                                <IconPicker value={categoryIcon} onChange={setCategoryIcon} />
                            </div>
                        </div>

                        {/* Skill items */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label className="text-xs uppercase tracking-widest text-primary">Skills</Label>
                                <Button type="button" variant="outline" size="sm" onClick={addItem} className="rounded-none text-xs border-primary/30 hover:bg-primary/10 hover:text-primary gap-1 h-7">
                                    <Plus className="h-3 w-3" /> Add Skill
                                </Button>
                            </div>
                            <div className="space-y-1.5">
                                {items.map((item, i) => (
                                    <div key={i} className="flex flex-col sm:flex-row gap-1.5 sm:gap-2 sm:items-center group border border-primary/10 sm:border-0 p-2 sm:p-0 rounded-none">
                                        {/* Row 1 (mobile) / inline (desktop): grip + icon preview + name */}
                                        <div className="flex items-center gap-2 flex-1 min-w-0">
                                            <GripVertical className="h-4 w-4 text-muted-foreground/30 shrink-0 hidden sm:block" />
                                            <LucideIcon name={item.icon} className="h-4 w-4 text-primary shrink-0" />
                                            <Input
                                                value={item.name}
                                                onChange={e => updateItem(i, 'name', e.target.value)}
                                                placeholder="Skill name"
                                                className="rounded-none bg-background/50 border-primary/20 focus-visible:border-primary focus-visible:ring-0 h-8 text-sm min-w-0"
                                            />
                                        </div>
                                        {/* Row 2 (mobile) / inline (desktop): icon picker + delete */}
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 sm:w-36 sm:flex-none">
                                                <IconPicker
                                                    value={item.icon}
                                                    onChange={v => updateItem(i, 'icon', v)}
                                                />
                                            </div>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => removeItem(i)}
                                                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-none shrink-0 h-8 w-8 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                                {items.length === 0 && (
                                    <p className="text-xs text-muted-foreground py-3 px-2 border border-dashed border-primary/20 text-center">No skills yet.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="py-2.5 px-4 border-t border-primary/10 bg-muted/10 flex justify-between gap-2">
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => onDelete(cat.id)}
                            className="text-destructive hover:bg-destructive/10 rounded-none text-xs gap-1 h-7"
                        >
                            <Trash2 className="h-3 w-3" /> Delete Category
                        </Button>
                        <Button
                            type="button"
                            size="sm"
                            onClick={handleSave}
                            disabled={isPending}
                            className="rounded-none gap-1 font-mono text-xs bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground border border-primary/30 transition-colors h-7"
                        >
                            <Save className="h-3 w-3" /> {isPending ? 'Saving...' : 'Save'}
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}

// ─── Main About Form ──────────────────────────────────────────
export function AdminAboutForm({ initialData, skillsData }: { initialData: any; skillsData?: any[] }) {
    const [paragraphs, setParagraphs] = useState<string[]>(initialData?.paragraphs || ['']);
    const [categories, setCategories] = useState<SkillCategory[]>(skillsData || []);
    const [isPending, startTransition] = useTransition();
    const [isAddingCat, startAddTransition] = useTransition();
    const [dragOverId, setDragOverId] = useState<number | null>(null);
    const dragIdRef = useRef<number | null>(null);
    const { toast } = useToast();

    const handleParagraphChange = (index: number, value: string) => {
        const newParagraphs = [...paragraphs];
        newParagraphs[index] = value;
        setParagraphs(newParagraphs);
    };

    const addParagraph = () => setParagraphs([...paragraphs, '']);
    const removeParagraph = (index: number) => {
        setParagraphs(paragraphs.filter((_, i) => i !== index));
    };

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        startTransition(async () => {
            await updateAboutAction(initialData.id, paragraphs);
            toast({ title: 'Saved!', description: 'About section updated.' });
        });
    };

    const handleAddCategory = () => {
        startAddTransition(async () => {
            const newCat = await addSkillCategoryAction({ category: 'New Category', categoryIcon: 'Code', items: [] });
            if (newCat) {
                setCategories(prev => [...prev, newCat as SkillCategory]);
                toast({ title: 'Category Added', description: 'Expand it below to edit.' });
            }
        });
    };

    const handleDeleteCategory = (id: number) => {
        startTransition(async () => {
            await deleteSkillCategoryAction(id);
            setCategories(prev => prev.filter(c => c.id !== id));
            toast({ title: 'Deleted', description: 'Skill category removed.' });
        });
    };

    // ── Drag-to-reorder handlers ──
    const handleDragStart = (id: number) => {
        dragIdRef.current = id;
    };

    const handleDragOver = (e: React.DragEvent, overId: number) => {
        e.preventDefault();
        if (dragIdRef.current === overId) return;
        setDragOverId(overId);
    };

    const handleDrop = (e: React.DragEvent, dropId: number) => {
        e.preventDefault();
        setDragOverId(null);
        const draggedId = dragIdRef.current;
        if (!draggedId || draggedId === dropId) return;

        setCategories(prev => {
            const updated = [...prev];
            const fromIdx = updated.findIndex(c => c.id === draggedId);
            const toIdx = updated.findIndex(c => c.id === dropId);
            const [moved] = updated.splice(fromIdx, 1);
            updated.splice(toIdx, 0, moved);
            // persist order in background
            reorderSkillsAction(updated.map(c => c.id));
            return updated;
        });

        dragIdRef.current = null;
    };

    const handleDragEnd = () => {
        setDragOverId(null);
        dragIdRef.current = null;
    };

    return (
        <div className="space-y-8">
            {/* ── Bio Paragraphs ── */}
            <Card className="rounded-none tech-border bg-card/80 backdrop-blur-sm font-mono">
                <CardHeader className="pb-4 border-b border-border/30 mb-4">
                    <CardTitle className="flex items-center gap-2 text-xl font-headline font-bold">
                        <UserCircle className="h-5 w-5 text-primary" />
                        About Identity
                    </CardTitle>
                    <CardDescription>Manage the biography paragraphs displayed in the About section.</CardDescription>
                </CardHeader>
                <form onSubmit={onSubmit}>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between">
                            <Label className="flex items-center gap-2 font-medium"><AlignLeft className="h-4 w-4" /> Paragraphs</Label>
                            <Button type="button" variant="outline" size="sm" onClick={addParagraph} className="h-8 gap-1 rounded-none border-primary/30 hover:bg-primary/10 hover:text-primary">
                                <Plus className="h-3.5 w-3.5" /> Add Paragraph
                            </Button>
                        </div>
                        <div className="space-y-4">
                            {paragraphs.map((p, index) => (
                                <div key={index} className="flex gap-3 items-start group">
                                    <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-muted text-xs text-muted-foreground mt-2 font-mono">
                                        {index + 1}
                                    </span>
                                    <Textarea
                                        className="bg-background/80 resize-none flex-1 min-h-[100px] rounded-none border-primary/20 focus-visible:border-primary focus-visible:ring-0"
                                        value={p}
                                        placeholder="Enter biographical information..."
                                        onChange={e => handleParagraphChange(index, e.target.value)}
                                        required
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeParagraph(index)}
                                        className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 mt-1 opacity-0 group-hover:opacity-100 transition-opacity rounded-none"
                                        disabled={paragraphs.length === 1}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                        <span className="sr-only">Remove</span>
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                    <CardFooter className="bg-muted/30 py-4 px-6 border-t border-border/30 flex justify-between">
                        <p className="text-sm text-muted-foreground">Changes reflect instantly on main site.</p>
                        <Button type="submit" disabled={isPending} className="gap-2 rounded-none">
                            <Save className="h-4 w-4" />
                            {isPending ? 'Saving...' : 'Save Bio'}
                        </Button>
                    </CardFooter>
                </form>
            </Card>

            {/* ── Skills Manager ── */}
            <Card className="rounded-none tech-border bg-card/80 backdrop-blur-sm font-mono">
                <CardHeader className="pb-4 border-b border-border/30">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2 text-xl font-headline font-bold">
                                <Cpu className="h-5 w-5 text-primary" />
                                Skills
                            </CardTitle>
                            <CardDescription className="mt-1">Manage skill categories and individual skills shown on the About page.</CardDescription>
                        </div>
                        <Button
                            type="button"
                            onClick={handleAddCategory}
                            disabled={isAddingCat}
                            className="rounded-none gap-1.5 border border-primary bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors text-xs"
                            size="sm"
                        >
                            <Plus className="h-3.5 w-3.5" /> Add Category
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="pt-5 space-y-2">
                    {categories.map(cat => (
                        <div
                            key={cat.id}
                            draggable
                            onDragStart={() => handleDragStart(cat.id)}
                            onDragOver={e => handleDragOver(e, cat.id)}
                            onDrop={e => handleDrop(e, cat.id)}
                            onDragEnd={handleDragEnd}
                            className={`relative transition-all duration-150 ${
                                dragOverId === cat.id
                                    ? 'border-t-2 border-primary scale-[1.01]'
                                    : ''
                            }`}
                        >
                            {/* Drag handle strip */}
                            <div
                                className="absolute left-0 top-0 h-full w-6 flex items-center justify-center cursor-grab active:cursor-grabbing bg-primary/5 border-r border-primary/10 hover:bg-primary/10 transition-colors z-10 select-none"
                                title="Drag to reorder"
                            >
                                <ArrowUpDown className="h-3 w-3 text-muted-foreground" />
                            </div>
                            <div className="pl-6">
                                <SkillCategoryCard cat={cat} onDelete={handleDeleteCategory} />
                            </div>
                        </div>
                    ))}
                    {categories.length === 0 && (
                        <div className="border border-dashed border-primary/20 py-12 text-center text-muted-foreground text-sm">
                            No skill categories. Click "Add Category" to get started.
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
