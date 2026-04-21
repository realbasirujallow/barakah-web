import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Barakah",
  description: "Barakah's Privacy Policy. Learn how we collect, use, and protect your personal and financial data.",
  alternates: { canonical: "https://trybarakah.com/privacy" },
  openGraph: {
    title: "Privacy Policy — Barakah",
    description: "How Barakah collects, uses, and protects your personal and financial data.",
    url: "https://trybarakah.com/privacy",
    siteName: "Barakah",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
