import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeHighlight from 'rehype-highlight';
import { cn } from '@/lib/utils';

/**
 * Renders admin-authored Markdown (GitHub-flavoured: tables, task lists, strikethrough)
 * with the site's typography. Raw HTML in the source is not rendered. Headings get ids
 * (for the table of contents) and fenced code blocks get syntax highlighting.
 */
export function Markdown({ children, className }: { children: string; className?: string }) {
    return (
        <div className={cn('max-w-none text-base leading-relaxed text-foreground/85 md:text-lg', className)}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeSlug, rehypeHighlight]}
                components={{
                    h1: ({ children, id }) => <h2 id={id} className="mt-14 scroll-mt-28 font-headline text-3xl font-semibold tracking-tight text-foreground first:mt-0 md:text-4xl">{children}</h2>,
                    h2: ({ children, id }) => <h2 id={id} className="mt-14 scroll-mt-28 font-headline text-3xl font-semibold tracking-tight text-foreground first:mt-0 md:text-4xl">{children}</h2>,
                    h3: ({ children, id }) => <h3 id={id} className="mt-10 scroll-mt-28 font-headline text-2xl font-semibold tracking-tight text-foreground first:mt-0">{children}</h3>,
                    h4: ({ children }) => <h4 className="mt-8 font-semibold text-foreground first:mt-0">{children}</h4>,
                    p: ({ children }) => <p className="mt-5 first:mt-0">{children}</p>,
                    a: ({ href, children }) => {
                        const external = !!href && /^https?:\/\//.test(href);
                        return (
                            <a href={href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})} className="text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-primary">
                                {children}
                            </a>
                        );
                    },
                    ul: ({ children }) => <ul className="mt-5 list-disc space-y-2 pl-6 marker:text-muted-foreground">{children}</ul>,
                    ol: ({ children }) => <ol className="mt-5 list-decimal space-y-2 pl-6 marker:text-muted-foreground">{children}</ol>,
                    blockquote: ({ children }) => <blockquote className="mt-6 border-l-2 border-primary pl-5 italic text-muted-foreground">{children}</blockquote>,
                    hr: () => <hr className="my-12 border-border" />,
                    img: ({ src, alt }) => (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={typeof src === 'string' ? src : ''} alt={alt ?? ''} loading="lazy" className="mt-8 w-full rounded-2xl border border-border" />
                    ),
                    pre: ({ children }) => <pre className="mt-6 overflow-x-auto rounded-2xl border border-border bg-muted/50 p-5 font-mono text-sm leading-relaxed">{children}</pre>,
                    code: ({ className, children }) =>
                        className ? (
                            <code className={className}>{children}</code>
                        ) : (
                            <code className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[0.9em] text-foreground">{children}</code>
                        ),
                    table: ({ children }) => (
                        <div className="mt-6 overflow-x-auto rounded-2xl border border-border">
                            <table className="w-full text-left text-sm">{children}</table>
                        </div>
                    ),
                    th: ({ children }) => <th className="border-b border-border bg-muted/40 px-4 py-2 font-medium text-foreground">{children}</th>,
                    td: ({ children }) => <td className="border-b border-border px-4 py-2 last:border-0">{children}</td>,
                }}
            >
                {children}
            </ReactMarkdown>
        </div>
    );
}
