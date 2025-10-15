import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { projects } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ExternalLink, Github } from 'lucide-react';

export default function ProjectsPage() {
  return (
    <div id="projects" className="container py-24 sm:py-32">
      <div className="text-center">
        <h1 className="text-4xl font-bold font-headline tracking-tighter sm:text-5xl">My Projects</h1>
        <p className="mt-4 max-w-2xl mx-auto text-muted-foreground md:text-xl">
          Here are some of the projects I'm proud to have worked on.
        </p>
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project) => {
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
              <CardFooter className="p-6 pt-0 flex justify-start gap-x-2">
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
                    <span className="sm:hidden">Demo</span>
                    <span className="hidden sm:inline">Live Demo</span>
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
