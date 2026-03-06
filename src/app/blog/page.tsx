import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import Link from 'next/link';
import { getBlogs } from '@/db/queries';
import { ExternalLink, Clock, BookOpen } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export const dynamic = 'force-dynamic';

export default async function BlogPage() {
  const posts = await getBlogs();

  function resolveImage(imageUrl?: string | null, imageHint?: string | null) {
    if (imageUrl) return imageUrl;
    if (imageHint) {
      const imgObj = PlaceHolderImages.find((p) => p.imageHint === imageHint);
      if (imgObj) return imgObj.imageUrl;
    }
    return '';
  }

  const [featured, ...rest] = posts;

  return (
    <div id="blog" className="container py-16 sm:py-24">
      {/* Page header */}
      <div className="text-center mb-14">
        <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-primary mb-3 bg-primary/10 px-4 py-1.5 rounded-full">Writing</span>
        <h1 className="text-4xl font-bold font-headline tracking-tighter sm:text-5xl">My Blog</h1>
        <p className="mt-4 max-w-2xl mx-auto text-muted-foreground md:text-lg">
          Thoughts on web development, engineering, and technology.
        </p>
      </div>

      {posts.length === 0 && (
        <p className="text-center text-muted-foreground py-20">No articles published yet.</p>
      )}

      {/* Featured (first post) — wide card */}
      {featured && (() => {
        const imgUrl = resolveImage(featured.imageUrl, featured.imageHint);
        return (
          <Link
            href={featured.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col md:flex-row rounded-2xl border border-border/50 bg-card overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 mb-8"
          >
            {imgUrl && (
              <div className="relative md:w-2/5 aspect-[16/9] md:aspect-auto shrink-0 overflow-hidden bg-muted">
                <Image
                  src={imgUrl}
                  alt={featured.title}
                  fill
                  unoptimized={imgUrl.startsWith('http')}
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            )}
            <div className="flex-1 flex flex-col p-6 md:p-8">
              <div className="flex items-center gap-2 mb-4">
                <Badge className="bg-primary text-primary-foreground text-xs">Featured</Badge>
                <span className="text-xs text-muted-foreground flex items-center gap-1"><BookOpen className="h-3 w-3" /> Article</span>
              </div>
              <h2 className="text-2xl font-bold font-headline mb-3 group-hover:text-primary transition-colors">{featured.title}</h2>
              <p className="text-muted-foreground leading-relaxed flex-1 mb-6">{featured.description}</p>
              <div className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
                Read Article <ExternalLink className="h-4 w-4" />
              </div>
            </div>
          </Link>
        );
      })()}

      {/* Remaining posts — grid */}
      {rest.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rest.map((post) => {
            const imgUrl = resolveImage(post.imageUrl, post.imageHint);
            return (
              <Link
                key={post.id}
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col rounded-2xl border border-border/50 bg-card overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                {imgUrl ? (
                  <div className="relative aspect-[16/9] overflow-hidden bg-muted">
                    <Image
                      src={imgUrl}
                      alt={post.title}
                      fill
                      unoptimized={imgUrl.startsWith('http')}
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                ) : (
                  <div className="aspect-[16/8] bg-gradient-to-br from-primary/15 via-primary/5 to-muted/30 flex items-center justify-center">
                    <BookOpen className="h-8 w-8 text-primary/30" />
                  </div>
                )}
                <div className="flex-1 flex flex-col p-5">
                  <h3 className="font-bold font-headline text-base mb-2 group-hover:text-primary transition-colors line-clamp-2">{post.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed flex-1 line-clamp-3 mb-4">{post.description}</p>
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary mt-auto">
                    Read more <ExternalLink className="h-3 w-3" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
