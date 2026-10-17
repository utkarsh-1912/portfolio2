import { getEducation } from '@/db/queries';
import { SectionHeading } from '@/components/ui/section-heading';
import { TimelineList } from './timeline-list';

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
        <TimelineList items={education} />
      </div>
    </section>
  );
}
