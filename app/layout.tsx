import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://portfolio.damswallace.fr"),
  title: "Damien Schonbakler | Architecte Solutions",
  description: "Portfolio d'Architecte Solutions & Fullstack Developer. Expert Cloud, Kubernetes, Cybersécurité et Domotique Avancée.",
  openGraph: {
    title: "Damien Schonbakler | Architecte Solutions",
    description: "Expertise: Architecture Distribuée, Kubernetes, React, Node.js, IoT.",
    type: "website",
    locale: "fr_FR",
    siteName: "Damien Schonbakler Portfolio",
  },
  icons: {
    icon: ["/favicon.ico", "/logo.png"],
    apple: "/apple-touch-icon.png",
  },
};



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >

        {children}
      </body>
    </html>
  );
}
