import { getBlogs } from '@/db/queries';
import { BlogPageClient } from '@/components/sections/blog-page-client';

export const dynamic = 'force-dynamic';

export default async function BlogPage() {
  const posts = await getBlogs();

  return <BlogPageClient posts={posts} />;
}
