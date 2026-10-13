import { getSkills } from '@/db/queries';

export async function SkillsMarquee() {
  const skills = await getSkills();
  const names = skills.flatMap((group) => group.items.map((item) => item.name));
  if (names.length === 0) return null;

  // Rendered twice so the -50% translate in the marquee keyframes loops seamlessly.
  const row = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {names.map((name, i) => (
        <li key={i} className="flex items-center whitespace-nowrap px-5 font-headline text-3xl font-medium tracking-tight text-foreground/70 transition-colors hover:text-foreground sm:text-5xl">
          {name}
          <span className="ml-10 h-2 w-2 rounded-full bg-primary/70" aria-hidden="true" />
        </li>
      ))}
    </ul>
  );

  return (
    <section aria-label="Skills" className="marquee w-full overflow-hidden border-y border-border py-8">
      <div className="marquee-track">
        {row(false)}
        {row(true)}
      </div>
    </section>
  );
}
