'use client';

import { useState, useTransition, useRef, useCallback } from 'react';
import { updateHeroAction, uploadImageAction } from '../../app/admin/actions';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Save, User, Briefcase, FileText, Github, Linkedin, Twitter, Upload, ImageIcon, RotateCcw, CheckCircle2, Loader2 } from 'lucide-react';

const DEFAULT_PHOTO = '/profile.jpg';

export function AdminHeroForm({ initialData }: { initialData: any }) {
    const [data, setData] = useState(initialData || {
        title: '', roles: [], description: '', githubUrl: '', linkedinUrl: '', twitterUrl: '', photoUrl: ''
    });
    const [isPending, startTransition] = useTransition();

    // Photo upload state
    const [preview, setPreview] = useState<string>(initialData?.photoUrl || DEFAULT_PHOTO);
    const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'done' | 'error'>('idle');
    const [uploadError, setUploadError] = useState('');
    const [isDragging, setIsDragging] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleRolesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rolesArray = e.target.value.split(',').map(r => r.trim());
        setData({ ...data, roles: rolesArray });
    };

    const processFile = useCallback((file: File) => {
        if (!file.type.startsWith('image/')) {
            setUploadError('Please select an image file.');
            return;
        }
        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64 = reader.result as string;
            setPreview(base64);        // immediate local preview
            setUploadStatus('uploading');
            setUploadError('');

            const res = await uploadImageAction(base64);
            if (res.success && res.url) {
                setData((prev: any) => ({ ...prev, photoUrl: res.url }));
                setPreview(res.url);
                setUploadStatus('done');
            } else {
                setUploadError(res.error || 'Upload failed.');
                setUploadStatus('error');
                // keep base64 as preview even if upload failed
                setData((prev: any) => ({ ...prev, photoUrl: base64 }));
            }
        };
        reader.readAsDataURL(file);
    }, []);

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) processFile(file);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) processFile(file);
    };

    const resetPhoto = () => {
        setPreview(DEFAULT_PHOTO);
        setData((prev: any) => ({ ...prev, photoUrl: '' }));
        setUploadStatus('idle');
        setUploadError('');
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        startTransition(async () => {
            await updateHeroAction(data.id, data);
        });
    };

    const isUsingDefault = !data.photoUrl;

    return (
        <Card className="border-border/50 shadow-sm bg-background/50 backdrop-blur-sm">
            <CardHeader className="pb-4 border-b border-border/30 mb-6">
                <CardTitle className="flex items-center gap-2 text-xl font-headline font-bold">
                    <User className="h-5 w-5 text-primary" />
                    Hero Section Settings
                </CardTitle>
                <CardDescription>Update your main landing page introductory content.</CardDescription>
            </CardHeader>
            <form onSubmit={onSubmit}>
                <CardContent className="space-y-6">

                    {/* Photo Upload */}
                    <div className="space-y-3">
                        <Label className="flex items-center gap-2 font-semibold">
                            <ImageIcon className="h-4 w-4 text-primary" /> Profile Photo
                        </Label>
                        <div className="flex flex-col sm:flex-row gap-6 items-start">
                            {/* Preview circle */}
                            <div className="flex-shrink-0 flex flex-col items-center gap-2">
                                <div className="relative w-28 h-28">
                                    <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-primary/30 bg-muted shadow-md">
                                        <img
                                            src={preview}
                                            alt="Profile preview"
                                            className="w-full h-full object-cover"
                                            onError={() => setPreview(DEFAULT_PHOTO)}
                                        />
                                    </div>
                                    {/* Status indicator */}
                                    {uploadStatus === 'uploading' && (
                                        <div className="absolute inset-0 rounded-full bg-background/70 flex items-center justify-center">
                                            <Loader2 className="h-7 w-7 text-primary animate-spin" />
                                        </div>
                                    )}
                                    {uploadStatus === 'done' && (
                                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-background flex items-center justify-center">
                                            <CheckCircle2 className="h-4 w-4 text-white" />
                                        </div>
                                    )}
                                    {isUsingDefault && (
                                        <div className="absolute -bottom-1 -right-1">
                                            <span className="text-[9px] bg-muted text-muted-foreground border border-border/50 px-1 py-0.5 rounded font-bold uppercase tracking-wide whitespace-nowrap">Default</span>
                                        </div>
                                    )}
                                </div>
                                {!isUsingDefault && (
                                    <button
                                        type="button"
                                        onClick={resetPhoto}
                                        className="text-xs text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1"
                                    >
                                        <RotateCcw className="h-3 w-3" /> Reset to default
                                    </button>
                                )}
                            </div>

                            {/* Drop zone */}
                            <div
                                className={`flex-1 w-full border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all
                                    ${isDragging
                                        ? 'border-primary bg-primary/10 scale-[1.01]'
                                        : uploadStatus === 'done'
                                            ? 'border-green-500/40 bg-green-500/5'
                                            : uploadStatus === 'error'
                                                ? 'border-destructive/40 bg-destructive/5'
                                                : 'border-border/50 hover:border-primary/40 hover:bg-primary/5'
                                    }`}
                                onClick={() => fileInputRef.current?.click()}
                                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                onDragLeave={() => setIsDragging(false)}
                                onDrop={handleDrop}
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleFileInput}
                                />
                                <div className="flex flex-col items-center gap-3 pointer-events-none">
                                    {uploadStatus === 'uploading' ? (
                                        <Loader2 className="h-8 w-8 text-primary animate-spin" />
                                    ) : uploadStatus === 'done' ? (
                                        <CheckCircle2 className="h-8 w-8 text-green-500" />
                                    ) : (
                                        <Upload className={`h-8 w-8 ${isDragging ? 'text-primary' : 'text-muted-foreground'}`} />
                                    )}
                                    <div>
                                        <p className="text-sm font-semibold text-foreground">
                                            {uploadStatus === 'uploading' ? 'Uploading to cloud…' :
                                                uploadStatus === 'done' ? 'Photo uploaded successfully!' :
                                                    isDragging ? 'Drop it here!' :
                                                        'Drag & drop or click to upload'}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {uploadStatus === 'done'
                                                ? 'Hit "Save Changes" to apply it to your portfolio.'
                                                : 'PNG, JPG, WEBP supported. Photo is uploaded to ImgBB automatically.'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {uploadStatus === 'error' && (
                            <p className="text-sm text-destructive font-medium flex items-center gap-1.5">
                                ⚠ {uploadError} Photo saved locally — save to keep it.
                            </p>
                        )}
                    </div>

                    <div className="border-t border-border/30 pt-4 space-y-6">
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2"><User className="h-4 w-4" /> Name / Title</Label>
                            <Input
                                className="bg-background/80"
                                value={data.title}
                                onChange={e => setData({ ...data, title: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2"><Briefcase className="h-4 w-4" /> Roles (comma separated)</Label>
                            <Input
                                className="bg-background/80"
                                value={data.roles?.join(', ')}
                                onChange={handleRolesChange}
                                required
                            />
                            <p className="text-xs text-muted-foreground">These will be animated in the hero section.</p>
                        </div>
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2"><FileText className="h-4 w-4" /> Description</Label>
                            <Textarea
                                className="bg-background/80 resize-none"
                                value={data.description}
                                onChange={e => setData({ ...data, description: e.target.value })}
                                rows={4}
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border/30">
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2"><Github className="h-4 w-4" /> GitHub URL</Label>
                            <Input
                                className="bg-background/80"
                                type="url"
                                value={data.githubUrl || ''}
                                onChange={e => setData({ ...data, githubUrl: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2"><Linkedin className="h-4 w-4" /> LinkedIn URL</Label>
                            <Input
                                className="bg-background/80"
                                type="url"
                                value={data.linkedinUrl || ''}
                                onChange={e => setData({ ...data, linkedinUrl: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label className="flex items-center gap-2"><Twitter className="h-4 w-4" /> Twitter/X URL</Label>
                            <Input
                                className="bg-background/80"
                                type="url"
                                value={data.twitterUrl || ''}
                                onChange={e => setData({ ...data, twitterUrl: e.target.value })}
                            />
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="bg-muted/30 py-4 px-6 border-t border-border/30 rounded-b-xl flex justify-between">
                    <p className="text-sm text-muted-foreground">Changes reflect instantly on main site.</p>
                    <Button type="submit" disabled={isPending || uploadStatus === 'uploading'} className="gap-2">
                        <Save className="h-4 w-4" />
                        {isPending ? 'Saving...' : uploadStatus === 'uploading' ? 'Uploading…' : 'Save Changes'}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}
