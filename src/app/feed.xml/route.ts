import { getBlogs } from '@/db/queries';
import { SITE_URL, articleHref } from '@/lib/site';

export const revalidate = 3600;

const escape = (s: string) =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');

/** RSS 2.0 feed of published articles (on-site posts link here, external ones to their source). */
export async function GET() {
    const posts = await getBlogs();
    const items = posts
        .map((p) => {
            const href = articleHref(p);
            const link = href.startsWith('/') ? `${SITE_URL}${href}` : href;
            const date = p.publishedAt ? new Date(p.publishedAt) : null;
            return `    <item>
      <title>${escape(p.title)}</title>
      <link>${escape(link)}</link>
      <guid isPermaLink="true">${escape(link)}</guid>
      <description>${escape(p.description)}</description>${date && !Number.isNaN(date.getTime()) ? `\n      <pubDate>${date.toUTCString()}</pubDate>` : ''}${(p.tags ?? []).map((t) => `\n      <category>${escape(t)}</category>`).join('')}
    </item>`;
        })
        .join('\n');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Utkarsh Gupta — Writing</title>
    <link>${SITE_URL}/blog</link>
    <description>Articles on software engineering, trading systems and AI.</description>
    <language>en</language>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

    return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
}
