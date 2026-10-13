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
import { useAdminAction } from './use-admin-action';
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
            const { ok } = await run(updateSkillCategoryAction(cat.id, { category, categoryIcon, items }));
            if (!ok) return;
            toast({ title: 'Saved!', description: `"${category}" updated.` });
        });
    };

    return (
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
            {/* Header */}
            <div
                className="flex items-center justify-between py-3 px-4 cursor-pointer bg-muted/40 hover:bg-muted transition-colors"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center gap-3">
                    <LucideIcon name={categoryIcon} className="h-4 w-4 text-primary shrink-0" />
                    <span className="font-bold uppercase tracking-wider text-sm text-foreground">{category}</span>
                    <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">{items.length} skills</span>
                </div>
                {isOpen ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
            </div>

            {isOpen && (
                <div className="border-t border-border">
                    <div className="p-4 space-y-4">
                        {/* Category meta */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <Label className="text-xs uppercase tracking-widest text-primary">Category Name</Label>
                                <Input
                                    value={category}
                                    onChange={e => setCategory(e.target.value)}
                                    className="bg-background border-border focus-visible:border-foreground/40 focus-visible:ring-0 h-8 text-sm"
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
                                <Button type="button" variant="outline" size="sm" onClick={addItem} className="text-xs border-border hover:bg-muted hover:text-primary gap-1 h-7">
                                    <Plus className="h-3 w-3" /> Add Skill
                                </Button>
                            </div>
                            <div className="space-y-1.5">
                                {items.map((item, i) => (
                                    <div key={i} className="flex flex-col sm:flex-row gap-1.5 sm:gap-2 sm:items-center group border border-border sm:border-0 p-2 sm:p-0">
                                        {/* Row 1 (mobile) / inline (desktop): grip + icon preview + name */}
                                        <div className="flex items-center gap-2 flex-1 min-w-0">
                                            <GripVertical className="h-4 w-4 text-muted-foreground/30 shrink-0 hidden sm:block" />
                                            <LucideIcon name={item.icon} className="h-4 w-4 text-primary shrink-0" />
                                            <Input
                                                value={item.name}
                                                onChange={e => updateItem(i, 'name', e.target.value)}
                                                placeholder="Skill name"
                                                className="bg-background border-border focus-visible:border-foreground/40 focus-visible:ring-0 h-8 text-sm min-w-0"
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
                                                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0 h-8 w-8 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                                {items.length === 0 && (
                                    <p className="text-xs text-muted-foreground py-3 px-2 border border-dashed border-border text-center">No skills yet.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="py-2.5 px-4 border-t border-border bg-muted/10 flex justify-between gap-2">
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => onDelete(cat.id)}
                            className="text-destructive hover:bg-destructive/10 text-xs gap-1 h-7"
                        >
                            <Trash2 className="h-3 w-3" /> Delete Category
                        </Button>
                        <Button
                            type="button"
                            size="sm"
                            onClick={handleSave}
                            disabled={isPending}
                            className="gap-1 text-xs bg-muted text-foreground hover:bg-foreground hover:text-background transition-colors h-7"
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
    const run = useAdminAction();

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
            await run(updateAboutAction(initialData.id, paragraphs), 'About section updated.');
        });
    };

    const handleAddCategory = () => {
        startAddTransition(async () => {
            const { data: newCat } = await run(addSkillCategoryAction({ category: 'New Category', categoryIcon: 'Code', items: [] }));
            if (newCat) {
                setCategories(prev => [...prev, newCat as SkillCategory]);
                toast({ title: 'Category Added', description: 'Expand it below to edit.' });
            }
        });
    };

    const handleDeleteCategory = (id: number) => {
        startTransition(async () => {
            const { ok } = await run(deleteSkillCategoryAction(id), 'Skill category removed.');
            if (ok) setCategories(prev => prev.filter(c => c.id !== id));
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

        const updated = [...categories];
        const fromIdx = updated.findIndex(c => c.id === draggedId);
        const toIdx = updated.findIndex(c => c.id === dropId);
        const [moved] = updated.splice(fromIdx, 1);
        updated.splice(toIdx, 0, moved);
        setCategories(updated);
        // persist order in background (kept out of the state updater, which may run twice)
        run(reorderSkillsAction(updated.map(c => c.id)));

        dragIdRef.current = null;
    };

    const handleDragEnd = () => {
        setDragOverId(null);
        dragIdRef.current = null;
    };

    return (
        <div className="space-y-8">
            {/* ── Bio Paragraphs ── */}
            <Card className="rounded-3xl border-border bg-card shadow-none">
                <CardHeader className="border-b border-border pb-6 mb-4">
                    <CardTitle className="flex items-center gap-2 font-headline text-2xl font-semibold tracking-tight">
                        <UserCircle className="h-5 w-5 text-primary" />
                        About Identity
                    </CardTitle>
                    <CardDescription>Manage the biography paragraphs displayed in the About section.</CardDescription>
                </CardHeader>
                <form onSubmit={onSubmit}>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between">
                            <Label className="flex items-center gap-2 font-medium"><AlignLeft className="h-4 w-4" /> Paragraphs</Label>
                            <Button type="button" variant="outline" size="sm" onClick={addParagraph} className="h-8 gap-1 border-border hover:bg-muted hover:text-primary">
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
                                        className="bg-background resize-none flex-1 min-h-[100px] border-border focus-visible:border-foreground/40 focus-visible:ring-0"
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
                                        className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 mt-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                        disabled={paragraphs.length === 1}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                        <span className="sr-only">Remove</span>
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                    <CardFooter className="bg-muted/30 py-4 px-6 border-t border-border flex justify-between">
                        <p className="text-sm text-muted-foreground">Changes reflect instantly on main site.</p>
                        <Button type="submit" disabled={isPending} className="gap-2">
                            <Save className="h-4 w-4" />
                            {isPending ? 'Saving...' : 'Save Bio'}
                        </Button>
                    </CardFooter>
                </form>
            </Card>

            {/* ── Skills Manager ── */}
            <Card className="rounded-3xl border-border bg-card shadow-none">
                <CardHeader className="pb-4 border-b border-border">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2 font-headline text-2xl font-semibold tracking-tight">
                                <Cpu className="h-5 w-5 text-primary" />
                                Skills
                            </CardTitle>
                            <CardDescription className="mt-1">Manage skill categories and individual skills shown on the About page.</CardDescription>
                        </div>
                        <Button
                            type="button"
                            onClick={handleAddCategory}
                            disabled={isAddingCat}
                            className="gap-1.5 bg-foreground text-background hover:bg-foreground/90 transition-colors text-xs"
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
                                className="absolute left-0 top-0 h-full w-6 flex items-center justify-center cursor-grab active:cursor-grabbing bg-muted/40 border-r border-border hover:bg-muted transition-colors z-10 select-none"
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
                        <div className="border border-dashed border-border py-12 text-center text-muted-foreground text-sm">
                            No skill categories. Click "Add Category" to get started.
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
