import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://portfolio.damswallace.fr"),
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Dams Wallace",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#050505",
};

// Root layout - just a simple wrapper
// Actual layout with i18n is in [locale]/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
