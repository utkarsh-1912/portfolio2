'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
    LayoutDashboard,
    Text,
    UserCircle,
    Code,
    Code2,
    GraduationCap,
    FileText,
    LogOut,
    Menu,
    ArrowLeft,
    Mail
} from 'lucide-react';
import { Button } from '../ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet';
import { useState, useEffect } from 'react';

const navItems = [
    { href: '/admin', id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin?tab=hero', id: 'hero', label: 'Hero Section', icon: Text },
    { href: '/admin?tab=about', id: 'about', label: 'About', icon: UserCircle },
    { href: '/admin?tab=projects', id: 'projects', label: 'Projects', icon: Code },
    { href: '/admin?tab=education', id: 'education', label: 'Education', icon: GraduationCap },
    { href: '/admin?tab=blogs', id: 'blogs', label: 'Blogs', icon: FileText },
    { href: '/admin?tab=contacts', id: 'contacts', label: 'Contacts', icon: Mail },
];

function SidebarContent({ currentTab, onNavigate }: { currentTab: string; onNavigate?: () => void }) {
    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        window.location.href = '/login';
    };

    return (
        <div className="flex h-full flex-col bg-card">
            <div className="flex-1 overflow-auto py-6">
                <nav className="grid gap-2 px-4">
                    <div className="mb-4 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Portfolio Management
                    </div>
                    {navItems.map((item) => {
                        const isActive = currentTab === item.id;
                        return (
                            <Link
                                key={item.id}
                                href={item.href}
                                onClick={onNavigate}
                                className={cn(
                                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:text-primary',
                                    isActive
                                        ? 'bg-primary/10 text-primary'
                                        : 'text-muted-foreground hover:bg-muted'
                                )}
                            >
                                <item.icon className={cn("h-4 w-4", isActive ? "text-primary" : "text-muted-foreground")} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="border-t p-4 mt-auto space-y-2">
                <Button
                    variant="outline"
                    asChild
                    className="w-full justify-start text-muted-foreground hover:text-foreground border-dashed"
                >
                    <Link href="/">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Website
                    </Link>
                </Button>
                <Button
                    variant="outline"
                    className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10 hover:border-destructive/30 border-dashed"
                    onClick={handleLogout}
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    Secure Logout
                </Button>
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
            {/* Mobile Topbar & Sheet */}
            <div className="md:hidden flex items-center justify-between bg-card border-b border-border p-4 w-full shadow-sm z-20">
                <Link href="/" className="flex items-center space-x-2">
                    <Code2 className="h-6 w-6 text-primary" />
                    <span className="font-bold font-headline text-lg">Utkristi</span>
                </Link>
                <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="shrink-0">
                            <Menu className="h-6 w-6" />
                            <span className="sr-only">Toggle Admin Menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-64 p-0">
                        <SheetHeader className="sr-only">
                            <SheetTitle>Admin Navigation</SheetTitle>
                        </SheetHeader>
                        <SidebarContent currentTab={currentTab} onNavigate={() => setIsMobileOpen(false)} />
                    </SheetContent>
                </Sheet>
            </div>

            {/* Desktop Permanent Sidebar */}
            <div className="hidden md:flex h-full w-64 flex-col border-r border-border shadow-sm z-10">
                <SidebarContent currentTab={currentTab} />
            </div>
        </>
    );
}
