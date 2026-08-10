import { getProjects } from '@/db/queries';
import { ProjectsPageClient } from '@/components/sections/projects-page-client';
import { getGitHubRepoStats } from '@/lib/api-stats';

export const dynamic = 'force-dynamic';

export default async function ProjectsPage() {
  const projects = await getProjects();
  
  const projectsWithStats = await Promise.all(
    projects.map(async (project) => {
      let stats = null;
      if (project.githubUrl && project.githubUrl !== '#') {
        stats = await getGitHubRepoStats(project.githubUrl);
      }
      return { ...project, githubStats: stats };
    })
  );

  return <ProjectsPageClient projects={projectsWithStats} />;
}
