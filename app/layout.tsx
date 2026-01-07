import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://portfolio.damswallace.fr"),
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
