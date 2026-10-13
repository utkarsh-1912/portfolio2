import { Metadata } from 'next';
import { Suspense } from 'react';
import { AdminSidebar } from '@/components/admin/sidebar';

export const metadata: Metadata = {
    title: 'Admin',
    description: 'Admin dashboard for portfolio content management',
    robots: { index: false, follow: false },
};

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen flex-col overflow-hidden bg-background text-foreground antialiased md:flex-row">
            <Suspense fallback={<aside className="hidden w-64 border-r border-border bg-card md:block" />}>
                <AdminSidebar />
            </Suspense>

            {/* Not <main>: the root layout already provides it */}
            <div className="relative flex-1 overflow-y-auto">
                <div className="mx-auto max-w-5xl px-4 py-8 animate-in fade-in duration-500 md:px-10 md:py-12">
                    {children}
                </div>
            </div>
        </div>
    );
}
