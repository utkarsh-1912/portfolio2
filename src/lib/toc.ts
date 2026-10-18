import GithubSlugger from 'github-slugger';

export type TocItem = { id: string; text: string; level: 2 | 3 };

/**
 * Builds a table of contents from Markdown `##` / `###` headings (skipping fenced code).
 * Ids come from the same slugger rehype-slug uses, so links match the rendered headings.
 * `#` headings are rendered as h2 too, so they count as level 2.
 */
export function extractToc(markdown: string): TocItem[] {
    const slugger = new GithubSlugger();
    const items: TocItem[] = [];
    let inFence = false;

    for (const line of markdown.split('\n')) {
        if (/^\s*(```|~~~)/.test(line)) inFence = !inFence;
        if (inFence) continue;
        const m = line.match(/^(#{1,3})\s+(.+?)\s*#*\s*$/);
        if (!m) continue;
        // Strip inline Markdown so the TOC text matches what readers see
        const text = m[2].replace(/[*_`~]/g, '').replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').trim();
        const id = slugger.slug(text);
        items.push({ id, text, level: m[1].length === 3 ? 3 : 2 });
    }
    return items;
}
