import { ArrowUpRight, Award } from 'lucide-react';
import { getCertifications } from '@/db/queries';
import { SectionHeading } from '@/components/ui/section-heading';
import { hasLink } from '@/lib/images';
import { formatMonth } from '@/lib/timeline';

type Certification = Awaited<ReturnType<typeof getCertifications>>[number];

function validity(cert: Certification) {
    if (!cert.issueDate) return null;
    const issued = `Issued ${formatMonth(cert.issueDate)}`;
    if (!cert.expiryDate) return issued;
    const expired = cert.expiryDate < new Date().toISOString().slice(0, 10);
    return `${issued} · ${expired ? 'Expired' : 'Valid until'} ${formatMonth(cert.expiryDate)}`;
}

export function CertificationCard({ cert, index }: { cert: Certification; index: number }) {
    const meta = validity(cert);
    const verify = hasLink(cert.credentialUrl) ? cert.credentialUrl : null;
    const Wrapper = verify ? 'a' : 'div';

    return (
        <Wrapper
            {...(verify ? { href: verify, target: '_blank', rel: 'noopener noreferrer', 'data-cursor': 'Verify' } : {})}
            data-spotlight
            className="lift group relative flex h-full flex-col justify-between gap-10 overflow-hidden rounded-3xl border border-border bg-card p-7 hover:border-foreground/25 sm:p-8"
        >
            <span aria-hidden="true" className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />
            <div className="relative flex items-start justify-between gap-6">
                {cert.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={cert.imageUrl} alt="" className="h-16 w-16 object-contain" />
                ) : (
                    <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
                        <Award className="h-6 w-6 text-primary" />
                    </span>
                )}
                <span className="font-mono text-xs text-muted-foreground">{String(index + 1).padStart(2, '0')}</span>
            </div>
            <div className="relative">
                <p className="eyebrow">{cert.issuer}</p>
                <h3 className="mt-2 font-headline text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">{cert.title}</h3>
                {meta && <p className="mt-3 text-sm text-muted-foreground">{meta}</p>}
                {cert.skills && cert.skills.length > 0 && (
                    <p className="mt-4 font-mono text-[11px] uppercase tracking-widest text-muted-foreground/80">{cert.skills.slice(0, 4).join(' · ')}</p>
                )}
                {verify && (
                    <span className="mt-6 inline-flex items-center gap-1 text-sm font-medium">
                        <span className="link-draw">Verify credential</span>
                        <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </span>
                )}
                {cert.credentialId && (
                    <p className="mt-2 font-mono text-[11px] text-muted-foreground">ID {cert.credentialId}</p>
                )}
            </div>
        </Wrapper>
    );
}

export async function CertificationsSection({ index = '03' }: { index?: string }) {
    const certs = await getCertifications();
    if (certs.length === 0) return null;

    return (
        <section id="certifications" className="relative w-full border-t border-border py-24 md:py-36">
            <div className="container">
                <SectionHeading index={index} label="Certifications" title="Credentials" intro="Industry certifications I've earned." />
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {certs.map((cert, i) => (
                        <div key={cert.id} data-reveal="up" style={{ '--i': i % 3 } as React.CSSProperties}>
                            <CertificationCard cert={cert} index={i} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
