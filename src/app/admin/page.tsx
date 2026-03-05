import { getHero, getAbout, getProjects, getEducation, getBlogs, getContacts } from '../../db/queries';
import { AdminHeroForm } from '../../components/admin/hero-form';
import { AdminAboutForm } from '../../components/admin/about-form';
import { AdminProjectsForm } from '../../components/admin/projects-form';
import { AdminEducationForm } from '../../components/admin/education-form';
import { AdminBlogsForm } from '../../components/admin/blogs-form';
import { AdminContactsView } from '../../components/admin/contacts-list';
import { Code, FileText, GraduationCap, Mail } from 'lucide-react';

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

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                        <div className="p-6 rounded-xl bg-card border border-border/50 shadow-lg hover:shadow-xl hover:border-primary/30 transition-all flex flex-col gap-4 relative overflow-hidden group">
                            <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />
                            <div className="p-3 bg-primary/10 w-fit rounded-lg shadow-inner">
                                <Code className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-bold text-foreground text-3xl font-headline tracking-tighter">{projects.length}</h3>
                                <p className="text-sm font-medium text-muted-foreground mt-1">Total Projects</p>
                            </div>
                        </div>
                        <div className="p-6 rounded-xl bg-card border border-border/50 shadow-lg hover:shadow-xl hover:border-primary/30 transition-all flex flex-col gap-4 relative overflow-hidden group">
                            <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />
                            <div className="p-3 bg-primary/10 w-fit rounded-lg shadow-inner">
                                <FileText className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-bold text-foreground text-3xl font-headline tracking-tighter">{blogs.length}</h3>
                                <p className="text-sm font-medium text-muted-foreground mt-1">Published Articles</p>
                            </div>
                        </div>
                        <div className="p-6 rounded-xl bg-card border border-border/50 shadow-lg hover:shadow-xl hover:border-primary/30 transition-all flex flex-col gap-4 relative overflow-hidden group">
                            <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />
                            <div className="p-3 bg-primary/10 w-fit rounded-lg shadow-inner">
                                <GraduationCap className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-bold text-foreground text-3xl font-headline tracking-tighter">{education.length}</h3>
                                <p className="text-sm font-medium text-muted-foreground mt-1">Timeline Entries</p>
                            </div>
                        </div>
                        <div className="p-6 rounded-xl bg-card border border-border/50 shadow-lg hover:shadow-xl hover:border-primary/30 transition-all flex flex-col gap-4 relative overflow-hidden group">
                            <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />
                            <div className="p-3 bg-primary/10 w-fit rounded-lg shadow-inner">
                                <Mail className={`h-6 w-6 text-primary ${unreadContacts > 0 ? 'animate-pulse' : ''}`} />
                            </div>
                            <div>
                                <h3 className="font-bold text-foreground text-3xl font-headline tracking-tighter">{unreadContacts}</h3>
                                <p className="text-sm font-medium text-muted-foreground mt-1">Unread Messages</p>
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
