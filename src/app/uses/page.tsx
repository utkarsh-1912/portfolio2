import { MarkdownPage, markdownPageMetadata } from '@/components/sections/markdown-page';

export const dynamic = 'force-dynamic';

type Props = { searchParams: Promise<{ preview?: string }> };

export async function generateMetadata({ searchParams }: Props) {
    return markdownPageMetadata('uses', (await searchParams).preview);
}

export default async function Page({ searchParams }: Props) {
    return <MarkdownPage slug="uses" preview={(await searchParams).preview} />;
}
