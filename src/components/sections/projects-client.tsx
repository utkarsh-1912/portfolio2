'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ProjectModal, type ProjectModalData } from '@/components/ui/project-modal';
import { SectionHeading } from '@/components/ui/section-heading';
import { RollText } from '@/components/ui/roll-text';
import { resolveImage } from '@/lib/images';
import { ProjectShowcase } from './project-showcase';
import { ProjectCard, type ProjectCardData } from './project-card';

export function ProjectsSectionClient({ projects }: { projects: ProjectCardData[] }) {
    const [selected, setSelected] = useState<ProjectModalData | null>(null);
    const latestProjects = projects.slice(0, 6);

    return (
        <section id="projects" className="relative w-full border-t border-border py-24 md:py-36">
            <div className="container">
                <SectionHeading
                    index="04"
                    label="Selected work"
                    title="Things I've built"
                    intro="A few recent projects. Open any of them for the details."
                />

                {/* Desktop: pinned scroll showcase */}
                <ProjectShowcase
                    projects={latestProjects.map((p) => ({ ...p, imageUrl: resolveImage(p.imageUrl) }))}
                    onOpen={(p) => setSelected(latestProjects.find((x) => x.id === p.id) ?? null)}
                />

                {/* Mobile/tablet: card grid */}
                <div className="grid grid-cols-1 gap-x-6 gap-y-14 md:grid-cols-2 lg:hidden">
                    {latestProjects.map((project, idx) => (
                        <div key={project.id} data-reveal="up" style={{ '--i': idx % 2 } as React.CSSProperties}>
                            <ProjectCard project={project} index={idx} onOpen={() => setSelected(project)} />
                        </div>
                    ))}
                </div>

                <div data-reveal="up" className="mt-20 flex justify-center">
                    <Link
                        href="/projects"
                        data-magnetic
                        className="group inline-flex items-center gap-3 rounded-full border border-foreground/20 px-7 py-3.5 text-base font-medium transition-colors hover:bg-foreground hover:text-background"
                    >
                        <RollText>See all projects</RollText>
                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                </div>
            </div>

            <ProjectModal project={selected} onClose={() => setSelected(null)} projects={latestProjects} onSelect={setSelected} />
        </section>
    );
}
