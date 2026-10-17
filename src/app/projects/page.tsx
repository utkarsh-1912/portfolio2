import type { Metadata } from 'next';
import { getProjects } from '@/db/queries';
import { ProjectsPageClient } from '@/components/sections/projects-page-client';
import { getGitHubRepoStats } from '@/lib/api-stats';
import { toProjectSummary } from '@/lib/projects';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Projects by Utkarsh Gupta: developer tools, AI agents, trading utilities and full-stack apps.',
  alternates: { canonical: '/projects' },
};

export default async function ProjectsPage() {
  const projects = await getProjects();
  
  const projectsWithStats = await Promise.all(
    projects.map(async (project) => {
      let stats = null;
      if (project.githubUrl && project.githubUrl !== '#') {
        stats = await getGitHubRepoStats(project.githubUrl);
      }
      return { ...toProjectSummary(project), githubStats: stats };
    })
  );

  return <ProjectsPageClient projects={projectsWithStats} />;
}
