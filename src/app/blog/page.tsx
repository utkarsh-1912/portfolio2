import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { blogPosts } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ExternalLink } from 'lucide-react';

export default function BlogPage() {
  return (
    <div id="blog" className="container py-24 sm:py-32">
      <div className="text-center">
        <h1 className="text-4xl font-bold font-headline tracking-tighter sm:text-5xl">My Blog</h1>
        <p className="mt-4 max-w-2xl mx-auto text-muted-foreground md:text-xl">
          Thoughts on web development, design, and technology.
        </p>
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {blogPosts.map((post) => {
          const postImage = PlaceHolderImages.find((p) => p.id === post.imageUrlId);
          return (
            <Card
              key={post.title}
              className="flex flex-col overflow-hidden transition-transform transform hover:-translate-y-2 hover:shadow-2xl"
            >
              {postImage && (
                <Link href={post.url} target="_blank" className="block overflow-hidden">
                  <Image
                    src={postImage.imageUrl}
                    alt={postImage.description}
                    width={550}
                    height={310}
                    className="w-full object-cover aspect-[16/9] transition-transform duration-500 hover:scale-105"
                    data-ai-hint={postImage.imageHint}
                  />
                </Link>
              )}
              <CardHeader className="p-6 pb-2">
                <CardTitle className="font-headline">{post.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0 flex-1">
                <p className="text-muted-foreground text-sm">{post.description}</p>
              </CardContent>
              <CardFooter className="p-6 pt-0">
                <Button asChild size="sm">
                  <Link href={post.url} target="_blank">
                    Read More
                    <ExternalLink className="ml-2 h-4 w-4" />
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
