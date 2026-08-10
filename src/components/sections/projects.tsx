import { getProjects } from '@/db/queries';
import { ProjectsSectionClient } from './projects-client';
import { getGitHubRepoStats } from '@/lib/api-stats';

export async function ProjectsSection() {
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

  return <ProjectsSectionClient projects={projectsWithStats} />;
}
