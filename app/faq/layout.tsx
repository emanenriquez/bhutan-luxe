import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Frequent Questions — Bhutan-Luxe",
  description: "Answers to common questions about planning a luxury journey to Bhutan with Bhutan-Luxe.",
};

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return children;
}
