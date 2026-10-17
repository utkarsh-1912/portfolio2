const CASE_STUDY_FIELDS = ['problem', 'approach', 'architecture', 'results'] as const;

type CaseStudyFields = Partial<Record<(typeof CASE_STUDY_FIELDS)[number], string | null>>;

/** A project only gets its own page once at least one case-study section is written. */
export function hasCaseStudy(project: CaseStudyFields) {
    return CASE_STUDY_FIELDS.some((f) => !!project[f]?.trim());
}

/**
 * List data for the browser: drops the (possibly long) case-study Markdown and keeps a flag.
 * The slug is only kept when there's a case study, so links never point at an empty page.
 */
export function toProjectSummary<T extends CaseStudyFields & { slug?: string | null }>(project: T) {
    const { problem, approach, architecture, results, ...rest } = project;
    const caseStudy = hasCaseStudy({ problem, approach, architecture, results });
    return { ...rest, slug: caseStudy ? rest.slug ?? null : null, hasCaseStudy: caseStudy };
}
