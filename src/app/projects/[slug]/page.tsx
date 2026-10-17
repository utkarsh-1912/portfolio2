import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, ArrowUpRight, GitFork, Star } from 'lucide-react';
import { getProjectBySlug, getProjects } from '@/db/queries';
import { getGitHubRepoStats } from '@/lib/api-stats';
import { isAdmin } from '@/lib/auth-server';
import { hasLink, resolveImage } from '@/lib/images';
import { Markdown } from '@/components/ui/markdown';
import { RevealObserver } from '@/components/ui/reveal-observer';
import { SplitText } from '@/components/ui/split-text';
import { ProjectPlaceholder } from '@/components/sections/project-placeholder';
import { hasCaseStudy } from '@/lib/projects';

export const dynamic = 'force-dynamic';

type Props = {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ preview?: string }>;
};

/**
 * Visitors only see published projects that have a written case study (otherwise the
 * popup already shows everything). An admin preview shows drafts and empty pages too.
 */
async function load(slug: string, preview?: string) {
    const includeDrafts = preview === '1' && (await isAdmin());
    const project = await getProjectBySlug(slug, { includeDrafts });
    if (project && !includeDrafts && !hasCaseStudy(project)) return { project: null, includeDrafts };
    return { project, includeDrafts };
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
    const { slug } = await params;
    const { project } = await load(slug, (await searchParams).preview);
    if (!project) return { title: 'Project not found' };
    return {
        title: project.title,
        description: project.description.slice(0, 160),
        alternates: { canonical: `/projects/${project.slug}` },
        openGraph: { title: project.title, description: project.description.slice(0, 160), url: `/projects/${project.slug}` },
    };
}

const SECTIONS = [
    ['problem', 'The problem'],
    ['approach', 'Approach'],
    ['architecture', 'Architecture'],
    ['results', 'Results'],
] as const;

export default async function ProjectPage({ params, searchParams }: Props) {
    const { slug } = await params;
    const { project, includeDrafts } = await load(slug, (await searchParams).preview);
    if (!project) notFound();

    const [all, stats] = await Promise.all([
        getProjects(),
        hasLink(project.githubUrl) ? getGitHubRepoStats(project.githubUrl) : Promise.resolve(null),
    ]);
    // "Next project" cycles through projects that have their own page
    const withPages = all.filter(hasCaseStudy);
    const index = withPages.findIndex((p) => p.id === project.id);
    const next = withPages.length > 1 ? withPages[(index + 1) % withPages.length] : null;
    const img = resolveImage(project.imageUrl);
    const sections = SECTIONS.filter(([key]) => project[key]);

    return (
        <article className="pb-24">
            {includeDrafts && project.status !== 'active' && (
                <div className="sticky top-20 z-40 mx-auto mt-2 w-fit rounded-full bg-foreground px-4 py-1.5 text-xs text-background">
                    Preview · this project is a {project.status} and hidden from visitors
                </div>
            )}

            {/* Header */}
            <header className="container pt-12 md:pt-20">
                <Link href="/projects" className="group inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
                    <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" /> All projects
                </Link>
                <p data-reveal="up" className="eyebrow mt-10">{project.tags.join(' · ')}</p>
                <SplitText
                    as="h1"
                    text={project.title}
                    className="mt-5 block font-headline text-5xl font-semibold leading-[0.95] tracking-tight sm:text-7xl lg:text-8xl"
                />
                <div className="mt-10 grid gap-10 lg:grid-cols-12">
                    <p data-reveal="up" style={{ '--i': 2 } as React.CSSProperties} className="text-lg leading-relaxed text-muted-foreground md:text-2xl lg:col-span-8">
                        {project.description}
                    </p>
                    <dl data-reveal="up" style={{ '--i': 3 } as React.CSSProperties} className="space-y-5 lg:col-span-4 lg:border-l lg:border-border lg:pl-10">
                        {stats && (
                            <div>
                                <dt className="eyebrow">On GitHub</dt>
                                <dd className="mt-1 flex items-center gap-4 text-sm">
                                    <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5" /> {stats.stargazers_count}</span>
                                    <span className="flex items-center gap-1"><GitFork className="h-3.5 w-3.5" /> {stats.forks_count}</span>
                                    {stats.language && <span>{stats.language}</span>}
                                </dd>
                            </div>
                        )}
                        <div>
                            <dt className="eyebrow">Links</dt>
                            <dd className="mt-3 flex flex-wrap gap-2">
                                {hasLink(project.liveUrl) && (
                                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="inline-flex h-10 items-center gap-1.5 rounded-full bg-foreground px-5 text-sm font-medium text-background">
                                        Visit site <ArrowUpRight className="h-4 w-4" />
                                    </a>
                                )}
                                {hasLink(project.githubUrl) && (
                                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="inline-flex h-10 items-center gap-1.5 rounded-full border border-foreground/20 px-5 text-sm font-medium transition-colors hover:bg-foreground/5">
                                        Source <ArrowUpRight className="h-4 w-4" />
                                    </a>
                                )}
                            </dd>
                        </div>
                    </dl>
                </div>
            </header>

            {/* Visual */}
            <div className="container mt-16">
                <div data-reveal="unclip" className="relative aspect-[16/9] overflow-hidden rounded-3xl border border-border bg-muted">
                    {img ? (
                        <Image src={img} alt={`${project.title} screenshot`} fill priority sizes="(min-width: 1400px) 1400px, 100vw" className="object-cover scroll-zoom" unoptimized={img.startsWith('http')} />
                    ) : (
                        <ProjectPlaceholder title={project.title} tags={project.tags} className="p-10 md:p-16 [&>p:last-child]:text-6xl md:[&>p:last-child]:text-8xl" />
                    )}
                </div>
            </div>

            {/* Case study */}
            <div className="container mt-24">
                {includeDrafts && sections.length === 0 && (
                    <p className="mb-10 rounded-2xl border border-dashed border-border p-6 text-sm text-muted-foreground">
                        Preview only: visitors won&apos;t see this page until you add at least one case-study section in the admin.
                    </p>
                )}
                {sections.length > 0 ? (
                    <div className="space-y-20">
                        {sections.map(([key, label], i) => (
                            <section key={key} className="grid gap-6 border-t border-border pt-10 lg:grid-cols-12">
                                <div className="lg:col-span-4">
                                    <p className="eyebrow"><span className="text-primary">({String(i + 1).padStart(2, '0')})</span> {label}</p>
                                </div>
                                <div data-reveal="up" className="lg:col-span-8">
                                    <Markdown>{project[key] as string}</Markdown>
                                </div>
                            </section>
                        ))}
                    </div>
                ) : (
                    <section className="grid gap-6 border-t border-border pt-10 lg:grid-cols-12">
                        <p className="eyebrow lg:col-span-4">Built with</p>
                        <ul className="flex flex-wrap gap-2 lg:col-span-8">
                            {project.tags.map((t) => (
                                <li key={t} className="rounded-full border border-border px-4 py-1.5 text-sm text-foreground/80">{t}</li>
                            ))}
                        </ul>
                    </section>
                )}
            </div>

            {/* Next project */}
            {next && next.id !== project.id && next.slug && (
                <div className="container mt-32">
                    <Link href={`/projects/${next.slug}`} className="group block border-t border-border pt-10">
                        <p className="eyebrow">Next project</p>
                        <p className="mt-4 flex items-center justify-between gap-6 font-headline text-4xl font-semibold tracking-tight transition-colors group-hover:text-primary md:text-7xl">
                            {next.title}
                            <ArrowRight className="h-10 w-10 shrink-0 transition-transform duration-500 group-hover:translate-x-2 md:h-16 md:w-16" />
                        </p>
                    </Link>
                </div>
            )}

            <RevealObserver />
        </article>
    );
}
