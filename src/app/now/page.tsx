import { MarkdownPage, markdownPageMetadata } from '@/components/sections/markdown-page';

export const dynamic = 'force-dynamic';

type Props = { searchParams: Promise<{ preview?: string }> };

export async function generateMetadata({ searchParams }: Props) {
    return markdownPageMetadata('now', (await searchParams).preview);
}

export default async function Page({ searchParams }: Props) {
    return <MarkdownPage slug="now" preview={(await searchParams).preview} />;
}
