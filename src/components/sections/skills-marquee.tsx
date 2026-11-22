import { getSkills } from '@/db/queries';

const MAX_ITEMS = 20;
const MAX_CORE = 12;

/**
 * One curated marquee row. If there's a skills group whose name contains "Core" (e.g. "Core stack"),
 * the row shows just that group (up to 12), so you control the headline technologies from the admin.
 * Otherwise skills are picked round-robin across the groups (first of each, then second, …)
 * so the row shows breadth, not one long list.
 */
export async function SkillsMarquee() {
  const skills = await getSkills();
  const core = skills.find((g) => /\bcore\b/i.test(g.category) && g.items.length > 0);
  const names: string[] = [];
  if (core) {
    names.push(...core.items.slice(0, MAX_CORE).map((i) => i.name));
  } else {
    const groups = skills.map((g) => g.items.map((i) => i.name));
    for (let round = 0; names.length < MAX_ITEMS && groups.some((g) => g[round]); round++) {
      for (const g of groups) if (g[round] && names.length < MAX_ITEMS) names.push(g[round]);
    }
  }
  if (names.length === 0) return null;

  // Rendered twice so the -50% translate in the marquee keyframes loops seamlessly
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
    <section aria-label={core ? core.category : 'Skills'} className="marquee w-full overflow-hidden border-y border-border py-8">
      <div className="marquee-track">
        {row(false)}
        {row(true)}
      </div>
    </section>
  );
}
