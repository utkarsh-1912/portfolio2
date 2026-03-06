import { getProjects } from '@/db/queries';
import { ProjectsPageClient } from '@/components/sections/projects-page-client';

export const dynamic = 'force-dynamic';

export default async function ProjectsPage() {
  const projects = await getProjects();
  return <ProjectsPageClient projects={projects} />;
}
