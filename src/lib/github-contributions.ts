// Reads the public GitHub contributions calendar (the same HTML the profile page embeds).
// No token needed; cached for an hour so page loads don't hit GitHub.

export type ContributionDay = { date: string; level: 0 | 1 | 2 | 3 | 4; count: number };
export type ContributionCalendar = { total: number; days: ContributionDay[] };

export async function getGitHubContributions(username: string): Promise<ContributionCalendar | null> {
    try {
        const res = await fetch(`https://github.com/users/${encodeURIComponent(username)}/contributions`, {
            next: { revalidate: 3600 },
            signal: AbortSignal.timeout(5000),
            headers: { 'User-Agent': 'utkristi-portfolio' },
        });
        if (!res.ok) return null;
        const html = await res.text();

        const total = Number(html.match(/([\d,]+)\s+contributions?\s+in the last year/)?.[1]?.replace(/,/g, '') ?? NaN);

        // Per-day counts live in <tool-tip for="contribution-day-component-x-y">N contributions on …</tool-tip>
        const counts = new Map<string, number>();
        for (const m of html.matchAll(/<tool-tip[^>]*for="([^"]+)"[^>]*>([^<]*)</g)) {
            const n = m[2].match(/^(\d+) contribution/);
            counts.set(m[1], n ? Number(n[1]) : 0);
        }

        const days: ContributionDay[] = [];
        for (const m of html.matchAll(/<td[^>]*ContributionCalendar-day[^>]*>/g)) {
            const tag = m[0];
            const date = tag.match(/data-date="([^"]+)"/)?.[1];
            const level = Number(tag.match(/data-level="(\d)"/)?.[1] ?? 0) as ContributionDay['level'];
            const id = tag.match(/id="([^"]+)"/)?.[1] ?? '';
            if (date) days.push({ date, level, count: counts.get(id) ?? 0 });
        }
        if (days.length === 0) return null;

        days.sort((a, b) => a.date.localeCompare(b.date));
        return { total: Number.isFinite(total) ? total : days.reduce((s, d) => s + d.count, 0), days };
    } catch (e) {
        console.error('getGitHubContributions error:', e);
        return null;
    }
}
