import { ArrowUpRight } from 'lucide-react';
import { getCodeforcesStats, getLeetCodeStats, getGitHubUserStats } from '@/lib/api-stats';
import { CountUp } from '@/components/ui/count-up';

type Stat = { label: string; value: string | number; detail: string; href: string };

function Heading() {
    return (
        <div className="eyebrow flex items-center gap-4">
            <span>Live stats</span>
            <span className="h-px flex-1 bg-border" />
        </div>
    );
}

/** Same footprint as the real tiles, so nothing jumps when the stats arrive. */
export function LiveStatsSkeleton() {
    return (
        <section className="mt-28" aria-busy="true" aria-label="Loading live stats">
            <Heading />
            <div className="mt-8 grid gap-px overflow-hidden rounded-3xl border border-border bg-border sm:grid-cols-3">
                {['GitHub', 'LeetCode', 'Codeforces'].map((label) => (
                    <div key={label} className="flex flex-col bg-card p-8">
                        <span className="eyebrow">{label}</span>
                        <span className="mt-8 h-14 w-28 animate-pulse rounded-xl bg-muted" />
                        <span className="mt-3 h-4 w-40 animate-pulse rounded bg-muted" />
                    </div>
                ))}
            </div>
        </section>
    );
}

/**
 * GitHub / LeetCode / Codeforces numbers. Rendered inside <Suspense> so these third-party
 * APIs stream in after the rest of the About page instead of blocking it.
 */
export async function LiveStats() {
    const [ghStats, lcStats, cfStats] = await Promise.all([
        getGitHubUserStats('utkarsh-1912'),
        getLeetCodeStats('user7883p'),
        getCodeforcesStats('utkarsh191201'),
    ]);

    const stats: Stat[] = [];
    if (ghStats) {
        stats.push({ label: 'GitHub', value: ghStats.public_repos, detail: `public repos · ${ghStats.followers} followers`, href: ghStats.html_url });
    }
    if (lcStats && lcStats.status === 'success') {
        stats.push({
            label: 'LeetCode',
            value: lcStats.totalSolved,
            detail: `solved · ${lcStats.easySolved} easy / ${lcStats.mediumSolved} medium / ${lcStats.hardSolved} hard`,
            href: 'https://leetcode.com/u/user7883p',
        });
    }
    if (cfStats) {
        stats.push({
            label: 'Codeforces',
            value: cfStats.rating || '—',
            detail: `rating · max ${cfStats.maxRank} (${cfStats.maxRating})`,
            href: `https://codeforces.com/profile/${cfStats.handle}`,
        });
    }
    if (stats.length === 0) return null;

    return (
        <section className="mt-28">
            <Heading />
            <div className="mt-8 grid gap-px overflow-hidden rounded-3xl border border-border bg-border sm:grid-cols-3">
                {stats.map((s, i) => (
                    <a
                        key={s.label}
                        href={s.href}
                        target="_blank"
                        rel="noreferrer"
                        data-reveal="up"
                        style={{ '--i': i } as React.CSSProperties}
                        data-spotlight
                        className="group flex flex-col bg-card p-8 transition-colors hover:bg-muted/50"
                    >
                        <span className="eyebrow flex items-center justify-between">
                            {s.label}
                            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                        </span>
                        <CountUp value={s.value} className="mt-8 font-headline text-6xl font-semibold tabular-nums tracking-tight" />
                        <span className="mt-2 text-sm text-muted-foreground">{s.detail}</span>
                    </a>
                ))}
            </div>
        </section>
    );
}
