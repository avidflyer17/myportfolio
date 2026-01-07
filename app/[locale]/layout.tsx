import type { Metadata } from "next";
import Script from "next/script";
import { routing } from '@/i18n/routing';
import { notFound } from 'next/navigation';
import { getMessages } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';
import { NeuralInterfaceProvider } from "@/components/features/neural-interface";
import { FloatingAIOrb } from "@/components/features/floating-ai-orb";
import { GlitchOverlay } from "@/components/ui/glitch-overlay";

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;

    const titles = {
        fr: "Damien Schonbakler | Architecte Solutions",
        en: "Damien Schonbakler | Solutions Architect"
    };

    const descriptions = {
        fr: "Portfolio d'Architecte Solutions & Fullstack Developer. Expert Cloud, Kubernetes, Cybersécurité et Domotique Avancée.",
        en: "Solutions Architect & Fullstack Developer Portfolio. Expert in Cloud, Kubernetes, Cybersecurity and Advanced Home Automation."
    };

    return {
        metadataBase: new URL("https://portfolio.damswallace.fr"),
        title: titles[locale as keyof typeof titles] || titles.fr,
        description: descriptions[locale as keyof typeof descriptions] || descriptions.fr,
        keywords: locale === 'en'
            ? ["Solutions Architect", "Fullstack Developer", "Cloud", "Kubernetes", "React", "Node.js", "Cybersecurity", "Home Automation", "IoT"]
            : ["Architecte Solutions", "Fullstack Developer", "Cloud", "Kubernetes", "React", "Node.js", "Cybersécurité", "Home Automation", "IoT"],
        authors: [{ name: "Damien Schonbakler" }],
        alternates: {
            canonical: locale === 'fr' ? '/' : `/${locale}`,
            languages: {
                'fr': '/',
                'en': '/en'
            }
        },
        openGraph: {
            title: titles[locale as keyof typeof titles] || titles.fr,
            description: descriptions[locale as keyof typeof descriptions] || descriptions.fr,
            type: "website",
            locale: locale === 'fr' ? 'fr_FR' : 'en_US',
            url: locale === 'fr' ? 'https://portfolio.damswallace.fr' : 'https://portfolio.damswallace.fr/en',
            siteName: "Damien Schonbakler Portfolio",
            images: [
                {
                    url: "/opengraph-image",
                    width: 1200,
                    height: 630,
                    alt: titles[locale as keyof typeof titles],
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: titles[locale as keyof typeof titles],
            description: descriptions[locale as keyof typeof descriptions],
            images: ["/opengraph-image"],
        },
        icons: {
            icon: "/logo.webp",
            apple: "/apple-touch-icon.webp",
        },
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                'max-video-preview': -1,
                'max-image-preview': 'large',
                'max-snippet': -1,
            },
        },
    };
}

export default async function LocaleLayout({
    children,
    params
}: Readonly<{
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}>) {
    const { locale } = await params;

    // Ensure that the incoming `locale` is valid
    if (!routing.locales.includes(locale as "fr" | "en")) {
        notFound();
    }

    const messages = await getMessages();

    return (
        <NextIntlClientProvider messages={messages} locale={locale}>
            <NeuralInterfaceProvider>
                <GlitchOverlay />
                {/* JSON-LD Structured Data for SEO */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "Person",
                            name: "Damien Schonbakler",
                            url: "https://portfolio.damswallace.fr",
                            jobTitle: locale === 'fr' ? "Architecte Solutions & Fullstack Developer" : "Solutions Architect & Fullstack Developer",
                            description: locale === 'fr'
                                ? "Expert en architecture cloud, Kubernetes, développement fullstack et domotique avancée"
                                : "Expert in cloud architecture, Kubernetes, fullstack development and advanced home automation",
                            image: "https://portfolio.damswallace.fr/logo.webp",
                            sameAs: [
                                "https://github.com/avidflyer17",
                                "https://www.linkedin.com/in/damien-schonbakler"
                            ],
                            knowsAbout: [
                                "Cloud Architecture",
                                "Kubernetes",
                                "React",
                                "Node.js",
                                "TypeScript",
                                "Cybersecurity",
                                "Home Automation",
                                "IoT"
                            ],
                            alumniOf: {
                                "@type": "Organization",
                                name: "Airbus"
                            },
                            inLanguage: locale
                        })
                    }}
                />

                {/* Plausible Analytics - Privacy-first, no cookies */}
                <Script
                    defer
                    data-domain="portfolio.damswallace.fr"
                    src="https://plausible.io/js/script.js"
                    strategy="afterInteractive"
                />

                {/* Scanline Effect Overlay moved here for consistency */}
                <div className="scanlines fixed inset-0 pointer-events-none z-[100] opacity-30 mix-blend-overlay"></div>
                <div className="vignette fixed inset-0 pointer-events-none z-[90]"></div>

                {children}
                <FloatingAIOrb />
            </NeuralInterfaceProvider>
        </NextIntlClientProvider>
    );
}
