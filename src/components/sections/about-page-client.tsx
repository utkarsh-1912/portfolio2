import { ArrowUpRight } from 'lucide-react';
import type { CodeforcesUser, LeetCodeStats, GitHubUserStats } from '@/lib/api-stats';
import { SectionHeading } from '@/components/ui/section-heading';
import { RevealObserver } from '@/components/ui/reveal-observer';
import { CertificationCard } from './certifications';
import { SplitWords } from '@/components/ui/split-words';
import { CountUp } from '@/components/ui/count-up';

type StatsProps = {
  cfStats: CodeforcesUser | null;
  lcStats: LeetCodeStats | null;
  ghStats: GitHubUserStats | null;
};

type Stat = { label: string; value: string | number; detail: string; href: string };

export function AboutPageClient({ about, skills, certifications = [], stats }: { about: any; skills: any[]; certifications?: any[]; stats: StatsProps }) {
  const paragraphs: string[] = about?.paragraphs ?? [];
  const [lead, ...rest] = paragraphs;

  const liveStats: Stat[] = [];
  if (stats.ghStats) {
    liveStats.push({
      label: 'GitHub',
      value: stats.ghStats.public_repos,
      detail: `public repos · ${stats.ghStats.followers} followers`,
      href: stats.ghStats.html_url,
    });
  }
  if (stats.lcStats && stats.lcStats.status === 'success') {
    liveStats.push({
      label: 'LeetCode',
      value: stats.lcStats.totalSolved,
      detail: `solved · ${stats.lcStats.easySolved} easy / ${stats.lcStats.mediumSolved} medium / ${stats.lcStats.hardSolved} hard`,
      href: 'https://leetcode.com/u/user7883p',
    });
  }
  if (stats.cfStats) {
    liveStats.push({
      label: 'Codeforces',
      value: stats.cfStats.rating || '—',
      detail: `rating · max ${stats.cfStats.maxRank} (${stats.cfStats.maxRating})`,
      href: `https://codeforces.com/profile/${stats.cfStats.handle}`,
    });
  }

  return (
    <div className="container py-16 md:py-24">
      <SectionHeading as="h1" label="About" title="Hello, I'm Utkarsh" />

      {/* Bio */}
      <div className="grid gap-12 md:grid-cols-12">
        <div className="md:col-span-8">
          {lead && (
            <SplitWords text={lead} className="font-headline text-2xl font-medium leading-snug tracking-tight md:text-4xl" />
          )}
          <div className="mt-10 max-w-2xl space-y-6 text-lg leading-relaxed text-muted-foreground">
            {rest.map((p, i) => (
              <p key={i} data-reveal="up" style={{ '--i': i + 1 } as React.CSSProperties}>{p}</p>
            ))}
          </div>
        </div>
      </div>

      {/* Live coding stats */}
      {liveStats.length > 0 && (
        <section className="mt-28">
          <div data-reveal="up" className="eyebrow flex items-center gap-4">
            <span>Live stats</span>
            <span className="h-px flex-1 bg-border" />
          </div>
          <div className="mt-8 grid gap-px overflow-hidden rounded-3xl border border-border bg-border sm:grid-cols-3">
            {liveStats.map((s, i) => (
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
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <section className="mt-28">
          <div data-reveal="up" className="eyebrow flex items-center gap-4">
            <span>Certifications</span>
            <span className="h-px flex-1 bg-border" />
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {certifications.map((cert, i) => (
              <div key={cert.id} data-reveal="up" style={{ '--i': i % 3 } as React.CSSProperties}>
                <CertificationCard cert={cert} index={i} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <section className="mt-28">
          <div data-reveal="up" className="eyebrow flex items-center gap-4">
            <span>Skills &amp; tools</span>
            <span className="h-px flex-1 bg-border" />
          </div>
          <div className="mt-4">
            {skills.map((group, i) => (
              <div
                key={group.id ?? group.category}
                data-reveal="up"
                style={{ '--i': i % 3 } as React.CSSProperties}
                className="grid gap-4 border-b border-border py-8 md:grid-cols-12"
              >
                <h2 className="font-headline text-2xl font-semibold tracking-tight md:col-span-4">{group.category}</h2>
                <ul className="flex flex-wrap gap-2 md:col-span-8">
                  {group.items.map((skill: { name: string }) => (
                    <li key={skill.name} className="rounded-full border border-border px-4 py-1.5 text-sm text-foreground/80">
                      {skill.name}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      <RevealObserver />
    </div>
  );
}
