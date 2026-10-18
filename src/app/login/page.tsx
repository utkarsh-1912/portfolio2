'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Lock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

function LoginForm() {
    const [password, setPassword] = useState('');
    // Shown when the server asks for a two-factor code (ADMIN_TOTP_SECRET is set)
    const [code, setCode] = useState('');
    const [needsCode, setNeedsCode] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const searchParams = useSearchParams();
    // Only allow same-site paths; rejects absolute URLs, protocol-relative "//host" and "javascript:"
    const requested = searchParams.get('callbackUrl') || '';
    const callbackUrl = requested.startsWith('/') && !requested.startsWith('//') && !requested.startsWith('/\\') ? requested : '/admin';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password, ...(needsCode ? { code } : {}) }),
            });

            const data = await res.json();

            if (res.ok && data.success) {
                // Force a hard navigation to apply the middleware cookie properly
                window.location.href = callbackUrl;
            } else if (data.needsCode) {
                // Password was right; ask for the authenticator code (no error on the first prompt)
                if (needsCode) setError(data.message);
                setNeedsCode(true);
                setCode('');
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
                <Label htmlFor="password" className="text-sm text-muted-foreground">
                    Password
                </Label>
                <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    className="h-12 rounded-xl bg-background"
                />
            </div>
            {needsCode && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-1 duration-300">
                    <Label htmlFor="code" className="text-sm text-muted-foreground">
                        Authenticator code
                    </Label>
                    <Input
                        id="code"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        pattern="[0-9 ]{6,7}"
                        maxLength={7}
                        placeholder="123 456"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        autoFocus
                        required
                        className="h-12 rounded-xl bg-background font-mono tracking-[0.3em]"
                    />
                </div>
            )}
            {error && <p role="alert" className="rounded-xl bg-destructive/10 p-3 text-center text-sm text-destructive">{error}</p>}
            <Button type="submit" className="h-12 w-full rounded-full bg-foreground text-background hover:bg-foreground/90" disabled={isLoading}>
                {isLoading ? 'Signing in…' : 'Sign in'}
            </Button>
            <Link href="/" className="flex items-center justify-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
                <ArrowLeft className="h-4 w-4" /> Back to site
            </Link>
        </form>
    );
}

export default function LoginPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
            <Card className="w-full max-w-sm rounded-3xl border-border bg-card shadow-xl animate-in fade-in zoom-in-95 duration-500">
                <CardHeader className="space-y-2 pb-6 pt-8">
                    <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-full bg-muted">
                        <Lock className="h-4 w-4" />
                    </div>
                    <CardTitle className="font-headline text-3xl font-semibold tracking-tight">Admin sign in</CardTitle>
                    <CardDescription>Manage the content of your portfolio.</CardDescription>
                </CardHeader>
                <CardContent className="pb-8">
                    <Suspense fallback={<div className="py-4 text-center text-sm text-muted-foreground">Loading…</div>}>
                        <LoginForm />
                    </Suspense>
                </CardContent>
            </Card>
        </div>
    );
}
