import { getHero, getAbout, getProjects, getEducation, getBlogs, getContacts } from '../../db/queries';
import { AdminHeroForm } from '../../components/admin/hero-form';
import { AdminAboutForm } from '../../components/admin/about-form';
import { AdminProjectsForm } from '../../components/admin/projects-form';
import { AdminEducationForm } from '../../components/admin/education-form';
import { AdminBlogsForm } from '../../components/admin/blogs-form';
import { AdminContactsView } from '../../components/admin/contacts-list';
import { Code, FileText, GraduationCap, Mail, Plus } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const dynamic = 'force-dynamic';

export default async function AdminPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const rawParams = await searchParams;
    const tab = (rawParams?.tab as string) || 'dashboard';

    const [hero, about, projects, education, blogs, contacts] = await Promise.all([
        getHero(),
        getAbout(),
        getProjects(),
        getEducation(),
        getBlogs(),
        getContacts(),
    ]);

    const unreadContacts = contacts.filter(c => c.status === 'unread').length;

    return (
        <div className="animate-in fade-in duration-500">
            {tab === 'dashboard' && (
                <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-700">
                    <div className="flex flex-col gap-2">
                        <h2 className="text-3xl font-bold font-headline text-primary tracking-tight">Dashboard Overview</h2>
                        <p className="text-muted-foreground text-lg">Welcome back. Manage your portfolio content and settings from here.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8 font-mono">
                        <div className="p-6 rounded-none bg-card/80 tech-border hover:shadow-xl hover:border-primary/50 transition-all flex flex-col gap-4 relative overflow-hidden group">
                            <div className="p-3 bg-primary/10 w-fit rounded-none border border-primary/30">
                                <Code className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-bold text-foreground text-3xl font-headline tracking-tighter">{projects.length}</h3>
                                <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground mt-1 text-primary/70">Projects</p>
                            </div>
                        </div>
                        <div className="p-6 rounded-none bg-card/80 tech-border hover:shadow-xl hover:border-primary/50 transition-all flex flex-col gap-4 relative overflow-hidden group">
                            <div className="p-3 bg-primary/10 w-fit rounded-none border border-primary/30">
                                <FileText className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-bold text-foreground text-3xl font-headline tracking-tighter">{blogs.length}</h3>
                                <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground mt-1 text-primary/70">Articles</p>
                            </div>
                        </div>
                        <div className="p-6 rounded-none bg-card/80 tech-border hover:shadow-xl hover:border-primary/50 transition-all flex flex-col gap-4 relative overflow-hidden group">
                            <div className="p-3 bg-primary/10 w-fit rounded-none border border-primary/30">
                                <GraduationCap className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-bold text-foreground text-3xl font-headline tracking-tighter">{education.length}</h3>
                                <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground mt-1 text-primary/70">Timeline</p>
                            </div>
                        </div>
                        <div className="p-6 rounded-none bg-card/80 tech-border hover:shadow-xl hover:border-primary/50 transition-all flex flex-col gap-4 relative overflow-hidden group">
                            <div className="p-3 bg-primary/10 w-fit rounded-none border border-primary/30">
                                <Mail className={`h-6 w-6 text-primary ${unreadContacts > 0 ? 'animate-pulse' : ''}`} />
                            </div>
                            <div>
                                <h3 className="font-bold text-foreground text-3xl font-headline tracking-tighter">{unreadContacts}</h3>
                                <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground mt-1 text-primary/70">Unread</p>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="mt-8 flex flex-wrap gap-4 font-mono">
                        <Button asChild className="rounded-none tech-border font-bold uppercase tracking-widest gap-2 bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary transition-colors">
                            <Link href="/admin?tab=projects">
                                <Plus className="w-4 h-4" /> Add Project
                            </Link>
                        </Button>
                        <Button asChild className="rounded-none tech-border font-bold uppercase tracking-widest gap-2 bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary transition-colors">
                            <Link href="/admin?tab=blogs">
                                <Plus className="w-4 h-4" /> Add Blog
                            </Link>
                        </Button>
                    </div>

                    {/* Recent Content */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 font-mono">
                        <div className="bg-card/80 tech-border rounded-none p-6 relative">
                            <h3 className="text-lg font-bold text-primary mb-4 flex items-center justify-between uppercase tracking-widest border-b border-primary/20 pb-2">
                                <span>&gt; ./recent_projects</span>
                            </h3>
                            <div className="space-y-2">
                                {projects.slice(0, 4).map((p: any) => (
                                    <div key={p.id} className="flex items-center justify-between p-2 border border-transparent hover:border-primary/20 hover:bg-primary/5 transition-colors">
                                        <span className="truncate font-bold text-sm text-foreground">{p.title}</span>
                                        <Link href="/admin?tab=projects" className="text-xs uppercase font-bold tracking-widest text-muted-foreground hover:text-primary transition-colors">
                                            [ Edit ]
                                        </Link>
                                    </div>
                                ))}
                                {projects.length === 0 && <p className="text-muted-foreground text-sm py-2 px-2">No projects found.</p>}
                            </div>
                        </div>

                        <div className="bg-card/80 tech-border rounded-none p-6 relative">
                            <h3 className="text-lg font-bold text-primary mb-4 flex items-center justify-between uppercase tracking-widest border-b border-primary/20 pb-2">
                                <span>&gt; ./recent_blogs</span>
                            </h3>
                            <div className="space-y-2">
                                {blogs.slice(0, 4).map((b: any) => (
                                    <div key={b.id} className="flex items-center justify-between p-2 border border-transparent hover:border-primary/20 hover:bg-primary/5 transition-colors">
                                        <span className="truncate font-bold text-sm text-foreground">{b.title}</span>
                                        <Link href="/admin?tab=blogs" className="text-xs uppercase font-bold tracking-widest text-muted-foreground hover:text-primary transition-colors">
                                            [ Edit ]
                                        </Link>
                                    </div>
                                ))}
                                {blogs.length === 0 && <p className="text-muted-foreground text-sm py-2 px-2">No blogs found.</p>}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {tab === 'hero' && <AdminHeroForm initialData={hero} />}
            {tab === 'about' && <AdminAboutForm initialData={about} />}
            {tab === 'projects' && <AdminProjectsForm initialData={projects} />}
            {tab === 'education' && <AdminEducationForm initialData={education} />}
            {tab === 'blogs' && <AdminBlogsForm initialData={blogs} />}
            {tab === 'contacts' && <AdminContactsView initialData={contacts} />}
        </div>
    );
}
