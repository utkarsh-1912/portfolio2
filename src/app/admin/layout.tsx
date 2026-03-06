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
            <main className="flex-1 overflow-y-auto relative bg-gradient-to-br from-background to-muted/20">
                <div className="container mx-auto p-2 md:p-8 max-w-6xl">
                    <div className="bg-card shadow-xl rounded-xl border border-border/50 p-2 md:p-8 backdrop-blur-xl">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}
