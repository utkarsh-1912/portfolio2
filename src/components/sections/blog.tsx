import Image from 'next/image';
import Link from 'next/link';
import { getBlogs } from '@/db/queries';
import { ArrowRight, ExternalLink, BookOpen } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';

function resolveImage(imageUrl?: string | null, imageHint?: string | null) {
  if (imageUrl) return imageUrl;
  if (imageHint) {
    const imgObj = PlaceHolderImages.find((p) => p.imageHint === imageHint);
    if (imgObj) return imgObj.imageUrl;
  }
  return '';
}

export async function BlogSection() {
  const allPosts = await getBlogs();
  const latestPosts = allPosts.slice(0, 3);

  return (
    <section id="blog-preview" className="w-full py-10 lg:py-18">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-primary mb-3 bg-primary/10 px-4 py-1.5 rounded-full">Writing</span>
          <h2 className="text-4xl font-bold font-headline tracking-tighter sm:text-5xl">From the Blog</h2>
          <p className="mt-4 max-w-xl mx-auto text-muted-foreground">
            Thoughts on web development, engineering, and technology.
          </p>
        </div>

        {latestPosts.length === 0 && (
          <p className="text-center text-muted-foreground py-12">No articles yet.</p>
        )}

        {/* Layout: first post large, rest compact */}
        {latestPosts.length > 0 && (() => {
          const [first, ...rest] = latestPosts;
          const firstImg = resolveImage(first.imageUrl, first.imageHint);

          return (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              {/* Featured post — takes 3/5 width on desktop */}
              <Link
                href={first.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group lg:col-span-3 flex flex-col rounded-2xl border border-border/50 bg-card overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                {firstImg ? (
                  <div className="relative aspect-[16/9] overflow-hidden bg-muted">
                    <Image
                      src={firstImg}
                      alt={first.title}
                      fill
                      unoptimized={firstImg.startsWith('http')}
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  </div>
                ) : (
                  <div className="aspect-[16/8] bg-gradient-to-br from-primary/20 via-primary/5 to-muted/30 flex items-center justify-center">
                    <BookOpen className="h-10 w-10 text-primary/30" />
                  </div>
                )}
                <div className="flex-1 flex flex-col p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-2.5 py-1 rounded-full">Featured</span>
                  </div>
                  <h3 className="font-bold font-headline text-xl mb-3 group-hover:text-primary transition-colors leading-snug">{first.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed flex-1 line-clamp-3">{first.description}</p>
                  <div className="inline-flex items-center gap-2 text-sm font-semibold text-primary mt-5">
                    Read Article <ExternalLink className="h-4 w-4" />
                  </div>
                </div>
              </Link>

              {/* Remaining posts column — 2/5 width on desktop */}
              <div className="lg:col-span-2 flex flex-col gap-4">
                {rest.length === 0 && (
                  <div className="flex-1 rounded-2xl border border-dashed border-border/40 flex items-center justify-center text-muted-foreground text-sm p-8">
                    More articles coming soon
                  </div>
                )}
                {rest.map((post, idx) => {
                  const imgUrl = resolveImage(post.imageUrl, post.imageHint);
                  return (
                    <Link
                      key={post.id}
                      href={post.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex flex-col rounded-2xl border border-border/50 bg-card overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                    >
                      {/* Image / fallback */}
                      {imgUrl ? (
                        <div className="relative aspect-[16/7] overflow-hidden bg-muted shrink-0">
                          <Image
                            src={imgUrl}
                            alt={post.title}
                            fill
                            unoptimized={imgUrl.startsWith('http')}
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                        </div>
                      ) : (
                        <div className="aspect-[16/7] bg-gradient-to-br from-primary/15 via-primary/5 to-muted/30 flex items-center justify-center shrink-0">
                          <BookOpen className="h-8 w-8 text-primary/30" />
                        </div>
                      )}

                      {/* Body */}
                      <div className="flex flex-col flex-1 p-4">
                        {/* Number badge */}
                        <span className="self-start text-[10px] font-bold tracking-[0.15em] uppercase text-primary bg-primary/10 px-2.5 py-1 rounded-full mb-3">
                          #{idx + 2}
                        </span>
                        <h4 className="font-bold font-headline text-sm leading-snug mb-2 group-hover:text-primary transition-colors line-clamp-2">
                          {post.title}
                        </h4>
                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed flex-1">
                          {post.description}
                        </p>
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/30">
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-primary">
                            Read Article <ExternalLink className="h-3 w-3" />
                          </span>
                          <ExternalLink className="h-3.5 w-3.5 text-muted-foreground/40 group-hover:text-primary/60 transition-colors" />
                        </div>
                      </div>
                    </Link>
                  );
                })}

              </div>
            </div>
          );
        })()}

        {/* CTA */}
        <div className="mt-12 text-center">
          <Button asChild variant="outline" size="lg" className="rounded-full border-primary/30 hover:border-primary">
            <Link href="/blog">
              View All Posts <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
