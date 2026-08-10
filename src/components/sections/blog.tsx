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
    <section id="blog" className="w-full min-h-screen py-10 md:py-16 lg:py-28 bg-background relative border-t border-border/50 snap-start flex flex-col justify-center overflow-y-auto">
      <div className="container relative z-10">
        {/* Header */}
        <div className="text-center md:text-left mb-14 font-mono">
          <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-primary mb-3 bg-primary/10 px-4 py-1 border border-primary/30 rounded-none">./writing</span>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-foreground">&gt; ls -la ./blog</h2>
          <p className="mt-4 max-w-xl text-muted-foreground font-sans">
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
                className="group lg:col-span-3 flex flex-col rounded-none tech-border bg-card overflow-hidden transition-all duration-300 font-mono"
              >
                {firstImg ? (
                  <div className="relative aspect-[16/9] overflow-hidden bg-muted">
                    <Image
                      src={firstImg}
                      alt={first.title}
                      fill
                      unoptimized={firstImg.startsWith('http')}
                      className="object-cover transition-transform duration-500 group-hover:scale-105 filter grayscale group-hover:grayscale-0"
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
                    <span className="text-xs font-bold uppercase tracking-widest text-primary border border-primary/30 bg-primary/10 px-2.5 py-1 rounded-none">Featured</span>
                  </div>
                  <h3 className="font-bold text-xl mb-3 text-primary transition-colors leading-snug">{first.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed flex-1 line-clamp-3 font-sans">{first.description}</p>
                  <div className="inline-flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase group-hover:text-primary mt-5 transition-colors">
                    <ExternalLink className="h-4 w-4" /> execute ./read
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
                      className="group flex flex-col rounded-none tech-border bg-card overflow-hidden transition-all duration-300 font-mono"
                    >
                      {/* Image / fallback */}
                      {imgUrl ? (
                        <div className="relative aspect-[16/7] overflow-hidden bg-muted shrink-0">
                          <Image
                            src={imgUrl}
                            alt={post.title}
                            fill
                            unoptimized={imgUrl.startsWith('http')}
                            className="object-cover transition-transform duration-500 group-hover:scale-105 filter grayscale group-hover:grayscale-0"
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
                        <span className="self-start text-[10px] font-bold tracking-[0.15em] uppercase text-primary border border-primary/30 bg-primary/10 px-2.5 py-1 rounded-none mb-3">
                          #{idx + 2}
                        </span>
                        <h4 className="font-bold text-sm leading-snug mb-2 text-primary transition-colors line-clamp-2">
                          {post.title}
                        </h4>
                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed flex-1 font-sans">
                          {post.description}
                        </p>
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-primary/20">
                          <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase text-muted-foreground group-hover:text-primary transition-colors">
                            <ExternalLink className="h-3 w-3" /> execute ./read
                          </span>
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
        <div className="mt-12 flex justify-center">
          <Button asChild variant="outline" size="lg" className="rounded-none tech-border font-mono uppercase tracking-wider text-primary hover:bg-primary/10">
            <Link href="/blog">
              ./read_all.sh <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
