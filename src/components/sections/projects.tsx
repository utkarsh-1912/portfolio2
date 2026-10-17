import { getProjects } from '@/db/queries';
import { ProjectsSectionClient } from './projects-client';
import { getGitHubRepoStats } from '@/lib/api-stats';
import { toProjectSummary } from '@/lib/projects';

export async function ProjectsSection() {
  // The home page shows six, so only fetch GitHub stats for those
  const projects = (await getProjects()).slice(0, 6);
  
  const projectsWithStats = await Promise.all(
    projects.map(async (project) => {
      let stats = null;
      if (project.githubUrl && project.githubUrl !== '#') {
        stats = await getGitHubRepoStats(project.githubUrl);
      }
      return { ...toProjectSummary(project), githubStats: stats };
    })
  );

  return <ProjectsSectionClient projects={projectsWithStats} />;
}
