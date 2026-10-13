// Helpers for timeline (education/experience) dates.
// Dates are stored as ISO "YYYY-MM-DD" strings (Postgres `date`), always on the 1st of the month.

const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** Parses "July 2024", "Aug 2023" or "2020" into an ISO date. `end` picks December for year-only values. */
function parsePart(part: string, end: boolean): string | null {
    const year = part.match(/\b(19|20)\d{2}\b/)?.[0];
    if (!year) return null;
    const monthIdx = MONTHS.findIndex((m) => part.toLowerCase().includes(m));
    const month = monthIdx >= 0 ? monthIdx + 1 : end ? 12 : 1;
    return `${year}-${String(month).padStart(2, '0')}-01`;
}

/**
 * Best-effort parse of a free-text duration like "July 2024 - Present" or "2020 - 2024".
 * Returns endDate null when the range is ongoing.
 */
export function parseDuration(duration: string): { startDate: string | null; endDate: string | null } {
    const [startPart = '', endPart = ''] = duration.split(/\s*[-–—]\s*|\s+to\s+/i);
    const ongoing = /present|current|now/i.test(endPart) || endPart.trim() === '';
    return {
        startDate: parsePart(startPart, false),
        endDate: ongoing ? null : parsePart(endPart, true),
    };
}

/** "2024-07-01" -> "Jul 2024" */
export function formatMonth(iso: string): string {
    const [y, m] = iso.split('-');
    return `${MONTH_LABELS[Number(m) - 1]} ${y}`;
}

export function formatDuration(startDate: string, endDate: string | null): string {
    return `${formatMonth(startDate)} - ${endDate ? formatMonth(endDate) : 'Present'}`;
}

type TimelineEntry = { id: number; sequence: number | null; startDate: string | null; endDate: string | null; duration: string };

/**
 * Newest first: manual `sequence` wins, then ongoing roles, then latest end date, then latest start.
 * Falls back to parsing `duration` for rows that don't have dates yet.
 */
export function sortTimeline<T extends TimelineEntry>(items: T[]): T[] {
    const key = (item: T) => {
        const parsed = item.startDate ? { startDate: item.startDate, endDate: item.endDate } : parseDuration(item.duration);
        return {
            seq: item.sequence ?? 0,
            end: parsed.endDate ?? '9999-12-31',
            start: parsed.startDate ?? '0000-01-01',
        };
    };
    return [...items].sort((a, b) => {
        const ka = key(a);
        const kb = key(b);
        if (ka.seq !== kb.seq) return ka.seq - kb.seq;
        if (ka.end !== kb.end) return kb.end.localeCompare(ka.end);
        if (ka.start !== kb.start) return kb.start.localeCompare(ka.start);
        return b.id - a.id;
    });
}
