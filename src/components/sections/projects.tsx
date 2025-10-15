import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { projects } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ArrowRight, ExternalLink, Github } from 'lucide-react';

export function ProjectsSection() {
  const latestProjects = projects.slice(0, 4);

  return (
    <section id="projects" className="w-full py-20 lg:py-24 bg-muted/40">
      <div className="container">
        <div className="text-center">
          <h2 className="text-3xl font-bold font-headline tracking-tighter sm:text-4xl mb-12">
            My Projects
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {latestProjects.map((project) => {
            const projectImage = PlaceHolderImages.find((p) => p.id === project.imageUrlId);
            const hasGithubUrl = project.githubUrl && project.githubUrl !== '#';
            const hasLiveUrl = project.liveUrl && project.liveUrl !== '#';

            return (
              <Card
                key={project.title}
                className="flex flex-col overflow-hidden transition-transform transform hover:-translate-y-2 hover:shadow-2xl"
              >
                {projectImage && (
                  <Link
                    href={hasLiveUrl ? project.liveUrl : '#'}
                    target="_blank"
                    className={`block overflow-hidden ${!hasLiveUrl ? 'pointer-events-none' : ''}`}
                    aria-disabled={!hasLiveUrl}
                    tabIndex={!hasLiveUrl ? -1 : undefined}
                  >
                    <Image
                      src={projectImage.imageUrl}
                      alt={projectImage.description}
                      width={550}
                      height={310}
                      className="w-full object-cover aspect-[16/9] transition-transform duration-500 hover:scale-105"
                      data-ai-hint={projectImage.imageHint}
                    />
                  </Link>
                )}
                <CardHeader className="p-6 pb-2">
                  <CardTitle className="font-headline">{project.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-0 flex-1 flex flex-col">
                  <p className="text-muted-foreground text-sm mb-4 flex-1">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="p-6 pt-0 flex justify-start gap-2">
                  <Button asChild variant="outline" size="sm" disabled={!hasGithubUrl}>
                    <Link
                      href={hasGithubUrl ? project.githubUrl : '#'}
                      target="_blank"
                      aria-disabled={!hasGithubUrl}
                      tabIndex={!hasGithubUrl ? -1 : undefined}
                      className={!hasGithubUrl ? 'pointer-events-none' : ''}
                    >
                      <Github className="mr-2 h-4 w-4" />
                      GitHub
                    </Link>
                  </Button>
                  <Button asChild size="sm" disabled={!hasLiveUrl}>
                    <Link
                      href={hasLiveUrl ? project.liveUrl : '#'}
                      target="_blank"
                      aria-disabled={!hasLiveUrl}
                      tabIndex={!hasLiveUrl ? -1 : undefined}
                      className={!hasLiveUrl ? 'pointer-events-none' : ''}
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Live Demo
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <Button asChild variant="outline">
            <Link href="/projects">
              View All Projects
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
