import { ArrowUpRight } from 'lucide-react';
import { getGitHubContributions, type ContributionDay } from '@/lib/github-contributions';
import { cn } from '@/lib/utils';
import { CountUp } from '@/components/ui/count-up';

const USERNAME = 'utkarsh-1912';
const MOBILE_WEEKS = 20;

// Always-dark "night" panel (after eddyrlora.com), independent of the site theme
const LEVEL_COLORS = [
    'rgba(255,255,255,0.06)',
    'hsl(265 85% 72% / 0.3)',
    'hsl(265 85% 72% / 0.5)',
    'hsl(265 85% 72% / 0.75)',
    'hsl(265 85% 72% / 1)',
];

/** Groups days into Sunday-first weeks, padding the first week so rows line up by weekday. */
function toWeeks(days: ContributionDay[]) {
    const weeks: (ContributionDay | null)[][] = [];
    let week: (ContributionDay | null)[] = Array(new Date(`${days[0].date}T00:00:00Z`).getUTCDay()).fill(null);
    for (const day of days) {
        week.push(day);
        if (week.length === 7) {
            weeks.push(week);
            week = [];
        }
    }
    if (week.length) weeks.push(week);
    return weeks;
}

function longestStreak(days: ContributionDay[]) {
    let best = 0;
    let run = 0;
    for (const d of days) {
        run = d.count > 0 ? run + 1 : 0;
        best = Math.max(best, run);
    }
    return best;
}

export async function GitHubActivitySection() {
    const calendar = await getGitHubContributions(USERNAME);
    if (!calendar) return null;

    const weeks = toWeeks(calendar.days);
    const activeDays = calendar.days.filter((d) => d.count > 0).length;
    const busiest = calendar.days.reduce((a, b) => (b.count > a.count ? b : a), calendar.days[0]);
    const stats = [
        { label: 'Contributions', value: calendar.total.toLocaleString('en-US') },
        { label: 'Active days', value: activeDays },
        { label: 'Longest streak', value: `${longestStreak(calendar.days)}d` },
        { label: 'Busiest day', value: busiest.count },
    ];

    // Month labels sit above the first week that starts in that month
    const monthLabels = weeks.map((w, i) => {
        const first = w.find(Boolean);
        if (!first) return null;
        const month = new Date(`${first.date}T00:00:00Z`).toLocaleString('en-US', { month: 'short', timeZone: 'UTC' });
        const prev = weeks[i - 1]?.find(Boolean);
        const prevMonth = prev && new Date(`${prev.date}T00:00:00Z`).toLocaleString('en-US', { month: 'short', timeZone: 'UTC' });
        return month !== prevMonth ? month : null;
    });

    return (
        <section aria-labelledby="github-activity-title" className="relative w-full bg-[#0d0c0b] py-24 text-[#ece8df] md:py-32">
            <div className="container">
                <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p data-reveal="up" className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/50">On GitHub</p>
                        <h2 id="github-activity-title" data-reveal="up" className="mt-4 font-headline text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                            {calendar.total.toLocaleString('en-US')} contributions this year.
                        </h2>
                    </div>
                    <a
                        href={`https://github.com/${USERNAME}`}
                        target="_blank"
                        rel="noreferrer"
                        data-reveal="up"
                        className="group inline-flex items-center gap-1 font-mono text-xs uppercase tracking-widest text-white/60 transition-colors hover:text-white"
                    >
                        <span className="link-draw">github.com/{USERNAME}</span>
                        <ArrowUpRight className="h-3.5 w-3.5" />
                    </a>
                </div>

                {/* Heatmap: one column per week, Sunday at the top */}
                <div data-reveal="up" className="mt-14">
                    <div className="flex gap-[3px]" role="img" aria-label={`GitHub contribution graph: ${calendar.total} contributions in the last year`}>
                        {weeks.map((week, wi) => {
                            const older = wi < weeks.length - MOBILE_WEEKS;
                            return (
                                <div key={wi} style={{ '--wk': wi } as React.CSSProperties} className={cn('heat-col flex flex-1 flex-col gap-[3px]', older && 'hidden md:flex')}>
                                    <span className="mb-1 h-3 font-mono text-[9px] uppercase leading-none text-white/40">{monthLabels[wi] ?? ''}</span>
                                    {Array.from({ length: 7 }, (_, di) => {
                                        const day = week[di];
                                        return (
                                            <span
                                                key={di}
                                                title={day ? `${day.count} on ${day.date}` : undefined}
                                                className="aspect-square w-full rounded-[2px]"
                                                style={{ backgroundColor: day ? LEVEL_COLORS[day.level] : 'transparent' }}
                                            />
                                        );
                                    })}
                                </div>
                            );
                        })}
                    </div>
                    <div className="mt-4 flex items-center justify-end gap-2 font-mono text-[10px] uppercase tracking-widest text-white/40">
                        Less
                        {LEVEL_COLORS.map((c) => (
                            <span key={c} className="h-2.5 w-2.5 rounded-[2px]" style={{ backgroundColor: c }} />
                        ))}
                        More
                    </div>
                </div>

                <dl className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 md:grid-cols-4">
                    {stats.map((s, i) => (
                        <div key={s.label} data-reveal="up" data-spotlight style={{ '--i': i } as React.CSSProperties} className="bg-[#0d0c0b] p-6 sm:p-8">
                            <dt className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/50">{s.label}</dt>
                            <dd className="mt-3 font-headline text-4xl font-semibold tabular-nums tracking-tight sm:text-5xl"><CountUp value={s.value} /></dd>
                        </div>
                    ))}
                </dl>
            </div>
        </section>
    );
}
