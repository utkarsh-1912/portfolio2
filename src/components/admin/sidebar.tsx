'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
    LayoutDashboard,
    Text,
    UserCircle,
    Code,
    GraduationCap,
    FileText,
    LogOut,
    Menu,
    ArrowUpRight,
    Mail,
    Award,
    MessageSquareQuote,
    Files,
} from 'lucide-react';
import { Button } from '../ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet';
import { LogoMark } from '../ui/logo-mark';
import { ThemeToggle } from '../theme-toggle';
import { useState, useEffect } from 'react';

const navGroups = [
    {
        label: 'Overview',
        items: [{ href: '/admin', id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }],
    },
    {
        label: 'Content',
        items: [
            { href: '/admin?tab=hero', id: 'hero', label: 'Hero', icon: Text },
            { href: '/admin?tab=about', id: 'about', label: 'About & Skills', icon: UserCircle },
            { href: '/admin?tab=education', id: 'education', label: 'Experience', icon: GraduationCap },
            { href: '/admin?tab=certifications', id: 'certifications', label: 'Certifications', icon: Award },
            { href: '/admin?tab=projects', id: 'projects', label: 'Projects', icon: Code },
            { href: '/admin?tab=blogs', id: 'blogs', label: 'Writing', icon: FileText },
            { href: '/admin?tab=testimonials', id: 'testimonials', label: 'Testimonials', icon: MessageSquareQuote },
            { href: '/admin?tab=pages', id: 'pages', label: 'Now & Uses', icon: Files },
        ],
    },
    {
        label: 'Inbox',
        items: [{ href: '/admin?tab=contacts', id: 'contacts', label: 'Messages', icon: Mail }],
    },
];

function SidebarContent({ currentTab, onNavigate }: { currentTab: string; onNavigate?: () => void }) {
    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        window.location.href = '/login';
    };

    return (
        <div className="flex h-full flex-col">
            <div className="flex h-16 items-center justify-between px-5">
                <Link href="/admin" onClick={onNavigate} className="flex items-center gap-2">
                    <LogoMark />
                    <span className="font-headline text-lg font-semibold tracking-tight">Utkristi</span>
                    <span className="rounded-full bg-muted px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Admin</span>
                </Link>
            </div>

            <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Admin">
                {navGroups.map((group) => (
                    <div key={group.label} className="mb-6">
                        <p className="eyebrow px-3 pb-2">{group.label}</p>
                        <ul className="space-y-0.5">
                            {group.items.map((item) => {
                                const isActive = currentTab === item.id;
                                return (
                                    <li key={item.id}>
                                        <Link
                                            href={item.href}
                                            onClick={onNavigate}
                                            aria-current={isActive ? 'page' : undefined}
                                            className={cn(
                                                'flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors',
                                                isActive
                                                    ? 'bg-foreground text-background'
                                                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                            )}
                                        >
                                            <item.icon className="h-4 w-4" />
                                            {item.label}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                ))}
            </nav>

            <div className="space-y-1 border-t border-border p-3">
                <Link
                    href="/"
                    target="_blank"
                    className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                    <ArrowUpRight className="h-4 w-4" />
                    View site
                </Link>
                <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                >
                    <LogOut className="h-4 w-4" />
                    Log out
                </button>
                <div className="flex items-center justify-between px-3 pt-2">
                    <span className="text-xs text-muted-foreground">Theme</span>
                    <ThemeToggle />
                </div>
            </div>
        </div>
    );
}

export function AdminSidebar() {
    const searchParams = useSearchParams();
    const currentTab = searchParams.get('tab') || 'dashboard';
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    // Close mobile sheet on tab change
    useEffect(() => {
        setIsMobileOpen(false);
    }, [currentTab]);

    return (
        <>
            {/* Mobile top bar */}
            <div className="z-20 flex w-full items-center justify-between border-b border-border bg-background/80 px-4 py-3 backdrop-blur md:hidden">
                <Link href="/admin" className="flex items-center gap-2">
                    <LogoMark />
                    <span className="font-headline text-lg font-semibold tracking-tight">Admin</span>
                </Link>
                <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <Menu className="h-5 w-5" />
                            <span className="sr-only">Open admin menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-72 p-0">
                        <SheetHeader className="sr-only">
                            <SheetTitle>Admin navigation</SheetTitle>
                        </SheetHeader>
                        <SidebarContent currentTab={currentTab} onNavigate={() => setIsMobileOpen(false)} />
                    </SheetContent>
                </Sheet>
            </div>

            {/* Desktop sidebar */}
            <aside className="z-10 hidden h-full w-64 shrink-0 flex-col border-r border-border bg-card md:flex">
                <SidebarContent currentTab={currentTab} />
            </aside>
        </>
    );
}
