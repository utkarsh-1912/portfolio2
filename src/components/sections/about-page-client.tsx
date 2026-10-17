import { SectionHeading } from '@/components/ui/section-heading';
import { RevealObserver } from '@/components/ui/reveal-observer';
import { CertificationCard } from './certifications';
import { SplitWords } from '@/components/ui/split-words';

export function AboutPageClient({ about, skills, certifications = [], liveStats }: { about: any; skills: any[]; certifications?: any[]; liveStats?: React.ReactNode }) {
  const paragraphs: string[] = about?.paragraphs ?? [];
  const [lead, ...rest] = paragraphs;

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

      {/* Live coding stats (streamed in separately; see components/sections/live-stats.tsx) */}
      {liveStats}

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
