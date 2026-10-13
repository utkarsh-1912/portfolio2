import { getEducation } from '@/db/queries';
import { SectionHeading } from '@/components/ui/section-heading';

export async function EducationSection() {
  const education = await getEducation();
  if (education.length === 0) return null;

  return (
    <section id="education" className="relative w-full border-t border-border py-24 md:py-36">
      <div className="container">
        <SectionHeading
          index="02"
          label="Experience"
          title="Where I've been"
          intro="Roles and studies, newest first."
        />

        <div className="relative">
          {/* Progress rule that draws down as the list scrolls through */}
          <span aria-hidden="true" className="absolute left-0 top-0 hidden h-full w-px bg-border md:block" />
          <span aria-hidden="true" className="scroll-grow-y absolute left-0 top-0 hidden h-full w-px bg-primary md:block" />

          <ol>
          {education.map((item) => {
            const isWork = item.icon === 'Briefcase';
            return (
              <li
                key={item.id}
                data-reveal="up"
                className="group grid gap-3 border-b border-border py-8 transition-colors md:grid-cols-12 md:gap-8 md:pl-10 md:hover:bg-muted/40"
              >
                <div className="md:col-span-3">
                  <p className="font-mono text-sm tabular-nums text-foreground">{item.duration}</p>
                  <p className="eyebrow mt-1">{isWork ? 'Work' : 'Education'}</p>
                </div>
                <div className="md:col-span-4">
                  <h3 className="font-headline text-2xl font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary">
                    {item.degree}
                  </h3>
                  <p className="mt-1 text-muted-foreground">{item.institution}</p>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground md:col-span-5 md:text-base">{item.description}</p>
              </li>
            );
          })}
          </ol>
        </div>
      </div>
    </section>
  );
}
