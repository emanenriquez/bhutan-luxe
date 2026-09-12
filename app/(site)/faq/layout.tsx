import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Frequent Questions — Bhutan-Luxe",
  description: "Answers to common questions about planning a luxury journey to Bhutan with Bhutan-Luxe.",
  openGraph: {
    title: "Frequent Questions — Bhutan-Luxe",
    description: "Answers to common questions about planning a luxury journey to Bhutan with Bhutan-Luxe.",
    url: "https://bhutan-luxe.com/faq",
    siteName: "Bhutan-Luxe",
    type: "website",
    images: [{ url: "/og/faq.jpg", width: 1200, height: 630, alt: "Frequent Questions — Bhutan-Luxe" }],
  },
  twitter: { card: "summary_large_image", title: "Frequent Questions — Bhutan-Luxe", description: "Answers to common questions about planning a luxury journey to Bhutan with Bhutan-Luxe.", images: ["/og/faq.jpg"] },
};

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return children;
}
