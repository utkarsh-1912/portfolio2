import { ImageResponse } from 'next/og';

// Share card used by Open Graph / Twitter previews of every page
export const alt = 'Utkarsh Gupta — Software Engineer';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
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
                    background: '#0d0c0b',
                    color: '#ece8df',
                    fontFamily: 'sans-serif',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 32 }}>
                    <span style={{ display: 'flex' }}>
                        <span>&lt;</span>
                        <span style={{ color: '#b59cf6' }}>/</span>
                        <span>&gt;</span>
                    </span>
                    <span>Utkristi</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ fontSize: 120, fontWeight: 700, letterSpacing: -4, lineHeight: 1 }}>Utkarsh Gupta</div>
                    <div style={{ marginTop: 28, fontSize: 40, color: 'rgba(236,232,223,0.6)' }}>
                        Software Engineer · Trading Systems · Agentic AI
                    </div>
                </div>
            </div>
        ),
        size
    );
}
