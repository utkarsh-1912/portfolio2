/** URL-safe slug from a title: "Blast Radius" -> "blast-radius". */
export function slugify(title: string): string {
    return title
        .toLowerCase()
        .normalize('NFKD')
        .replace(/[̀-ͯ]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
        .slice(0, 80);
}
