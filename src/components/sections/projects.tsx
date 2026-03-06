import { getProjects } from '@/db/queries';
import { ProjectsSectionClient } from './projects-client';

export async function ProjectsSection() {
  const projects = await getProjects();
  return <ProjectsSectionClient projects={projects} />;
}
