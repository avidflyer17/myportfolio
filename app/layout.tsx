import type { Metadata, Viewport } from "next";
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import "./globals.css";
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import { NeuralInterfaceProvider } from "@/components/features/neural-interface";
import { FloatingAIOrb } from "@/components/features/floating-ai-orb";

export const metadata: Metadata = {
  title: "DamienS | Architecte Solutions & Fullstack",
  description: "Portfolio de Damien Schonbakler - Architecte Solutions, Développeur Fullstack & Passionné de Tech.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "DamienS Portfolio"
  }
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

import { GlitchOverlay } from "@/components/ui/glitch-overlay";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} antialiased bg-black text-white overflow-x-hidden`}
      >
        <GlitchOverlay />
        <NextIntlClientProvider messages={messages}>
          <NeuralInterfaceProvider>
            {/* Scanline Effect Overlay */}
            <div className="scanlines fixed inset-0 pointer-events-none z-[100] opacity-30 mix-blend-overlay"></div>
            <div className="vignette fixed inset-0 pointer-events-none z-[90]"></div>

            {children}
            <FloatingAIOrb />
          </NeuralInterfaceProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
