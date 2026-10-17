import { ImageResponse } from 'next/og';
import { getProjectBySlug } from '@/db/queries';

// Per-project share card: project name, stack and the site mark
export const alt = 'Project by Utkarsh Gupta';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function ProjectOgImage({ params }: { params: Promise<{ slug: string }> }) {
    const project = await getProjectBySlug((await params).slug);
    const title = project?.title ?? 'Project';
    const tags = project?.tags?.slice(0, 4).join('  ·  ') ?? '';

    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: '72px',
                    background: '#f7f5f0',
                    color: '#161412',
                    fontFamily: 'sans-serif',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 28 }}>
                    <span style={{ display: 'flex', gap: 12 }}>
                        <span style={{ display: 'flex' }}>
                            <span>&lt;</span>
                            <span style={{ color: '#6d3fd0' }}>/</span>
                            <span>&gt;</span>
                        </span>
                        Utkristi
                    </span>
                    <span style={{ color: 'rgba(22,20,18,0.5)' }}>Project</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ fontSize: title.length > 18 ? 96 : 128, fontWeight: 700, letterSpacing: -4, lineHeight: 1 }}>{title}</div>
                    <div style={{ marginTop: 28, fontSize: 32, color: 'rgba(22,20,18,0.55)' }}>{tags}</div>
                </div>
            </div>
        ),
        size
    );
}
