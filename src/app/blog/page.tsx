import type { Metadata } from 'next';
import { getBlogs } from '@/db/queries';
import { toArticleSummary } from '@/lib/site';
import { BlogPageClient } from '@/components/sections/blog-page-client';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Writing',
  description: 'Articles by Utkarsh Gupta on web development, engineering and technology.',
  alternates: { canonical: '/blog' },
};

export default async function BlogPage() {
  const posts = (await getBlogs()).map(toArticleSummary);

  return <BlogPageClient posts={posts} />;
}
