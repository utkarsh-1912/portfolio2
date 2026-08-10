import { Metadata } from 'next';
import { AdminSidebar } from '@/components/admin/sidebar';

export const metadata: Metadata = {
    title: 'Portfolio Admin',
    description: 'Admin dashboard for portfolio content management',
};

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-background font-sans antialiased text-foreground">
            {/* Sidebar Navigation */}
            <AdminSidebar />

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto relative bg-background font-mono">
                {/* Tech background pattern */}
                <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none"></div>
                <div className="container mx-auto p-4 md:p-8 max-w-6xl relative z-10 animate-in fade-in duration-500">
                    {children}
                </div>
            </main>
        </div>
    );
}
