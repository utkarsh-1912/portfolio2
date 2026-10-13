import { getHero, getAbout, getProjects, getEducation, getBlogs, getContacts, getSkills, getCertifications } from '../../db/queries';
import { AdminHeroForm } from '../../components/admin/hero-form';
import { AdminAboutForm } from '../../components/admin/about-form';
import { AdminProjectsForm } from '../../components/admin/projects-form';
import { AdminEducationForm } from '../../components/admin/education-form';
import { AdminBlogsForm } from '../../components/admin/blogs-form';
import { AdminContactsView } from '../../components/admin/contacts-list';
import { AdminCertificationsForm } from '../../components/admin/certifications-form';
import { AdminPageHeader } from '../../components/admin/admin-ui';
import { ArrowRight, ArrowUpRight, Award, Code, FileText, GraduationCap, Mail, Plus } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

const published = (rows: { status?: string | null }[]) => rows.filter((r) => (r.status ?? 'active') === 'active').length;

export default async function AdminPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const rawParams = await searchParams;
    const tab = (rawParams?.tab as string) || 'dashboard';

    const [hero, about, projects, education, skillsData, blogs, contacts, certifications] = await Promise.all([
        getHero(),
        getAbout(),
        getProjects({ includeDrafts: true }),
        getEducation(),
        getSkills(),
        getBlogs({ includeDrafts: true }),
        getContacts(),
        getCertifications({ includeDrafts: true }),
    ]);

    const unread = contacts.filter((c) => c.status === 'unread');

    const stats = [
        { label: 'Projects', value: projects.length, sub: `${published(projects)} published`, icon: Code, href: '/admin?tab=projects' },
        { label: 'Articles', value: blogs.length, sub: `${published(blogs)} published`, icon: FileText, href: '/admin?tab=blogs' },
        { label: 'Certifications', value: certifications.length, sub: `${published(certifications)} published`, icon: Award, href: '/admin?tab=certifications' },
        { label: 'Timeline', value: education.length, sub: 'roles & studies', icon: GraduationCap, href: '/admin?tab=education' },
    ];

    return (
        <div>
            {tab === 'dashboard' && (
                <div className="space-y-12">
                    <AdminPageHeader
                        eyebrow="Overview"
                        title={`Welcome back${hero?.title ? `, ${hero.title.split(' ')[0]}` : ''}`}
                        description="Manage what appears on your portfolio. Changes go live as soon as you save."
                        action={
                            <Link href="/" target="_blank" className="inline-flex h-10 items-center gap-1.5 rounded-full border border-border px-4 text-sm transition-colors hover:bg-muted">
                                View site <ArrowUpRight className="h-4 w-4" />
                            </Link>
                        }
                    />

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-border bg-border lg:grid-cols-4">
                        {stats.map((s) => (
                            <Link key={s.label} href={s.href} className="group bg-card p-6 transition-colors hover:bg-muted/50">
                                <span className="eyebrow flex items-center justify-between">
                                    {s.label}
                                    <s.icon className="h-4 w-4" />
                                </span>
                                <span className="mt-6 block font-headline text-5xl font-semibold tabular-nums tracking-tight">{s.value}</span>
                                <span className="mt-1 block text-sm text-muted-foreground">{s.sub}</span>
                            </Link>
                        ))}
                    </div>

                    {/* Quick actions */}
                    <div className="flex flex-wrap gap-2">
                        {[
                            ['New project', '/admin?tab=projects'],
                            ['New article', '/admin?tab=blogs'],
                            ['New certification', '/admin?tab=certifications'],
                            ['New timeline entry', '/admin?tab=education'],
                        ].map(([label, href]) => (
                            <Link key={label} href={href} className="inline-flex h-10 items-center gap-1.5 rounded-full bg-muted px-4 text-sm transition-colors hover:bg-foreground hover:text-background">
                                <Plus className="h-4 w-4" /> {label}
                            </Link>
                        ))}
                    </div>

                    <div className="grid gap-6 lg:grid-cols-2">
                        {/* Messages */}
                        <section className="rounded-3xl border border-border bg-card p-6">
                            <div className="flex items-center justify-between">
                                <h2 className="font-headline text-xl font-semibold tracking-tight">
                                    Messages
                                    {unread.length > 0 && <span className="ml-2 rounded-full bg-primary px-2 py-0.5 align-middle text-xs text-primary-foreground">{unread.length} new</span>}
                                </h2>
                                <Link href="/admin?tab=contacts" className="text-sm text-muted-foreground hover:text-foreground">Open inbox</Link>
                            </div>
                            <ul className="mt-4 divide-y divide-border">
                                {contacts.slice(0, 4).map((c) => (
                                    <li key={c.id} className="flex items-start gap-3 py-3">
                                        <span className={`mt-2 h-2 w-2 shrink-0 rounded-full ${c.status === 'unread' ? 'bg-primary' : 'bg-transparent'}`} />
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-medium">{c.name}</p>
                                            <p className="truncate text-sm text-muted-foreground">{c.message}</p>
                                        </div>
                                    </li>
                                ))}
                                {contacts.length === 0 && (
                                    <li className="flex items-center gap-2 py-6 text-sm text-muted-foreground"><Mail className="h-4 w-4" /> No messages yet.</li>
                                )}
                            </ul>
                        </section>

                        {/* Recent content */}
                        <section className="rounded-3xl border border-border bg-card p-6">
                            <h2 className="font-headline text-xl font-semibold tracking-tight">Recent content</h2>
                            <ul className="mt-4 divide-y divide-border">
                                {[
                                    ...projects.slice(0, 3).map((p) => ({ key: `p${p.id}`, title: p.title, kind: 'Project', status: p.status, href: '/admin?tab=projects' })),
                                    ...blogs.slice(0, 2).map((b) => ({ key: `b${b.id}`, title: b.title, kind: 'Article', status: b.status, href: '/admin?tab=blogs' })),
                                ].map((row) => (
                                    <li key={row.key}>
                                        <Link href={row.href} className="group flex items-center gap-3 py-3">
                                            <span className="eyebrow w-16 shrink-0">{row.kind}</span>
                                            <span className="min-w-0 flex-1 truncate text-sm">{row.title}</span>
                                            {row.status && row.status !== 'active' && (
                                                <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] uppercase tracking-widest text-muted-foreground">{row.status}</span>
                                            )}
                                            <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    </div>
                </div>
            )}

            {tab === 'hero' && <AdminHeroForm initialData={hero} />}
            {tab === 'about' && <AdminAboutForm initialData={about} skillsData={skillsData} />}
            {tab === 'projects' && <AdminProjectsForm initialData={projects} />}
            {tab === 'education' && <AdminEducationForm initialData={education} />}
            {tab === 'certifications' && <AdminCertificationsForm initialData={certifications} />}
            {tab === 'blogs' && <AdminBlogsForm initialData={blogs} />}
            {tab === 'contacts' && <AdminContactsView initialData={contacts} />}
        </div>
    );
}
