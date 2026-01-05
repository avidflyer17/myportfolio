import { ImageResponse } from 'next/og';

// Route segment config
export const runtime = 'edge';

// Image metadata
export const alt = 'Damien Schonbakler - Architecte Solutions';
export const size = {
    width: 1200,
    height: 630,
};

export const contentType = 'image/png';

// Image generation
export default async function Image() {
    // Font loading (optional, using system fonts fallback first for speed/reliability in this snippet)
    // In a real production environment, you might fetch a font here.

    return new ImageResponse(
        (
            <div
                style={{
                    background: 'linear-gradient(to bottom right, #0f172a, #020617)',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'sans-serif',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {/* Abstract Background Shapes */}
                <div
                    style={{
                        position: 'absolute',
                        top: '-20%',
                        left: '-10%',
                        width: '600px',
                        height: '600px',
                        background: 'radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 70%)',
                        filter: 'blur(80px)',
                        opacity: 0.6,
                    }}
                />
                <div
                    style={{
                        position: 'absolute',
                        bottom: '-10%',
                        right: '-10%',
                        width: '500px',
                        height: '500px',
                        background: 'radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%)',
                        filter: 'blur(80px)',
                        opacity: 0.6,
                    }}
                />

                {/* Glossy Card Effect */}
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '40px 80px',
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '24px',
                        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
                        zIndex: 10,
                        textAlign: 'center',
                    }}
                >
                    {/* Logo / Icon Area */}
                    <div
                        style={{
                            width: '80px',
                            height: '80px',
                            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                            borderRadius: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '30px',
                            boxShadow: '0 0 20px rgba(59,130,246,0.5)',
                        }}
                    >
                        <svg
                            width="48"
                            height="48"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                        </svg>
                    </div>

                    <h1
                        style={{
                            fontSize: '64px',
                            fontWeight: 800,
                            background: 'linear-gradient(to right, #fff, #94a3b8)',
                            backgroundClip: 'text',
                            color: 'transparent',
                            margin: '0 0 20px 0',
                            lineHeight: 1.1,
                            letterSpacing: '-0.02em',
                        }}
                    >
                        Damien Schonbakler
                    </h1>

                    <div
                        style={{
                            fontSize: '32px',
                            color: '#94a3b8',
                            fontWeight: 500,
                            letterSpacing: '0.05em',
                            textTransform: 'uppercase',
                        }}
                    >
                        Architecte Solutions
                    </div>

                    {/* Tagline / Tech Stack */}
                    <div
                        style={{
                            display: 'flex',
                            gap: '16px',
                            marginTop: '40px',
                            alignItems: 'center',
                        }}
                    >
                        {['Kubernetes', 'Cloud', 'React', 'IoT', 'Security'].map((tech) => (
                            <div
                                key={tech}
                                style={{
                                    padding: '8px 16px',
                                    background: 'rgba(255,255,255,0.05)',
                                    borderRadius: '100px',
                                    fontSize: '18px',
                                    color: '#cbd5e1',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                }}
                            >
                                {tech}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}
