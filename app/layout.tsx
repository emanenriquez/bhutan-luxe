import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://bhutan-luxe.com"),
  title: "Bhutan-Luxe — The Bhutan Few Will Ever See",
  description:
    "We craft bespoke journeys that connect guests with the authentic heart of the Bhutan Kingdom.",
  openGraph: {
    title: "Bhutan-Luxe — The Bhutan Few Will Ever See",
    description:
      "We craft bespoke journeys that connect guests with the authentic heart of the Bhutan Kingdom.",
    url: "https://bhutan-luxe.com",
    siteName: "Bhutan-Luxe",
    images: [
      {
        url: "/hero-cover.jpg",
        width: 1200,
        height: 630,
        alt: "Bhutan-Luxe — Bespoke Journeys to Bhutan",
      },
    ],
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500&family=Inter:wght@400;500;600&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,700;0,9..40,900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
