import { getProjects } from '@/db/queries';
import { ProjectsSectionClient } from './projects-client';
import { getGitHubRepoStats } from '@/lib/api-stats';
import { toProjectSummary } from '@/lib/projects';

export async function ProjectsSection() {
  // The home page shows a curated set: the featured projects (in their admin order) once at least
  // three are marked, otherwise the first six. Only those get GitHub stats.
  const all = await getProjects();
  const featured = all.filter((p) => p.featured);
  const projects = (featured.length >= 3 ? featured : all).slice(0, 6);
  
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
