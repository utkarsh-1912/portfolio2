import { getAbout, getSkills } from '@/db/queries';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { SectionHeading } from '@/components/ui/section-heading';
import { SplitWords } from '@/components/ui/split-words';

export async function AboutSection() {
  const [about, skills] = await Promise.all([getAbout(), getSkills()]);
  const [lead, ...rest] = about?.paragraphs ?? [];

  return (
    <section id="about" className="relative w-full py-24 md:py-36">
      <div className="container">
        <SectionHeading index="01" label="About" title="A bit about me" />

        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-8">
            {lead && (
              <SplitWords text={lead} className="font-headline text-2xl font-medium leading-snug tracking-tight text-foreground md:text-4xl" />
            )}
            {rest[0] && (
              <p data-reveal="up" style={{ '--i': 1 } as React.CSSProperties} className="mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                {rest[0]}
              </p>
            )}
            <Link
              href="/about"
              data-reveal="up"
              style={{ '--i': 2 } as React.CSSProperties}
              className="group mt-10 inline-flex items-center gap-2 text-base font-medium"
            >
              <span className="link-draw">More about me</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Skill groups as a quiet index */}
          {skills.length > 0 && (
            <dl className="md:col-span-4 md:border-l md:border-border md:pl-10">
              {skills.slice(0, 4).map((group, i) => (
                <div key={group.id} data-reveal="up" style={{ '--i': i } as React.CSSProperties} className="border-b border-border py-5 first:pt-0 last:border-0">
                  <dt className="eyebrow">{group.category}</dt>
                  <dd className="mt-2 text-sm leading-relaxed text-foreground/80">
                    {group.items.map((item) => item.name).join(', ')}
                  </dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </div>
    </section>
  );
}
