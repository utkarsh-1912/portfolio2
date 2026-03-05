'use client';

import { useState, useTransition } from 'react';
import { updateAboutAction } from '../../app/admin/actions';
import { Textarea } from '../../components/ui/textarea';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { UserCircle, Plus, Trash2, Save, AlignLeft } from 'lucide-react';

export function AdminAboutForm({ initialData }: { initialData: any }) {
    const [paragraphs, setParagraphs] = useState<string[]>(initialData?.paragraphs || ['']);
    const [isPending, startTransition] = useTransition();

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
        });
    };

    return (
        <Card className="border-border/50 shadow-sm bg-background/50 backdrop-blur-sm">
            <CardHeader className="pb-4 border-b border-border/30 mb-6">
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
                        <Button type="button" variant="outline" size="sm" onClick={addParagraph} className="h-8 gap-1">
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
                                    className="bg-background/80 resize-none flex-1 min-h-[100px]"
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
                <CardFooter className="bg-muted/30 py-4 px-6 border-t border-border/30 rounded-b-xl flex justify-between">
                    <p className="text-sm text-muted-foreground">Changes reflect instantly on main site.</p>
                    <Button type="submit" disabled={isPending} className="gap-2">
                        <Save className="h-4 w-4" />
                        {isPending ? 'Saving...' : 'Save Changes'}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}
