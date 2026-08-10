'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Lock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

function LoginForm() {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '/admin';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            });

            const data = await res.json();

            if (res.ok && data.success) {
                // Force a hard navigation to apply the middleware cookie properly
                window.location.href = callbackUrl;
            } else {
                setError(data.message || 'Invalid password');
            }
        } catch (err) {
            setError('An error occurred during login.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
                <Label htmlFor="password" className="text-primary font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                    <span className="text-primary/50">&gt;</span> Enter password
                </Label>
                <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-background/80 rounded-none tech-border focus-visible:ring-primary/50 font-mono"
                />
            </div>
            {error && <p className="text-sm text-destructive text-center font-bold bg-destructive/10 p-2 border border-destructive/30">ERR: {error}</p>}
            <Button type="submit" className="w-full rounded-none tech-border font-bold tracking-widest uppercase transition-all" disabled={isLoading}>
                {isLoading ? './verifying...' : './login'}
            </Button>
            <Button className="w-full mt-4 rounded-none border border-primary bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground font-mono uppercase tracking-[0.2em] transition-all duration-300" size="lg">
                 <Link href="/" className="flex items-center justify-center gap-2 w-full">
                    <span>./back_to_website</span>
                </Link>
            </Button>
        </form>
    );
}

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background relative p-4 font-mono">
            {/* Background pattern */}
            <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none"></div>

            <Card className="w-full max-w-md shadow-2xl rounded-none tech-border bg-card/80 backdrop-blur-xl relative z-10 animate-in zoom-in-95 duration-500">
                <CardHeader className="space-y-1 pb-6 text-center relative border-b border-primary/20 bg-muted/30">
                    <div className="w-12 h-12 bg-primary/10 rounded-none border border-primary/30 flex items-center justify-center mx-auto mb-4 mt-2">
                        <Lock className="w-5 h-5 text-primary" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-primary">&gt; sudo su</CardTitle>
                    <CardDescription className="text-muted-foreground font-sans">Authorize access to the admin system</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                    <Suspense fallback={<div className="text-center py-4 text-primary animate-pulse">Loading login module...</div>}>
                        <LoginForm />
                    </Suspense>
                </CardContent>
                <CardFooter className="flex justify-center border-t border-primary/20 py-4 text-xs font-bold tracking-widest uppercase text-primary/50 bg-muted/10">
                    System Secured
                </CardFooter>
            </Card>
        </div>
    );
}
