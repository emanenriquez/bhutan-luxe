import type { Metadata } from "next";
import "./styles/tokens.css";
import "./globals.css";

// Root layout for the CRM route group. The marketing site has its own root
// layout under app/(site); the two share nothing but the repo.
export const metadata: Metadata = {
  metadataBase: new URL("https://bhutan-luxe.com"),
  title: "Bhutan Luxe CRM",
  description: "Concierge CRM for Bhutan Luxe: contacts, inquiries, deals and affiliates.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Bhutan Luxe CRM",
    description: "Concierge CRM for Bhutan Luxe: contacts, inquiries, deals and affiliates.",
    siteName: "Bhutan Luxe CRM",
    type: "website",
    images: [{ url: "/og/admin.jpg", width: 1200, height: 630, alt: "Bhutan Luxe CRM" }],
  },
  twitter: { card: "summary_large_image", title: "Bhutan Luxe CRM", images: ["/og/admin.jpg"] },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
