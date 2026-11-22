'use client';

import { useMemo, useState } from 'react';
import { ArrowUpRight, Search } from 'lucide-react';
import { ProjectModal, type ProjectModalData } from '@/components/ui/project-modal';
import { SectionHeading } from '@/components/ui/section-heading';
import { RevealObserver } from '@/components/ui/reveal-observer';
import { cn } from '@/lib/utils';
import { ProjectCard, type ProjectCardData } from './project-card';

const TAG_FILTER_COUNT = 8;

export function ProjectsPageClient({ projects }: { projects: ProjectCardData[] }) {
    const [selected, setSelected] = useState<ProjectModalData | null>(null);
    const [search, setSearch] = useState('');
    const [activeTag, setActiveTag] = useState<string | null>(null);

    // Most-used tags first
    const topTags = useMemo(() => {
        const counts: Record<string, number> = {};
        projects.forEach((p) => p.tags.forEach((t) => (counts[t] = (counts[t] || 0) + 1)));
        return Object.entries(counts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, TAG_FILTER_COUNT)
            .map(([tag]) => tag);
    }, [projects]);

    const q = search.trim().toLowerCase();
    const filtered = projects.filter((p) => {
        const matchSearch =
            !q ||
            p.title.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            p.tags.some((tag) => tag.toLowerCase().includes(q));
        return matchSearch && (!activeTag || p.tags.includes(activeTag));
    });

    const chip = (active: boolean) =>
        cn(
            'rounded-full border px-4 py-1.5 text-sm transition-colors',
            active ? 'border-foreground bg-foreground text-background' : 'border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground'
        );

    return (
        <div className="projects-page container py-16 md:py-24">
            <div className="standard-only"><SectionHeading
                as="h1"
                label="Projects"
                title="All work"
                intro={`${projects.length} projects, from side experiments to production apps.`}
            />

            </div>
            <div className="exchange-only desk-heading"><span>PROJECT DIRECTORY / ಕೆಲಸ</span><h1>Engineering book</h1><p>Inspect the builds, explore the stack, and open a project for the full picture.</p></div>

            {/* Filters */}
            <div className="project-controls mb-14 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-wrap gap-2">
                    <button type="button" aria-pressed={!activeTag} onClick={() => setActiveTag(null)} className={chip(!activeTag)}>
                        All
                    </button>
                    {topTags.map((tag) => (
                        <button key={tag} type="button" aria-pressed={activeTag === tag} onClick={() => setActiveTag(activeTag === tag ? null : tag)} className={chip(activeTag === tag)}>
                            {tag}
                        </button>
                    ))}
                </div>
                <label className="relative block w-full md:w-72">
                    <span className="sr-only">Search projects</span>
                    <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                        type="search"
                        placeholder="Search projects"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="h-11 w-full rounded-full border border-border bg-transparent pl-11 pr-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-foreground/50"
                    />
                </label>
            </div>

            <p className="eyebrow mb-8" aria-live="polite">
                {filtered.length} result{filtered.length !== 1 ? 's' : ''}
                {activeTag ? ` · ${activeTag}` : ''}
            </p>

            <div className="standard-only grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((project, idx) => (
                    <div key={project.id} data-reveal="up" style={{ '--i': idx % 3 } as React.CSSProperties}>
                        <ProjectCard project={project} index={projects.indexOf(project)} onOpen={() => setSelected(project)} />
                    </div>
                ))}
            </div>

            <div className="exchange-only project-register">
                <div className="exchange-panel-title"><span>PROJECT BLOTTER</span><span>{filtered.length} / {projects.length} RECORDS</span></div>
                <div className="project-register-scroll"><table>
                    <caption className="sr-only">Projects matching the current search and technology filter</caption>
                    <thead><tr><th>Ref</th><th>Project / description</th><th>Technology</th><th>Inspect</th></tr></thead>
                    <tbody>{filtered.map(project => <tr key={project.id}>
                        <td>{String(projects.indexOf(project) + 1).padStart(2, '0')}</td>
                        <td><button onClick={() => setSelected(project)}>{project.title}</button><p>{project.description}</p></td>
                        <td><div className="register-tags">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div></td>
                        <td><button aria-label={`Open details for ${project.title}`} onClick={() => setSelected(project)}>Details <ArrowUpRight className="inline-block h-3.5 w-3.5 shrink-0 align-[-0.15em]" aria-hidden="true" /></button></td>
                    </tr>)}</tbody>
                </table></div>
            </div>

            {filtered.length === 0 && (
                <div className="rounded-3xl border border-dashed border-border py-24 text-center text-muted-foreground">
                    No projects match that filter.
                </div>
            )}

            <ProjectModal project={selected} onClose={() => setSelected(null)} projects={filtered} onSelect={setSelected} />
            <RevealObserver />
        </div>
    );
}
