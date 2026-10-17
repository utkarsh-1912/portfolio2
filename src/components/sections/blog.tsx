import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getBlogs } from '@/db/queries';
import { SectionHeading } from '@/components/ui/section-heading';
import { PostCard } from './post-card';
import { toArticleSummary } from '@/lib/site';

export async function BlogSection() {
  const posts = (await getBlogs()).slice(0, 3).map(toArticleSummary);
  if (posts.length === 0) return null;

  const [first, ...rest] = posts;

  return (
    <section id="blog" className="relative w-full border-t border-border py-24 md:py-36">
      <div className="container">
        <SectionHeading
          index="05"
          label="Writing"
          title="Notes & articles"
          intro="Thoughts on web development, engineering and technology."
        />

        <div className="grid gap-x-8 gap-y-14 lg:grid-cols-12">
          <div data-reveal="up" className="lg:col-span-7">
            <PostCard post={first} featured />
          </div>
          <div className="grid gap-14 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1 lg:gap-10">
            {rest.map((post, i) => (
              <div key={post.id} data-reveal="up" style={{ '--i': i + 1 } as React.CSSProperties}>
                <PostCard post={post} compact />
              </div>
            ))}
          </div>
        </div>

        <div data-reveal="up" className="mt-16 flex justify-center">
          <Link href="/blog" className="group inline-flex items-center gap-2 text-base font-medium">
            <span className="link-draw">Read all articles</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
