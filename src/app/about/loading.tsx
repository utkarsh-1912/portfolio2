import { PageLoader } from '@/components/ui/page-loader';

// Shown while the About page fetches live coding stats (GitHub, LeetCode, Codeforces).
// Kept out of the root so pages that call notFound() (project/article pages) can return a real 404.
export default function Loading() {
    return <PageLoader label="Loading profile" />;
}
