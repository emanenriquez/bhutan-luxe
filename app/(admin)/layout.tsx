import type { Metadata } from "next";
import "./styles/tokens.css";
import "./globals.css";

// Root layout for the CRM route group. The marketing site has its own root
// layout under app/(site); the two share nothing but the repo.
export const metadata: Metadata = {
  title: "Bhutan Luxe CRM",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
